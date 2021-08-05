export const state = () => ({
  performance: null,
})

export const mutations = {
  setPerformance(state, value) {
    state.performance = value
  },
}
