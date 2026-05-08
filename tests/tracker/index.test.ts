import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach, afterAll } from 'vitest';
import { createTracker } from '../../src/tracker';
import { createBrowserAdapter } from '../../src/tracker/adapter';

const server = setupServer(
  http.get('*', () => HttpResponse.text('0')),
  http.post('*', () => HttpResponse.text('')),
);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => {
  server.resetHandlers();
  vi.restoreAllMocks();
});

describe('createTracker', () => {
  it('should throw an error if apiEndpoint.track is invalid', () => {
    expect(() =>
      createTracker({ apiEndpoint: { track: 'invalid-url', ping: 'http://example.com' } }),
    ).toThrowError('`apiEndpoint.track` must be a valid URL');
  });

  it('should throw an error if apiEndpoint.ping is invalid', () => {
    expect(() =>
      createTracker({ apiEndpoint: { track: 'http://example.com', ping: 'invalid-url' } }),
    ).toThrowError('`apiEndpoint.ping` must be a valid URL');
  });

  it('should create a tracker with default options', () => {
    const tracker = createTracker({
      apiEndpoint: { track: 'http://example.com', ping: 'http://example.com' },
    });
    expect(tracker).toBeDefined();
    expect(tracker.register).toBeDefined();
    expect(tracker.track).toBeDefined();
    expect(tracker.trackEndOf).toBeDefined();
  });
});

describe('register', () => {
  const destroyFns: (() => void)[] = [];

  const settle = () => new Promise<void>((r) => setTimeout(r, 0));

  afterEach(() => {
    for (const fn of destroyFns) {
      fn();
    }
    destroyFns.length = 0;
  });

  it('should fallback to fetch when sendBeacon is unavailable', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    Object.defineProperty(navigator, 'sendBeacon', { writable: true, value: undefined });
    const destroy = createTracker({
      apiEndpoint: { track: 'http://example.com', ping: 'http://example.com' },
    }).register();
    destroyFns.push(destroy);
    await settle();

    window.dispatchEvent(new Event('pagehide'));
    await settle();
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('should send events correctly', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    const sendBeaconMock = vi.fn();
    Object.defineProperty(navigator, 'sendBeacon', { writable: true, value: sendBeaconMock });
    const destroy1 = createTracker({
      apiEndpoint: { track: 'http://example.com', ping: 'http://example.com' },
    }).register();
    destroyFns.push(destroy1);
    await settle();
    expect(fetchSpy).toHaveBeenCalledTimes(1); // register load

    window.dispatchEvent(new Event('pagehide'));
    expect(sendBeaconMock).toHaveBeenCalledTimes(1);

    const destroy2 = createTracker({
      apiEndpoint: { track: 'http://example.com', ping: 'http://example.com' },
    }).register();
    destroyFns.push(destroy2);
    await settle();
    expect(fetchSpy).toHaveBeenCalledTimes(2); // +1 register load
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    window.dispatchEvent(new Event('visibilitychange'));
    expect(sendBeaconMock).toHaveBeenCalledTimes(2); // unload event should be sent

    const destroy3 = createTracker({
      apiEndpoint: { track: 'http://example.com', ping: 'http://example.com' },
    }).register();
    destroyFns.push(destroy3);
    await settle();
    expect(fetchSpy).toHaveBeenCalledTimes(3); // +1 register load
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    window.dispatchEvent(new Event('visibilitychange'));
    expect(sendBeaconMock).toHaveBeenCalledTimes(3); // still on timeout

    window.dispatchEvent(new Event('popstate'));
    await settle();
    expect(fetchSpy).toHaveBeenCalledTimes(6); // +2 other registered trackers (still listen to popstate)
  });

  it('should not trigger unload on visibility change to visible', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    const sendBeaconMock = vi.fn();
    Object.defineProperty(navigator, 'sendBeacon', { writable: true, value: sendBeaconMock });
    const destroy = createTracker({
      apiEndpoint: { track: 'http://example.com', ping: 'http://example.com' },
    }).register();
    destroyFns.push(destroy);
    await settle();
    fetchSpy.mockClear();
    sendBeaconMock.mockClear();

    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    window.dispatchEvent(new Event('visibilitychange'));
    await settle();
    expect(sendBeaconMock).toHaveBeenCalledTimes(0);
  });

  it('should send load event on hashchange in hash mode', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    const adapter = createBrowserAdapter({ mode: 'hash' });
    const destroy = createTracker({
      apiEndpoint: { track: 'http://example.com', ping: 'http://example.com' },
      adapter,
    }).register();
    await settle();
    fetchSpy.mockClear();

    window.dispatchEvent(new Event('hashchange'));
    await settle();
    // hashchange triggers navigation: unload via sendBeacon, load via fetch
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    destroy();
  });

  it('should mark subsequent pageview as returning after SPA navigation', async () => {
    const bodies: Record<string, unknown>[] = [];
    server.use(
      http.post('http://example.com', async ({ request }) => {
        const body = (await request.json()) as Record<string, unknown>;
        bodies.push(body);
        return HttpResponse.text('');
      }),
    );

    const destroy = createTracker({
      apiEndpoint: { track: 'http://example.com', ping: 'http://example.com' },
    }).register();
    destroyFns.push(destroy);
    await settle();

    // First load event should have p=true (isUnique)
    expect(bodies.filter((b) => b.e === 'load')[0].p).toBe(true);

    // Simulate SPA navigation via popstate — cleanup() sets isUnique=false
    window.dispatchEvent(new Event('popstate'));
    await settle();

    const loadEvents = bodies.filter((b) => b.e === 'load');
    // The last load event after popstate should have p=false
    expect(loadEvents[loadEvents.length - 1].p).toBe(false);
  });
});

describe('track', () => {
  it('should call fetch with correct parameters', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    await createTracker({
      apiEndpoint: { track: 'http://example.com', ping: 'http://example.com' },
    }).track('test-event', { type: 'test' });
    expect(fetchSpy).toHaveBeenCalledTimes(1); // track event
  });
});

describe('trackEndOf', () => {
  it('should call fetch with correct parameters', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    const tracker = createTracker({
      apiEndpoint: { track: 'http://example.com', ping: 'http://example.com' },
    });
    await tracker.track('test-event', { type: 'test' }, { withDuration: true });
    await tracker.trackEndOf('test-event');
    expect(fetchSpy).toHaveBeenCalledTimes(2); // track event & track end of event
  });

  it('should not call fetch for non-existent key', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    const tracker = createTracker({
      apiEndpoint: { track: 'http://example.com', ping: 'http://example.com' },
    });
    await tracker.trackEndOf('non-existent-key');
    expect(fetchSpy).toHaveBeenCalledTimes(0);
  });

  it('should be idempotent for same key', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    const tracker = createTracker({
      apiEndpoint: { track: 'http://example.com', ping: 'http://example.com' },
    });
    await tracker.track('test-key', { type: 'test' }, { withDuration: true });
    await tracker.trackEndOf('test-key');
    await tracker.trackEndOf('test-key');
    // fetch calls: 1 track POST, 1 trackEndOf POST, second trackEndOf is no-op
    // (ping uses XHR, not fetch, so it's not counted)
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });
});

describe('sessionTimeoutDuration', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should end session and start a new one when timeout fires', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    const destroy = createTracker({
      apiEndpoint: { track: 'http://example.com', ping: 'http://example.com' },
      sessionTimeoutDuration: 50,
    }).register();
    await vi.advanceTimersByTimeAsync(100);
    expect(fetchSpy).toHaveBeenCalledTimes(2); // initial load + session timeout load
    destroy();
  });

  it('should reset the timeout on user interaction', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch');
    const destroy = createTracker({
      apiEndpoint: { track: 'http://example.com', ping: 'http://example.com' },
      sessionTimeoutDuration: 200,
    }).register();
    await vi.advanceTimersByTimeAsync(50);
    window.dispatchEvent(new Event('mousedown')); // reset timer
    await vi.advanceTimersByTimeAsync(100);
    expect(fetchSpy).toHaveBeenCalledTimes(1); // only initial load, timer was reset
    destroy();
  });
});
