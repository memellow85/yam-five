import firebase from '~/server/api/firebase'

export default {
  mounted() {
    console.log('mounted mixin', process.env.NUXT_ENV_NODE_ENV)
    if (
      process.env.NUXT_ENV_NODE_ENV === 'production' ||
      process.env.NUXT_ENV_NODE_ENV === 'beta'
    ) {
      this.logEvent(this.$route)
    }
  },
  methods: {
    logEvent(route) {
      console.log(route)
      firebase.analytics().setCurrentScreen(route.fullPath)
      firebase
        .analytics()
        .logEvent('screen_view', { env: process.env.NUXT_ENV_NODE_ENV })
    },
  },
}
