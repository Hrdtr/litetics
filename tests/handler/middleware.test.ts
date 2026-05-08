import type { Middleware, MiddlewareContext } from '../../src/handler/middleware';
// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';
import { applyMiddleware } from '../../src/handler/middleware';

const createCtx = (overrides?: Partial<MiddlewareContext>): MiddlewareContext => ({
  event: { e: 'load', b: 'id', u: 'https://example.com', p: true, q: true, a: 'pageview' },
  headers: { 'user-agent': 'test' },
  data: {},
  aborted: false,
  abort() {
    this.aborted = true;
  },
  ...overrides,
});

describe('applyMiddleware', () => {
  it('should run all middleware in order', async () => {
    const order: number[] = [];
    const mws: Middleware[] = [
      async () => {
        order.push(1);
      },
      async () => {
        order.push(2);
      },
      async () => {
        order.push(3);
      },
    ];
    await applyMiddleware(mws, createCtx());
    expect(order).toEqual([1, 2, 3]);
  });

  it('should work with empty middleware array', async () => {
    await expect(applyMiddleware([], createCtx())).resolves.toBeUndefined();
  });

  it('should support async middleware', async () => {
    const fn = vi.fn();
    const mws: Middleware[] = [
      async () => {
        await Promise.resolve();
        fn();
      },
    ];
    await applyMiddleware(mws, createCtx());
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should allow middleware to mutate data', async () => {
    const mws: Middleware[] = [
      (ctx) => {
        ctx.data.country = 'US';
      },
    ];
    const ctx = createCtx();
    await applyMiddleware(mws, ctx);
    expect(ctx.data).toHaveProperty('country', 'US');
  });

  it('should stop processing when aborted', async () => {
    const order: number[] = [];
    const mws: Middleware[] = [
      async (ctx) => {
        order.push(1);
        ctx.abort();
      },
      async () => {
        order.push(2);
      },
    ];
    const ctx = createCtx();
    await applyMiddleware(mws, ctx);
    expect(order).toEqual([1]);
    expect(ctx.aborted).toBe(true);
  });

  it('should skip to next middleware when aborted flag is already set', async () => {
    const order: number[] = [];
    const mws: Middleware[] = [
      async () => {
        order.push(1);
      },
      async () => {
        order.push(2);
      },
    ];
    const ctx = createCtx();
    ctx.aborted = true;
    await applyMiddleware(mws, ctx);
    expect(order).toEqual([]);
  });

  it('should stop processing when middleware sets aborted', async () => {
    const order: number[] = [];
    const mws: Middleware[] = [
      async () => {
        order.push(1);
      },
      async (ctx) => {
        ctx.abort();
        order.push(2);
      },
      async () => {
        order.push(3);
      },
    ];
    const ctx = createCtx();
    await applyMiddleware(mws, ctx);
    expect(order).toEqual([1, 2]);
    expect(ctx.aborted).toBe(true);
  });

  it('should provide event and headers to middleware', async () => {
    const middleware = vi.fn();
    const mws: Middleware[] = [middleware];
    const ctx = createCtx();
    await applyMiddleware(mws, ctx);
    expect(middleware).toHaveBeenCalledWith(ctx);
    expect(middleware.mock.calls[0][0].event.e).toBe('load');
    expect(middleware.mock.calls[0][0].headers['user-agent']).toBe('test');
  });
});
