import { mapState } from 'vuex'
import firebase from '~/server/api/firebase'
import { isProd } from '~/utils'

export default {
  computed: {
    ...mapState({
      analytics: (state) => state.analytics,
    }),
  },
  mounted() {
    this.logEvent(this.$route)
  },
  methods: {
    logEvent(route) {
      if (isProd()) {
        firebase.logEvent(this.analytics, 'screen_view', {
          route: route.fullPath,
          env: process.env.NUXT_ENV_NODE_ENV,
        })
      }
    },
    logCustomEvent(event) {
      if (isProd()) {
        firebase.logEvent(this.analytics, event, {
          env: process.env.NUXT_ENV_NODE_ENV,
        })
      }
    },
  },
}
