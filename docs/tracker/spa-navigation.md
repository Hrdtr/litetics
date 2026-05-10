---
description: How the tracker automatically detects and tracks single-page application navigation with history and hash mode support.
---

# SPA Navigation

The tracker automatically detects and tracks single-page application (SPA) navigation. When the route changes without a full page reload, the tracker sends an unload beacon for the previous route and a load beacon for the new one.

## How It Works

The tracker intercepts `pushState` calls and listens to `popstate` to detect route changes without full page reloads.

### History Mode (Default)

The browser adapter wraps `history.pushState`. When your router calls `pushState` (from a `<NuxtLink>`, `<RouterLink>`, or `router.push()`), the wrapped version fires all registered `onNavigate` callbacks.

The adapter also listens to `popstate` — fired when the user clicks the browser's back or forward buttons.

```text
User clicks link → router calls pushState → onNavigate fires
                                                  │
                    ┌─────────────────────────────┘
                    ▼
            sendUnloadBeacon()  (previous page, with duration)
                    │
                    ▼
              cleanup()         (new beacon ID, isUnique = false)
                    │
                    ▼
            sendLoadBeacon()    (new page, p: false, q: from ping)
```

### Hash Mode

For hash-based routers, the adapter listens to `hashchange` instead:

```ts
const tracker = createTracker({
  apiEndpoint: { track: '...', ping: '...' },
  adapter: createBrowserAdapter({ mode: 'hash' }),
});
```

When `location.hash` changes, `hashchange` fires → `onNavigate` listeners are called → unload/load cycle runs.

## Wrapping Semantics

`pushState` is wrapped once globally, not per adapter instance:

```ts
// First call — wraps history.pushState
const adapter1 = createBrowserAdapter();

// Second call — uses the already-wrapped pushState, adds to listener Set
const adapter2 = createBrowserAdapter();
```

Both adapters' `onNavigate` listeners fire when `pushState` is called. This means multiple tracker instances all detect the same navigation event.

## Uniqueness After Navigation

When SPA navigation occurs:

- `isUnique` is set to `false` (the user was already counted as unique today from the initial page load)
- A new beacon ID is generated
- A ping is sent for the new page URL (to determine `q` — whether this page was visited before today)
- No global ping is sent (the user's uniqueness for the day is preserved)

The subsequent load beacon carries `p: false` (returning user) and `q: true/false` (based on whether this specific page path was pinged before today).

## Framework Compatibility

Configurations for common routers and frameworks:

| Framework            | Router                        | Mode              |
| -------------------- | ----------------------------- | ----------------- |
| Vue (Vue Router)     | `createWebHistory()`          | History (default) |
| Vue (Vue Router)     | `createWebHashHistory()`      | Hash              |
| React (React Router) | `BrowserRouter`               | History (default) |
| React (React Router) | `HashRouter`                  | Hash              |
| Nuxt                 | `<NuxtLink>` (uses pushState) | History (default) |
| Next.js              | `<Link>` (uses pushState)     | History (default) |
| SvelteKit            | Client-side navigation        | History (default) |
