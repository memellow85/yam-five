import { logger, trace } from '~/utils'

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
  reset(state) {
    state.userFirebase = null
    state.userDetailsFirebase = null
    state.usersChampions = []
    state.issueList = []
  },
}

/**
 * Actions
 */
export const actions = {
  logout({ commit, dispatch }) {
    logger('ACTION-FIREBASE logout', null, 'i')
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/yam-five/logout')
        .then(() => {
          commit('reset')
          resolve()
        })
        .catch((error) => {
          dispatch('logErrors', {
            message: 'ACTION-FIREBASE logout: ' + JSON.stringify(error),
            type: 'firebase_store',
          })
          reject(error.response.data.message)
        })
    })
  },
  login({ commit, dispatch, rootState }, data) {
    logger('ACTION-FIREBASE login', data, 'i')
    const log = trace(true, rootState.performance, 'LOGIN', null)
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/yam-five/login', data)
        .then((resp) => {
          trace(false, null, null, log)
          // const user = resp.data.user
          commit('setUserFirebase', resp.data.user)
          dispatch('dataFirebaseInit', resp.data.user.uid)
            .then(() => {
              resolve()
            })
            .catch((error) => {
              reject(error.response.data.message)
            })
        })
        .catch((error) => {
          trace(false, null, null, log)
          dispatch('logErrors', {
            message: 'ACTION-FIREBASE login: ' + JSON.stringify(error),
            type: 'firebase_store',
          })
          reject(error.response.data.message)
        })
    })
  },
  recovery({ commit, dispatch, rootState }, data) {
    logger('ACTION-FIREBASE recovery', data, 'i')
    const log = trace(true, rootState.performance, 'RECOVERY', null)
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/yam-five/user-recovery-email', data)
        .then(() => {
          trace(false, null, null, log)
          resolve()
        })
        .catch((error) => {
          trace(false, null, null, log)
          dispatch('logErrors', {
            message: 'ACTION-FIREBASE recovery: ' + JSON.stringify(error),
            type: 'firebase_store',
          })
          reject(error.response.data.message)
        })
    })
  },
  getDetailsUser({ commit, dispatch, rootState }, data) {
    logger('ACTION-FIREBASE getDetailsUser', data, 'i')
    const log = trace(true, rootState.performance, 'GETDETAILSUSER', null)
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/yam-five/user/${data.value}/?check=${data.check}`)
        .then((resp) => {
          trace(false, null, null, log)
          commit('setUserDetailsFirebase', resp.data)
          resolve(resp.data)
        })
        .catch((error) => {
          trace(false, null, null, log)
          dispatch('logErrors', {
            message: 'ACTION-FIREBASE getDetailsUser: ' + JSON.stringify(error),
            type: 'firebase_store',
          })
          reject(error.response.data.message)
        })
    })
  },
  getChampions({ commit, dispatch, rootState }) {
    logger('ACTION-FIREBASE getChampions', null, 'i')
    const log = trace(true, rootState.performance, 'GETCHAMPIONS', null)
    this.$axios
      .get('/yam-five/user')
      .then((resp) => {
        trace(false, null, null, log)
        commit('setChampions', resp.data)
      })
      .catch((error) => {
        trace(false, null, null, log)
        dispatch('logErrors', {
          message: 'ACTION-FIREBASE getChampions: ' + JSON.stringify(error),
          type: 'firebase_store',
        })
      })
  },
  registration({ dispatch, rootState }, data) {
    logger('ACTION-FIREBASE registration', data, 'i')
    const log = trace(true, rootState.performance, 'REGISTRATION', null)
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/yam-five/user', data)
        .then(() => {
          trace(false, null, null, log)
          resolve()
        })
        .catch((error) => {
          trace(false, null, null, log)
          dispatch('logErrors', {
            message: 'ACTION-FIREBASE registration: ' + JSON.stringify(error),
            type: 'firebase_store',
          })
          reject(error.response.data.message)
        })
    })
  },
  updateRecordUser({ dispatch, commit, state, rootState }, data) {
    logger('ACTION-FIREBASE updateRecordUser', data, 'i')
    const log = trace(true, rootState.performance, 'UPDATERECORDUSER', null)
    return new Promise((resolve, reject) => {
      this.$axios
        .put(`/yam-five/user/${data.details.user.id_doc}`, data)
        .then(() => {
          trace(false, null, null, log)
          dispatch('dataFirebaseInit')
            .then(() => {
              resolve()
            })
            .catch((error) => {
              reject(error.response.data.message)
            })
        })
        .catch((error) => {
          trace(false, null, null, log)
          dispatch('logErrors', {
            message:
              'ACTION-FIREBASE updateRecordUser: ' + JSON.stringify(error),
            type: 'firebase_store',
          })
          reject(error.response.data.message)
        })
    })
  },
  resetRecordUser({ dispatch, state, rootState }) {
    logger('ACTION-FIREBASE resetRecordUser', null, 'i')
    const log = trace(true, rootState.performance, 'RESETRECORDUSER', null)
    return new Promise((resolve, reject) => {
      this.$axios
        .put(`/yam-five/reset-record/${state.userDetailsFirebase.id_doc}`, {})
        .then(() => {
          trace(false, null, null, log)
          dispatch('dataFirebaseInit')
            .then(() => {
              resolve()
            })
            .catch((error) => {
              reject(error.response.data.message)
            })
        })
        .catch((error) => {
          trace(false, null, null, log)
          dispatch('logErrors', {
            message:
              'ACTION-FIREBASE resetRecordUser: ' + JSON.stringify(error),
            type: 'firebase_store',
          })
          reject(error.response.data.message)
        })
    })
  },
  reportAIssueList({ commit, dispatch, rootState }) {
    logger('ACTION-FIREBASE reportAIssueList', null, 'i')
    const log = trace(true, rootState.performance, 'REPORTISSUELIST', null)
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`/yam-five/report-issue`)
        .then((resp) => {
          trace(false, null, null, log)
          commit('setReportIssueList', resp.data)
          resolve()
        })
        .catch((error) => {
          trace(false, null, null, log)
          dispatch('logErrors', {
            message:
              'ACTION-FIREBASE reportAIssueList: ' + JSON.stringify(error),
            type: 'firebase_store',
          })
          reject(error.response.data.message)
        })
    })
  },
  reportAIssue({ state, dispatch, rootState }, data) {
    logger('ACTION-FIREBASE reportAIssue', data, 'i')
    const log = trace(true, rootState.performance, 'REPORTISSUE', null)
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`/yam-five/report-issue/${state.userDetailsFirebase.uid}`, data)
        .then(() => {
          trace(false, null, null, log)
          resolve()
        })
        .catch((error) => {
          trace(false, null, null, log)
          dispatch('logErrors', {
            message: 'ACTION-FIREBASE reportAIssue: ' + JSON.stringify(error),
            type: 'firebase_store',
          })
          reject(error.response.data.message)
        })
    })
  },
  logErrors({ rootState }, data) {
    logger('ACTION-FIREBASE logErrors', data, 'i')
    const log = trace(true, rootState.performance, 'ERRORS', null)
    this.$axios
      .post(`/yam-five/errors`, data)
      .then(() => {
        trace(false, null, null, log)
      })
      .catch(() => {
        trace(false, null, null, log)
      })
  },
  dataFirebaseInit({ commit, dispatch, state, rootState }, id) {
    logger('ACTION-FIREBASE dataFirebaseInit', id, 'i')
    const log = trace(true, rootState.performance, 'UPDATEALL', null)
    return new Promise((resolve, reject) => {
      const value = id || state.userDetailsFirebase.id_doc
      const check = !!id
      dispatch('getDetailsUser', { value, check })
        .then(() => {
          trace(false, null, null, log)
          dispatch('getChampions')
          resolve()
        })
        .catch((error) => {
          trace(false, null, null, log)
          dispatch('logErrors', {
            message:
              'ACTION-FIREBASE dataFirebaseInit: ' + JSON.stringify(error),
            type: 'firebase_store',
          })
          reject(error.response.data.message)
        })
    })
  },
}
