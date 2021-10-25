export const state = () => ({
  performance: null,
  analytics: null,
})

export const mutations = {
  setPerformance(state, value) {
    state.performance = value
  },
  setAnalytics(state, value) {
    state.analytics = value
  },
}
