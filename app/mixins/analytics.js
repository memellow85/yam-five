import firebase from '~/server/api/firebase'

export default {
  mounted() {
    if (
      process.env.NUXT_ENV_NODE_ENV === 'production' ||
      process.env.NUXT_ENV_NODE_ENV === 'beta'
    ) {
      this.logEvent(this.$route)
    }
  },
  methods: {
    logEvent(route) {
      firebase.analytics().setCurrentScreen(route.fullPath)
      firebase
        .analytics()
        .logEvent('screen_view', { env: process.env.NUXT_ENV_NODE_ENV })
    },
    logCustomEvent(event) {
      firebase
        .analytics()
        .logEvent(event, { env: process.env.NUXT_ENV_NODE_ENV })
    },
  },
}
