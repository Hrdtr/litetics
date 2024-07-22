import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Litetics",
  description: "Embeddable javascript analytics event tracking library.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Quick Start', link: '/quick-start' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        items: [
          { text: 'What is Litetics?', link: '/introduction' },
          { text: 'Quick Start', link: '/quick-start' },
        ]
      },
    ],

    footer: {
      message: 'Released under the <a href="https://github.com/Hrdtr/litetics/blob/main/LICENSE">MIT License</a>.',
      copyright: 'Copyright © 2024 <a href="https://github.com/Hrdtr">Herdi Tr.</a>'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Hrdtr/litetics' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/litetics' },
    ]
  }
})
