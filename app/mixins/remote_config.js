import { getRemoteConfig } from 'firebase/remote-config'
// import { mapState } from 'vuex'

export default {
  /* computed: {
    ...mapState({
      activeRemoveConfig: (state) => state.activeRemoveConfig,
    }),
  }, */
  beforeMount() {
    const remoteConfig = getRemoteConfig()
    this.$store.dispatch(`firebase/getRemoteConfigFirebase`, remoteConfig)
  },
}
