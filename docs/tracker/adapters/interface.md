# Runtime Adapter Interface

The `RuntimeAdapter` interface decouples the tracker from any specific platform. Implement it to run the tracker in Node.js, Deno, React Native, tests, or any other environment.

## Interface

The adapter must provide three capabilities: transport, context, and lifecycle hooks.

```ts
interface RuntimeAdapter {
  send: (url: string, options: SendOptions) => Promise<string | void>;
  context: () => EnvironmentContext;
  hooks: {
    onUnload: (fn: () => void) => () => void;
    onVisibilityChange: (fn: (hidden: boolean) => void) => () => void;
    onInteract: (fn: () => void) => () => void;
    onNavigate: (fn: (url: string) => void) => () => void;
  };
}
```

## `send(url, options)`

The transport layer. Called for both pings (GET) and beacons (POST).

```ts
interface SendOptions {
  method: 'GET' | 'POST';
  body?: string;
  mode?: 'no-cors' | 'cors' | 'same-origin';
  keepalive?: boolean;
}
```

Return value:

- **GET**: Return the response body as a `string`. The tracker reads `"0"` or `"1"` from the ping response.
- **POST**: Return `void`. POST beacons are fire-and-forget.

The `options` parameter carries all the context the adapter needs:

| Field       | Used when                      | Purpose                                       |
| ----------- | ------------------------------ | --------------------------------------------- |
| `method`    | Always                         | HTTP method                                   |
| `body`      | POST                           | JSON-serialized beacon payload                |
| `mode`      | POST (when `fetchMode` is set) | CORS mode for fetch                           |
| `keepalive` | POST (unload beacons)          | Hint to use `sendBeacon` or `keepalive: true` |

A correct `send` implementation must forward `keepalive` and `mode` to the underlying transport. The tracker relies on `keepalive` for unload beacons to ensure delivery during page teardown.

## `context()`

Returns a point-in-time snapshot of environment metadata used to enrich events.

```ts
interface EnvironmentContext {
  timeZone: string; // IANA time zone, e.g. "Europe/London"
  userAgent: string; // Raw user-agent string
  referrer: string; // Document referrer URL
  location: {
    host: string; // e.g. "example.com"
    hostname: string; // e.g. "example.com"
    pathname: string; // e.g. "/blog/post-1"
    href: string; // Full URL
  };
}
```

Called fresh on every `register()`, `track()`, and navigation event.

## Hooks

Each hook returns an unsubscribe function.

### `onUnload(fn)`

Called when the session is ending (page unload, tab close, timeout). The tracker calls `fn` to send the final unload beacon.

In a browser, register `pagehide`, `beforeunload`, `unload` listeners. In a CLI tool, register process exit handlers. In an environment without lifecycle events, return a no-op unsubscribe.

### `onVisibilityChange(fn)`

Called when the page/document visibility changes. Receives `true` when hidden, `false` when visible. The tracker sends an unload beacon when the page becomes hidden.

In a browser, listen to `visibilitychange`. In React Native, listen to `AppState` changes.

### `onInteract(fn)`

Fires on user interaction. The tracker only uses this hook when `sessionTimeoutDuration` is configured — it resets the inactivity timer so an idle session timeout does not fire while the user is active. The tracker does not use this to automatically create analytics events; custom events are always sent via `track()`.

In a browser, listen to `mousedown`, `keydown`, `touchstart` (passive). If your adapter runs in an environment without user interaction, or you are not using `sessionTimeoutDuration`, return a no-op unsubscribe.

### `onNavigate(fn)`

Called when navigation occurs. Receives the new URL as a string.

In a browser with history routing, wrap `pushState` and listen to `popstate`. In a browser with hash routing, listen to `hashchange`. In environments without routing, return a no-op unsubscribe.

## No-Op Hooks

For environments without browser-like lifecycle events (CLI tools, server processes, cron jobs), hooks can be no-ops:

```ts
hooks: {
  onUnload: () => () => {},
  onVisibilityChange: () => () => {},
  onInteract: () => () => {},
  onNavigate: () => () => {},
}
```

The tracker still functions — it just won't send unload beacons or detect session changes.
