// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: ['@nuxt/content', '@nuxt/eslint', '@nuxt/image', '@nuxt/scripts', '@pinia/nuxt'],

  css: [
    '~/assets/css/main.css', 
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css'
  ],

  build: {
    transpile: ['vuetify']
  },

  vite: {
    define: {
      'process.env.DEBUG': false
    },
    ssr: {
      noExternal: ['vuetify']
    }
  },

  typescript: {
    strict: true
  },

  runtimeConfig: {
    public: {
      apiBase: 'https://ap1.takasimo.com/api'
    }
  },

  // SSR ayarları
  ssr: true,

  // Nitro ayarları
  nitro: {
    esbuild: {
      options: {
        target: 'es2020'
      }
    }
  },

  hooks: {
    'pages:extend'(pages) {
      pages.push(
        {
          path: '/login',
          file: '~/pages/auth/login/login.vue'
        },
        {
          path: '/signup',
          file: '~/pages/auth/signup/signup.vue'
        },
        {
          path: '/product-detail/:id',
          file: '~/pages/products/product-detail/product-detail.vue'
        },
        {
          path: '/category-detail/:id',
          file: '~/pages/category/category-detail.vue'
        },
        {
          path: '/seller-profile/:id',
          file: '~/pages/seller/seller-profile.vue'
        },
        {
          path: '/product-create/:id',
          file: '~/pages/products/product-create/product-create.vue'
        },
        {
          path: '/product-create-main-categories',
          file: '~/pages/products/product-create/product-create-main-categories.vue'
        },
        {
          path: '/product-create-sub-categories/:id',
          file: '~/pages/products/product-create/product-create-sub-categories.vue'
        },
      )
    }
  }
})
