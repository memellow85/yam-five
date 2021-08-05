import firebase from '~/server/api/firebase'

export default {
  methods: {
    logCustomEvent(event) {
      if (
        process.env.NUXT_ENV_NODE_ENV === 'production' ||
        process.env.NUXT_ENV_NODE_ENV === 'beta'
      ) {
        firebase
          .analytics()
          .logEvent(event, { env: process.env.NUXT_ENV_NODE_ENV })
      }
    },
  },
}
