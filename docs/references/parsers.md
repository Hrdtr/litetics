# Parser Utilities

The parser functions used by `Litetics` are internal but exposed for reference and custom use. Each can be overridden via `EventRequestHandlerOptions.parsers`.

## `parseUserAgent(ua: string): ParsedUserAgent`

Uses `my-ua-parser` to decompose a User-Agent string.

```ts
import { parseUserAgent } from 'litetics'; // (internal, not exported)

parseUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/91.0');
// {
//   browserName: "Chrome",
//   browserVersion: "91.0.4472.124",
//   browserEngineName: "Blink",
//   browserEngineVersion: "91.0.4472.124",
//   deviceType: null,
//   deviceVendor: null,
//   deviceModel: null,
//   cpuArchitecture: "amd64",
//   osName: "macOS",
//   osVersion: "10.15.7",
// }
```

Return type:

```ts
interface ParsedUserAgent {
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
}
```

Empty or unparseable UA strings produce all-null output.

## `parseReferrer(referrerURL: string, currentURL?: string): ParsedReferrer`

Classifies a referrer URL against a database of known domains.

```ts
parseReferrer('https://google.com/search?q=test', 'https://mysite.com');
// {
//   referrerHost: "google.com",
//   referrerPath: "/search",
//   referrerQueryString: "q=test",
//   referrerKnown: true,
//   referrerMedium: "search",
//   referrerName: "Google",
//   referrerSearchParameter: "q",
//   referrerSearchTerm: "test",
// }
```

Return type:

```ts
interface ParsedReferrer {
  referrerHost: string;
  referrerPath: string;
  referrerQueryString: string | null;
  referrerKnown: boolean;
  referrerMedium: string | null;
  referrerName: string | null;
  referrerSearchParameter: string | null;
  referrerSearchTerm: string | null;
}
```

When `currentURL` is provided and its hostname matches the referrer hostname, the medium is set to `"internal"` without querying the database. Unknown domains return `referrerKnown: false` and `null` for medium/name.

## `parseAcceptLanguage(header: string): ParsedAcceptLanguage`

Parses RFC 7231 `Accept-Language` headers.

```ts
parseAcceptLanguage('en-US,en;q=0.9,fr-CA;q=0.8');
// {
//   languageCode: "en",
//   languageScript: null,
//   languageRegion: "US",
//   secondaryLanguageCode: "en",
//   secondaryLanguageScript: null,
//   secondaryLanguageRegion: null,
// }
```

Return type:

```ts
interface ParsedAcceptLanguage {
  languageCode: string | null;
  languageScript: string | null;
  languageRegion: string | null;
  secondaryLanguageCode: string | null;
  secondaryLanguageScript: string | null;
  secondaryLanguageRegion: string | null;
}
```

Languages are sorted by quality factor (highest first). Invalid tags are skipped. The `*` wildcard is accepted as a valid language code. An empty header produces all-null output.

## `parseUTMParams(url: URL): ParsedUTMParams`

Extracts UTM parameters from a URL's query string.

```ts
parseUTMParams(
  new URL('https://example.com?utm_source=twitter&utm_medium=social&utm_campaign=launch'),
);
// {
//   source: "twitter",
//   medium: "social",
//   campaign: "launch",
//   term: null,
//   content: null,
//   id: null,
//   sourcePlatform: null,
// }
```

Return type:

```ts
interface ParsedUTMParams {
  source: string | null;
  medium: string | null;
  campaign: string | null;
  term: string | null;
  content: string | null;
  id: string | null;
  sourcePlatform: string | null;
}
```

## `getCountryCodeByTimeZone(timeZone: string): string | null`

Maps an IANA time zone to an ISO 3166-1 alpha-2 country code.

```ts
getCountryCodeByTimeZone('Europe/London'); // → "GB"
getCountryCodeByTimeZone('Asia/Tokyo'); // → "JP"
getCountryCodeByTimeZone('Unknown/Zone'); // → null
```

## `isValidUrl(string: string, options?): boolean`

Validates URL strings. Optionally restricts allowed protocols.

```ts
isValidUrl('https://example.com'); // → true
isValidUrl('not-a-url'); // → false
isValidUrl('ftp://example.com', { matchProtocols: 'https:' }); // → false
isValidUrl('https://a', { matchProtocols: ['http:', 'https:'] }); // → true
```
