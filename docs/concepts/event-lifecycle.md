---
description: How Litetics models pageviews and custom events as a load/unload pair with ping, load, and unload beacons.
---

# Event Lifecycle

Litetics models pageviews and custom events as a **load/unload** pair. A load event marks the start of an interaction; an unload event records how long it lasted.

## Pageview Lifecycle

A page visit produces three network calls in order:

```text
register()                    navigate away / SPA transition
    │                                               │
    ▼                                               ▼
 [ping]     →     [load event]  ─── time ───  [unload event]
```

1. **Ping** — `GET /ping` determines whether this is a new unique visitor
2. **Load** — `POST /event` with `{ e: 'load', b, u, p, q, a, r, t, d? }` carries the page URL, referrer, time zone, uniqueness flags, and optional custom data
3. **Unload** — `POST /event` with `{ e: 'unload', b, m }` carries only the beacon ID and duration in milliseconds

## Custom Event Lifecycle

Events tracked via `track()` follow the same ping-then-beacon pattern:

```text
track()                                   trackEndOf()
    │                                           │
    ▼                                           ▼
 [ping]  →  [load event]  ─── time ───  [unload event]
```

Custom events follow the same pattern. `track(key, data)` sends a ping (for uniqueness determination), then a load event. `trackEndOf(key)` sends an unload event with the beacon ID and duration. The custom data is carried in the load event's `d` (properties) field.

## Triggering Unload

The client sends an unload beacon when:

- The page unloads (`pagehide`, `beforeunload`, `unload`)
- Tab visibility changes to hidden (`visibilitychange` with `document.hidden === true`)
- SPA navigation occurs (History API `pushState` or `popstate`, or `hashchange` in hash mode)
- Session timeout fires (when `sessionTimeoutDuration` is set)

## Beacon Transport

Unload beacons use `navigator.sendBeacon()` when available. This ensures the beacon is delivered even when the page is being torn down. If `sendBeacon` is unavailable, `fetch()` with `keepalive: true` is used as fallback.

## Server-Side Handling

The server receives both load and unload beacons through the same endpoint:

```ts
const { handleEventRequest } = createLitetics({
  persist(data) {
    // Called for load events with fully enriched data
  },
  update({ bid, durationMs }) {
    // Called for unload events — find the load event by bid and attach the duration
  },
});
```

The `bid` (beacon ID) links a load event to its corresponding unload event. The tracker generates a unique bid per session, using a timestamp (millisecond precision, base36) followed by a random suffix.

## Duration Is `null` Until Unload

The `durationMs` field in `EventData` starts as `null`. For pageviews, it gets a value when the unload event arrives and your `update` callback runs. For one-time events (e.g. clicks, signups) tracked without `withDuration`, there is no corresponding unload — `durationMs` remains `null` permanently.
