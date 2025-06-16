/* eslint-disable unicorn/prefer-global-this */

import type { EventHandlerLoadRequestBody, EventHandlerUnloadRequestBody } from '../handler'
import { isValidUrl } from '../utils/is-valid-url'

const AnalyticsEvent = {
  UNLOAD: 'unload',
  LOAD: 'load',
} as const

/**
 * Represents the options object for creating a new tracker.
 */
export interface CreateTrackerOptions {
  /**
   * The API endpoint to send track events to.
   */
  apiEndpoint: {
    /**
     * The URL to send track events to.
     */
    track: string
    /**
     * The URL to send ping events to.
     */
    ping: string
  }

  /**
   * The mode of tracking to use. Either 'history' or 'hash'.
   * @default 'history
   */
  mode?: 'history' | 'hash'

  /**
   * The maximum duration of a session before the user is considered inactive.
   * @default 5 * 60 * 1000
   */
  sessionTimeoutDuration?: number
}

export const createTracker = ({
  apiEndpoint: {
    ping: pingEndpoint,
    track: trackEndpoint,
  },
  mode = 'history',
  sessionTimeoutDuration = 5 * 60 * 1000,
}: CreateTrackerOptions) => {
  if (!isValidUrl(trackEndpoint)) {
    throw new Error('`apiEndpoint.track` must be a valid URL')
  }
  if (!isValidUrl(pingEndpoint)) {
    throw new Error('`apiEndpoint.ping` must be a valid URL')
  }

  /**
   * Generate a unique ID for linking multiple beacon events together for the same page
   * view. This is necessary for us to determine how long someone has spent on a page.
   *
   * @remarks We intentionally use Math.random() instead of the Web Crypto API
   * because uniqueness against collisions is not a requirement and is worth
   * the tradeoff for bundle size and performance.
   */
  const generateID = () => Date.now().toString(36) + Math.random().toString(36).slice(2)

  /**
   * Ping the server with the cache endpoint and read the last modified header to determine
   * if the user is unique or not.
   *
   * If the response is not cached, then the user is unique. If it is cached, then the
   * browser will send an If-Modified-Since header indicating the user is not unique.
   *
   * @param {string} url URL to ping.
   * @returns {Promise<boolean>} Is the cache unique or not.
   */
  const ping = (url: string): Promise<boolean> => new Promise((resolve) => {
    // We use XHR here because fetch GET request requires a CORS
    // header to be set on the server, which adds additional requests and
    // latency to ping the server.
    const xhr = new XMLHttpRequest()
    xhr.addEventListener('load', () => {
      // @ts-expect-error - Double equals reduces bundle size.
      resolve(xhr.responseText == 0)
    })
    xhr.open('GET', url)
    xhr.setRequestHeader('Content-Type', 'text/plain')
    xhr.send()
  })

  /**
   * Whether the user is unique or not.
   * This is updated when the server checks the ping cache on page load.
   */
  let isUnique: boolean = true

  const register = () => {
    /**
     * Unique ID linking multiple beacon events together for the same page view.
     */
    let id: string = generateID()

    /**
     * Variable to store the start time of the session.
     */
    let startTime = Date.now()

    /**
     * Variable to store the last time when the tab was active.
     */
    let lastActiveTime: number | null = null

    /**
     * Variable to store the total inactive time in the session.
     */
    let totalInactiveTime = 0

    /**
     * Ensure only the unload beacon is called once.
     */
    let isUnloadCalled: boolean = false

    /**
     * Variable to store the timeout to end the session.
     */
    let sessionTimeout: ReturnType<typeof setTimeout> | null = null

    /**
     * Copy of the original pushState and replaceState functions, used for overriding
     * the History API to track navigation changes.
     */
    const historyPushState = history.pushState
    const historyReplaceState = history.replaceState

    /**
     * Cleanup temporary variables and reset the unique ID.
     */
    const cleanup = () => {
      // Main ping cache won't be called again, so we can assume the user is not unique.
      // However, isFirstVisit will be called on each page load, so we don't need to reset it.
      isUnique = false
      id = generateID()
      startTime = Date.now()
      lastActiveTime = Date.now()
      totalInactiveTime = 0
      isUnloadCalled = false
      if (sessionTimeout) {
        clearTimeout(sessionTimeout)
      }
      sessionTimeout = null
    }

    /**
     * Wraps a history method with additional tracking events.
     * @param {!Function} original - The original history method to wrap.
     * @returns {function(this:History, *, string, (string | URL)=): void} The wrapped history method.
     */
    const wrapHistoryFunc = (
      original: typeof historyPushState | typeof historyReplaceState,
      /**
       * @this {History}
       * @param {*} _state - The state object.
       * @param {string} _unused - The title (unused).
       * @param {(string | URL)=} url - The URL to navigate to.
       * @returns {void}
       */
    ): typeof historyPushState | typeof historyReplaceState => {
      return function (state, unused, url, ...rest) {
        if (url && location.pathname !== new URL(url, location.href).pathname) {
          sendUnloadBeacon()
          // If the event is a history change, then we need to reset the id and timers
          // because the page is not actually reloading the script.
          cleanup()
          // @ts-expect-error
          Reflect.apply(original, this, [state, unused, url, ...rest])
          sendLoadBeacon()
        }
        else {
          // @ts-expect-error
          Reflect.apply(original, this, [state, unused, url, ...rest])
        }
      }
    }

    /**
     * Send a load beacon event to the server when the page is loaded.
     * @returns {Promise<void>}
     */
    const sendLoadBeacon = async (): Promise<void> => {
      // Returns true if it is the user's first visit to page, false if not.
      // The u query parameter is a cache busting parameter which is the page host and path
      // without protocol or query parameters.
      const isFirstVisit = await ping(pingEndpoint + '?u=' + encodeURIComponent(location.host + location.pathname))
      await fetch(trackEndpoint, {
        method: 'POST',
        /**
         * Payload to send to the server.
         * @type {EventHandlerLoadRequestBody}
         */
        body: JSON.stringify({
          e: AnalyticsEvent.LOAD,
          b: id,
          u: location.href,
          p: isUnique,
          q: isFirstVisit,
          a: 'pageview',
          r: document.referrer,
          /**
           * Get timezone for country detection.
           * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#return_value
           */
          t: Intl.DateTimeFormat().resolvedOptions().timeZone,
        } satisfies EventHandlerLoadRequestBody),
        // Will make the response opaque, but we don't need it.
        mode: 'no-cors',
      })
    }

    /**
     * Send an unload beacon event to the server when the page is unloaded.
     * @returns {void}
     */
    const sendUnloadBeacon = (): void => {
      if (!isUnloadCalled) {
        // We use sendBeacon here because it is more reliable than fetch on page unloads.
        // The Fetch API keepalive flag has a few caveats and doesn't work very well on
        // Firefox on top of that. Previous experiments also seemed to indicate that
        // the fetch API doesn't work well on page unloads.
        // See: https://github.com/whatwg/fetch/issues/679
        //
        // Some ad-blockers block this API directly, but since this is the unload event,
        // it's an optional event to send.
        navigator.sendBeacon(
          trackEndpoint,
          /**
           * Payload to send to the server.
           * @type {EventHandlerUnloadRequestBody}
           */
          JSON.stringify({
            e: AnalyticsEvent.UNLOAD,
            b: id,
            m: Date.now() - (startTime - totalInactiveTime),
          } satisfies EventHandlerUnloadRequestBody),
        )
      }

      // Ensure unload is only called once.
      isUnloadCalled = true
    }

    // Prefer pagehide if available because it's more reliable than unload.
    // We also prefer pagehide because it doesn't break bf-cache.
    if ('onpagehide' in self) {
      addEventListener('pagehide', sendUnloadBeacon, { capture: true })
    }
    else {
      // Otherwise, use unload and beforeunload. Using both is significantly more
      // reliable than just one due to browser differences. However, this will break
      // bf-cache, but it's better than nothing.
      addEventListener('beforeunload', sendUnloadBeacon, { capture: true })
      addEventListener('unload', sendUnloadBeacon, { capture: true })
    }

    // Visibility change events allow us to track whether a user is tabbed out and
    // correct our timings.
    addEventListener('visibilitychange', () => {
      if (sessionTimeout) clearTimeout(sessionTimeout)

      if (document.hidden) {
        // Page is hidden, record the current time.
        lastActiveTime = Date.now()
        sessionTimeout = setTimeout(() => {
          totalInactiveTime += Date.now() - (lastActiveTime ?? 0)
          sendUnloadBeacon()
        }, sessionTimeoutDuration)
      }
      else {
        // Page is visible, subtract the hidden time to calculate the total time hidden.
        totalInactiveTime += Date.now() - (lastActiveTime ?? 0)
        lastActiveTime = null
      }
    }, { capture: true })

    ping(pingEndpoint).then((response: boolean) => {
      // The response is a boolean indicating if the user is unique or not.
      isUnique = response

      // Send the first beacon event to the server.
      sendLoadBeacon()

      // Check if hash mode is enabled. If it is, then we need to send a beacon event
      // when the hash changes. If disabled, it is safe to override the History API.
      if (mode === 'hash') {
        // Hash mode is enabled. Add hashchange event listener.
        addEventListener('hashchange', sendLoadBeacon, { capture: true })
      }
      else {
        // Add pushState event listeners to track navigation changes with
        // router libraries that use the History API.
        history.pushState = wrapHistoryFunc(historyPushState)

        // replaceState is used by some router libraries to replace the current
        // history state instead of pushing a new one.
        history.replaceState = wrapHistoryFunc(historyReplaceState)

        // popstate is fired when the back or forward button is pressed.
        addEventListener('popstate', () => {
          // Unfortunately, we can't use unload here because we can't call it before
          // the history change, so cleanup any temporary variables here.
          cleanup()
          sendLoadBeacon()
        }, { capture: true })
      }
    })
  }

  /**
   * Map of custom event tracking (track method usage) keys to beacon IDs.
   */
  const trackWithDurationMap = new Map<string, {
    id: string
    startTime: number
  }>()

  /**
   * Tracks an event with the given key and data.
   *
   * @param {string} key - The key of the event to track.
   * @param {Object.<string, (string | number | boolean | null | undefined)>} data - The data associated with the event.
   * @param {Object} options - The options for tracking the event.
   * @param {boolean} [options.withDuration] - Whether to track the duration of the event.
   * @return {Promise<void>} A promise that resolves when the event is tracked.
   */
  const track = async (
    key: string,
    data: { type: string } & {
      [key: string]: string | number | boolean | null | undefined
    },
    options?: {
      withDuration?: boolean
    },
  ): Promise<void> => {
    const isFirstVisit = await ping(pingEndpoint + '?u=' + encodeURIComponent(location.host + location.pathname) + '&k=' + encodeURIComponent(key))
    const id = generateID()
    if (options?.withDuration) {
      trackWithDurationMap.set(key, { id, startTime: Date.now() })
    }

    const { type, ...rest } = data
    // We use fetch here because it is more reliable than XHR.
    await fetch(trackEndpoint, {
      method: 'POST',
      /**
       * Payload to send to the server.
       * @type {EventHandlerLoadRequestBody}
       */
      body: JSON.stringify({
        e: AnalyticsEvent.LOAD,
        b: id,
        u: location.href,
        p: isUnique,
        q: isFirstVisit,
        a: type,
        r: document.referrer,
        /**
         * Get timezone for country detection.
         * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#return_value
         */
        t: Intl.DateTimeFormat().resolvedOptions().timeZone,
        d: rest,
      } satisfies EventHandlerLoadRequestBody),
      // Will make the response opaque, but we don't need it.
      mode: 'no-cors',
    })
  }

  /**
   * Tracks the end of a given key and sends an unload event to the server.
   *
   * @param {string} key - The key to track the end of.
   * @return {Promise<void>} A promise that resolves when the unload event is sent.
   */
  const trackEndOf = async (key: string): Promise<void> => {
    const { id, startTime } = trackWithDurationMap.get(key) ?? {}
    if (!id || !startTime) {
      // If the key is not being tracked, do nothing.
      return
    }

    await fetch(trackEndpoint, {
      method: 'POST',
      /**
       * Payload to send to the server.
       * @type {EventHandlerUnloadRequestBody}
       */
      body: JSON.stringify({
        e: AnalyticsEvent.UNLOAD,
        b: id,
        m: Date.now() - startTime,
      } satisfies EventHandlerUnloadRequestBody),
      // Will make the response opaque, but we don't need it.
      mode: 'no-cors',
    })
      .then(() => trackWithDurationMap.delete(key))
  }

  return {
    register,
    track,
    trackEndOf,
  }
}
