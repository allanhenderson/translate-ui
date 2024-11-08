// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000',
      awsRegion: process.env.NUXT_PUBLIC_AWS_REGION || 'us-east-1'
    }
  },

  nitro: {
    devProxy: {
      '/api': {
        target: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000',
        changeOrigin: true,
        prependPath: true
      }
    }
  },

  app: {
    head: {
      title: 'Translation Service',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'AWS Translation Service Interface' }
      ]
    }
  },

  compatibilityDate: '2024-11-08'
})