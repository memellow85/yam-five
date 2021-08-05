import { logger } from '~/utils'

const compare = (a, b) => {
  if (a.tot > b.tot) return -1
  if (b.tot > a.tot) return 1
  return 0
}

const sort = (data, type) => {
  const tmp = []
  data.map((v) => {
    v.tot = type ? v[type] : 0
    tmp.push(v)
  })
  return tmp.sort(compare)
}

/**
 * State
 */
export const state = () => ({
  userFirebase: null,
  userDetailsFirebase: null,
  usersChampions: [],
  issueList: [],
})

/**
 * Getters
 */
export const getters = {
  getTypeChampions: (state) => (type) => {
    return sort(state.usersChampions, type)
  },
}

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
    state.usersChampions = data || []
  },
  setReportIssueList(state, data) {
    state.issueList = data || []
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
  login({ commit, dispatch, rootState }, data) {
    logger('ACTION-FIREBASE login', data, 'i')
    const log = rootState.performance.trace('FB_login')
    log.start()
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/yam-five/login', data)
        .then((resp) => {
          log.stop()
          const user = resp.data.user
          commit('setUserFirebase', user)
          dispatch('getDetailsUser', user.uid)
            .then((r) => {
              commit('setUserDetailsFirebase', r)
              dispatch('getChampions')
              resolve()
            })
            .catch((error) => {
              reject(error.response.data.message)
            })
        })
        .catch((error) => {
          log.stop()
          reject(error.response.data.message)
        })
    })
  },
  recovery({ commit, rootState }, data) {
    logger('ACTION-FIREBASE recovery', data, 'i')
    const log = rootState.performance.trace('FB_recovery')
    log.start()
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/yam-five/user-recovery-email', data)
        .then(() => {
          log.stop()
          resolve()
        })
        .catch((error) => {
          log.stop()
          reject(error.response.data.message)
        })
    })
  },
  getDetailsUser({ commit, rootState }, uid) {
    logger('ACTION-FIREBASE getDetailsUser', uid, 'i')
    const log = rootState.performance.trace('FB_getDetailsUser')
    log.start()
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/yam-five/user/${uid}`)
        .then((resp) => {
          log.stop()
          resolve(resp.data)
        })
        .catch((error) => {
          log.stop()
          reject(error.response.data.message)
        })
    })
  },
  getChampions({ commit, rootState }) {
    logger('ACTION-FIREBASE getChampions', null, 'i')
    const log = rootState.performance.trace('FB_getChampions')
    log.start()
    this.$axios.get('/yam-five/user').then((resp) => {
      commit('setChampions', resp.data)
      log.stop()
    })
  },
  registration({ dispatch, rootState }, data) {
    logger('ACTION-FIREBASE registration', data, 'i')
    const log = rootState.performance.trace('FB_registration')
    log.start()
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/yam-five/user', data)
        .then(() => {
          log.stop()
          resolve()
        })
        .catch((error) => {
          log.stop()
          reject(error.response.data.message)
        })
    })
  },
  updateRecordUser({ dispatch, commit, state, rootState }, data) {
    logger('ACTION-FIREBASE updateRecordUser', data, 'i')
    const log = rootState.performance.trace('FB_updateRecordUser')
    log.start()
    return new Promise((resolve, reject) => {
      this.$axios
        .put(`/yam-five/user/${data.details.user.uid}`, data)
        .then(() => {
          log.stop()
          dispatch('getChampions')
          dispatch('getDetailsUser', state.userDetailsFirebase.uid)
            .then((r) => {
              commit('setUserDetailsFirebase', r)
            })
            .catch((error) => {
              reject(error.response.data.message)
            })
          resolve()
        })
        .catch((error) => {
          log.stop()
          reject(error.response.data.message)
        })
    })
  },
  resetRecordUser({ dispatch, commit, state, rootState }) {
    logger('ACTION-FIREBASE resetRecordUser', null, 'i')
    const log = rootState.performance.trace('FB_resetRecordUser')
    log.start()
    return new Promise((resolve, reject) => {
      this.$axios
        .put(`/yam-five/reset-record/${state.userDetailsFirebase.uid}`, {})
        .then(() => {
          log.stop()
          dispatch('getChampions')
          dispatch('getDetailsUser', state.userDetailsFirebase.uid)
            .then((r) => {
              commit('setUserDetailsFirebase', r)
            })
            .catch((error) => {
              reject(error.response.data.message)
            })
          resolve()
        })
        .catch((error) => {
          log.stop()
          reject(error.response.data.message)
        })
    })
  },
  reportAIssueList({ commit, rootState }) {
    logger('ACTION-FIREBASE reportAIssueList', null, 'i')
    const log = rootState.performance.trace('FB_reportAIssueList')
    log.start()
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/yam-five/report-issue`)
        .then((resp) => {
          commit('setReportIssueList', resp.data)
          resolve()
          log.stop()
        })
        .catch((error) => {
          log.stop()
          reject(error.response.data.message)
        })
    })
  },
  reportAIssue({ state, rootState }, data) {
    logger('ACTION-FIREBASE reportAIssue', data, 'i')
    const log = rootState.performance.trace('FB_reportAIssue')
    log.start()
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`/yam-five/report-issue/${state.userDetailsFirebase.uid}`, data)
        .then(() => {
          log.stop()
          resolve()
        })
        .catch((error) => {
          log.stop()
          reject(error.response.data.message)
        })
    })
  },
}
