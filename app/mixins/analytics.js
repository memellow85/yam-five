import { mapState } from 'vuex'
import { logEvent } from 'firebase/analytics'
import { isProd } from '~/utils'

export default {
  computed: {
    ...mapState('firebase', {
      analytics: (state) => state.analytics,
    }),
  },
  mounted() {
    this.logEventYamFive(this.$route)
  },
  methods: {
    logEventYamFive(route) {
      if (isProd()) {
        logEvent(this.analytics, 'screen_view', {
          route: route.fullPath,
          env: process.env.NUXT_ENV_NODE_ENV,
        })
      }
    },
    logCustomEvent(event) {
      if (isProd()) {
        logEvent(this.analytics, event, {
          env: process.env.NUXT_ENV_NODE_ENV,
        })
      }
    },
  },
}
