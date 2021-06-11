import { logger } from '~/utils'

/**
 * State
 */
export const state = () => ({
  userFirebase: null,
  userDetailsFirebase: null,
  usersChampions: [],
})

/**
 * Mutations
 */
export const mutations = {
  setUserFirebase(state, user) {
    logger('COMMIT-FIREBASE userFirebase', user, 'i')
    state.userFirebase = user
  },
  setUserDetailsFirebase(state, user) {
    logger('COMMIT-FIREBASE userDetailsFirebase', user, 'i')
    state.userDetailsFirebase = user
  },
  setChampions(state, data) {
    logger('COMMIT-FIREBASE usersChampions', data, 'i')
    state.usersChampions = data
  },
}

/**
 * Actions
 */
export const actions = {
  logout({ commit }) {
    logger('ACTION-FIREBASE logout', null, 'i')
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/yam-five/logout')
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error.response.data.message)
        })
    })
  },
  login({ commit, dispatch }, data) {
    logger('ACTION-FIREBASE login', data, 'i')
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/yam-five/login', data)
        .then((resp) => {
          const user = resp.data.user
          commit('setUserFirebase', user)
          dispatch('getDetailsUser', user.uid).then((r) => {
            commit('setUserDetailsFirebase', r)
            resolve()
          })
          dispatch('getChampions')
        })
        .catch((error) => {
          reject(error.response.data.message)
        })
    })
  },
  recovery({ commit }, data) {
    logger('ACTION-FIREBASE recovery', data, 'i')
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/yam-five/user-recovery-email', data)
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error.response.data.message)
        })
    })
  },
  getDetailsUser({ commit }, uid) {
    logger('ACTION-FIREBASE getDetailsUser', uid, 'i')
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/yam-five/user/${uid}`)
        .then((resp) => {
          resolve(resp.data)
        })
        .catch((error) => {
          reject(error.response.data.message)
        })
    })
  },
  getChampions({ commit }) {
    logger('ACTION-FIREBASE getChampions', null, 'i')
    this.$axios.get('/yam-five/user').then((resp) => {
      commit('setChampions', resp.data)
    })
  },
  registration({ dispatch }, data) {
    logger('ACTION-FIREBASE registration', data, 'i')
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/yam-five/user', data)
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error.response.data.message)
        })
    })
  },
  updateRecordUser({ dispatch }, data) {
    logger('ACTION-FIREBASE updateRecordUser', data, 'i')
    return new Promise((resolve, reject) => {
      this.$axios
        .put(`/yam-five/user/${data.user.uid}`, data)
        .then(() => {
          dispatch('getChampions')
          resolve()
        })
        .catch((error) => {
          reject(error.response.data.message)
        })
    })
  },
}
