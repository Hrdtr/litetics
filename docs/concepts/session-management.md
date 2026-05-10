# Session Management

The tracker can automatically detect user inactivity and reset the session.

## Session Timeout

Configured via `sessionTimeoutDuration`:

```ts
const tracker = createTracker({
  apiEndpoint: { track: '...', ping: '...' },
  sessionTimeoutDuration: 5 * 60 * 1000, // 5 minutes
});
tracker.register();
```

When set, the tracker starts a timer. If no user interaction is detected before the timer fires, the current session is ended and a new one begins.

## How It Works

Each interaction resets the timer. When it expires, a new session begins.

```
Time ─────────────────────────────────────────────────────────────▶

register()  ┌─ interaction ─┐  ┌─ interaction ─┐      timeout fires
    │       │  timer reset  │  │  timer reset  │       │
    ▼       ▼               ▼  ▼               ▼       ▼
[load]     ...              ...               ... [unload] → [load]
                                                      (new session)
```

1. **Timer starts** after the initial ping and load beacon
2. **Timer resets** on `mousedown`, `keydown`, or `touchstart` events
3. **Timer fires** — the tracker sends an unload beacon for the old session, generates a new beacon ID, sets `isUnique` to `false` (user was already counted today), and sends a fresh load beacon

## Interaction Events

The browser adapter listens to three DOM events (passive mode, no default prevention):

| Event        | Description          |
| ------------ | -------------------- |
| `mousedown`  | Mouse button pressed |
| `keydown`    | Keyboard key pressed |
| `touchstart` | Touch contact begins |

These are the same events used by `onInteract` in the `RuntimeAdapter` interface. Custom adapters can implement their own interaction detection.

## When Timeout Is Not Set

If `sessionTimeoutDuration` is `undefined` (the default), no session timer runs and no `onInteract` listeners are registered. The tracker still captures page unloads, visibility changes, and SPA navigation normally.

## Session State After Timeout

When a timeout fires and a new session begins:

- A new beacon ID is generated
- `isUnique` is set to `false` (the user's first-load ping already counted them as unique for the day)
- A global uniqueness ping is not re-sent — the user was already counted for the day. A page-level ping (`?u=<host+path>`) is still sent to determine `q`.
- The new load event carries `p: false` and `q: true` (new page, same user)
