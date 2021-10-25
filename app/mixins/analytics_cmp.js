import { mapState } from 'vuex'
import firebase from '~/server/api/firebase'
import { isProd } from '~/utils'

export default {
  computed: {
    ...mapState({
      analytics: (state) => state.analytics,
    }),
  },
  methods: {
    logCustomEvent(event) {
      if (isProd()) {
        firebase.logEvent(this.analytics, event, {
          env: process.env.NUXT_ENV_NODE_ENV,
        })
      }
    },
  },
}
