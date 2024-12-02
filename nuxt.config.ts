// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  plugins: [
    '~/plugins/azure-auth.ts'
  ],
  devServer: {
    port: 3001
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || `http://localhost:${process.env.DEV_PORT}`,
      awsRegion: process.env.NUXT_PUBLIC_AWS_REGION || 'us-east-1',
      azureClientId: process.env.AZURE_CLIENT_ID,
      azureTenantId: process.env.AZURE_TENANT_ID,
      authRedirectUri: process.env.AUTH_REDIRECT_URI
    }
  },
  nitro: {
    devProxy: {
      '/api': {
        target: process.env.NUXT_PUBLIC_API_BASE || `http://localhost:${process.env.DEV_PORT}`,
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
