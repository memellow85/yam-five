import cloneDeep from 'lodash/cloneDeep'
import { getAll } from 'firebase/remote-config'
import firebase from '~/server/api/firebase'
import { logger } from '~/utils'

export const state = () => ({
  performance: cloneDeep(firebase.getPerformance(firebase.app)),
  analytics: null,
  activeRemoveConfig: null,
})

export const mutations = {
  setAnalytics(state, value) {
    logger('COMMIT-YAM setAnalytics', value, 'i')
    state.analytics = value
  },
  setRemoteConfig(state, config) {
    logger('COMMIT-YAM setRemoteConfig', config, 'i')
    state.activeRemoveConfig = getAll(config)
  },
}
