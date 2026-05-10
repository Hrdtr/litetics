# TypeScript Types

All types exported from `litetics` and `litetics/tracker`.

## `litetics` Types

Import everything from the root package:

```ts
import type {
  EventData,
  MaybePromise,
  Primitive,
  EventRequestHandlerLoadRequestBody,
  EventRequestHandlerUnloadRequestBody,
  EventRequestHandlerLoadResult,
  EventRequestHandlerUnloadResult,
  EventRequestHandlerParsers,
  EventRequestHandlerOptions,
  EventRequestHandlerTrackOptions,
  EventRequestHandlerTrackPayload,
  PingRequestHandlerResult,
  PingRequestHandlerOptions,
  PingRequestHandlerPayload,
} from 'litetics';
```

### `EventData`

The full enriched event object. See [Event Data](/references/event-data) for details.

```ts
interface EventData {
  bid: string;
  receivedAt: Date;
  host: string;
  path: string;
  queryString: string | null;
  hash: string | null;
  isUniqueUser: boolean;
  isUniquePage: boolean;
  type: 'pageview' | (string & { _?: never });
  durationMs: number | null;
  timeZone: string | null;
  country: string | null;
  userAgent: string | null;
  browserName: string | null;
  browserVersion: string | null;
  browserEngineName: string | null;
  browserEngineVersion: string | null;
  deviceType: string | null;
  deviceVendor: string | null;
  deviceModel: string | null;
  cpuArchitecture: string | null;
  osName: string | null;
  osVersion: string | null;
  referrer: string | null;
  referrerHost: string | null;
  referrerPath: string | null;
  referrerQueryString: string | null;
  referrerKnown: boolean | null;
  referrerMedium: string | null;
  referrerName: string | null;
  referrerSearchParameter: string | null;
  referrerSearchTerm: string | null;
  acceptLanguage: string | null;
  languageCode: string | null;
  languageScript: string | null;
  languageRegion: string | null;
  secondaryLanguageCode: string | null;
  secondaryLanguageScript: string | null;
  secondaryLanguageRegion: string | null;
  utmCampaign: string | null;
  utmMedium: string | null;
  utmSource: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  utmId: string | null;
  utmSourcePlatform: string | null;
  properties: Record<string, Primitive> | null;
}
```

### Helper Types

Shared utility types used throughout the handler interfaces:

```ts
type Primitive = string | number | boolean | null | undefined;
type MaybePromise<T> = T | Promise<T>;
```

### Request Body Types

The shapes sent by the tracker in POST /event requests:

```ts
interface EventRequestHandlerLoadRequestBody {
  e: 'load';
  b: string;
  u: string;
  p: boolean;
  q: boolean;
  a: 'pageview' | (string & { _?: never });
  r?: string;
  t?: string;
  d?: Record<string, Primitive>;
}

interface EventRequestHandlerUnloadRequestBody {
  e: 'unload';
  b: string;
  m: number;
}
```

### Result Types

What gets passed to your `persist` and `update` callbacks:

```ts
type EventRequestHandlerLoadResult = EventData;

type EventRequestHandlerUnloadResult = {
  bid: string;
  durationMs: number;
};
```

### Handler Options

Options passed to `createLitetics`:

```ts
interface EventRequestHandlerParsers {
  userAgent?: (ua: string) => ParsedUserAgent;
  referrer?: (referrerUrl: string, currentUrl: string) => ParsedReferrer;
  acceptLanguage?: (header: string) => ParsedAcceptLanguage;
  utm?: (url: URL) => ParsedUTMParams;
}

interface EventRequestHandlerOptions<
  TProperties extends Record<string, Primitive> = Record<string, Primitive>,
> {
  persist: (
    data: EventRequestHandlerLoadResult & { properties: TProperties | null },
  ) => MaybePromise<void>;
  update: (data: EventRequestHandlerUnloadResult) => MaybePromise<void>;
  debug?: boolean;
  parsers?: EventRequestHandlerParsers;
  shouldIgnoreUserAgent?: (ua: string) => boolean;
}

interface EventRequestHandlerTrackOptions {
  getRequestBody: () => MaybePromise<
    EventRequestHandlerLoadRequestBody | EventRequestHandlerUnloadRequestBody
  >;
  getRequestHeader: (name: string) => MaybePromise<string | null | undefined>;
}

interface EventRequestHandlerTrackPayload {
  requestBody: EventRequestHandlerLoadRequestBody | EventRequestHandlerUnloadRequestBody;
  requestHeaders: Record<string, string | null | undefined>;
}
```

### Ping Types

Types related to the ping handler and its results:

```ts
interface PingRequestHandlerResult {
  status: number;
  headers: Record<string, string>;
  body: '0' | '1' | null;
  error?: string;
}

interface PingRequestHandlerOptions {
  getRequestHeader: (name: string) => MaybePromise<string | null | undefined>;
}

interface PingRequestHandlerPayload {
  requestHeaders: Record<string, string | null | undefined>;
}
```

## `litetics/tracker` Types

Import from the tracker subpath:

```ts
import type {
  RuntimeAdapter,
  BrowserAdapterOptions,
  SendOptions,
  EnvironmentContext,
  CreateTrackerOptions,
} from 'litetics/tracker';
```

### Adapter Types

The interface used to run the tracker in any JavaScript environment:

```ts
interface RuntimeAdapter {
  send: (url: string, options: SendOptions) => Promise<string | void>;
  context: () => EnvironmentContext;
  hooks: {
    onUnload: (fn: () => void) => () => void;
    onVisibilityChange: (fn: (hidden: boolean) => void) => () => void;
    onInteract: (fn: () => void) => () => void;
    onNavigate: (fn: (url: string) => void) => () => void;
  };
}

interface SendOptions {
  method: 'GET' | 'POST';
  body?: string;
  mode?: 'no-cors' | 'cors' | 'same-origin';
  keepalive?: boolean;
}

interface EnvironmentContext {
  timeZone: string;
  userAgent: string;
  referrer: string;
  location: {
    host: string;
    hostname: string;
    pathname: string;
    href: string;
  };
}

interface BrowserAdapterOptions {
  mode?: 'history' | 'hash';
}
```

### Tracker Types

Options passed when creating a tracker instance:

```ts
interface CreateTrackerOptions {
  apiEndpoint: {
    track: string;
    ping: string;
  };
  adapter?: RuntimeAdapter;
  sessionTimeoutDuration?: number;
  fetchMode?: 'no-cors' | 'cors' | 'same-origin';
}
```

## `AnalyticsEvent` Constants

Exported from `litetics/tracker`:

```ts
const AnalyticsEvent = {
  LOAD: 'load',
  UNLOAD: 'unload',
} as const;
```
