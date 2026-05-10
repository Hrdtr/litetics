---
description: API reference for the tracker instance methods — register, track, and trackEndOf.
---

# Tracker Instance

The tracker instance provides three methods: `register`, `track`, and `trackEndOf`.

## `register()`

Starts tracking the current page. Returns a cleanup function.

```ts
const stop = tracker.register();

// Later:
stop(); // unregisters all hooks, clears timers
```

What happens when `register()` is called:

1. Generates a beacon ID (timestamp base36 + random suffix)
2. Sends a ping to determine visitor uniqueness
3. Sends a load beacon with page context
4. Registers lifecycle hooks: unload, visibility change, interaction, navigation

## `track(key, data, options?)`

Sends a custom event beacon.

```ts
await tracker.track('signup_button', {
  type: 'engagement',
  label: 'hero-cta',
});
```

### Parameters

`track()` accepts three arguments:

| Parameter | Type                                       | Required | Description                                    |
| --------- | ------------------------------------------ | -------- | ---------------------------------------------- |
| `key`     | `string`                                   | Yes      | Event identifier. Used for timed event lookups |
| `data`    | `{ type: string; [k: string]: Primitive }` | Yes      | Event data. `type` is required                 |
| `options` | `{ withDuration?: boolean }`               | No       | Set `withDuration: true` for timed events      |

When called, the tracker:

1. Sends a ping (with `?u=<host+path>&k=<key>` for page + event uniqueness)
2. Sends a load beacon with `a` set to `data.type` and all extra fields in `d`
3. If `withDuration: true`, stores the key and start time for later resolution via `trackEndOf`

## `trackEndOf(key)`

Ends a timed event and sends the duration.

```ts
await tracker.track('video_play', { type: 'media' }, { withDuration: true });
// ... time passes ...
await tracker.trackEndOf('video_play');
```

This sends an unload beacon (`e: 'unload'`) with the beacon ID and calculated duration in milliseconds. The key is then removed from the internal map.

Calling `trackEndOf` for a key that was never tracked (or was already ended) is a no-op.

## Beacon ID

Generated per session:

```ts
Date.now().toString(36) + Math.random().toString(36).slice(2);
```

The timestamp provides millisecond ordering; the 8-character random suffix provides ~2.8 trillion possible values per millisecond.

## Unload Beacons

Unload beacons use `navigator.sendBeacon()` when available. If unavailable, `fetch()` with `keepalive: true` is used. This ensures beacons are delivered even during page teardown.

## Fetch Mode

Control CORS behavior of track POST requests:

| Mode                  | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| `'no-cors'` (default) | Opaque response. Simplest setup for cross-origin tracking        |
| `'cors'`              | Standard CORS. Server must include `Access-Control-Allow-Origin` |
| `'same-origin'`       | Only send when tracker and endpoint share the same origin        |

Ping requests ignore `fetchMode` — they always use `XMLHttpRequest`.
