// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { createBrowserAdapter } from '../../src/tracker/adapter';

describe('createBrowserAdapter', () => {
  it('should return an adapter with all required properties', () => {
    const adapter = createBrowserAdapter();
    expect(adapter).toHaveProperty('transport');
    expect(adapter).toHaveProperty('environment');
    expect(adapter).toHaveProperty('hooks');
    expect(adapter).toHaveProperty('navigate');
    expect(adapter.transport.fetch).toBeTypeOf('function');
  });

  it('should provide environment getters', () => {
    const adapter = createBrowserAdapter();
    expect(adapter.environment.timezone).toBeTypeOf('string');
    expect(adapter.environment.userAgent).toBeTypeOf('string');
    expect(adapter.environment.referrer).toBeTypeOf('string');
    const loc = adapter.environment.location;
    expect(loc).toHaveProperty('host');
    expect(loc).toHaveProperty('hostname');
    expect(loc).toHaveProperty('pathname');
    expect(loc).toHaveProperty('href');
  });

  it('should have optional transport methods', () => {
    const adapter = createBrowserAdapter();
    // sendBeacon is optional — may be undefined in non-browser or test environments
    expect(
      adapter.transport.sendBeacon === undefined ||
        typeof adapter.transport.sendBeacon === 'function',
    ).toBe(true);
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

  it('navigate should set location.hash in hash mode', () => {
    const adapter = createBrowserAdapter({ mode: 'hash' });
    adapter.navigate('/test');
    expect(location.hash).toBe('#/test');
  });
});

describe('navigate', () => {
  it('should push state in history mode', () => {
    const adapter = createBrowserAdapter();
    const original = history.length;
    adapter.navigate('/test-nav');
    expect(history.length).toBe(original + 1);
  });

  it('wrapped pushState should fire onNavigate', () => {
    const adapter = createBrowserAdapter();
    const fn = vi.fn();
    adapter.hooks.onNavigate(fn);
    history.pushState(null, '', '/wrapped-test');
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
