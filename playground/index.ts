import type { EventData } from '../src/types';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { createEventHandler, createPingHandler, createPingResponse } from '../src';

const __dirname = dirname(fileURLToPath(import.meta.url));

const events: EventData[] = [];

const eventHandler = createEventHandler({
  persist: (data) => {
    events.push(data);
  },
  update: ({ bid, durationMs }) => {
    const event = events.find((e) => e.bid === bid);
    if (event) {
      event.durationMs = durationMs;
    }
  },
  debug: true,
});

const pingHandler = createPingHandler({ debug: true });

const app = new Hono();

app.use('*', async (c, next) => {
  if (c.req.method === 'OPTIONS') {
    return c.body(null, 204);
  }
  await next();
  c.res.headers.set('Access-Control-Allow-Origin', '*');
});

app.get('/ping', (c) => pingHandler.process(c.req.raw).then(createPingResponse));

app.post('/event', async (c) => {
  await eventHandler.track(c.req.raw);
  return c.body(null, 204);
});

app.get('/events', (c) => c.json(events));

app.get('/', (_c) => {
  const html = readFileSync(resolve(__dirname, 'index.html'), 'utf-8');
  return new Response(html, {
    headers: { 'content-type': 'text/html' },
  });
});

const port = Number(process.env.PORT) || 3000;
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`\n  Litetics playground\n  http://localhost:${info.port}\n`);
});
