# Hono Integration

Hono is the simplest framework to integrate because its `Context` exposes the standard `Request` object directly via `c.req.raw`.

## Full Example

A complete Hono server with both routes:

```ts
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { createLitetics, createPingResponse } from 'litetics';
import type { EventData } from 'litetics';

const events: EventData[] = [];

const { handleEventRequest, handlePingRequest } = createLitetics({
  persist: (data) => {
    events.push(data);
  },
  update: ({ bid, durationMs }) => {
    const event = events.find((e) => e.bid === bid);
    if (event) event.durationMs = durationMs;
  },
});

const app = new Hono();

app.get('/ping', (c) => handlePingRequest(c.req.raw).then(createPingResponse));
app.post('/event', (c) => handleEventRequest(c.req.raw).then(() => c.body(null, 204)));

serve({ fetch: app.fetch, port: 3000 });
```

## Using Hono Helpers

If you prefer using Hono's built-in utilities:

```ts
app.get('/ping', async (c) => {
  const result = await handlePingRequest({
    requestHeaders: { 'If-Modified-Since': c.req.header('If-Modified-Since') },
  });
  return createPingResponse(result);
});

app.post('/event', async (c) => {
  await handleEventRequest({
    requestBody: await c.req.json(),
    requestHeaders: {
      'User-Agent': c.req.header('User-Agent'),
      'Accept-Language': c.req.header('Accept-Language'),
    },
  });
  return c.body(null, 204);
});
```

## Middleware Pattern

Wrap `handleEventRequest` into reusable middleware:

```ts
import type { Litetics } from 'litetics';

function analyticsMiddleware(handler: Litetics) {
  return async (c: Context, next: Next) => {
    await handler.handleEventRequest(c.req.raw);
    await next();
  };
}

app.use('/event', analyticsMiddleware(handler));
```

## Debug Mode

Enable logging to see what the handler is doing:

```ts
const { handleEventRequest, handlePingRequest } = createLitetics({
  persist: (data) => {
    /* ... */
  },
  update: (data) => {
    /* ... */
  },
  debug: true,
});
```

Logs are prefixed with `[litetics:event]` and `[litetics:ping]`.
