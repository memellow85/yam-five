import { getRemoteConfig } from 'firebase/remote-config'

export default {
  beforeMount() {
    const remoteConfig = getRemoteConfig()
    this.$store.dispatch(`firebase/getRemoteConfigFirebase`, remoteConfig)
  },
}
