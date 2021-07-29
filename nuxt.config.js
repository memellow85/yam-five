// const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

module.exports = {
  ssr: false,
  components: true,
  telemetry: false,
  srcDir: 'app',
  dev: process.env.NUXT_ENV_NODE_ENV !== 'production',
  /* server: {
    host: 'localhost',
    port: 5000, // default: 3000
  }, */
  layoutTransition: 'fade-in',
  pageTransition: 'fade-in',
  /*
   ** Headers of the page
   */
  head: {
    title: 'YamFive',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi',
      },
      {
        hid: 'description',
        name: 'description',
        content: 'The dices game',
      },
      {
        name: 'mobile-web-app-capable',
        content: 'yes',
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'default',
      },
      {
        name: 'apple-mobile-web-app-title',
        content: 'YamFive',
      },
      {
        name: 'author',
        content: 'eb',
      },
      {
        name: 'og:type',
        content: 'website',
      },
      {
        name: 'og:title',
        content: 'YamFive',
      },
      {
        name: 'og:site_name',
        content: 'YamFive',
      },
      {
        name: 'og:description',
        content: 'The dices game',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'apple-touch-startup-image',
        href: '/splash/launch-640x1136.png',
        media:
          '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        rel: 'apple-touch-startup-image',
        href: '/splash/launch-750x1294.png',
        media:
          '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        rel: 'apple-touch-startup-image',
        href: '/splash/launch-1242x2148.png',
        media:
          '(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        rel: 'apple-touch-startup-image',
        href: '/splash/launch-1125x2436.png',
        media:
          '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
      },
      {
        rel: 'apple-touch-startup-image',
        href: '/splash/launch-1536x2048.png',
        media:
          '(min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        rel: 'apple-touch-startup-image',
        href: '/splash/launch-1668x2224.png',
        media:
          '(min-device-width: 834px) and (max-device-width: 834px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        rel: 'apple-touch-startup-image',
        href: '/splash/launch-2048x2732.png',
        media:
          '(min-device-width: 1024px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        rel: 'shortcut icon',
        href: '/icons/icon512.png',
      },
      {
        rel: 'apple-touch-icon',
        href: '/icons/icon512.png',
      },
      {
        rel: 'manifest',
        href: 'manifest.json',
      },
    ],
  },
  /*
   ** PWA
   */
  pwa: {
    meta: false,
    manifest: {
      name: 'YamFive',
      short_name: 'YamFive',
      description: 'The dices game',
      viewport:
        'user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi',
    },
    /* meta: {
      mobileAppIOS: true,
    }, */
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#00A676', height: '3px' },
  /*
   ** Global CSS
   */
  css: [
    '@mdi/font/scss/materialdesignicons.scss',
    '~/assets/scss/fonts.scss',
    '~/assets/scss/animations.scss',
    '~/assets/scss/normalize.scss',
    '~/assets/scss/index.scss',
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/pwa-update.js' },
    { src: '~/plugins/i18n.js' },
    { src: '~/plugins/visibility.js' },
    { src: '~/plugins/socket-client.js' },
    // { src: '~/plugins/firebase.js', ssr: false },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/pwa',
  ],
  /*
   ** Scss resources
   */
  styleResources: {
    // your settings here
    scss: [
      '~/assets/scss/common/_variables.scss',
      '~/assets/scss/common/_mixins.scss',
      '~/assets/scss/common/_helpers.scss',
    ],
  },
  axios: {
    debug: process.env.NUXT_ENV_NODE_ENV !== 'production',
    headers: {
      'Content-Type': 'application/json',
    },
    baseURL:
      process.env.NUXT_ENV_NODE_ENV !== 'production'
        ? process.env.NUXT_ENV_NODE_ENV === 'beta'
          ? 'https://yamfive-app-dev.herokuapp.com/'
          : 'http://localhost:5000/'
        : 'https://yamfive-app.herokuapp.com/',
  },
  /*
   ** Build configuration
   */
  build: {
    extend(config, { isDev, isClient }) {
      config.node = {
        fs: 'empty',
      }
    },
    /* plugins: [
      new LodashModuleReplacementPlugin({
        collections: true,
        paths: true,
        caching: true,
      }),
    ], */
    performance: {
      hints: 'warning',
      maxEntrypointSize: 300000,
      maxAssetSize: 300000,
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 0,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 6,
        maxInitialRequests: 4,
        automaticNameDelimiter: '~',
        automaticNameMaxLength: 30,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1]
              return `npm.${packageName.replace('@', '')}`
            },
          },
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
    babel: {
      plugins: [
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        ['@babel/plugin-proposal-private-methods', { loose: true }],
        ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
      ],
      presets({ isServer }) {
        return [
          [
            require.resolve('@nuxt/babel-preset-app', { loose: true }),
            // require.resolve('@nuxt/babel-preset-app-edge'), // For nuxt-edge users
            {
              buildTarget: isServer ? 'server' : 'client',
              corejs: { version: 3 },
            },
          ],
        ]
      },
    },
  },
}
