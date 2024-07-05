import contentModule from '../../src/module'

export default defineNuxtConfig({
  // Nuxt 4 FTW: https://nuxt.com/docs/getting-started/upgrade#testing-nuxt-4
  future: { compatibilityVersion: 4 },

  extends: ['../shared'],

  content: {
    sources: {
      'content': {
        driver: 'http',
        // Run `playground/http-driver/content-server` to on port 3004
        base: 'http://localhost:3004/api/storage'
      }
    },
  },

  typescript: {
    includeWorkspace: true
  },

  modules: [
    // @ts-expect-error
    contentModule
    // '@nuxtjs/tailwindcss'
  ],

  compatibilityDate: '2024-07-05'
})