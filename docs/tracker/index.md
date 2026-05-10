# Tracker

The tracker runs on the client, generating beacon IDs, sending pings and beacons, and managing the page lifecycle. Import from `litetics/tracker`.

```ts
import { createTracker } from 'litetics/tracker';
```

## Exports

| Export                           | Description                                                |
| -------------------------------- | ---------------------------------------------------------- |
| `createTracker(options)`         | Creates a tracker instance                                 |
| `createBrowserAdapter(options?)` | Creates a `RuntimeAdapter` backed by browser APIs          |
| `AnalyticsEvent`                 | Event type constants: `{ LOAD: 'load', UNLOAD: 'unload' }` |

## Architecture

The tracker is platform-independent. All browser API access is routed through a `RuntimeAdapter` interface. When no adapter is provided, `createBrowserAdapter()` is used as the default.

```
createTracker(options)
    │
    ├─ adapter (creates BrowserAdapter by default)
    │     ├─ send()           → XHR (GET) / fetch (POST) / sendBeacon (keepalive)
    │     ├─ context()        → timeZone, userAgent, referrer, location
    │     └─ hooks            → onUnload, onVisibilityChange, onInteract, onNavigate
    │
    └─ public API
          ├─ register()       → start pageview lifecycle
          ├─ track()          → send custom event
          └─ trackEndOf()     → end timed custom event
```

## Quick Setup

```ts
const tracker = createTracker({
  apiEndpoint: {
    track: 'http://localhost:3000/event',
    ping: 'http://localhost:3000/ping',
  },
});

const stop = tracker.register();
```

`register()` returns a cleanup function. Call it to stop all tracking (unregisters hooks, clears timers).

## Minimum Options

Only `apiEndpoint.track` and `apiEndpoint.ping` are required. Both must be valid URLs with protocols. Invalid URLs throw at construction time.

```ts
createTracker({
  apiEndpoint: {
    track: 'http://...', // required
    ping: 'http://...', // required
  },
  // optional:
  adapter: myAdapter,
  sessionTimeoutDuration: 5 * 60 * 1000,
  fetchMode: 'no-cors',
});
```

## Package Size

`litetics/tracker` is tree-shakeable and has no runtime dependencies of its own. The browser adapter is included in the tracker build but only loaded when used.
