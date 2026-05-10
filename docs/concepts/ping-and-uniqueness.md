# Ping & Visitor Uniqueness

The ping endpoint distinguishes new visitors from returning visitors within a calendar day. It uses the `If-Modified-Since` HTTP header as a lightweight state mechanism.

## How It Works

The tracker adds a `Cache-Control: no-cache` header on its first ping request. On subsequent requests within the same day, the browser sends back `If-Modified-Since` with the value received from the server's `Last-Modified` header.

```
First visit ever:
  Client → GET /ping (no If-Modified-Since)
  Server → 200, body: "0", Cache-Control: no-cache, Last-Modified: <today midnight UTC>

Same day, returning:
  Client → GET /ping (If-Modified-Since: <today's date>)
  Server → 200, body: "1", Cache-Control: max-age=<seconds until tomorrow midnight>

Next day:
  Client → GET /ping (If-Modified-Since: <yesterday's date>)
  Server → 200, body: "0", Cache-Control: no-cache, Last-Modified: <today midnight UTC>
```

## Response Matrix

The ping handler returns one of three outcomes based on the `If-Modified-Since` header:

| `If-Modified-Since` | Status | Body  | Meaning                                       |
| ------------------- | ------ | ----- | --------------------------------------------- |
| Not present         | 200    | `"0"` | New visitor — send load beacon with `p: true` |
| Before today        | 200    | `"0"` | New day — treated as new unique, `p: true`    |
| Today               | 200    | `"1"` | Returning today — `p: false`                  |
| Invalid date        | 400    | error | Malformed header                              |
| Future date         | 400    | error | Clock skew or tampered header                 |

## Uniqueness Flags

The ping response controls two fields in the load event:

- **`p` (isUniqueUser)** — maps to ping body: `"0"` → `true`, `"1"` → `false`. Indicates whether this user was already counted today.
- **`q` (isUniquePage)** — determined by including the current page path in the ping URL query. The tracker appends `?u=<host+pathname>` to the ping URL. If that specific path has been visited today, `q` is `false`.

### Page-Level Uniqueness

Page-level ping adds `&k=<eventKey>` for custom events:

```
GET /ping?u=example.com%2Fblog%2Fpost-1&k=signup_button
```

This lets the ping handler track uniqueness per page and per custom event key.

## Cache Behavior

- **`body: "0"`** responses use `Cache-Control: no-cache` and `Last-Modified` set to today at midnight UTC. This forces the browser to always revalidate.
- **`body: "1"`** responses use `Cache-Control: max-age=<seconds until midnight>` and preserve the original `Last-Modified` date. The browser caches the response until the day boundary, reducing requests.

## Implementation Notes

The tracker calls `ping()` for:

- Every `register()` call (pageview lifecycle)
- Every `track()` call (custom event lifecycle)

The uniqueness flag `isUnique` is set once per session. After SPA navigation or session timeout, `isUnique` is reset to `false` for subsequent pageviews (since the user is already counted for today).

## Attribution

The uniqueness strategy using `If-Modified-Since` headers is inspired by [Medama](https://github.com/medama-io/medama/), an open-source analytics platform.
