# Litetics

<!-- automd:badges color=yellow -->

[![npm version](https://img.shields.io/npm/v/litetics?color=yellow)](https://npmjs.com/package/litetics)
[![npm downloads](https://img.shields.io/npm/dm/litetics?color=yellow)](https://npm.chart.dev/litetics)

<!-- /automd -->

Embeddable JavaScript analytics event tracking library. Server handlers for any JS runtime. Browser tracker with SPA support, session management, and automatic event enrichment.

## Packages

| Entry              | Purpose                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| `litetics`         | Server-side event and ping handler. Parses user-agent, referrer, Accept-Language, UTM params. Bot filtering. |
| `litetics/tracker` | Browser tracker. Pageview lifecycle, SPA navigation, custom events, session timeouts, unload beacons.        |

## Install

<!-- automd:pm-install -->

```sh
# ✨ Auto-detect
npx nypm install litetics

# npm
npm install litetics

# yarn
yarn add litetics

# pnpm
pnpm add litetics

# bun
bun install litetics

# deno
deno install npm:litetics
```

<!-- /automd -->

## Quick Start

### Server (Hono)

```ts
import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { createLitetics, createPingResponse } from 'litetics';

const events = [];

const { handleEventRequest, handlePingRequest } = createLitetics({
  persist: (data) => {
    events.push(data);
  },
  update: ({ bid, durationMs }) => {
    const event = events.find((e) => e.bid === bid);
    if (event) event.durationMs = durationMs;
  },
});

const app = new Hono();

app.get('/ping', (c) => handlePingRequest(c.req.raw).then(createPingResponse));
app.post('/event', async (c) => {
  await handleEventRequest(c.req.raw);
  return c.body(null, 204);
});

serve({ fetch: app.fetch, port: 3000 });
```

### Client (Browser)

```ts
import { createTracker } from 'litetics/tracker';

const tracker = createTracker({
  apiEndpoint: {
    track: 'http://localhost:3000/event',
    ping: 'http://localhost:3000/ping',
  },
});

// Start tracking the current page
const stop = tracker.register();

// Track a custom event
await tracker.track('signup_button', {
  type: 'engagement',
  label: 'hero-cta',
});

// Track with duration
await tracker.track('video_play', { type: 'media' }, { withDuration: true });
// ... later
await tracker.trackEndOf('video_play');
```

## API

### `litetics` — Server Exports

| Export                                           | Description                                                                                        |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| `createLitetics(options)`                        | Creates a handler for pings, load, and unload events. Calls `persist` on load, `update` on unload. |
| `createPingResponse(result)`                     | Converts a `PingRequestHandlerResult` into a `Response`.                                           |
| `EventData` (type)                               | The full enriched event data object (50+ fields).                                                  |
| `EventRequestHandlerOptions<TProperties>` (type) | Options for `createLitetics`.                                                                      |
| `EventRequestHandlerParsers` (type)              | Overridable parser functions.                                                                      |
| `EventRequestHandlerLoadRequestBody` (type)      | Shape of the load event POST body.                                                                 |
| `EventRequestHandlerUnloadRequestBody` (type)    | Shape of the unload event POST body.                                                               |
| `PingRequestHandlerResult` (type)                | Result of a ping request.                                                                          |
| `EventRequestHandlerTrackOptions` (type)         | Getter-based track input.                                                                          |
| `EventRequestHandlerTrackPayload` (type)         | Pre-resolved track input.                                                                          |

### `litetics/tracker` — Client Exports

| Export                           | Description                                                              |
| -------------------------------- | ------------------------------------------------------------------------ |
| `createTracker(options)`         | Creates a tracker instance with `register()`, `track()`, `trackEndOf()`. |
| `createBrowserAdapter(options?)` | Creates a `RuntimeAdapter` backed by browser APIs.                       |
| `RuntimeAdapter` (type)          | Interface for custom runtime adapters.                                   |
| `BrowserAdapterOptions` (type)   | Options for `createBrowserAdapter` (`mode: 'history' \| 'hash'`).        |
| `CreateTrackerOptions` (type)    | Options for `createTracker`.                                             |
| `AnalyticsEvent` (const)         | Event name constants: `{ LOAD: 'load', UNLOAD: 'unload' }`.              |

### Tracker Instance

```ts
{
  register: () => () => void;                                   // Start tracking, returns cleanup fn
  track: (key: string, data: { type: string; [k: string]: Primitive }, options?: { withDuration?: boolean }) => Promise<void>;
  trackEndOf: (key: string) => Promise<void>;                  // End a timed event
}
```

## What Gets Parsed

Every load event is automatically enriched with:

| Category       | Source                   | Fields produced                                                                                                                                                     |
| -------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Page**       | Body `u`                 | `host`, `path`, `queryString`, `hash`                                                                                                                               |
| **User-Agent** | Header `User-Agent`      | `browserName`, `browserVersion`, `browserEngineName`, `browserEngineVersion`, `deviceType`, `deviceVendor`, `deviceModel`, `cpuArchitecture`, `osName`, `osVersion` |
| **Referrer**   | Body `r`                 | `referrerHost`, `referrerPath`, `referrerQueryString`, `referrerKnown`, `referrerMedium`, `referrerName`, `referrerSearchParameter`, `referrerSearchTerm`           |
| **Language**   | Header `Accept-Language` | `languageCode`, `languageScript`, `languageRegion`, `secondaryLanguageCode`, `secondaryLanguageScript`, `secondaryLanguageRegion`                                   |
| **UTM**        | URL query params         | `utmCampaign`, `utmMedium`, `utmSource`, `utmTerm`, `utmContent`, `utmId`, `utmSourcePlatform`                                                                      |
| **Location**   | Body `t`                 | `timeZone` → `country` (two-letter code)                                                                                                                            |
| **Custom**     | Body `d`                 | `properties` (arbitrary key-value data)                                                                                                                             |

## Documentation

Full docs at [litetics.hrdtr.dev](https://litetics.hrdtr.dev) — architecture, complete API reference, integration guides, and playground.

## Development

```sh
pnpm install
pnpm dev       # interactive tests (vitest dev)
pnpm play      # playground server at localhost:3000
pnpm test      # lint + typecheck + tests (123 tests, 100% coverage)
pnpm lint      # oxlint
pnpm typecheck # tsc --noEmit
pnpm build     # unbuild
```

## License

<!-- automd:contributors license=MIT -->

Published under the [MIT](https://github.com/Hrdtr/litetics/blob/main/LICENSE) license.
Made by [community](https://github.com/Hrdtr/litetics/graphs/contributors) 💛
<br><br>
<a href="https://github.com/Hrdtr/litetics/graphs/contributors">
<img src="https://contrib.rocks/image?repo=Hrdtr/litetics" />
</a>

<!-- /automd -->

<!-- automd:with-automd -->

---

_🤖 auto updated with [automd](https://automd.unjs.io)_

<!-- /automd -->
