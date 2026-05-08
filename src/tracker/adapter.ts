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
   * HTTP transport primitives. All are optional with sensible fallbacks.
   */
  transport: {
    /**
     * Standard `fetch` for sending event data.
     */
    fetch: typeof globalThis.fetch;
    /**
     * Fire-and-forget transport for unload beacons. Falls back to `fetch`
     * with `keepalive: true` when not provided.
     */
    sendBeacon?: (url: string, data: BodyInit) => boolean;
    /**
     * Synchronous XMLHttpRequest for ping requests. Falls back to a
     * dynamic `new XMLHttpRequest()` when not provided.
     */
    xmlHttpRequest?: () => XMLHttpRequest;
  };

  /**
   * Read-only environment information about the current page/session.
   * Values are accessed lazily (getters) so they reflect the latest state.
   */
  environment: {
    /** The IANA time zone of the user, e.g. `"Europe/London"`. */
    timezone: string;
    /** The raw User-Agent string. */
    userAgent: string;
    /** The document referrer (the page that linked here). */
    referrer: string;
    /** The current page URL components. */
    location: { host: string; hostname: string; pathname: string; href: string };
  };

  /**
   * Lifecycle hooks let the tracker listen to page/session events
   * without depending on DOM APIs directly.
   *
   * Each hook returns an unsubscribe function.
   */
  hooks: {
    /**
     * Fires when the page is being unloaded (pagehide / beforeunload / unload).
     * The tracker uses this to send final beacons.
     */
    onUnload: (fn: () => void) => () => void;
    /**
     * Fires when page visibility changes. The callback receives a boolean
     * indicating whether the page is now hidden.
     */
    onVisibilityChange: (fn: (hidden: boolean) => void) => () => void;
    /**
     * Fires on any user interaction (mousedown, keydown, touchstart).
     * The tracker uses this to reset the session timeout.
     */
    onInteract: (fn: () => void) => () => void;
    /**
     * Fires when navigation occurs (popstate, hashchange, or wrapped
     * pushState/replaceState). The callback receives the new URL.
     */
    onNavigate: (fn: (url: string) => void) => () => void;
  };

  /**
   * Updates the current URL. How the URL is reflected depends on the
   * runtime: in a browser this calls `history.pushState` or sets
   * `location.hash`; in other runtimes it may be a no-op.
   */
  navigate: (url: string) => void;
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
 * Wraps `history.pushState` / `history.replaceState` so that SPA
 * navigation via the History API is captured through `onNavigate`.
 *
 * @param options - Optional mode configuration.
 * @returns A fully configured browser adapter.
 */
export const createBrowserAdapter = (options?: BrowserAdapterOptions): RuntimeAdapter => {
  let currentOnNavigate: ((url: string) => void) | null = null;
  let isInternalNav = false;

  const originalPushState = history.pushState.bind(history);
  const originalReplaceState = history.replaceState.bind(history);

  // Wrap history methods so the adapter can detect SPA navigations
  // triggered by the application calling pushState/replaceState.
  const wrapHistory = (original: typeof originalPushState) => {
    return function (
      this: History,
      state: unknown,
      unused: string,
      url?: string | URL | null,
      ...rest: unknown[]
    ) {
      Reflect.apply(original, this, [state, unused, url, ...rest]);
      if (!isInternalNav && currentOnNavigate) {
        currentOnNavigate(location.href);
      }
    };
  };

  history.pushState = wrapHistory(originalPushState);
  history.replaceState = wrapHistory(originalReplaceState);

  return {
    transport: {
      fetch: globalThis.fetch.bind(globalThis),
      sendBeacon: navigator.sendBeacon?.bind(navigator),
    },

    environment: {
      get timezone() {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
      },
      get userAgent() {
        return navigator.userAgent;
      },
      get referrer() {
        return document.referrer;
      },
      get location() {
        return {
          host: location.host,
          hostname: location.hostname,
          pathname: location.pathname,
          href: location.href,
        };
      },
    },

    hooks: {
      onUnload: (fn) => {
        addEventListener('pagehide', fn);
        addEventListener('beforeunload', fn);
        addEventListener('unload', fn);
        return () => {
          removeEventListener('pagehide', fn);
          removeEventListener('beforeunload', fn);
          removeEventListener('unload', fn);
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
        currentOnNavigate = fn;
        const onPopState = () => fn(location.href);
        addEventListener('popstate', onPopState);
        if (options?.mode === 'hash') {
          addEventListener('hashchange', onPopState);
          return () => {
            currentOnNavigate = null;
            removeEventListener('popstate', onPopState);
            removeEventListener('hashchange', onPopState);
          };
        }
        return () => {
          currentOnNavigate = null;
          removeEventListener('popstate', onPopState);
        };
      },
    },

    navigate: (url) => {
      if (options?.mode === 'hash') {
        isInternalNav = true;
        location.hash = url;
        isInternalNav = false;
      } else {
        isInternalNav = true;
        history.pushState(null, '', url);
        isInternalNav = false;
      }
    },
  };
};
