import type { EventHandlerLoadRequestBody, EventHandlerUnloadRequestBody } from '../handler';
import { isValidUrl } from '../utils/is-valid-url';

const AnalyticsEvent = {
  UNLOAD: 'unload',
  LOAD: 'load',
} as const;

/**
 * Represents the options object for creating a new tracker.
 *
 * @remarks This module is browser-only. It accesses DOM APIs (`location`,
 * `history`, `document`, `navigator`, `self`, `addEventListener`, `fetch`,
 * `XMLHttpRequest`, `Intl`) and must not be imported in a Node.js environment
 * without a DOM polyfill. All global access is lazy — nothing is evaluated
 * at import time beyond type imports and constant definitions.
 */
export interface CreateTrackerOptions {
  /**
   * The API endpoint to send track events to.
   */
  apiEndpoint: {
    /**
     * The URL to send track events to.
     */
    track: string;
    /**
     * The URL to send ping events to.
     */
    ping: string;
  };

  /**
   * The mode of tracking to use. Either 'history' or 'hash'.
   * @default 'history
   */
  mode?: 'history' | 'hash';

  /**
   * The maximum duration of a session before the user is considered inactive.
   * @default 5 * 60 * 1000
   */
  sessionTimeoutDuration?: number;
}

/**
 * Creates a new tracker instance for sending analytics events to a server.
 *
 * @remarks This module is browser-only. It accesses DOM APIs (`location`,
 * `history`, `document`, `navigator`, `self`, `addEventListener`, `fetch`,
 * `XMLHttpRequest`, `Intl`) and must not be imported in a Node.js environment
 * without a DOM polyfill. All global access is lazy — nothing is evaluated
 * at import time beyond type imports and constant definitions.
 */
export const createTracker = ({
  apiEndpoint: { ping: pingEndpoint, track: trackEndpoint },
  mode = 'history',
  sessionTimeoutDuration,
}: CreateTrackerOptions) => {
  if (!isValidUrl(trackEndpoint)) {
    throw new Error('`apiEndpoint.track` must be a valid URL');
  }
  if (!isValidUrl(pingEndpoint)) {
    throw new Error('`apiEndpoint.ping` must be a valid URL');
  }

  const generateID = () => {
    // ID format: timestamp(36) + random(36). Timestamp provides
    // millisecond precision ordering; the random suffix reduces
    // collision probability within the same millisecond to
    // 1/36^8 (~1/2.8e12) per session.
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  };

  const ping = (url: string): Promise<boolean> =>
    new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.addEventListener('load', () => {
        // @ts-expect-error - Double equals reduces bundle size.
        resolve(xhr.responseText == 0);
      });
      xhr.open('GET', url);
      xhr.send();
    });

  let isUnique: boolean = true;

  const register = () => {
    const originalPushState = history.pushState.bind(history);
    const originalReplaceState = history.replaceState.bind(history);

    const ac = new AbortController();
    const { signal } = ac;

    let id: string = generateID();
    let startTime = Date.now();
    let isUnloadCalled: boolean = false;

    let sessionTimer: ReturnType<typeof setTimeout> | null = null;

    const resetSessionTimer = () => {
      if (sessionTimer) clearTimeout(sessionTimer);
      sessionTimer = setTimeout(() => {
        sendUnloadBeacon();
        cleanup();
        sendLoadBeacon();
      }, sessionTimeoutDuration);
    };

    const clearSessionTimer = () => {
      if (sessionTimer) {
        clearTimeout(sessionTimer);
        sessionTimer = null;
      }
    };

    const cleanup = () => {
      isUnique = false;
      id = generateID();
      startTime = Date.now();
      isUnloadCalled = false;
    };

    const wrapHistoryFunc = (original: typeof originalPushState) => {
      return function (
        this: History,
        state: unknown,
        unused: string,
        url?: string | URL | null,
        ...rest: unknown[]
      ) {
        if (url && location.pathname !== new URL(url, location.href).pathname) {
          sendUnloadBeacon();
          cleanup();
          Reflect.apply(original, this, [state, unused, url, ...rest]);
          sendLoadBeacon();
        } else {
          Reflect.apply(original, this, [state, unused, url, ...rest]);
        }
      };
    };

    const sendLoadBeacon = async (): Promise<void> => {
      const isFirstVisit = await ping(
        pingEndpoint + '?u=' + encodeURIComponent(location.host + location.pathname),
      );
      await fetch(trackEndpoint, {
        method: 'POST',
        body: JSON.stringify({
          e: AnalyticsEvent.LOAD,
          b: id,
          u: location.href,
          p: isUnique,
          q: isFirstVisit,
          a: 'pageview',
          r: document.referrer,
          t: Intl.DateTimeFormat().resolvedOptions().timeZone,
        } satisfies EventHandlerLoadRequestBody),
        mode: 'no-cors',
      });
    };

    const sendUnloadBeacon = (): void => {
      if (!isUnloadCalled) {
        navigator.sendBeacon(
          trackEndpoint,
          JSON.stringify({
            e: AnalyticsEvent.UNLOAD,
            b: id,
            m: Date.now() - startTime,
          } satisfies EventHandlerUnloadRequestBody),
        );
      }

      isUnloadCalled = true;
    };

    if ('onpagehide' in self) {
      addEventListener('pagehide', sendUnloadBeacon, { signal, capture: true });
    } else {
      addEventListener('beforeunload', sendUnloadBeacon, { signal, capture: true });
      addEventListener('unload', sendUnloadBeacon, { signal, capture: true });
    }

    addEventListener(
      'visibilitychange',
      () => {
        if (document.hidden) {
          clearSessionTimer();
          sendUnloadBeacon();
        }
      },
      { signal, capture: true },
    );

    if (sessionTimeoutDuration) {
      for (const type of ['mousedown', 'keydown', 'touchstart'] as const) {
        addEventListener(type, resetSessionTimer, { signal, passive: true });
      }
    }

    ping(pingEndpoint).then((response: boolean) => {
      isUnique = response;
      sendLoadBeacon();

      if (sessionTimeoutDuration) {
        resetSessionTimer();
      }

      if (mode === 'hash') {
        addEventListener('hashchange', sendLoadBeacon, { signal, capture: true });
      } else {
        history.pushState = wrapHistoryFunc(originalPushState);
        history.replaceState = wrapHistoryFunc(originalReplaceState);
        addEventListener(
          'popstate',
          () => {
            clearSessionTimer();
            sendUnloadBeacon();
            cleanup();
            sendLoadBeacon();
          },
          { signal, capture: true },
        );
      }
    });

    return () => {
      clearSessionTimer();
      ac.abort();
      if (history.pushState !== originalPushState) {
        history.pushState = originalPushState;
      }
      if (history.replaceState !== originalReplaceState) {
        history.replaceState = originalReplaceState;
      }
    };
  };

  /**
   * Map of custom event tracking (track method usage) keys to beacon IDs.
   */
  const trackWithDurationMap = new Map<
    string,
    {
      id: string;
      startTime: number;
    }
  >();

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
      [key: string]: string | number | boolean | null | undefined;
    },
    options?: {
      withDuration?: boolean;
    },
  ): Promise<void> => {
    const isFirstVisit = await ping(
      pingEndpoint +
        '?u=' +
        encodeURIComponent(location.host + location.pathname) +
        '&k=' +
        encodeURIComponent(key),
    );
    const id = generateID();
    if (options?.withDuration) {
      trackWithDurationMap.set(key, { id, startTime: Date.now() });
    }

    const { type, ...rest } = data;
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
    });
  };

  /**
   * Tracks the end of a given key and sends an unload event to the server.
   *
   * @param {string} key - The key to track the end of.
   * @return {Promise<void>} A promise that resolves when the unload event is sent.
   */
  const trackEndOf = async (key: string): Promise<void> => {
    const { id, startTime } = trackWithDurationMap.get(key) ?? {};
    if (!id || !startTime) {
      // If the key is not being tracked, do nothing.
      return;
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
    }).then(() => trackWithDurationMap.delete(key));
  };

  return {
    register,
    track,
    trackEndOf,
  };
};
