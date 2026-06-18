// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';
import * as handler from '../../src';

describe('handler module exports', () => {
  it('should export createLitetics', () => {
    expect(handler.createLitetics).toBeDefined();
    expect(typeof handler.createLitetics).toBe('function');
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

  it('createEventRequestHandler should return an EventRequestHandler with a track method', () => {
    const persist = vi.fn();
    const update = vi.fn();
    const eventHandler = handler.createEventRequestHandler({ persist, update });
    expect(eventHandler).toBeInstanceOf(handler.EventRequestHandler);
    expect(typeof eventHandler.track).toBe('function');
  });

  it('createPingRequestHandler should return a PingRequestHandler with a process method', () => {
    const pingHandler = handler.createPingRequestHandler();
    expect(pingHandler).toBeInstanceOf(handler.PingRequestHandler);
    expect(typeof pingHandler.process).toBe('function');
  });

  it('createPingRequestHandler should expose handle method', () => {
    const pingHandler = handler.createPingRequestHandler();
    expect(typeof pingHandler.handle).toBe('function');
  });
});
