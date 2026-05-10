---
layout: home

hero:
  name: 'Litetics'
  text: 'Flexible, embeddable'
  tagline: Runtime agnostic Javascript analytics event tracking library.
  actions:
    - theme: brand
      text: Get Started
      link: /quick-start
    - theme: alt
      text: Architecture
      link: /introduction

features:
  - icon: 🧩
    title: Runtime Agnostic Server
    details: Handlers accept standard Request objects. Works with Hono, Fastify, Workers, Bun, Deno, Node.
  - icon: 🔍
    title: Automatic Enrichment
    details: Parses user-agent, referrer, Accept-Language, UTM params, and time-zone-to-country. No manual mapping needed.
  - icon: 🤖
    title: Bot Filtering
    details: Built-in bot detection with optional custom shouldIgnoreUserAgent.
  - icon: ⏱️
    title: Session & Duration Tracking
    details: Configurable session timeout with automatic inactivity detection. Paired track() / trackEndOf() for event durations.
  - icon: 🔌
    title: Custom Runtime Adapters
    details: Adapter interface for any JS environment. Provide your own send, context, and lifecycle hooks.
  - icon: 🛡️
    title: TypeScript First
    details: Full type safety with zero any. Every type exported. Discriminated request body types.
---
