# Quick Start

Get Litetics running in your project with a server handler and a browser tracker.

## Install

Choose your package manager:

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

## Server

Two routes, one handler. `POST /event` for beacons, `GET /ping` for visitor uniqueness.

```ts
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

app.post('/event', (c) => handleEventRequest(c.req.raw).then(() => c.body(null, 204)));
app.get('/ping', (c) => handlePingRequest(c.req.raw).then(createPingResponse));
```

`persist` receives fully enriched data for every load event. `update` receives the duration when an unload beacon arrives. You decide where the data goes — database, log, in-memory array.

The handler works with any framework. Pass a `Request` object, getter functions, or a pre-resolved payload:

```ts
handleEventRequest(request); // Hono, Workers, Bun, Deno
handleEventRequest({ getRequestBody, getRequestHeader }); // Nuxt Nitro, Fastify
handleEventRequest({ requestBody, requestHeaders }); // Express, any framework
```

## Browser

Import the tracker, configure your endpoints, and call `register()`.

```ts
import { createTracker } from 'litetics/tracker';

const tracker = createTracker({
  apiEndpoint: {
    track: 'http://localhost:3000/event',
    ping: 'http://localhost:3000/ping',
  },
});

tracker.register(); // starts pageview tracking, returns a stop function
```

The tracker handles pageview lifecycle automatically — ping, load beacon, unload beacon on navigation or tab close.

Custom events:

```ts
await tracker.track('signup', { type: 'engagement', label: 'hero-cta' });
```

Timed events:

```ts
await tracker.track('video_play', { type: 'media' }, { withDuration: true });
await tracker.trackEndOf('video_play');
```

Session timeout:

```ts
const tracker = createTracker({
  apiEndpoint: { track: '...', ping: '...' },
  sessionTimeoutDuration: 5 * 60 * 1000, // 5 min, resets on user interaction
});
```

## Enrichment

Every event is enriched server-side with no configuration:

| Category   | Source                   | Fields                                                         |
| ---------- | ------------------------ | -------------------------------------------------------------- |
| Page       | Body `u`                 | `host`, `path`, `queryString`, `hash`                          |
| User-Agent | Header                   | `browserName`, `osName`, `deviceType`, `deviceModel`, etc.     |
| Referrer   | Body `r`                 | `referrerHost`, `referrerMedium`, `referrerName`, search terms |
| Language   | Header `Accept-Language` | `languageCode`, `languageRegion`, secondary language           |
| UTM        | URL params               | `utmCampaign`, `utmSource`, `utmMedium`, etc.                  |
| Location   | Body `t`                 | `timezone` → `country` (ISO 3166-1 alpha-2)                    |
| Custom     | Body `d`                 | `properties`                                                   |

## Next

- [Event lifecycle](/concepts/event-lifecycle)
- [Ping & visitor uniqueness](/concepts/ping-and-uniqueness)
- [Handler API reference](/server/handler)
