---
description: Overview of the Litetics server package — receiving beacons, enriching events, and determining visitor uniqueness.
---

# Server

The `litetics` package handles all server-side analytics work: receiving beacons, enriching them with metadata, and determining visitor uniqueness.

```ts
import { createLitetics, createPingResponse } from 'litetics';

const { handleEventRequest, handlePingRequest } = createLitetics({
  persist: (data) => {
    /* store load event */
  },
  update: ({ bid, durationMs }) => {
    /* attach duration */
  },
});

app.post('/event', (c) => handleEventRequest(c.req.raw).then(() => c.body(null, 204)));
app.get('/ping', (c) => handlePingRequest(c.req.raw).then(createPingResponse));
```

Two routes, one handler instance. `handleEventRequest` processes POST beacons. `handlePingRequest` processes GET pings.

## Input flexibility

Both methods accept a standard `Request` object, getter functions, or a pre-resolved payload. Pick whichever fits your framework:

```ts
// Request object (Hono, Workers, Bun, Deno)
handleEventRequest(c.req.raw);

// Getter functions (Nuxt Nitro, Fastify)
handleEventRequest({
  getRequestBody: () => readBody(event),
  getRequestHeader: (name) => getHeader(event, name),
});

// Pre-resolved payload (Express, any framework)
handleEventRequest({
  requestBody: req.body,
  requestHeaders: { 'user-agent': req.headers['user-agent'] },
});
```

See the [handler reference](/server/handler) for full API details, and the [integration pages](/server/hono) for framework-specific examples.

## Error Handling

The handlers do not throw on malformed input:

- Invalid JSON body → logged (if `debug: true`), event dropped
- Missing or invalid page URL → event dropped
- Unknown event type → logged (if `debug: true`), event dropped
- Bot user-agent → event dropped

`persist` and `update` errors propagate normally. Wrap with try/catch if needed.

## No Storage

Litetics never stores data. You provide `persist` and `update` callbacks. Common patterns: in-memory array (dev), database insert/update, log stream, analytics platform API call, or a combination.
