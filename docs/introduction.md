---
description: Overview and architecture of Litetics, a runtime-agnostic analytics event tracking library for JavaScript.
---

# Introduction

Litetics is an analytics event tracking library for JavaScript. It captures pageviews, enriches events with metadata, and delivers them to your own persistence layer — no third-party services involved.

## What It Is

A library, not a platform. You import it, hook it up to your HTTP server and browser frontend, and decide where events go: a database, a log file, an in-memory array, or anywhere else.

Two packages:

| Package            | Environment              | Purpose                                                         |
| ------------------ | ------------------------ | --------------------------------------------------------------- |
| `litetics`         | Server                   | Accepts and enriches analytics events from the client           |
| `litetics/tracker` | Browser / any JS runtime | Generates beacons, manages page lifecycle, tracks custom events |

## Why Litetics

- **Own your data**. No third-party analytics service. Events go to your infrastructure.
- **Runtime agnostic**. Server handlers accept standard `Request` objects. Client tracker works through a pluggable adapter interface.
- **Automatic enrichment**. User-Agent, referrer, Accept-Language, UTM parameters, and time-zone-to-country resolution happen server-side with no configuration.
- **Bot filtering**. Silently drops bot traffic via [isbot](https://www.npmjs.com/package/isbot). Custom detection supported.
- **Session & duration tracking**. Configurable session timeouts. Paired `track()` / `trackEndOf()` for timing arbitrary interactions.
- **SPA-aware**. Wraps `history.pushState` and listens to `popstate`. Hash-based routing supported. Works with React Router, Vue Router, Nuxt, Next.js.

## Architecture

A tracker in the browser communicates with a handler on the server over two HTTP routes.

```text
  Browser                          Server
 ┌───────────┐                    ┌─────────────────────────┐
 │           │─── GET  /ping ───▶ │ Litetics                │
 │  Tracker  │                    │   .handlePingRequest()  │
 │           │─── POST /event ──▶ │   .handleEventRequest() │
 └───────────┘                    │         ▼               │
                                  │     persist(data)       │
                                  │     update(duration)    │
                                  └─────────────────────────┘
                                               │
                                               ▼
                                         Your database
```

**Ping** determines whether the visitor is new or returning within the same calendar day using `If-Modified-Since` headers.

**Load events** carry the page URL, referrer, time zone, and optional custom data. The server parses HTTP headers (User-Agent, Accept-Language) and URL query parameters (UTM), enriches the payload, and calls your `persist` callback.

**Unload events** carry only a beacon ID and duration in milliseconds. The server calls your `update` callback to attach the duration to a previously persisted load event.

## How It Compares

Litetics is not a dashboard, not a database, and not a hosted service. It is the transport and enrichment layer between your frontend and your data store. Compare it to libraries like Plausible's event ingestion pipeline or a self-hosted Matomo collector — but smaller, framework-independent, and designed to be embedded into existing applications.
