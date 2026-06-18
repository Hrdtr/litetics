---
description: Examples of integrating Litetics with Cloudflare Workers, Bun, Deno, Fastify, Express, and Nuxt Nitro.
---

# Other Server Frameworks

The handlers accept standard `Request` objects or getter/payload interfaces, making them compatible with any JavaScript HTTP server.

## Cloudflare Workers

Pass the incoming `Request` directly:

```ts
import { createEventRequestHandler, createPingRequestHandler, createPingResponse } from 'litetics';

const eventHandler = createEventRequestHandler({
  persist: (data) => {
    /* KV, D1, or Durable Object */
  },
  update: (data) => {
    /* update duration */
  },
});
const pingHandler = createPingRequestHandler();

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/ping' && request.method === 'GET') {
      const result = await pingHandler.handle(request);
      return createPingResponse(result);
    }

    if (url.pathname === '/event' && request.method === 'POST') {
      await eventHandler.handle(request);
      return new Response(null, { status: 204 });
    }

    return new Response('Not found', { status: 404 });
  },
};
```

## Bun

Bun's `fetch` handler receives a standard `Request`:

```ts
import { createEventRequestHandler, createPingRequestHandler, createPingResponse } from 'litetics';

const eventHandler = createEventRequestHandler({
  persist: logEvent,
  update: logDuration,
});
const pingHandler = createPingRequestHandler();

Bun.serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === '/ping') {
      const result = await pingHandler.handle(request);
      return createPingResponse(result);
    }

    if (url.pathname === '/event') {
      await eventHandler.handle(request);
      return new Response(null, { status: 204 });
    }

    return new Response('Not found', { status: 404 });
  },
});
```

## Deno

Deno's `serve` provides a standard `Request`:

```ts
import {
  createEventRequestHandler,
  createPingRequestHandler,
  createPingResponse,
} from 'npm:litetics';

const eventHandler = createEventRequestHandler({
  persist: logEvent,
  update: logDuration,
});
const pingHandler = createPingRequestHandler();

Deno.serve({ port: 3000 }, async (request) => {
  const url = new URL(request.url);

  if (url.pathname === '/ping') {
    const result = await pingHandler.handle(request);
    return createPingResponse(result);
  }

  if (url.pathname === '/event') {
    await eventHandler.handle(request);
    return new Response(null, { status: 204 });
  }

  return new Response('Not found', { status: 404 });
});
```

## Fastify

Fastify's request object does not implement the Web API `Request` interface, so use the options overload:

```ts
import Fastify from 'fastify';
import { createEventRequestHandler, createPingRequestHandler, createPingResponse } from 'litetics';

const eventHandler = createEventRequestHandler({
  persist: logEvent,
  update: logDuration,
});
const pingHandler = createPingRequestHandler();
const app = Fastify();

app.get('/ping', async (request, reply) => {
  const result = await pingHandler.handle({
    requestHeaders: { 'if-modified-since': request.headers['if-modified-since'] },
  });
  const response = createPingResponse(result);
  reply.status(response.status).headers(Object.fromEntries(response.headers)).send(response.body);
});

app.post('/event', async (request, reply) => {
  await eventHandler.handle({
    requestBody: request.body,
    requestHeaders: {
      'user-agent': request.headers['user-agent'],
      'accept-language': request.headers['accept-language'],
    },
  });
  reply.status(204).send();
});

app.listen({ port: 3000 });
```

## Express

Express doesn't use the Web API Request object — use the payload overload:

```ts
import express from 'express';
import { createEventRequestHandler, createPingRequestHandler, createPingResponse } from 'litetics';

const eventHandler = createEventRequestHandler({
  persist: logEvent,
  update: logDuration,
});
const pingHandler = createPingRequestHandler();
const app = express();

app.use(express.json());

app.get('/ping', async (req, res) => {
  const result = await pingHandler.handle({
    requestHeaders: { 'if-modified-since': req.headers['if-modified-since'] },
  });
  const response = createPingResponse(result);
  res.status(response.status).set(Object.fromEntries(response.headers)).send(response.body);
});

app.post('/event', async (req, res) => {
  await eventHandler.handle({
    requestBody: req.body,
    requestHeaders: {
      'user-agent': req.headers['user-agent'],
      'accept-language': req.headers['accept-language'],
    },
  });
  res.status(204).send();
});

app.listen(3000);
```

## Nuxt Nitro

Use Nitro's `readBody` and `getHeader` helpers with the getter overload:

```ts
// server/api/event.post.ts
import { createEventRequestHandler } from 'litetics';

const eventHandler = createEventRequestHandler({
  persist: logEvent,
  update: logDuration,
});

export default defineEventRequestHandler(async (event) => {
  await eventHandler.handle({
    getRequestBody: () => readBody(event),
    getRequestHeader: (name) => getHeader(event, name) ?? null,
  });
  setResponseStatus(event, 204);
  return null;
});
```

```ts
// server/api/ping.get.ts
import { createPingRequestHandler, createPingResponse } from 'litetics';

const pingHandler = createPingRequestHandler();

export default defineEventRequestHandler(async (event) => {
  const result = await pingHandler.handle({
    getRequestHeader: (name) => getHeader(event, name) ?? null,
  });
  return createPingResponse(result);
});
```

## Persistence Patterns

Since Litetics has no built-in storage, custom `persist` and `update` implementations connect it to your data layer:

```ts
// In-memory (development)
const events: EventData[] = [];
const eventHandler = createEventRequestHandler({
  persist: (data) => {
    events.push(data);
  },
  update: ({ bid, durationMs }) => {
    const e = events.find((ev) => ev.bid === bid);
    if (e) e.durationMs = durationMs;
  },
});

// PostgreSQL (Drizzle)
const eventHandler = createEventRequestHandler({
  persist: async (data) => {
    await db.insert(events).values({
      /* ...map fields... */
    });
  },
  update: async ({ bid, durationMs }) => {
    await db.update(events).set({ durationMs }).where(eq(events.bid, bid));
  },
});

// Multiple destinations
const eventHandler = createEventRequestHandler({
  persist: async (data) => {
    await Promise.all([db.insert(data), analytics.send(data)]);
  },
  update: async (data) => {
    await Promise.all([db.update(data), analytics.update(data)]);
  },
});
```
