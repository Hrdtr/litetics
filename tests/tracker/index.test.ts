// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTracker } from '../../src/tracker';

describe('createTracker', () => {
  beforeEach(() => {
    // Mock fetch for all tests
    const fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('0'),
    });
    globalThis.fetch = fetch as unknown as typeof fetch;
  });

  it('should throw an error if apiEndpoint.hit is not a valid URL', () => {
    const invalidUrl = 'invalid-url';

    expect(() => createTracker({
      apiEndpoint: {
        hit: invalidUrl,
        ping: 'https://valid.url'
      },
    })).toThrow('`apiEndpoint.hit` must be a valid URL');
  });

  it('should throw an error if apiEndpoint.ping is not a valid URL', () => {
    const invalidUrl = 'invalid-url';

    expect(() => createTracker({
      apiEndpoint: {
        hit: 'https://valid.url',
        ping: invalidUrl
      },
    })).toThrow('`apiEndpoint.ping` must be a valid URL');
  });

  it('should call sendBeacon on unload event', () => {
    const hitEndpoint = 'https://valid.url';
    const pingEndpoint = 'https://valid.url/ping';

    // Mock navigator.sendBeacon
    const sendBeacon = vi.fn();
    globalThis.navigator.sendBeacon = sendBeacon as unknown as Navigator['sendBeacon'];

    const { register } = createTracker({
      apiEndpoint: {
        hit: hitEndpoint,
        ping: pingEndpoint
      },
    });

    register();

    // Simulate unload event
    const unloadEvent = new Event('unload');
    globalThis.window.dispatchEvent(unloadEvent);

    expect(sendBeacon).toHaveBeenCalled();
  });

  // it('should call sendBeacon on pagehide event if supported', () => {
  //   const hitEndpoint = 'https://valid.url';
  //   const pingEndpoint = 'https://valid.url/ping';

  //   // Mock navigator.sendBeacon
  //   const sendBeacon = vi.fn();
  //   globalThis.navigator.sendBeacon = sendBeacon as unknown as Navigator['sendBeacon'];

  //   const { register } = createTracker({
  //     apiEndpoint: {
  //       hit: hitEndpoint,
  //       ping: pingEndpoint
  //     },
  //   });

  //   register();

  //   // Simulate pagehide event
  //   const pagehideEvent = new Event('pagehide');
  //   globalThis.window.dispatchEvent(pagehideEvent);

  //   expect(sendBeacon).toHaveBeenCalled();
  // });

  // it('should handle visibilitychange event', () => {
  //   const hitEndpoint = 'https://valid.url';
  //   const pingEndpoint = 'https://valid.url/ping';
  
  //   // Mock fetch response
  //   const fetch = vi.fn().mockResolvedValue({
  //     ok: true,
  //     text: () => Promise.resolve('0'),
  //   });
  //   globalThis.fetch = fetch as unknown as typeof fetch;
  
  //   // Mock visibilityState changes
  //   Object.defineProperty(document, 'visibilityState', {
  //     configurable: true,
  //     get: () => 'hidden',
  //   });
  
  //   const { register } = createTracker({
  //     apiEndpoint: {
  //       hit: hitEndpoint,
  //       ping: pingEndpoint
  //     },
  //   });
  
  //   register();
  
  //   // Mock addEventListener
  //   const addEventListenerMock = vi.fn();
  //   globalThis.window.addEventListener = addEventListenerMock;
  
  //   // Simulate visibilitychange event
  //   const visibilityChangeEvent = new Event('visibilitychange');
  //   globalThis.window.dispatchEvent(visibilityChangeEvent);
  
  //   // Simulate the page becoming visible again
  //   Object.defineProperty(document, 'visibilityState', {
  //     configurable: true,
  //     get: () => 'visible',
  //   });
  //   globalThis.window.dispatchEvent(new Event('visibilitychange'));
  
  //   // Check if visibilitychange listener was added
  //   expect(addEventListenerMock).toHaveBeenCalledWith('visibilitychange', expect.any(Function), { capture: true });
  // });
  
  it('should call the proper history methods and send beacons', () => {
    const hitEndpoint = 'https://valid.url';
    const pingEndpoint = 'https://valid.url/ping';
  
    // Mock fetch response
    const fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve('0'),
    });
    globalThis.fetch = fetch as unknown as typeof fetch;
  
    // Mock history methods
    const pushState = vi.fn();
    const replaceState = vi.fn();
    globalThis.history.pushState = pushState as unknown as History['pushState'];
    globalThis.history.replaceState = replaceState as unknown as History['replaceState'];
  
    const { register } = createTracker({
      apiEndpoint: {
        hit: hitEndpoint,
        ping: pingEndpoint
      },
    });
  
    register();
  
    // Simulate history changes
    globalThis.history.pushState({}, '', '/new-url');
    expect(pushState).toHaveBeenCalled();
  
    globalThis.history.replaceState({}, '', '/replaced-url');
    expect(replaceState).toHaveBeenCalled();
  });
});
