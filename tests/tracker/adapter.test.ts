// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { createBrowserAdapter } from '../../src/tracker/adapter';

describe('createBrowserAdapter', () => {
  it('should return an adapter with all required properties', () => {
    const adapter = createBrowserAdapter();
    expect(adapter).toHaveProperty('send');
    expect(adapter).toHaveProperty('context');
    expect(adapter).toHaveProperty('hooks');
    expect(adapter.send).toBeTypeOf('function');
    expect(adapter.context).toBeTypeOf('function');
  });

  it('should provide environment context', () => {
    const adapter = createBrowserAdapter();
    const ctx = adapter.context();
    expect(ctx.timeZone).toBeTypeOf('string');
    expect(ctx.userAgent).toBeTypeOf('string');
    expect(ctx.referrer).toBeTypeOf('string');
    expect(ctx.location).toHaveProperty('host');
    expect(ctx.location).toHaveProperty('hostname');
    expect(ctx.location).toHaveProperty('pathname');
    expect(ctx.location).toHaveProperty('href');
  });

  it('should provide send method', () => {
    const adapter = createBrowserAdapter();
    expect(adapter.send).toBeTypeOf('function');
  });

  it('send should resolve empty string on XHR error', async () => {
    const OrigXHR = globalThis.XMLHttpRequest;
    let triggerError: (() => void) | null = null;

    class MockXHR {
      responseText = '';
      addEventListener(type: string, fn: EventListener) {
        if (type === 'error') {
          triggerError = fn as () => void;
        }
      }
      open() {}
      setRequestHeader() {}
      send() {}
    }

    globalThis.XMLHttpRequest = MockXHR as unknown as typeof XMLHttpRequest;

    const adapter = createBrowserAdapter();
    const promise = adapter.send('http://x.com', { method: 'GET' }) as Promise<string>;

    triggerError!();
    expect(await promise).toBe('');

    globalThis.XMLHttpRequest = OrigXHR;
  });

  it('send should use empty string body fallback for keepalive', () => {
    const sendBeaconSpy = vi.fn();
    Object.defineProperty(navigator, 'sendBeacon', {
      writable: true,
      configurable: true,
      value: sendBeaconSpy,
    });
    const adapter = createBrowserAdapter();
    adapter.send('http://x.com', { method: 'POST', keepalive: true, body: undefined });
    expect(sendBeaconSpy).toHaveBeenCalledWith('http://x.com', '');
  });
});

describe('hooks', () => {
  it('onUnload should fire callback on pagehide and return unsubscribe', () => {
    const adapter = createBrowserAdapter();
    const fn = vi.fn();
    const unsub = adapter.hooks.onUnload(fn);
    window.dispatchEvent(new Event('pagehide'));
    expect(fn).toHaveBeenCalledTimes(1);
    unsub();
    window.dispatchEvent(new Event('pagehide'));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('onVisibilityChange should fire callback on visibilitychange', () => {
    const adapter = createBrowserAdapter();
    const fn = vi.fn();
    const unsub = adapter.hooks.onVisibilityChange(fn);
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    window.dispatchEvent(new Event('visibilitychange'));
    expect(fn).toHaveBeenCalledWith(true);
    unsub();
  });

  it('onInteract should fire callback on user events', () => {
    const adapter = createBrowserAdapter();
    const fn = vi.fn();
    const unsub = adapter.hooks.onInteract(fn);
    window.dispatchEvent(new Event('mousedown'));
    expect(fn).toHaveBeenCalledTimes(1);
    window.dispatchEvent(new Event('keydown'));
    expect(fn).toHaveBeenCalledTimes(2);
    unsub();
    window.dispatchEvent(new Event('mousedown'));
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('onNavigate should fire callback on popstate', () => {
    const adapter = createBrowserAdapter();
    const fn = vi.fn();
    const unsub = adapter.hooks.onNavigate(fn);
    window.dispatchEvent(new Event('popstate'));
    expect(fn).toHaveBeenCalledTimes(1);
    unsub();
    window.dispatchEvent(new Event('popstate'));
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('hash mode', () => {
  it('onNavigate should fire on hashchange in hash mode', () => {
    const adapter = createBrowserAdapter({ mode: 'hash' });
    const fn = vi.fn();
    const unsub = adapter.hooks.onNavigate(fn);
    window.dispatchEvent(new Event('hashchange'));
    expect(fn).toHaveBeenCalledTimes(1);
    unsub();
  });
});

describe('wrapped pushState', () => {
  it('should fire onNavigate', () => {
    const adapter = createBrowserAdapter();
    const fn = vi.fn();
    adapter.hooks.onNavigate(fn);
    history.pushState(null, '', '/wrapped-test');
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('fetch fallback', () => {
  it('should catch fetch rejection gracefully', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network error'));
    const adapter = createBrowserAdapter();
    Object.defineProperty(navigator, 'sendBeacon', { writable: true, value: undefined });

    const result = adapter.send('http://x.com', { method: 'POST', body: '{}' });
    await expect(result).resolves.toBeUndefined();
    fetchSpy.mockRestore();
  });
});
