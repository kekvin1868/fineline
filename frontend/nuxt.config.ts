export default defineNuxtConfig({
  compatibilityDate: '2025-09-29',
  devtools: { enabled: true },
  devServer: {
    port: 3001
  },
  runtimeConfig: {
    public: {
      backendBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000'
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'shadcn-nuxt',
    '@nuxtjs/color-mode'
  ],
  colorMode: {
    classSuffix: ''
  },
  css: ['~/assets/css/main.css']
});