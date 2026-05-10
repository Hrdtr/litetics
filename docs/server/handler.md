---
description: Full API reference for the Litetics handler — handleEventRequest, handlePingRequest, options, and enrichment.
---

# Handler

The `Litetics` processes event beacons and ping requests. A single instance handles both concerns.

## Creating a Handler

Create a handler by providing `persist` and `update` callbacks:

```ts
import { createLitetics, createPingResponse } from 'litetics';

const { handleEventRequest, handlePingRequest } = createLitetics({
  persist: (data) => {
    // Called for every load event with fully enriched data
  },
  update: ({ bid, durationMs }) => {
    // Called for every unload event
  },
});
```

## Options

All available configuration fields:

```ts
interface LiteticsOptions<TProperties> {
  /** Called for load events with enriched data. */
  persist: (
    data: EventRequestHandlerLoadResult & { properties: TProperties | null },
  ) => MaybePromise<void>;

  /** Called for unload events with duration. */
  update: (data: EventRequestHandlerUnloadResult) => MaybePromise<void>;

  /** Enable console logging. Default: false. */
  debug?: boolean;

  /** Override individual parser functions. */
  parsers?: EventRequestHandlerParsers;

  /** Custom bot detection. Defaults to isbot. */
  shouldIgnoreUserAgent?: (ua: string) => boolean;
}
```

The `TProperties` generic types the `properties` field in persisted events. Defaults to `Record<string, Primitive>`.

## `handleEventRequest()` — `POST`

Processes an incoming event beacon. Accepts three input shapes:

```ts
// 1. Web API Request object
handleEventRequest(request: Request): Promise<void>

// 2. Getter-based options
handleEventRequest(options: EventRequestHandlerTrackOptions): Promise<void>

// 3. Pre-resolved payload
handleEventRequest(payload: EventRequestHandlerTrackPayload): Promise<void>
```

### Request Body Schema

The handler discriminates on the `e` field.

**Load** — a pageview or custom event:

```ts
{
  e: 'load'
  b: string           // beacon ID
  u: string           // page URL (must be valid with protocol)
  p: boolean          // is unique user
  q: boolean          // is unique page
  a: 'pageview' | string  // event type
  r?: string          // referrer URL
  t?: string          // IANA time zone
  d?: Record<string, Primitive>  // custom event data
}
```

**Unload** — duration for a previously tracked beacon:

```ts
{
  e: 'unload';
  b: string; // beacon ID (links to a previous load)
  m: number; // duration in milliseconds
}
```

### Processing Flow

The handler proceeds through these steps for each incoming event:

```text
handleEventRequest() called
  │
  ├─ Extract headers (User-Agent, Accept-Language) and body
  ├─ Bot check         → skip if bot
  ├─ Validate page URL → skip if invalid
  ├─ Strip invalid referrer URL
  │
  ├─ e === 'load'   → parse, enrich, persist(data)
  ├─ e === 'unload' → update({ bid, durationMs })
  └─ else           → log (if debug), skip
```

### Enrichment

Load events are enriched server-side with:

| Category   | Source                   | Fields                                                           |
| ---------- | ------------------------ | ---------------------------------------------------------------- |
| Page URL   | Body `u`                 | `host`, `path`, `queryString`, `hash`                            |
| User-Agent | Header `User-Agent`      | `browserName`, `osName`, `deviceType`, etc. (via `my-ua-parser`) |
| Referrer   | Body `r`                 | `referrerMedium`, `referrerName`, search terms (via referrer DB) |
| Language   | Header `Accept-Language` | `languageCode`, `languageRegion`, secondary language             |
| UTM        | Page URL query           | `utmSource`, `utmMedium`, `utmCampaign`, etc.                    |
| Location   | Body `t`                 | `timeZone` → `country` (ISO 3166-1 alpha-2)                      |

### Custom Parsers

Override individual parsers:

```ts
const { handleEventRequest } = createLitetics({
  persist: (data) => {
    /* ... */
  },
  update: (data) => {
    /* ... */
  },
  parsers: {
    userAgent: (ua) => myCustomParse(ua),
    referrer: (refUrl, pageUrl) => myCustomParse(refUrl, pageUrl),
    acceptLanguage: (header) => myCustomParse(header),
    utm: (url) => myCustomParse(url),
  },
});
```

### Bot Filtering

Bots are silently dropped via [isbot](https://www.npmjs.com/package/isbot). Override with `shouldIgnoreUserAgent`:

```ts
shouldIgnoreUserAgent: (ua) => ua.includes('my-bot');
```

## `handlePingRequest()` — `GET`

Determines whether a visitor is new or returning within the same calendar day. Uses `If-Modified-Since` headers.

```ts
// 1. Web API Request object
handlePingRequest(request: Request): Promise<PingRequestHandlerResult>

// 2. Getter-based options
handlePingRequest(options: PingRequestHandlerOptions): Promise<PingRequestHandlerResult>

// 3. Pre-resolved payload
handlePingRequest(payload: PingRequestHandlerPayload): Promise<PingRequestHandlerResult>
```

### Ping Result

The `PingRequestHandlerResult` type returned by `handlePingRequest`:

```ts
interface PingRequestHandlerResult {
  status: number;
  headers: Record<string, string>;
  body: '0' | '1' | null;
  error?: string;
}
```

| Condition              | Status | Body  | Meaning                |
| ---------------------- | ------ | ----- | ---------------------- |
| No `If-Modified-Since` | 200    | `"0"` | New visitor            |
| Before today           | 200    | `"0"` | New day — count as new |
| Today                  | 200    | `"1"` | Returning today        |
| Invalid date           | 400    | error | Malformed header       |
| Future date            | 400    | error | Clock skew             |

### How It Works

The browser uses `If-Modified-Since` to signal the last date it was told:

```text
First visit:
  Client → GET /ping (no If-Modified-Since)
  Server → 200, "0", Last-Modified: <midnight UTC>, Cache-Control: no-cache

Same day:
  Client → GET /ping (If-Modified-Since: <today>)
  Server → 200, "1", max-age=<until midnight>

Next day:
  Client → GET /ping (If-Modified-Since: <yesterday>)
  Server → 200, "0", Last-Modified: <midnight UTC>, Cache-Control: no-cache
```

Cache behavior: `"0"` responses use `no-cache` to force revalidation. `"1"` responses use `max-age=<until midnight>` to reduce requests for already-counted visitors.

## `createPingResponse(result)`

Converts a `PingRequestHandlerResult` into a standard `Response`:

```ts
import { createPingResponse } from 'litetics';

const result = await handlePingRequest(request);
return createPingResponse(result);
```

## Result Types

The types passed to `persist` and `update`:

```ts
type EventRequestHandlerLoadResult = EventData; // Full enriched event

type EventRequestHandlerUnloadResult = {
  bid: string;
  durationMs: number;
};
```

## Error Handling

Handlers do not throw on malformed input:

- Invalid JSON body → logged (if `debug`), event dropped
- Missing or invalid page URL → event dropped
- Unknown event type → logged (if `debug`), event dropped
- Bot user-agent → event dropped
- Invalid/malformed `If-Modified-Since` → 400 response

## Persistence

No built-in storage. You provide `persist` and `update`:

```ts
const events: EventData[] = [];

const { handleEventRequest } = createLitetics({
  persist: (data) => {
    events.push(data);
  },
  update: ({ bid, durationMs }) => {
    const e = events.find((ev) => ev.bid === bid);
    if (e) e.durationMs = durationMs;
  },
});
```
