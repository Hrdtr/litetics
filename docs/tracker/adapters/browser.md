---
description: Reference for createBrowserAdapter — the default RuntimeAdapter using native browser APIs with history and hash modes.
---

# Browser Adapter

The `createBrowserAdapter` function creates a `RuntimeAdapter` that uses native browser APIs. This is the default adapter when none is provided to `createTracker`.

## Creating an Adapter

Pass no arguments for the default history-mode adapter, or specify `mode: 'hash'` for hash-based routing.

```ts
import { createBrowserAdapter } from 'litetics/tracker';

const adapter = createBrowserAdapter();
// or with options:
const adapter = createBrowserAdapter({ mode: 'hash' });
```

### Options

A single optional field controls the routing mode:

```ts
interface BrowserAdapterOptions {
  mode?: 'history' | 'hash'; // Default: 'history'
}
```

## How `send()` Works

The adapter's `send` method chooses the transport based on the request:

| Condition                  | Transport                       | Returns                        |
| -------------------------- | ------------------------------- | ------------------------------ |
| `GET`                      | `XMLHttpRequest`                | Response text (`"0"` or `"1"`) |
| `POST` with `keepalive`    | `navigator.sendBeacon()`        | `void`                         |
| `POST` without `keepalive` | `fetch()` with specified `mode` | `void`                         |

XHR errors for GET requests resolve to `""` (empty string).

## How `context()` Works

Returns a snapshot of the browser environment:

```ts
{
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  userAgent: navigator.userAgent,
  referrer: document.referrer,
  location: {
    host: location.host,
    hostname: location.hostname,
    pathname: location.pathname,
    href: location.href,
  },
}
```

## Hooks

The adapter registers DOM listeners for four lifecycle events:

| Hook                   | DOM Events                           | Purpose                            |
| ---------------------- | ------------------------------------ | ---------------------------------- |
| `onUnload`             | `pagehide`, `beforeunload`, `unload` | Send final unload beacon           |
| `onVisibilityChange`   | `visibilitychange`                   | Send unload beacon when tab hidden |
| `onInteract`           | `mousedown`, `keydown`, `touchstart` | Reset session timeout timer        |
| `onNavigate` (history) | `popstate` + wrapped `pushState`     | Detect SPA page transitions        |
| `onNavigate` (hash)    | `hashchange`                         | Detect hash-based SPA transitions  |

All hooks return unsubscribe functions.

## `pushState` Wrapping

In history mode, `createBrowserAdapter` wraps `history.pushState` to detect SPA navigation. The wrapping happens once globally — all adapter instances share the same wrapper via a `Set` of listener callbacks.

When `pushState` is called by your router framework (Vue Router, React Router, Nuxt, Next.js), the wrapped version fires all registered `onNavigate` listeners with the new URL.

## History vs Hash Mode

**History mode** (`mode: 'history'`, default):

- Wraps `history.pushState`
- Listens to `popstate` events
- Correct for: Vue Router (`createWebHistory`), React Router (`BrowserRouter`), Nuxt, Next.js, SvelteKit

**Hash mode** (`mode: 'hash'`):

- Does not wrap `pushState`
- Listens to `hashchange` events
- Correct for: Vue Router (`createWebHashHistory`), React Router (`HashRouter`)

Both modes only wrap `pushState` once globally. Switching between modes requires creating a new tracker instance.
