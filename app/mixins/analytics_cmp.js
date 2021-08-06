import firebase from '~/server/api/firebase'
import { isProd } from '~/utils'

export default {
  methods: {
    logCustomEvent(event) {
      if (isProd()) {
        firebase
          .analytics()
          .logEvent(event, { env: process.env.NUXT_ENV_NODE_ENV })
      }
    },
  },
}
