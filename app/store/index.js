import cloneDeep from 'lodash/cloneDeep'
import firebase from '~/server/api/firebase'

export const state = () => ({
  performance: cloneDeep(firebase.getPerformance(firebase.app)),
  analytics: null,
})

export const mutations = {
  setAnalytics(state, value) {
    state.analytics = value
  },
}
