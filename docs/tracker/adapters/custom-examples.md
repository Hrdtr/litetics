---
description: Examples of custom RuntimeAdapter implementations for Nuxt, React, Vue, React Native, Node.js, Deno, Bun, and Vitest.
---

# Custom Adapter Examples

The `RuntimeAdapter` interface allows you to customize the tracker to work in any environment. Here are some examples of how to use it in different environments.

## Nuxt Plugin

Browser adapter used as a Nuxt plugin:

```ts
// plugins/tracker.client.ts
import { createTracker, createBrowserAdapter } from 'litetics/tracker';
import type { RuntimeAdapter } from 'litetics/tracker';

export default defineNuxtPlugin(() => {
  let dispose: (() => void) | null = null;

  function init(mode: 'history' | 'hash') {
    dispose?.();
    const adapter: RuntimeAdapter = createBrowserAdapter({ mode });
    const t = createTracker({
      apiEndpoint: {
        track: '/api/event',
        ping: '/api/ping',
      },
      adapter,
      sessionTimeoutDuration: 5 * 60 * 1000,
    });
    dispose = t.register();
    return t;
  }

  const tracker = shallowRef(init('history'));

  return {
    provide: {
      tracker,
      setTrackerMode: (mode: 'history' | 'hash') => {
        tracker.value = init(mode);
      },
    },
  };
});
```

In a Vue component:

```vue
<script setup lang="ts">
const { $tracker } = useNuxtApp();

$tracker.value.track('signup', { type: 'engagement' });
</script>
```

## React / Next.js

Use a hook or provider component to register the tracker on mount:

```tsx
import { useEffect } from 'react';
import { createTracker } from 'litetics/tracker';

const tracker = createTracker({
  apiEndpoint: { track: '/api/event', ping: '/api/ping' },
});

export function usePageviewTracker() {
  useEffect(() => {
    const stop = tracker.register();
    return () => stop();
  }, []);
}
```

Next.js App Router — wrapper component:

```tsx
'use client';

import { useEffect } from 'react';
import { createTracker } from 'litetics/tracker';

const tracker = createTracker({
  apiEndpoint: { track: '/api/event', ping: '/api/ping' },
});

export function TrackerProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const stop = tracker.register();
    return () => stop();
  }, []);

  return <>{children}</>;
}
```

## Vue / Vue Router

Register the tracker as a Vue plugin:

```ts
import { createTracker, createBrowserAdapter } from 'litetics/tracker';
import type { App } from 'vue';

const tracker = createTracker({
  apiEndpoint: { track: '/api/event', ping: '/api/ping' },
  adapter: createBrowserAdapter(),
});

export function createTrackerPlugin() {
  return {
    install(app: App) {
      app.provide('tracker', tracker);
      tracker.register();
    },
  };
}
```

## React Native

Uses `AppState` for lifecycle and `react-native-localize` for time zone:

```ts
import { createTracker } from 'litetics/tracker';
import type { RuntimeAdapter } from 'litetics/tracker';
import { AppState } from 'react-native';
import { getTimeZone } from 'react-native-localize';
import { Platform } from 'react-native';

const rnAdapter: RuntimeAdapter = {
  send: (url, options) => {
    return fetch(url, {
      method: options.method,
      body: options.body,
      keepalive: options.keepalive,
      mode: options.mode,
      headers: options.body ? { 'content-type': 'application/json' } : undefined,
    }).then((r) => (options.method === 'GET' ? r.text() : undefined));
  },
  context: () => ({
    timeZone: getTimeZone(),
    userAgent: `${Platform.OS}/${Platform.Version}`,
    referrer: '',
    location: { host: 'app', hostname: 'app', pathname: '/', href: 'app:///' },
  }),
  hooks: {
    onUnload: (fn) => {
      const sub = AppState.addEventListener('change', (state) => {
        if (state === 'background' || state === 'inactive') fn();
      });
      return () => sub.remove();
    },
    onVisibilityChange: (fn) => {
      const sub = AppState.addEventListener('change', (state) => {
        fn(state === 'background');
      });
      return () => sub.remove();
    },
    onInteract: () => () => {},
    onNavigate: () => () => {},
  },
};

const tracker = createTracker({
  apiEndpoint: { track: 'https://api.example.com/event', ping: 'https://api.example.com/ping' },
  adapter: rnAdapter,
});

tracker.register();
```

## Node.js

A no-op adapter for CLI tools, scripts, and server processes:

```ts
import { createTracker } from 'litetics/tracker';
import type { RuntimeAdapter } from 'litetics/tracker';

const nodeAdapter: RuntimeAdapter = {
  send: async (url, options) => {
    const resp = await fetch(url, {
      method: options.method,
      body: options.body,
      keepalive: options.keepalive,
      mode: options.mode,
      headers: options.body ? { 'content-type': 'application/json' } : undefined,
    });
    return options.method === 'GET' ? resp.text() : undefined;
  },
  context: () => ({
    timeZone: '',
    userAgent: `litetics-cli/${process.env.npm_package_version ?? '0.0.0'}`,
    referrer: '',
    location: {
      host: 'localhost',
      hostname: 'localhost',
      pathname: '/',
      href: 'http://localhost/',
    },
  }),
  hooks: {
    onUnload: () => () => {},
    onVisibilityChange: () => () => {},
    onInteract: () => () => {},
    onNavigate: () => () => {},
  },
};

const tracker = createTracker({
  apiEndpoint: { track: 'https://api.example.com/event', ping: 'https://api.example.com/ping' },
  adapter: nodeAdapter,
});

tracker.register();
await tracker.track('cli_command', { type: 'automated' });
```

## Deno

Same pattern, using Deno-specific context APIs:

```ts
import { createTracker } from 'npm:litetics/tracker';
import type { RuntimeAdapter } from 'npm:litetics/tracker';

const denoAdapter: RuntimeAdapter = {
  send: async (url, options) => {
    const resp = await fetch(url, {
      method: options.method,
      body: options.body,
      keepalive: options.keepalive,
      mode: options.mode,
      headers: options.body ? { 'content-type': 'application/json' } : undefined,
    });
    return options.method === 'GET' ? resp.text() : undefined;
  },
  context: () => ({
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    userAgent: `Deno/${Deno.version.deno}`,
    referrer: '',
    location: { host: Deno.hostname(), hostname: Deno.hostname(), pathname: '/', href: 'deno:///' },
  }),
  hooks: {
    onUnload: () => () => {},
    onVisibilityChange: () => () => {},
    onInteract: () => () => {},
    onNavigate: () => () => {},
  },
};

const tracker = createTracker({
  apiEndpoint: { track: 'http://localhost:3000/event', ping: 'http://localhost:3000/ping' },
  adapter: denoAdapter,
});

tracker.register();
```

## Bun

Same pattern, using Bun-specific context APIs:

```ts
import { createTracker } from 'litetics/tracker';
import type { RuntimeAdapter } from 'litetics/tracker';

const bunAdapter: RuntimeAdapter = {
  send: async (url, options) => {
    const resp = await fetch(url, {
      method: options.method,
      body: options.body,
      keepalive: options.keepalive,
      mode: options.mode,
      headers: options.body ? { 'content-type': 'application/json' } : undefined,
    });
    return options.method === 'GET' ? resp.text() : undefined;
  },
  context: () => ({
    timeZone: '',
    userAgent: `Bun/${Bun.version}`,
    referrer: '',
    location: {
      host: 'localhost',
      hostname: 'localhost',
      pathname: '/',
      href: 'http://localhost/',
    },
  }),
  hooks: {
    onUnload: () => () => {},
    onVisibilityChange: () => () => {},
    onInteract: () => () => {},
    onNavigate: () => () => {},
  },
};

const tracker = createTracker({
  apiEndpoint: { track: 'http://localhost:3000/event', ping: 'http://localhost:3000/ping' },
  adapter: bunAdapter,
});

tracker.register();
await tracker.track('cron_job', { type: 'scheduled' });
```

The `onUnload` hook maps to the app entering background/inactive state — this is the closest analog to a browser page unload. `onVisibilityChange` maps background state to `hidden: true`. Interaction detection is left as a no-op; implement touch handlers if session timeout is needed.

## Vitest

A mock adapter for testing tracker behavior:

```ts
import { createTracker } from 'litetics/tracker';
import type { RuntimeAdapter } from 'litetics/tracker';
import { vi } from 'vitest';

const testAdapter = (mockSend = vi.fn()): RuntimeAdapter => ({
  send: async (url, options) => {
    mockSend(url, options);
    return options.method === 'GET' ? '0' : undefined;
  },
  context: () => ({
    timeZone: 'Europe/London',
    userAgent: 'vitest',
    referrer: 'https://google.com',
    location: {
      host: 'example.com',
      hostname: 'example.com',
      pathname: '/test',
      href: 'https://example.com/test',
    },
  }),
  hooks: {
    onUnload: (fn) => {
      const handler = () => fn();
      process.on('beforeExit', handler);
      return () => process.off('beforeExit', handler);
    },
    onVisibilityChange: () => () => {},
    onInteract: () => () => {},
    onNavigate: () => () => {},
  },
});

const sendSpy = vi.fn();
const tracker = createTracker({
  apiEndpoint: { track: 'http://example.com/event', ping: 'http://example.com/ping' },
  adapter: testAdapter(sendSpy),
});

tracker.register();
await tracker.track('test_event', { type: 'test' });

expect(sendSpy).toHaveBeenCalledTimes(5); // register ping + page ping + pageview load + event ping + event load
```

The mock adapter returns `'0'` from GET requests (simulating a new unique visitor). The `onUnload` hook fires on `beforeExit` so tests can trigger unload beacons by allowing process exit.

## Jest

Same pattern as Vitest — replace `vi.fn()` with `jest.fn()` and `vi.spyOn` with `jest.spyOn`.
