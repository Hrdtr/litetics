import { isValidUrl } from "../utils/is-valid-url"

export enum AnalyticsEventType {
  UNLOAD = 'unload',
  LOAD = 'load',
  // These events must still be sent with the unload event when calling
  // sendBeacon to ensure there are no duplicate events.
  PAGEHIDE = 'pagehide',
  BEFOREUNLOAD = 'beforeunload',
  // Custom events that are not part of the event listener spec, but is
  // used to determine what state visibilitychange is in.
  VISIBILITYCHANGE = 'visibilitychange',
  HIDDEN = 'hidden',
  VISIBLE = 'visible',
};

export interface AnalyticsOptions {
  apiEndpoint: {
    hit: string,
    ping: string,
  }
  mode?: 'history' | 'hash',
}

export const createTracker = ({
  apiEndpoint: {
    ping: pingEndpoint,
    hit: hitEndpoint
  },
  mode = 'history'
}: AnalyticsOptions) => {
  if (!isValidUrl(hitEndpoint)) {
    throw new Error('`apiEndpoint.hit` must be a valid URL')
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
  const generateUid = () => Date.now().toString(36) + Math.random().toString(36).slice(2)

  /**
   * Unique ID linking multiple beacon events together for the same page view.
   */
  let uid: string = generateUid()

  /**
   * Whether the user is unique or not.
   * This is updated when the server checks the ping cache on page load.
   */
  let isUnique: boolean = true

  /**
   * A temporary variable to store the start time of the page when it is hidden.
   */
  let hiddenStartTime: number = 0

  /**
   * The total time the user has had the page hidden.
   * It also signifies the start epoch time of the page.
   */
  let hiddenTotalTime: number = Date.now()

  /**
   * Ensure only the unload beacon is called once.
   */
  let isUnloadCalled: boolean = false

  const register = () => {
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
      uid = generateUid()
      hiddenStartTime = 0
      hiddenTotalTime = Date.now()
      isUnloadCalled = false
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
    ): typeof historyPushState | typeof historyReplaceState =>
      function (state, unused, url, ...rest) {
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
    const pingCache = (url: string): Promise<boolean> =>
      new Promise((resolve) => {
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
     * Send a load beacon event to the server when the page is loaded.
     * @returns {Promise<void>}
     */
    const sendLoadBeacon = async (): Promise<void> => {
      // Returns true if it is the user's first visit to page, false if not.
      // The u query parameter is a cache busting parameter which is the page host and path
      // without protocol or query parameters.
      pingCache(pingEndpoint + '?u=' + encodeURIComponent(location.host + location.pathname))
        .then((isFirstVisit) => {
          // We use fetch here because it is more reliable than XHR.
          fetch(hitEndpoint, {
            method: 'POST',
            /**
             * Payload to send to the server.
             * @type {AnalyticsHitPayload}
             */
            body: JSON.stringify({
              'b': uid,
              'e': AnalyticsEventType.LOAD,
              'u': location.href,
              'r': document.referrer,
              'p': isUnique,
              'q': isFirstVisit,
              /**
               * Get timezone for country detection.
               * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#return_value
               */
              't': Intl.DateTimeFormat().resolvedOptions().timeZone,
            }),
            // Will make the response opaque, but we don't need it.
            mode: 'no-cors',
          })
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
          hitEndpoint,
          /**
           * Payload to send to the server.
           * @type {AnalyticsDurationPayload}
           */
          JSON.stringify({
            'b': uid,
            'e': AnalyticsEventType.UNLOAD,
            'm': Date.now() - hiddenTotalTime,
          }),
        )
      }

      // Ensure unload is only called once.
      isUnloadCalled = true
    }

    // Prefer pagehide if available because it's more reliable than unload.
    // We also prefer pagehide because it doesn't break bf-cache.
    if ('onpagehide' in self) {
      addEventListener(AnalyticsEventType.PAGEHIDE, sendUnloadBeacon, { capture: true })
    }
    else {
      // Otherwise, use unload and beforeunload. Using both is significantly more
      // reliable than just one due to browser differences. However, this will break
      // bf-cache, but it's better than nothing.
      addEventListener(AnalyticsEventType.BEFOREUNLOAD, sendUnloadBeacon, {
        capture: true,
      })
      addEventListener(AnalyticsEventType.UNLOAD, sendUnloadBeacon, { capture: true })
    }

    // Visibility change events allow us to track whether a user is tabbed out and
    // correct our timings.
    addEventListener(
      AnalyticsEventType.VISIBILITYCHANGE,
      () => {
        if (document.visibilityState == AnalyticsEventType.HIDDEN) {
          // Page is hidden, record the current time.
          hiddenStartTime = Date.now()
        }
        else {
          // Page is visible, subtract the hidden time to calculate the total time hidden.
          hiddenTotalTime += Date.now() - hiddenStartTime
          hiddenStartTime = 0
        }
      },
      { capture: true },
    )

    pingCache(pingEndpoint).then((response: boolean) => {
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

  return {
    uid,
    isUnique,
    hiddenStartTime,
    hiddenTotalTime,
    isUnloadCalled,
    register,
  }
}
