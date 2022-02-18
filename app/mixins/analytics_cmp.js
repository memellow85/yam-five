import { mapState } from 'vuex'
import { logEvent } from 'firebase/analytics'
import { isProd } from '~/utils'

export default {
  computed: {
    ...mapState('firebase', {
      analytics: (state) => state.analytics,
    }),
  },
  methods: {
    logCustomEvent(event) {
      if (isProd()) {
        logEvent(this.analytics, event, {
          env: process.env.NUXT_ENV_NODE_ENV,
        })
      }
    },
  },
}
