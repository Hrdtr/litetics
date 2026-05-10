import type {
  EventRequestHandlerLoadRequestBody,
  EventRequestHandlerUnloadRequestBody,
} from '../handler';
import type { RuntimeAdapter } from './adapter';
import { isValidUrl } from '../utils/is-valid-url';
import { createBrowserAdapter } from './adapter';
export type { RuntimeAdapter, BrowserAdapterOptions } from './adapter';
export type { SendOptions, EnvironmentContext } from './adapter';
export { createBrowserAdapter } from './adapter';

export const AnalyticsEvent = {
  UNLOAD: 'unload',
  LOAD: 'load',
} as const;

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
    track: string;
    /**
     * The URL to send ping events to.
     */
    ping: string;
  };

  /**
   * An optional runtime adapter. When not provided, the browser adapter
   * is used automatically. Supply a custom adapter to run the tracker
   * in non-browser environments.
   */
  adapter?: RuntimeAdapter;

  /**
   * The maximum duration of a session before the user is considered inactive.
   * @default 5 * 60 * 1000
   */
  sessionTimeoutDuration?: number;

  /**
   * The fetch mode to use for track requests.
   * - `'no-cors'` (default): Response is opaque, errors invisible.
   * - `'cors'`: Allow cross-origin requests with readable response.
   * - `'same-origin'`: Only send for same-origin requests.
   * - `undefined`: No mode set, browser default (same-origin with readable response).
   * @default 'no-cors'
   */
  fetchMode?: 'no-cors' | 'cors' | 'same-origin';
}

/**
 * Creates a new tracker instance for sending analytics events to a server.
 *
 * @remarks All browser API access is routed through the provided
 * `RuntimeAdapter`. When no adapter is given, `createBrowserAdapter()`
 * is used automatically, making the tracker work in the browser without
 * any additional setup.
 */
export const createTracker = ({
  apiEndpoint: { ping: pingEndpoint, track: trackEndpoint },
  adapter: providedAdapter,
  sessionTimeoutDuration,
  fetchMode = 'no-cors',
}: CreateTrackerOptions) => {
  if (!isValidUrl(trackEndpoint)) {
    throw new Error('`apiEndpoint.track` must be a valid URL');
  }
  if (!isValidUrl(pingEndpoint)) {
    throw new Error('`apiEndpoint.ping` must be a valid URL');
  }

  const adapter = providedAdapter ?? createBrowserAdapter();

  const generateID = () => {
    // ID format: timestamp(36) + random(36). Timestamp provides
    // millisecond precision ordering; the random suffix reduces
    // collision probability within the same millisecond to
    // 1/36^8 (~1/2.8e12) per session.
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  };

  const ping = (url: string): Promise<boolean> =>
    adapter.send(url, { method: 'GET' }).then((text) => text === '0');

  let isUnique: boolean = true;

  const register = () => {
    const unsubs: (() => void)[] = [];

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
      trackWithDurationMap.clear();
    };

    const sendLoadBeacon = async (): Promise<void> => {
      const ctx = adapter.context();
      const isFirstVisit = await ping(
        pingEndpoint + '?u=' + encodeURIComponent(ctx.location.host + ctx.location.pathname),
      );
      await adapter.send(trackEndpoint, {
        method: 'POST',
        body: JSON.stringify({
          e: AnalyticsEvent.LOAD,
          b: id,
          u: ctx.location.href,
          p: isUnique,
          q: isFirstVisit,
          a: 'pageview',
          r: ctx.referrer,
          t: ctx.timeZone,
        } satisfies EventRequestHandlerLoadRequestBody),
        mode: fetchMode,
      });
    };

    const sendUnloadBeacon = (): void => {
      if (!isUnloadCalled) {
        const body = JSON.stringify({
          e: AnalyticsEvent.UNLOAD,
          b: id,
          m: Date.now() - startTime,
        } satisfies EventRequestHandlerUnloadRequestBody);

        adapter.send(trackEndpoint, { method: 'POST', body, keepalive: true, mode: fetchMode });
      }

      isUnloadCalled = true;
    };

    // Register lifecycle hooks — each returns an unsubscribe function.
    unsubs.push(adapter.hooks.onUnload(() => sendUnloadBeacon()));

    unsubs.push(
      adapter.hooks.onVisibilityChange((hidden: boolean) => {
        if (hidden) {
          clearSessionTimer();
          sendUnloadBeacon();
        } else {
          cleanup();
          sendLoadBeacon();
          if (sessionTimeoutDuration) {
            resetSessionTimer();
          }
        }
      }),
    );

    if (sessionTimeoutDuration) {
      unsubs.push(adapter.hooks.onInteract(() => resetSessionTimer()));
    }

    unsubs.push(
      adapter.hooks.onNavigate(() => {
        clearSessionTimer();
        sendUnloadBeacon();
        cleanup();
        sendLoadBeacon();
      }),
    );

    ping(pingEndpoint).then((response: boolean) => {
      isUnique = response;
      sendLoadBeacon();

      if (sessionTimeoutDuration) {
        resetSessionTimer();
      }
    });

    return () => {
      clearSessionTimer();
      for (const unsub of unsubs) {
        unsub();
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
    const ctx = adapter.context();
    const isFirstVisit = await ping(
      pingEndpoint +
        '?u=' +
        encodeURIComponent(ctx.location.host + ctx.location.pathname) +
        '&k=' +
        encodeURIComponent(key),
    );
    const id = generateID();
    if (options?.withDuration) {
      trackWithDurationMap.set(key, { id, startTime: Date.now() });
    }

    const { type, ...rest } = data;
    await adapter.send(trackEndpoint, {
      method: 'POST',
      body: JSON.stringify({
        e: AnalyticsEvent.LOAD,
        b: id,
        u: ctx.location.href,
        p: isFirstVisit,
        q: isFirstVisit,
        a: type,
        r: ctx.referrer,
        t: ctx.timeZone,
        d: rest,
      } satisfies EventRequestHandlerLoadRequestBody),
      mode: fetchMode,
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
      return;
    }

    // Remove synchronously to prevent race conditions
    trackWithDurationMap.delete(key);

    await adapter.send(trackEndpoint, {
      method: 'POST',
      body: JSON.stringify({
        e: AnalyticsEvent.UNLOAD,
        b: id,
        m: Date.now() - startTime,
      } satisfies EventRequestHandlerUnloadRequestBody),
      mode: fetchMode,
    });
  };

  return {
    register,
    track,
    trackEndOf,
  };
};
