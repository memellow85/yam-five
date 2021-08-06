import firebase from '~/server/api/firebase'
import { isProd } from '~/utils'

export default {
  mounted() {
    if (isProd()) {
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
