import firebase from '~/server/api/firebase'

export default {
  mounted() {
    console.log('mounted mixin', process.env.NODE_ENV)
    if (process.env.NODE_ENV === 'production') {
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
