import { fetchAndActivate } from 'firebase/remote-config'
import { logger, trace, isNowBetweenDate } from '~/utils'
import { modelResetUser, modelResetCampaign, modelUser } from '~/lists'

const data = require('../../lists/campaign.json')

const root = '/yam-five'

const compare = (a, b) => {
  if (a.tot > b.tot) return -1
  if (b.tot > a.tot) return 1
  return 0
}

const sort = (data, type) => {
  const tmp = []
  data.map((v) => {
    // TODO decommentare quando funziona la parte di campagne
    // if (v.uid !== process.env.NUXT_ENV_USER_HIDE) {
    v.tot = type ? (v[type] ? v[type] : 0) : 0
    tmp.push(v)
    // }
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
  modelUser,
  modelResetUser,
  modelResetCampaign,
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
        .post(`${root}/logout`)
        .then(() => {
          commit('reset')
          resolve()
        })
        .catch((error) => {
          dispatch('logErrors', {
            message: 'ACTION-FIREBASE logout: ' + JSON.stringify(error),
            type: 'firebase_store',
          })
          reject(error.response.data)
        })
    })
  },
  login({ commit, dispatch, rootState }, data) {
    logger('ACTION-FIREBASE login', data, 'i')
    const log = trace(true, rootState.performance, 'LOGIN', null)
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`${root}/login`, data)
        .then((resp) => {
          trace(false, null, null, log)
          // const user = resp.data.user
          commit('setUserFirebase', resp.data.user)
          console.log(rootState.activeRemoveConfig)
          dispatch('dataFirebaseInit', resp.data.user.uid)
            .then((r) => {
              dispatch('getCampaigns', r)
                .then(() => {
                  resolve()
                })
                .catch((error) => {
                  reject(error.response.data)
                })
            })
            .catch((error) => {
              reject(error.response.data)
            })
        })
        .catch((error) => {
          trace(false, null, null, log)
          dispatch('logErrors', {
            message: 'ACTION-FIREBASE login: ' + JSON.stringify(error),
            type: 'firebase_store',
          })
          reject(error.response.data)
        })
    })
  },
  recovery({ commit, dispatch, rootState }, data) {
    logger('ACTION-FIREBASE recovery', data, 'i')
    const log = trace(true, rootState.performance, 'RECOVERY', null)
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`${root}/user-recovery-email`, data)
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
          reject(error.response.data)
        })
    })
  },
  getDetailsUser({ commit, dispatch, rootState }, data) {
    logger('ACTION-FIREBASE getDetailsUser', data, 'i')
    const log = trace(true, rootState.performance, 'GETDETAILSUSER', null)
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`${root}/user/${data.value}/?check=${data.check}`)
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
          reject(error.response.data)
        })
    })
  },
  getChampions({ commit, dispatch, rootState }) {
    logger('ACTION-FIREBASE getChampions', null, 'i')
    const log = trace(true, rootState.performance, 'GETCHAMPIONS', null)
    this.$axios
      .get(`${root}/user`)
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
  registration({ dispatch, state, rootState }, data) {
    logger('ACTION-FIREBASE registration', data, 'i')
    const log = trace(true, rootState.performance, 'REGISTRATION', null)
    return new Promise((resolve, reject) => {
      const body = Object.assign({}, state.modelUser, {
        name: data.name,
      })
      this.$axios
        .post(`${root}/user`, body)
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
          reject(error.response.data)
        })
    })
  },
  updateRecordUser({ dispatch, commit, state, rootState }, data) {
    logger('ACTION-FIREBASE updateRecordUser', data, 'i')
    const log = trace(true, rootState.performance, 'UPDATERECORDUSER', null)
    return new Promise((resolve, reject) => {
      const body = {}
      body.match = data.details.user.match + 1
      switch (data.details.type) {
        case 'short':
          if (state.userDetailsFirebase.score_short < data.details.tot) {
            body.score_short = data.details.tot
            body.score_short_record_chart_1 = JSON.stringify(data.chart_1)
            body.score_short_record_chart_2 = JSON.stringify(data.chart_2)
          }
          if (rootState.game.campaignActive) {
            if (
              state.userDetailsFirebase.campaign_score_short < data.details.tot
            ) {
              body.campaign_score_short = data.details.tot
              body.campaign_score_short_record_chart_1 = JSON.stringify(
                data.chart_1
              )
              body.campaign_score_short_record_chart_2 = JSON.stringify(
                data.chart_2
              )
            }
          }
          break
        case 'veryshort':
          if (state.userDetailsFirebase.score_veryshort < data.details.tot) {
            body.score_veryshort = data.details.tot
            body.score_veryshort_record_chart_1 = JSON.stringify(data.chart_1)
            body.score_veryshort_record_chart_2 = JSON.stringify(data.chart_2)
          }
          if (rootState.game.campaignActive) {
            if (
              state.userDetailsFirebase.campaign_score_veryshort <
              data.details.tot
            ) {
              body.campaign_score_veryshort = data.details.tot
              body.campaign_score_veryshort_record_chart_1 = JSON.stringify(
                data.chart_1
              )
              body.campaign_score_veryshort_record_chart_2 = JSON.stringify(
                data.chart_2
              )
            }
          }
          break
        default:
          if (state.userDetailsFirebase.score < data.details.tot) {
            body.score = data.details.tot
            body.score_record_chart_1 = JSON.stringify(data.chart_1)
            body.score_record_chart_2 = JSON.stringify(data.chart_2)
          }
          if (rootState.game.campaignActive) {
            if (state.userDetailsFirebase.campaign_score < data.details.tot) {
              body.campaign_score = data.details.tot
              body.campaign_score_record_chart_1 = JSON.stringify(data.chart_1)
              body.campaign_score_record_chart_2 = JSON.stringify(data.chart_2)
            }
          }
      }
      this.$axios
        .put(`${root}/user/${data.details.user.id_doc}`, body)
        .then(() => {
          trace(false, null, null, log)
          dispatch('dataFirebaseInit')
            .then(() => {
              resolve()
            })
            .catch((error) => {
              reject(error.response.data)
            })
        })
        .catch((error) => {
          trace(false, null, null, log)
          dispatch('logErrors', {
            message:
              'ACTION-FIREBASE updateRecordUser: ' + JSON.stringify(error),
            type: 'firebase_store',
          })
          reject(error.response.data)
        })
    })
  },
  resetRecordUser({ dispatch, state, rootState }) {
    logger('ACTION-FIREBASE resetRecordUser', null, 'i')
    const log = trace(true, rootState.performance, 'RESETRECORDUSER', null)
    return new Promise((resolve, reject) => {
      this.$axios
        .put(
          `${root}/reset-record/${state.userDetailsFirebase.id_doc}`,
          state.modelResetUser
        )
        .then(() => {
          trace(false, null, null, log)
          dispatch('dataFirebaseInit')
            .then(() => {
              resolve()
            })
            .catch((error) => {
              reject(error.response.data)
            })
        })
        .catch((error) => {
          trace(false, null, null, log)
          dispatch('logErrors', {
            message:
              'ACTION-FIREBASE resetRecordUser: ' + JSON.stringify(error),
            type: 'firebase_store',
          })
          reject(error.response.data)
        })
    })
  },
  getCampaigns({ commit, dispatch, rootState }, user) {
    logger('ACTION-FIREBASE getCampaigns', user, 'i')
    const log = trace(true, rootState.performance, 'GETCAMPAIGNS', null)
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`${root}/campaigns`)
        .then((resp) => {
          trace(false, null, null, log)
          // TODO da decommentare per usare le remoteConfig
          /* const cmps = JSON.parse(
            rootState.activeRemoveConfig.campaigns._value
          ).items */
          const cmps = data.items
          const activeCampaigns = cmps.filter((c) =>
            isNowBetweenDate(c.start, c.end)
          )
          // TODO il ragionamento non può funzionare perchè si vedrebbe la classifica della campagna mai aggiornata correttamente
          // TODO bisogna resettare tutti gli utenti al primo accesso di uno user
          console.log(resp.data, activeCampaigns, user)
          commit('game/setCurrentCampaign', activeCampaigns, { root: true })
          if (activeCampaigns.length > 0) {
            // Active campaign
            if (user.active_campaign !== activeCampaigns[0].id) {
              if (resp.data.length === 0 && activeCampaigns.length > 0) {
                // Non esiste nessuna campagna quindi salvo e resetto
                dispatch('saveCampaign', activeCampaigns[0]).then(() => {
                  dispatch('resetCampaign', activeCampaigns[0].id).then(() => {
                    resolve()
                  })
                })
              } else if (
                activeCampaigns.length > 0 &&
                resp.data.length > 0 &&
                resp.data[0].id !== activeCampaigns[0].id
              ) {
                // esiste una campagna ma è diversa da quella attiva aggiorno salvo e resetto
                dispatch('updateCampaign', resp.data[0]).then(() => {
                  dispatch('saveCampaign', activeCampaigns[0]).then(() => {
                    dispatch('resetCampaign', activeCampaigns[0].id).then(
                      () => {
                        resolve()
                      }
                    )
                  })
                })
              } else if (resp.data.length > 0 && activeCampaigns.length === 0) {
                // esiste una campagna ma nessuna è attiva quindi aggiorno e resetto
                dispatch('updateCampaign', resp.data[0]).then(() => {
                  dispatch('resetCampaign', activeCampaigns[0].id).then(() => {
                    resolve()
                  })
                })
              } else {
                // se esiste una campagna ma è diversa da quella che ho attiva io
                dispatch('resetCampaign', activeCampaigns[0].id).then(() => {
                  resolve()
                })
              }
            } else {
              resolve()
            }
          } else {
            resolve()
          }
        })
        .catch((error) => {
          trace(false, null, null, log)
          dispatch('logErrors', {
            message: 'ACTION-FIREBASE getCampaigns: ' + JSON.stringify(error),
            type: 'firebase_store',
          })
          reject(error.response.data)
        })
    })
  },
  saveCampaign({ dispatch, rootState }, data) {
    logger('ACTION-FIREBASE saveCampaign', data, 'i')
    const log = trace(true, rootState.performance, 'SAVECAMPAIGN', null)
    return new Promise((resolve, reject) => {
      console.log(data)
      this.$axios
        .post(`${root}/campaign`, {
          id: data.id,
          name: data.name,
          active: true,
          data_save: false,
          winner_is: '',
        })
        .then(() => {
          trace(false, null, null, log)
          resolve()
        })
        .catch((error) => {
          trace(false, null, null, log)
          dispatch('logErrors', {
            message: 'ACTION-FIREBASE saveCampaign: ' + JSON.stringify(error),
            type: 'firebase_store',
          })
          reject(error.response.data)
        })
    })
  },
  updateCampaign({ dispatch, rootState, getters }, data) {
    logger('ACTION-FIREBASE updateCampaign', data, 'i')
    const log = trace(true, rootState.performance, 'UPDATECAMPAIGN', null)
    const campaign =
      getters.getTypeChampions('campaign_score')[0].tot > 0
        ? getters.getTypeChampions('campaign_score')[0]
        : ''
    const campaignShort =
      getters.getTypeChampions('campaign_score_short')[0].tot > 0
        ? getters.getTypeChampions('campaign_score_short')[0]
        : ''
    const campaignVeryshort =
      getters.getTypeChampions('campaign_score_veryshort')[0].tot > 0
        ? getters.getTypeChampions('campaign_score_veryshort')[0]
        : ''
    return new Promise((resolve, reject) => {
      console.log(campaign, campaignShort, campaignVeryshort)
      this.$axios
        .put(`${root}/campaign/${data.id_doc}`, {
          active: false,
          data_save: true,
          winner_is: {
            campaign_veryshort: campaignVeryshort.uid,
            campaign_short: campaignShort.uid,
            campaign: campaign.uid,
          },
        })
        .then(() => {
          trace(false, null, null, log)
          if (campaign !== '') {
            dispatch('updateWinnerCampaign', {
              id_doc: campaign.id_doc,
              type: 'campaigns',
            })
          }
          if (campaignShort !== '') {
            dispatch('updateWinnerCampaign', {
              id_doc: campaignShort.id_doc,
              type: 'campaigns_short',
            })
          }
          if (campaignVeryshort !== '') {
            dispatch('updateWinnerCampaign', {
              id_doc: campaignVeryshort.id_doc,
              type: 'campaigns_veryshort',
            })
          }
          resolve()
        })
        .catch((error) => {
          trace(false, null, null, log)
          dispatch('logErrors', {
            message: 'ACTION-FIREBASE updateCampaign: ' + JSON.stringify(error),
            type: 'firebase_store',
          })
          reject(error.response.data)
        })
    })
  },
  updateWinnerCampaign({ dispatch, state, rootState }, data) {
    logger('ACTION-FIREBASE updateWinnerCampaign', data, 'i')
    const log = trace(true, rootState.performance, 'UPDATEUSERCAMPAIGN', null)
    return new Promise((resolve, reject) => {
      console.log(state.userDetailsFirebase)
      const body = {}
      body[data.type] = state.userDetailsFirebase[data.type] + 1
      console.log(body)
      this.$axios
        .put(`${root}/user/${data.id_doc}`, body)
        .then(() => {
          trace(false, null, null, log)
          resolve()
        })
        .catch((error) => {
          trace(false, null, null, log)
          dispatch('logErrors', {
            message:
              'ACTION-FIREBASE updateWinnerCampaign: ' + JSON.stringify(error),
            type: 'firebase_store',
          })
          reject(error.response.data)
        })
    })
  },
  resetCampaign({ dispatch, state, rootState }, campaign) {
    logger('ACTION-FIREBASE resetCampaign', campaign, 'i')
    const log = trace(true, rootState.performance, 'RESETCAMPAIGN', null)
    return new Promise((resolve, reject) => {
      const body = Object.assign({}, state.modelResetCampaign, {
        active_campaign: campaign,
      })
      console.log(body)
      this.$axios
        .put(`${root}/reset-campaign`, body)
        .then(() => {
          trace(false, null, null, log)
          dispatch('getChampions')
            .then(() => {
              resolve()
            })
            .catch((error) => {
              reject(error.response.data)
            })
        })
        .catch((error) => {
          trace(false, null, null, log)
          dispatch('logErrors', {
            message: 'ACTION-FIREBASE resetCampaign: ' + JSON.stringify(error),
            type: 'firebase_store',
          })
          reject(error.response.data)
        })
    })
  },
  reportAIssueList({ commit, dispatch, rootState }) {
    logger('ACTION-FIREBASE reportAIssueList', null, 'i')
    const log = trace(true, rootState.performance, 'REPORTISSUELIST', null)
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`${root}/report-issue`)
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
          reject(error.response.data)
        })
    })
  },
  reportAIssue({ state, dispatch, rootState }, data) {
    logger('ACTION-FIREBASE reportAIssue', data, 'i')
    const log = trace(true, rootState.performance, 'REPORTISSUE', null)
    return new Promise((resolve, reject) => {
      const body = Object.assign({}, data, {
        date_close: null,
        status: 'open', // open, close, in progress
        priority: 'low', // low, medium, high
      })
      this.$axios
        .post(`${root}/report-issue/${state.userDetailsFirebase.uid}`, body)
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
          reject(error.response.data)
        })
    })
  },
  logErrors({ rootState }, data) {
    logger('ACTION-FIREBASE logErrors', data, 'i')
    const log = trace(true, rootState.performance, 'ERRORS', null)
    this.$axios
      .post(`${root}/errors`, data)
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
        .then((resp) => {
          trace(false, null, null, log)
          dispatch('getChampions')
            .then(() => {
              resolve(resp)
            })
            .catch((error) => {
              reject(error.response.data)
            })
        })
        .catch((error) => {
          trace(false, null, null, log)
          dispatch('logErrors', {
            message:
              'ACTION-FIREBASE dataFirebaseInit: ' + JSON.stringify(error),
            type: 'firebase_store',
          })
          reject(error.response.data)
        })
    })
  },
  getRemoteConfigFirebase({ commit, dispatch, rootState }, remoteConfig) {
    logger('ACTION-FIREBASE getRemoteConfigFirebase', null, 'i')
    const log = trace(true, rootState.performance, 'GETREMOTECONFIG', null)
    return new Promise((resolve, reject) => {
      // TODO verificare questo controllo
      if (!remoteConfig._isInitializationComplete) {
        fetchAndActivate(remoteConfig)
          .then(() => {
            trace(false, null, null, log)
            commit('setRemoteConfig', remoteConfig, { root: true })
            resolve()
          })
          .catch((error) => {
            trace(false, null, null, log)
            dispatch('logErrors', {
              message:
                'ACTION-FIREBASE getRemoteConfigFirebase: ' +
                JSON.stringify(error),
              type: 'firebase_store',
            })
            reject(error)
          })
      } else {
        trace(false, null, null, log)
        commit('setRemoteConfig', remoteConfig, { root: true })
        resolve()
      }
    })
  },
}
