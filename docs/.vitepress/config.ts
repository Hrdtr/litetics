import { defineConfig } from 'vitepress';
import llmstxt, { copyOrDownloadAsMarkdownButtons } from 'vitepress-plugin-llms';

export default defineConfig({
  title: 'Litetics',
  description: 'Embeddable JavaScript analytics event tracking library.',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Concepts', link: '/concepts/event-lifecycle' },
      { text: 'Server', link: '/server/' },
      { text: 'Tracker', link: '/tracker/' },
      { text: 'GitHub', link: 'https://github.com/Hrdtr/litetics' },
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/introduction' },
          { text: 'Quick Start', link: '/quick-start' },
        ],
      },
      {
        text: 'Concepts',
        items: [
          { text: 'Event Lifecycle', link: '/concepts/event-lifecycle' },
          { text: 'Ping & Uniqueness', link: '/concepts/ping-and-uniqueness' },
          { text: 'Event Enrichment', link: '/concepts/enrichment' },
          { text: 'Bot Filtering', link: '/concepts/bot-filtering' },
          { text: 'Session Management', link: '/concepts/session-management' },
        ],
      },
      {
        text: 'Server',
        items: [
          { text: 'Overview', link: '/server/' },
          { text: 'Handler', link: '/server/handler' },
          { text: 'Hono Integration', link: '/server/hono' },
          { text: 'Other Frameworks', link: '/server/other-frameworks' },
        ],
      },
      {
        text: 'Tracker',
        items: [
          { text: 'Overview', link: '/tracker/' },
          { text: 'Instance API', link: '/tracker/instance' },
          { text: 'SPA Navigation', link: '/tracker/spa-navigation' },
          {
            text: 'Adapters',
            items: [
              { text: 'Interface', link: '/tracker/adapters/interface' },
              { text: 'Browser', link: '/tracker/adapters/browser' },
              { text: 'Custom Examples', link: '/tracker/adapters/custom-examples' },
            ],
          },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'Event Data', link: '/references/event-data' },
          { text: 'Parser Utilities', link: '/references/parsers' },
          { text: 'TypeScript Types', link: '/references/types' },
        ],
      },
    ],

    outline: {
      level: [2, 3],
    },

    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {},
          searchOptions: {},
        },
      },
    },

    footer: {
      message:
        'Released under the <a href="https://github.com/Hrdtr/litetics/blob/main/LICENSE">MIT License</a>.',
      copyright: 'Copyright © 2026 <a href="https://github.com/Hrdtr">Herdi Tr.</a>',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Hrdtr/litetics' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/litetics' },
    ],
  },
  vite: {
    plugins: [llmstxt({ domain: 'https://litetics.hrdtr.dev' })],
  },
  markdown: {
    config(md) {
      md.use(copyOrDownloadAsMarkdownButtons);
    },
  },
});
