import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devServer: {
    port: Number(process.env.NUXT_DEV_SERVER_PORT) || 5173,
  },
  devtools: { enabled: true },
  components: [
    { path: '~/components/atoms', pathPrefix: false },
    { path: '~/components/molecules', pathPrefix: false },
    { path: '~/components/organisms', pathPrefix: false },
  ],
  modules: ['@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8200',
    },
  },
})
