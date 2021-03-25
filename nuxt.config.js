const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

export default {
  ssr: false,
  components: false,
  telemetry: false,
  srcDir: 'app',
  target: 'static',
  server: {
    host: 'localhost',
    port: 5000, // default: 3000
  },
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
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Il gioco di dadi',
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
        content: 'Il gioco di dadi',
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
        href: 'icon.png',
      },
      {
        rel: 'apple-touch-icon',
        href: 'icon.png',
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
      description: 'Il gioco di dadi',
      viewport:
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
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
  css: ['@mdi/font/css/materialdesignicons.css', '~/assets/animations.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/i18n.js' },
    { src: '~/plugins/visibility.js' },
    { src: '~/plugins/firebase.js', ssr: false },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
  ],
  /*
   ** Scss resources
   */
  styleResources: {
    // your settings here
    scss: ['~/assets/scss/index.scss'],
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    plugins: [
      new LodashModuleReplacementPlugin({
        collections: true,
        paths: true,
      }),
    ],
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
      presets({ isServer }) {
        return [
          [
            require.resolve('@nuxt/babel-preset-app'),
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
