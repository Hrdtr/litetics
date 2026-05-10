import type { CreateTrackerOptions } from '../../../src/tracker';
import type { RuntimeAdapter } from '../../../src/tracker/adapter';
import { createTracker } from '../../../src/tracker';
import { createBrowserAdapter } from '../../../src/tracker/adapter';

export default defineNuxtPlugin(() => {
  const baseOpts: Omit<CreateTrackerOptions, 'adapter'> = {
    apiEndpoint: {
      track: 'http://localhost:3000/api/event',
      ping: 'http://localhost:3000/api/ping',
    },
    fetchMode: undefined,
    sessionTimeoutDuration: 5 * 60 * 1000,
  };

  let dispose: (() => void) | null = null;

  function init(mode: 'history' | 'hash') {
    dispose?.();
    const adapter: RuntimeAdapter = createBrowserAdapter({ mode });
    const t = createTracker({ ...baseOpts, adapter });
    dispose = t.register();
    return t;
  }

  const tracker = shallowRef(init('history'));

  function setTrackerMode(mode: 'history' | 'hash') {
    tracker.value = init(mode);
  }

  return {
    provide: {
      tracker,
      setTrackerMode,
    },
  };
});
