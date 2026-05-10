/**
 * A runtime adapter abstracts all platform-specific APIs so the tracker
 * can run in any JavaScript environment (browser, Node.js, Bun, Deno,
 * Cloudflare Workers, etc.).
 *
 * Implement this interface to supply custom transport, environment
 * access, and lifecycle hooks for non-browser runtimes.
 */
export interface RuntimeAdapter {
  /**
   * Sends an HTTP request. The adapter implementation decides how to
   * execute it (fetch, XHR, node http, etc.).
   *
   * - For `GET` requests the response body text is returned.
   * - For `POST` requests the return value is void (fire-and-forget).
   */
  send: (url: string, options: SendOptions) => Promise<string | void>;

  /**
   * Returns a snapshot of the current environment context used to
   * enrich tracked events.
   */
  context: () => EnvironmentContext;

  /**
   * Lifecycle hooks let the tracker listen to page/session events
   * without depending on DOM APIs directly.
   *
   * Each hook returns an unsubscribe function.
   */
  hooks: {
    /**
     * Fires when the current session should end (page unload, tab close).
     * The tracker uses this to send final beacons.
     */
    onUnload: (fn: () => void) => () => void;
    /**
     * Fires when page visibility changes. The callback receives a boolean
     * indicating whether the page is now hidden.
     */
    onVisibilityChange: (fn: (hidden: boolean) => void) => () => void;
    /**
     * Fires on any user interaction. The tracker uses this to reset the
     * session timeout.
     */
    onInteract: (fn: () => void) => () => void;
    /**
     * Fires when navigation occurs (popstate, hashchange, or wrapped
     * pushState). The callback receives the new URL.
     */
    onNavigate: (fn: (url: string) => void) => () => void;
  };
}

/**
 * Options passed to {@link RuntimeAdapter.send}.
 */
export interface SendOptions {
  method: 'GET' | 'POST';
  body?: string;
  mode?: 'no-cors' | 'cors' | 'same-origin';
  keepalive?: boolean;
}

/**
 * The environment context returned by {@link RuntimeAdapter.context}. All
 * values represent a point-in-time snapshot of the current environment.
 */
export interface EnvironmentContext {
  /** The IANA time zone of the user, e.g. `"Europe/London"`. */
  timeZone: string;
  /** The raw User-Agent string. */
  userAgent: string;
  /** The document referrer (the page that linked here). */
  referrer: string;
  /** The current page URL components. */
  location: { host: string; hostname: string; pathname: string; href: string };
}

/**
 * Options for creating a browser-based adapter.
 */
export interface BrowserAdapterOptions {
  /**
   * The routing mode.
   * - `'history'` (default): Uses `history.pushState` and listens to `popstate`.
   * - `'hash'`: Uses `location.hash` and listens to `hashchange`.
   * @default 'history'
   */
  mode?: 'history' | 'hash';
}

/**
 * Creates a `RuntimeAdapter` for the browser environment.
 *
 * Wraps `history.pushState` so that SPA navigation via the History API
 * is captured through `onNavigate`.
 *
 * The wrapping only happens once — the original functions are saved
 * and all subsequent adapter instances share the same wrapper.
 *
 * @param options - Optional mode configuration.
 * @returns A fully configured browser adapter.
 */
let historyWrapped = false;
let globalOnNavigateListeners: Set<(url: string) => void> = new Set();

export const createBrowserAdapter = (options?: BrowserAdapterOptions): RuntimeAdapter => {
  if (!historyWrapped) {
    const originalPushState = history.pushState.bind(history);

    const wrapHistory = (original: typeof originalPushState) => {
      return function (
        this: History,
        state: unknown,
        unused: string,
        url?: string | URL | null,
        ...rest: unknown[]
      ) {
        Reflect.apply(original, this, [state, unused, url, ...rest]);
        for (const listener of globalOnNavigateListeners) {
          listener(location.href);
        }
      };
    };

    history.pushState = wrapHistory(originalPushState);
    historyWrapped = true;
  }

  return {
    send: (url, opts) => {
      if (opts.method === 'GET') {
        return new Promise((resolve) => {
          const xhr = new XMLHttpRequest();
          xhr.addEventListener('load', () => resolve(xhr.responseText));
          xhr.addEventListener('error', () => resolve(''));
          xhr.open('GET', url);
          xhr.send();
        });
      }

      if (opts.keepalive && navigator.sendBeacon) {
        navigator.sendBeacon(url, opts.body ?? '');
        return Promise.resolve();
      }

      return globalThis
        .fetch(url, {
          method: 'POST',
          body: opts.body,
          keepalive: opts.keepalive,
          mode: opts.mode,
        } as RequestInit)
        .then(() => {})
        .catch(() => {});
    },

    context: () => ({
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      location: {
        host: location.host,
        hostname: location.hostname,
        pathname: location.pathname,
        href: location.href,
      },
    }),

    hooks: {
      onUnload: (fn) => {
        let fired = false;
        const once = () => {
          if (fired) return;
          fired = true;
          fn();
        };
        addEventListener('pagehide', once);
        addEventListener('beforeunload', once);
        addEventListener('unload', once);
        return () => {
          removeEventListener('pagehide', once);
          removeEventListener('beforeunload', once);
          removeEventListener('unload', once);
        };
      },

      onVisibilityChange: (fn) => {
        const handler = () => fn(document.hidden);
        addEventListener('visibilitychange', handler);
        return () => removeEventListener('visibilitychange', handler);
      },

      onInteract: (fn) => {
        const types = ['mousedown', 'keydown', 'touchstart'] as const;
        for (const t of types) addEventListener(t, fn, { passive: true });
        return () => {
          for (const t of types) removeEventListener(t, fn);
        };
      },

      onNavigate: (fn) => {
        if (options?.mode === 'hash') {
          const onHashChange = () => fn(location.href);
          addEventListener('hashchange', onHashChange);
          return () => {
            removeEventListener('hashchange', onHashChange);
          };
        }

        globalOnNavigateListeners.add(fn);
        const onPopState = () => fn(location.href);
        addEventListener('popstate', onPopState);
        return () => {
          globalOnNavigateListeners.delete(fn);
          removeEventListener('popstate', onPopState);
        };
      },
    },
  };
};
