// @vitest-environment node
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { createEventHandler, createPingHandler, createPingResponse } from '../../src';

describe('tracker → hono → handler', () => {
  const persist = vi.fn();
  const update = vi.fn();
  const eventHandler = createEventHandler({ persist, update });
  const pingHandler = createPingHandler();

  const app = new Hono();

  app.get('/ping', async (c) => {
    const result = await pingHandler.process({
      requestHeaders: { 'If-Modified-Since': c.req.header('If-Modified-Since') },
    });
    return createPingResponse(result);
  });

  app.post('/event', async (c) => {
    await eventHandler.track({
      requestBody: await c.req.json(),
      requestHeaders: {
        'User-Agent': c.req.header('User-Agent'),
        'Accept-Language': c.req.header('Accept-Language'),
      },
    });
    return c.body(null, 204);
  });

  let baseUrl: string;
  let closeServer: () => void;

  beforeAll(async () => {
    await new Promise<void>((resolve) => {
      const s = serve({ fetch: app.fetch, port: 0 }, (info) => {
        baseUrl = `http://localhost:${info.port}`;
        resolve();
      });
      closeServer = () => s.close();
    });
  });

  afterAll(() => {
    closeServer?.();
  });

  it('should have server running', () => {
    expect(baseUrl).toBeDefined();
    expect(baseUrl).toMatch(/^http:\/\/localhost:\d+$/);
  });

  it('should respond to ping', async () => {
    const res = await fetch(`${baseUrl}/ping`);
    expect(res.status).toBe(200);
    expect(await res.text()).toBe('0');
  });

  it('should process a load event via hono', async () => {
    const res = await fetch(`${baseUrl}/event`, {
      method: 'POST',
      body: JSON.stringify({
        e: 'load',
        b: 'test-bid',
        u: 'https://example.com',
        p: true,
        q: true,
        a: 'pageview',
      }),
      headers: {
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 TestBrowser/1.0',
      },
    });
    expect(res.status).toBe(204);

    expect(persist).toHaveBeenCalledOnce();
    const data = persist.mock.calls[0][0];
    expect(data).toMatchObject({
      bid: 'test-bid',
      host: 'example.com',
      path: '/',
      type: 'pageview',
    });
  });

  it('should handle unload events', async () => {
    const eventRes = await fetch(`${baseUrl}/event`, {
      method: 'POST',
      body: JSON.stringify({ e: 'unload', b: 'test-bid', m: 5000 }),
      headers: {
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 TestBrowser/1.0',
      },
    });
    expect(eventRes.status).toBe(204);

    expect(update).toHaveBeenCalledWith({ bid: 'test-bid', durationMs: 5000 });
  });

  it('should reject bots', async () => {
    const eventRes = await fetch(`${baseUrl}/event`, {
      method: 'POST',
      body: JSON.stringify({
        e: 'load',
        b: 'bot-bid',
        u: 'https://example.com',
        p: true,
        q: true,
        a: 'pageview',
      }),
      headers: {
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      },
    });
    expect(eventRes.status).toBe(204);

    const botCall = persist.mock.calls.find(
      (args) => (args[0] as Record<string, unknown>).bid === 'bot-bid',
    );
    expect(botCall).toBeUndefined();
  });
});

describe('handler with raw Request', () => {
  const persist = vi.fn();
  const update = vi.fn();
  const eventHandler = createEventHandler({ persist, update });
  const pingHandler = createPingHandler();

  const app = new Hono();

  // These routes pass the raw Web API Request object directly to the handler
  // without using any hono helpers (c.req.header, c.req.json, etc.).
  // The handler must extract everything from the Request itself.
  app.get('/ping', (c) => pingHandler.process(c.req.raw).then(createPingResponse));
  app.post('/event', (c) => eventHandler.track(c.req.raw).then(() => c.body(null, 204)));

  let baseUrl: string;
  let closeServer: () => void;

  beforeAll(async () => {
    await new Promise<void>((resolve) => {
      const s = serve({ fetch: app.fetch, port: 0 }, (info) => {
        baseUrl = `http://localhost:${info.port}`;
        resolve();
      });
      closeServer = () => s.close();
    });
  });

  afterAll(() => {
    closeServer?.();
  });

  it('should process ping', async () => {
    const res = await fetch(`${baseUrl}/ping`);
    expect(res.status).toBe(200);
    expect(await res.text()).toBe('0');
  });

  it('should process load event', async () => {
    const res = await fetch(`${baseUrl}/event`, {
      method: 'POST',
      body: JSON.stringify({
        e: 'load',
        b: 'raw2-bid',
        u: 'https://example.com/raw-test',
        p: true,
        q: true,
        a: 'pageview',
        t: 'Europe/London',
      }),
      headers: {
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 RawTest/1.0',
        'accept-language': 'fr-FR,fr;q=0.9',
      },
    });
    expect(res.status).toBe(204);

    const call = persist.mock.calls.find(
      (args) => (args[0] as Record<string, unknown>).bid === 'raw2-bid',
    );
    expect(call).toBeDefined();
    const data = call![0] as Record<string, unknown>;
    expect(data).toMatchObject({
      host: 'example.com',
      path: '/raw-test',
      type: 'pageview',
      timezone: 'Europe/London',
      country: 'GB',
    });
    expect(data.languageCode).toBe('fr');
    expect(data.languageRegion).toBe('FR');
  });

  it('should reject bots', async () => {
    const res = await fetch(`${baseUrl}/event`, {
      method: 'POST',
      body: JSON.stringify({
        e: 'load',
        b: 'bot-raw',
        u: 'https://example.com',
        p: true,
        q: true,
        a: 'pageview',
      }),
      headers: {
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      },
    });
    expect(res.status).toBe(204);
    const botCall = persist.mock.calls.find(
      (args) => (args[0] as Record<string, unknown>).bid === 'bot-raw',
    );
    expect(botCall).toBeUndefined();
  });

  it('should handle custom event types', async () => {
    const res = await fetch(`${baseUrl}/event`, {
      method: 'POST',
      body: JSON.stringify({
        e: 'load',
        b: 'custom-bid',
        u: 'https://example.com',
        p: true,
        q: true,
        a: 'signup',
        d: { plan: 'premium', trial: true, amount: 29.99, coupon: null },
      }),
      headers: {
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 TestBrowser/1.0',
      },
    });
    expect(res.status).toBe(204);

    const call = persist.mock.calls.find(
      (args) => (args[0] as Record<string, unknown>).bid === 'custom-bid',
    );
    expect(call).toBeDefined();
    const data = call![0] as Record<string, unknown>;
    expect(data.type).toBe('signup');
    expect(data.properties).toEqual({ plan: 'premium', trial: true, amount: 29.99, coupon: null });
  });

  it('should handle unknown event types', async () => {
    const persistCount = persist.mock.calls.length;

    const res = await fetch(`${baseUrl}/event`, {
      method: 'POST',
      body: JSON.stringify({ e: 'unknown', b: 'unknown-bid' }),
      headers: {
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 TestBrowser/1.0',
      },
    });
    expect(res.status).toBe(204);
    // persist should not be called for unknown events
    expect(persist.mock.calls.length).toBe(persistCount);
  });

  it('should skip load event with missing URL', async () => {
    const persistCount = persist.mock.calls.length;

    const res = await fetch(`${baseUrl}/event`, {
      method: 'POST',
      body: JSON.stringify({ e: 'load', b: 'no-url-bid', u: '', p: true, q: true, a: 'pageview' }),
      headers: {
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 TestBrowser/1.0',
      },
    });
    expect(res.status).toBe(204);
    expect(persist.mock.calls.length).toBe(persistCount);
  });

  it('should handle multiple rapid events', async () => {
    const startCount = persist.mock.calls.length;

    await Promise.all([
      fetch(`${baseUrl}/event`, {
        method: 'POST',
        body: JSON.stringify({
          e: 'load',
          b: 'rapid-1',
          u: 'https://example.com/page1',
          p: true,
          q: true,
          a: 'pageview',
        }),
        headers: {
          'content-type': 'application/json',
          'user-agent': 'Mozilla/5.0 TestBrowser/1.0',
        },
      }),
      fetch(`${baseUrl}/event`, {
        method: 'POST',
        body: JSON.stringify({
          e: 'load',
          b: 'rapid-2',
          u: 'https://example.com/page2',
          p: false,
          q: true,
          a: 'pageview',
        }),
        headers: {
          'content-type': 'application/json',
          'user-agent': 'Mozilla/5.0 TestBrowser/1.0',
        },
      }),
      fetch(`${baseUrl}/event`, {
        method: 'POST',
        body: JSON.stringify({
          e: 'load',
          b: 'rapid-3',
          u: 'https://example.com/page3',
          p: false,
          q: false,
          a: 'pageview',
        }),
        headers: {
          'content-type': 'application/json',
          'user-agent': 'Mozilla/5.0 TestBrowser/1.0',
        },
      }),
    ]);

    expect(persist.mock.calls.length - startCount).toBe(3);
  });

  it('should normalize trailing slashes in path', async () => {
    const res = await fetch(`${baseUrl}/event`, {
      method: 'POST',
      body: JSON.stringify({
        e: 'load',
        b: 'trailing-bid',
        u: 'https://example.com/blog/',
        p: true,
        q: true,
        a: 'pageview',
      }),
      headers: {
        'content-type': 'application/json',
        'user-agent': 'Mozilla/5.0 TestBrowser/1.0',
      },
    });
    expect(res.status).toBe(204);

    const call = persist.mock.calls.find(
      (args) => (args[0] as Record<string, unknown>).bid === 'trailing-bid',
    );
    expect(call).toBeDefined();
    expect((call![0] as Record<string, unknown>).path).toBe('/blog');
  });
});
