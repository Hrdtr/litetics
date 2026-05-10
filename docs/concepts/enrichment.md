---
description: How Litetics enriches load events server-side with parsed HTTP headers, request body, and page URL data.
---

# Event Enrichment

Every load event is enriched server-side with data parsed from HTTP headers, the request body, and the page URL. No client-side configuration is needed beyond providing the URL and time zone.

## Enrichment Pipeline

Data flows through a sequence of parsers. Each step extracts structured fields from raw request data.

```
Client request
  │
  ├─ POST body :  { e, b, u, p, q, a, r, t, d }
  └─ Headers   :  User-Agent, Accept-Language
        │
        ▼
  Litetics.handleEventRequest()
        │
        ├─ Bot check (isbot) → skip if bot
        ├─ URL validation (u must be valid)
        ├─ Referrer URL validation (r stripped if invalid)
        │
        ├─ Page URL parsed        → host, path, queryString, hash
        ├─ UTM params extracted   → utmSource, utmMedium, ... (from page URL)
        ├─ User-Agent parsed      → browserName, osName, deviceType, ... (via my-ua-parser)
        ├─ Referrer classified    → referrerMedium, referrerName, search terms (via referrer db)
        ├─ Accept-Language parsed → languageCode, languageRegion, ... (1st & 2nd language)
        └─ Time zone mapped       → country (2-letter code, via time zones db)
              │
              ▼
           persist(enrichedEventData)
```

## Parsers

Each enrichment step uses a dedicated parser function. All parsers are replaceable via `EventRequestHandlerOptions.parsers`:

```ts
createLitetics({
  persist: (data) => {
    /* ... */
  },
  update: (data) => {
    /* ... */
  },
  parsers: {
    userAgent: (ua) => customParse(ua),
    referrer: (refUrl, pageUrl) => customParse(refUrl, pageUrl),
    acceptLanguage: (header) => customParse(header),
    utm: (url) => customParse(url),
  },
});
```

### User-Agent Parser

Uses [my-ua-parser](https://www.npmjs.com/package/my-ua-parser). Extracts:

| Field                  | Example                                      |
| ---------------------- | -------------------------------------------- |
| `browserName`          | `"Chrome"`, `"Mobile Safari"`, `"Firefox"`   |
| `browserVersion`       | `"91.0.4472"`                                |
| `browserEngineName`    | `"Blink"`, `"WebKit"`, `"Gecko"`             |
| `browserEngineVersion` | `"91.0.4472"`                                |
| `deviceType`           | `"mobile"`, `"tablet"`, `"console"`          |
| `deviceVendor`         | `"Apple"`, `"Samsung"`                       |
| `deviceModel`          | `"iPhone"`, `"SM-G991B"`                     |
| `cpuArchitecture`      | `"amd64"`, `"arm"`                           |
| `osName`               | `"Windows"`, `"macOS"`, `"iOS"`, `"Android"` |
| `osVersion`            | `"10"`, `"14.0"`                             |

All fields are `null` when the User-Agent header is absent or unparseable.

### Referrer Parser

Classification happens in two steps:

1. **Internal check** — if the referrer hostname matches the current page hostname, the medium is set to `"internal"` and classification stops there.
2. **Database lookup** — for external referrers, the hostname is looked up against a database of hundreds of domains (exact match first, then suffix match). Domains are categorized into mediums: `"search"`, `"social"`, `"email"`, `"unknown"`.

| Field                     | Example                                                        |
| ------------------------- | -------------------------------------------------------------- |
| `referrerHost`            | `"google.com"`                                                 |
| `referrerKnown`           | `true` when the domain is found in the database or is internal |
| `referrerMedium`          | `"search"`, `"social"`, `"email"`, `"internal"`, `"unknown"`   |
| `referrerName`            | `"Google"`, `"Twitter"`, `"Facebook"`                          |
| `referrerSearchParameter` | `"q"`, `"text"`                                                |
| `referrerSearchTerm`      | `"how to track analytics"`                                     |

Domains not found in the database return `referrerKnown: false` and all medium/name fields as `null`.

### Accept-Language Parser

Parses RFC 7231 `Accept-Language` headers. Extracts the two highest-quality languages. Each language tag is decomposed into:

- **Code** — ISO 639 (2-3 characters, or `*` for wildcard)
- **Script** — ISO 15924 (4 characters, optional)
- **Region** — ISO 3166 (2 characters, optional)

Languages are sorted by quality factor (highest first). Invalid tags are skipped.

### UTM Parser

Extracts standard UTM parameters from the page URL's query string:

| Parameter             | Field               |
| --------------------- | ------------------- |
| `utm_source`          | `utmSource`         |
| `utm_medium`          | `utmMedium`         |
| `utm_campaign`        | `utmCampaign`       |
| `utm_term`            | `utmTerm`           |
| `utm_content`         | `utmContent`        |
| `utm_id`              | `utmId`             |
| `utm_source_platform` | `utmSourcePlatform` |

### Time Zone to Country

Maps the IANA time zone sent by the client (e.g. `"America/New_York"`) to a two-letter country code (e.g. `"US"`). Uses a database of 450+ time zones covering all ISO 3166-1 country codes.

The client time zone is obtained via `Intl.DateTimeFormat().resolvedOptions().timeZone` in the browser adapter.

> Country is derived from the browser’s time zone rather than the user’s IP address. Since the time zone is already exposed by the browser, this approach provides a better balance between user privacy and analytics needs. The detected country is approximate because some time zones span multiple countries, but it is generally accurate enough for regional reporting.

> You can still override the detected country with your own geo-IP logic. The `persist` callback receives the complete `EventData` object, so if you perform IP geolocation from the incoming request, you can replace `data.country` before storing it:
>
> ```ts
> const { handleEventRequest } = createLitetics({
>   persist: (data) => {
>     data.country = geoip(getClientIP()) ?? data.country;
>     // store data...
>   },
>   update: (data) => {
>     /* ... */
>   },
> });
> ```
>
> The `country` field is writable on the data object passed to `persist` — no parser override needed.

## What Falls Through

Fields are `null` when their source data is absent:

- No `User-Agent` header → all browser/device/OS fields are `null`
- No referrer (`r`) → all referrer fields are `null`
- No `Accept-Language` header → all language fields are `null`
- No timeZone (`t`) → `country` is `null` (but `timeZone` itself may still be set)
- Invalid page URL → the entire event is silently dropped (no `persist` call)
