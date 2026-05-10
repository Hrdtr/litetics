---
description: How Litetics silently drops events from bots and crawlers using isbot and custom detection.
---

# Bot Filtering

The server handler silently drops events from bots and crawlers. This prevents polluting your analytics data with automated traffic.

## Default Detection

Bot detection is powered by [isbot](https://www.npmjs.com/package/isbot). It examines the `User-Agent` header against a comprehensive database of known bot patterns.

When a bot is detected, the handler returns immediately without calling `persist` or `update`.

## Custom Detection

Override the default behavior with `shouldIgnoreUserAgent`:

```ts
const { handleEventRequest } = createLitetics({
  persist: (data) => {
    /* ... */
  },
  update: (data) => {
    /* ... */
  },
  shouldIgnoreUserAgent: (ua) => {
    // Return true to drop the event
    return ua.includes('my-custom-bot');
  },
});
```

When `shouldIgnoreUserAgent` is not provided, `isbot` is used as the default.

## When Bot Check Runs

The `User-Agent` header is checked at the start of `handleEventRequest()`, before any parsing or enrichment. If the check passes (returning `true`), the handler exits immediately. If `debug` mode is enabled, a log message is emitted:

```
[litetics:event] User agent ignored: [user-agent]
```

## No Client-Side Filtering

Bot detection happens entirely on the server. The client tracker sends beacons regardless of who or what is using the browser. This keeps the client lightweight and allows the server to make the final decision.
