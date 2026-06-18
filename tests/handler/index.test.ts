// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';
import * as handler from '../../src';

describe('handler module exports', () => {
  it('should export createLitetics', () => {
    expect(handler.createLitetics).toBeDefined();
    expect(typeof handler.createLitetics).toBe('function');
  });

  it('createLitetics should return a Litetics instance with working handlers', async () => {
    const persist = vi.fn();
    const update = vi.fn();
    const litetics = handler.createLitetics({ persist, update });
    expect(litetics).toBeInstanceOf(handler.Litetics);
    expect(typeof litetics.handleEventRequest).toBe('function');
    expect(typeof litetics.handlePingRequest).toBe('function');

    await litetics.handleEventRequest({
      requestBody: {
        e: 'load',
        b: 'test-bid',
        u: 'https://example.com',
        p: true,
        q: true,
        a: 'pageview',
      },
      requestHeaders: {},
    });
    expect(persist).toHaveBeenCalled();
  });

  it('should export createPingResponse', () => {
    expect(handler.createPingResponse).toBeDefined();
    expect(typeof handler.createPingResponse).toBe('function');
  });

  it('should export Litetics class', () => {
    expect(handler.Litetics).toBeDefined();
  });

  it('should export createEventRequestHandler', () => {
    expect(handler.createEventRequestHandler).toBeDefined();
    expect(typeof handler.createEventRequestHandler).toBe('function');
  });

  it('should export createPingRequestHandler', () => {
    expect(handler.createPingRequestHandler).toBeDefined();
    expect(typeof handler.createPingRequestHandler).toBe('function');
  });

  it('should export EventRequestHandler class', () => {
    expect(handler.EventRequestHandler).toBeDefined();
  });

  it('should export PingRequestHandler class', () => {
    expect(handler.PingRequestHandler).toBeDefined();
  });

  it('createEventRequestHandler should return an EventRequestHandler with a handle method', () => {
    const persist = vi.fn();
    const update = vi.fn();
    const eventHandler = handler.createEventRequestHandler({ persist, update });
    expect(eventHandler).toBeInstanceOf(handler.EventRequestHandler);
    expect(typeof eventHandler.handle).toBe('function');
    expect(typeof eventHandler.track).toBe('function');
  });

  it('createPingRequestHandler should return a PingRequestHandler with a handle method', () => {
    const pingHandler = handler.createPingRequestHandler();
    expect(pingHandler).toBeInstanceOf(handler.PingRequestHandler);
    expect(typeof pingHandler.handle).toBe('function');
    expect(typeof pingHandler.process).toBe('function');
  });
});
