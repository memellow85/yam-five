import { initializeApp } from 'firebase/app'
import {
  signInWithEmailAndPassword,
  getAuth,
  setPersistence,
  browserSessionPersistence,
  signOut,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth'
import {
  getDoc,
  doc,
  getFirestore,
  query,
  collection,
  where,
  getDocs,
  Timestamp,
  addDoc,
  updateDoc,
  orderBy,
} from 'firebase/firestore'
import { getPerformance } from 'firebase/performance'
import { IncomingWebhook } from '@slack/webhook'
import { fetchAndActivate, getAll } from 'firebase/remote-config'
import cloneDeep from 'lodash/cloneDeep'
import {
  logger,
  tracePerformance,
  isNowBetweenDate,
  getLocalStorageKey,
  setLocalStorageKey,
} from '~/utils'
import { modelResetUser, modelResetCampaign, modelUser } from '~/lists'
import {
  config,
  WEBHOOK_URL,
  CONFIGURATION_DETAILS,
  USER_DETAILS,
  CAMPAIGN_DETAILS,
  ERROR_DETAILS,
  ISSUE_DETAILS,
} from '~/lists/firebase'

const app = initializeApp(config)
const auth = getAuth(app)
const db = getFirestore(app)

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const compare = (a, b) => {
  if (a.tot > b.tot) return -1
  if (b.tot > a.tot) return 1
  return 0
}

const sort = (data, type) => {
  const tmp = []
  const campaignType =
    type.split('_').length > 0 ? `campaigns_${type.split('_')[1]}` : 'campaigns'
  data.map((v) => {
    if (v.uid !== process.env.NUXT_ENV_USER_HIDE) {
      v.tot = type ? (v[type] ? v[type] : 0) : 0
      v.tot_campaigns = type ? (v[campaignType] ? v[campaignType] : 0) : 0
      tmp.push(v)
    }
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
  performance: cloneDeep(getPerformance(app)),
  analytics: null,
  authFirebase: null,
  databaseFirebase: null,
  activeRemoveConfig: null,
  webhook: new IncomingWebhook(WEBHOOK_URL),
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
    logger('COMMIT-FIREBASE setReportIssueList', data, 'i')
    state.issueList = data || []
  },
  reset(state) {
    logger('COMMIT-FIREBASE reset', null, 'i')
    state.userFirebase = null
    state.userDetailsFirebase = null
    state.usersChampions = []
    state.issueList = []
  },
  setAuth(state, value) {
    logger('COMMIT-FIREBASE setAuth', value, 'i')
    state.authFirebase = value
  },
  setAnalytics(state, value) {
    logger('COMMIT-FIREBASE setAnalytics', value, 'i')
    state.analytics = value
  },
  setDatabase(state, value) {
    logger('COMMIT-FIREBASE setDatabase', value, 'i')
    state.databaseFirebase = cloneDeep(value)
  },
  setRemoteConfig(state, config) {
    logger('COMMIT-FIREBASE setRemoteConfig', config, 'i')
    state.activeRemoveConfig = getAll(config)
  },
  logSlack(state, data) {
    logger('COMMIT-FIREBASE logSlack', data, 'i')
    state.webhook.send({
      channel: '#yamfive',
      text: `Error ${data.name}: ${JSON.stringify(data.err)}`,
    })
  },
}

/**
 * Actions
 */
export const actions = {
  logout({ commit, dispatch, state }) {
    logger('ACTION-FIREBASE logout', null, 'i')
    return new Promise((resolve, reject) => {
      signOut(auth)
        .then(() => {
          dispatch('ws/logoutUser', state.userDetailsFirebase.uid, {
            root: true,
          })
          commit('reset')
          resolve()
        })
        .catch((error) => {
          commit('logSlack', { name: 'fn: logout | call: signOut', err: error })
          reject(error)
        })
    })
  },
  login({ commit, dispatch, state }, data) {
    logger('ACTION-FIREBASE login', data, 'i')
    const log = tracePerformance(true, state.performance, 'LOGIN', null)
    return new Promise((resolve, reject) => {
      setPersistence(auth, browserSessionPersistence)
        .then(() => {
          signInWithEmailAndPassword(auth, data.email, data.password)
            .then((data) => {
              const userLogin = data.user
              tracePerformance(false, null, null, log)
              const docRef = doc(db, CONFIGURATION_DETAILS, 'version')
              getDoc(docRef)
                .then((version) => {
                  const activeVersion = version.data().number
                  if (
                    getLocalStorageKey('version') &&
                    getLocalStorageKey('version') !== '' &&
                    getLocalStorageKey('version') !== activeVersion
                  ) {
                    resolve({
                      type: 'change_version',
                      version: activeVersion,
                    })
                  } else {
                    setLocalStorageKey('version', activeVersion)
                    commit('setUserFirebase', userLogin)
                    dispatch('dataFirebaseInit', userLogin.uid).then((r) => {
                      dispatch('getCampaigns', r).then(() => {
                        resolve()
                      })
                    })
                  }
                })
                .catch((error) => {
                  commit('logSlack', {
                    name: 'fn: login | call: getDoc',
                    err: error,
                  })
                  reject(error)
                })
            })
            .catch((error) => {
              tracePerformance(false, null, null, log)
              commit('logSlack', {
                name: 'fn: login | call: signInWithEmailAndPassword',
                err: error,
              })
              reject(error)
            })
        })
        .catch((error) => {
          tracePerformance(false, null, null, log)
          commit('logSlack', {
            name: 'fn: login | call: setPersistence',
            err: error,
          })
          reject(error)
        })
    })
  },
  recovery({ commit, state }, data) {
    logger('ACTION-FIREBASE recovery', data, 'i')
    const log = tracePerformance(true, state.performance, 'RECOVERY', null)
    return new Promise((resolve, reject) => {
      sendPasswordResetEmail(auth, data.recovery)
        .then(() => {
          tracePerformance(false, null, null, log)
          resolve()
        })
        .catch((error) => {
          tracePerformance(false, null, null, log)
          commit('logSlack', {
            name: 'fn: recovery | call: sendPasswordResetEmail',
            err: error,
          })
          reject(error)
        })
    })
  },
  getDetailsUser({ commit, state }, data) {
    logger('ACTION-FIREBASE getDetailsUser', data, 'i')
    const log = tracePerformance(
      true,
      state.performance,
      'GETDETAILSUSER',
      null
    )
    return new Promise((resolve, reject) => {
      if (data.check) {
        const queryRef = query(
          collection(db, USER_DETAILS),
          where('uid', '==', data.value)
        )
        getDocs(queryRef)
          .then((docs) => {
            tracePerformance(false, null, null, log)
            docs.forEach((doc) => {
              commit('setUserDetailsFirebase', doc.data())
              resolve(doc.data())
            })
          })
          .catch((error) => {
            tracePerformance(false, null, null, log)
            commit('logSlack', {
              name: `fn: getDetailsUser | call: getDocs | data: uid=${data.value}, check=true`,
              err: error,
            })
            reject(error)
          })
      } else {
        const docRef = doc(db, USER_DETAILS, data.value)
        getDoc(docRef)
          .then((doc) => {
            tracePerformance(false, null, null, log)
            commit('setUserDetailsFirebase', doc.data())
            resolve(doc.data())
          })
          .catch((error) => {
            tracePerformance(false, null, null, log)
            commit('logSlack', {
              name: `fn: getDetailsUser | call: getDoc | data: uid=${data.value}, check=false`,
              err: error,
            })
            reject(error)
          })
      }
    })
  },
  getChampions({ commit, state }) {
    logger('ACTION-FIREBASE getChampions', null, 'i')
    const log = tracePerformance(true, state.performance, 'GETCHAMPIONS', null)
    return new Promise((resolve, reject) => {
      const collectionRef = collection(db, USER_DETAILS)
      getDocs(collectionRef)
        .then((docs) => {
          const list = []
          docs.forEach((doc) => {
            list.push(doc.data())
          })
          tracePerformance(false, null, null, log)
          commit('setChampions', list)
          resolve()
        })
        .catch((error) => {
          tracePerformance(false, null, null, log)
          commit('logSlack', {
            name: `fn: getChampions | call: getDocs`,
            err: error,
          })
          reject(error)
        })
    })
  },
  registration({ dispatch, commit, state }, data) {
    logger('ACTION-FIREBASE registration', data, 'i')
    const log = tracePerformance(true, state.performance, 'REGISTRATION', null)
    return new Promise((resolve, reject) => {
      const model = Object.assign({}, state.modelUser, {
        name: data.name,
      })
      createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
          console.log('1', userCredential)
          console.log('2', auth.currentUser)
          const user = auth.currentUser
          sendEmailVerification(user)
          const data = Object.assign(
            {},
            {
              uid: user.uid,
              last_updated: Timestamp.now(),
              last_reset: Timestamp.now(),
            },
            model
          )
          const collectionRef = collection(db, USER_DETAILS)
          addDoc(collectionRef, data)
            .then((docUser) => {
              const docRef = doc(db, USER_DETAILS, docUser.id)
              updateDoc(docRef, {
                id_doc: docUser.id,
              })
                .then(() => {
                  tracePerformance(false, null, null, log)
                  resolve()
                })
                .catch((error) => {
                  tracePerformance(false, null, null, log)
                  commit('logSlack', {
                    name: `fn: registration | call: updateDoc`,
                    err: error,
                  })
                  reject(error)
                })
            })
            .catch((error) => {
              tracePerformance(false, null, null, log)
              commit('logSlack', {
                name: `fn: registration | call: addDoc`,
                err: error,
              })
              reject(error)
            })
        })
        .catch((error) => {
          tracePerformance(false, null, null, log)
          commit('logSlack', {
            name: `fn: registration | call: createUserWithEmailAndPassword`,
            err: error,
          })
          reject(error)
        })
    })
  },
  updateRecordUser({ dispatch, commit, state, rootState }, data) {
    logger('ACTION-FIREBASE updateRecordUser', data, 'i')
    const log = tracePerformance(
      true,
      state.performance,
      'UPDATERECORDUSER',
      null
    )
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
      const dataUpdate = Object.assign(
        {},
        {
          last_updated: Timestamp.now(),
        },
        body
      )
      const docRef = doc(db, USER_DETAILS, data.details.user.id_doc)
      getDoc(docRef)
        .then(() => {
          updateDoc(docRef, dataUpdate)
            .then(() => {
              tracePerformance(false, null, null, log)
              dispatch('dataFirebaseInit').then(() => {
                resolve()
              })
            })
            .catch((error) => {
              tracePerformance(false, null, null, log)
              commit('logSlack', {
                name: `fn: updateRecordUser | call: updateDoc | data: idDoc=${data.details.user.id_doc}`,
                err: error,
              })
              reject(error)
            })
        })
        .catch((error) => {
          tracePerformance(false, null, null, log)
          commit('logSlack', {
            name: `fn: updateRecordUser | call: getDoc | data: idDoc=${data.details.user.id_doc}`,
            err: error,
          })
          reject(error)
        })
    })
  },
  updateUser({ commit, state }, idCampaign) {
    logger('ACTION-FIREBASE updateUser', null, 'i')
    const log = tracePerformance(true, state.performance, 'UPDATEUSER', null)
    return new Promise((resolve, reject) => {
      const data = Object.assign(
        {},
        {
          last_updated: Timestamp.now(),
        },
        {
          active_campaign: idCampaign,
        }
      )
      const docRef = doc(db, USER_DETAILS, state.userDetailsFirebase.id_doc)
      getDoc(docRef)
        .then(() => {
          updateDoc(docRef, data)
            .then(() => {
              tracePerformance(false, null, null, log)
              resolve()
            })
            .catch((error) => {
              tracePerformance(false, null, null, log)
              commit('logSlack', {
                name: `fn: updateUser | call: updateDoc | data: idDoc=${state.userDetailsFirebase.id_doc}`,
                err: error,
              })
              reject(error)
            })
        })
        .catch((error) => {
          tracePerformance(false, null, null, log)
          commit('logSlack', {
            name: `fn: updateUser | call: getDoc | data: idDoc=${state.userDetailsFirebase.id_doc}`,
            err: error,
          })
          reject(error)
        })
    })
  },
  resetRecordUser({ dispatch, commit, state }) {
    logger('ACTION-FIREBASE resetRecordUser', null, 'i')
    const log = tracePerformance(
      true,
      state.performance,
      'RESETRECORDUSER',
      null
    )
    return new Promise((resolve, reject) => {
      const data = Object.assign(
        {},
        {
          last_reset: Timestamp.now(),
        },
        state.modelResetUser
      )
      const docRef = doc(db, USER_DETAILS, state.userDetailsFirebase.id_doc)
      updateDoc(docRef, data)
        .then(() => {
          tracePerformance(false, null, null, log)
          dispatch('dataFirebaseInit').then(() => {
            resolve()
          })
        })
        .catch((error) => {
          tracePerformance(false, null, null, log)
          commit('logSlack', {
            name: `fn: resetRecordUser | call: updateDoc | data: idDoc=${state.userDetailsFirebase.id_doc}`,
            err: error,
          })
          reject(error)
        })
    })
  },
  getCampaigns({ commit, dispatch, state }, user) {
    logger('ACTION-FIREBASE getCampaigns', user, 'i')
    const log = tracePerformance(true, state.performance, 'GETCAMPAIGNS', null)
    return new Promise((resolve, reject) => {
      const queryRef = query(
        collection(db, CAMPAIGN_DETAILS),
        where('active', '==', true)
      )
      getDocs(queryRef)
        .then((docs) => {
          tracePerformance(false, null, null, log)
          const list = []
          docs.forEach((doc) => {
            list.push(doc.data())
          })

          const cmps = JSON.parse(
            state.activeRemoveConfig.campaigns._value
          ).items

          const activeCampaigns = cmps.filter((c) => {
            return isNowBetweenDate(c.start, c.end)
          })
          commit('game/setCurrentCampaign', activeCampaigns, { root: true })

          // primo accesso utente nuovo campagna attiva
          if (activeCampaigns.length > 0) {
            if (
              user.active_campaign === 0 &&
              user.match === 0 &&
              user.active_campaign !== activeCampaigns[0].id
            ) {
              // primo accesso utente nuovo
              dispatch('updateUser', activeCampaigns[0].id).then(() => {
                resolve()
              })
            } else if (user.active_campaign !== activeCampaigns[0].id) {
              // Active campaign
              if (list.length === 0) {
                // Non esiste nessuna campagna quindi salvo e resetto
                dispatch('saveCampaign', activeCampaigns[0]).then(() => {
                  dispatch('resetCampaign', activeCampaigns[0].id).then(() => {
                    resolve()
                  })
                })
              } else if (
                list.length > 0 &&
                list[0].id !== activeCampaigns[0].id
              ) {
                // esiste una campagna ma è diversa da quella attiva aggiorno salvo e resetto
                dispatch('updateCampaign', list[0]).then(() => {
                  dispatch('saveCampaign', activeCampaigns[0]).then(() => {
                    dispatch('resetCampaign', activeCampaigns[0].id).then(
                      () => {
                        resolve()
                      }
                    )
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
          } else if (list.length > 0) {
            // Non esiste realmente una campagna attiva e quindi devo azzerare quella finita
            dispatch('updateCampaign', list[0]).then(() => {
              dispatch('resetCampaign', null).then(() => {
                resolve()
              })
            })
          } else {
            resolve()
          }
        })
        .catch((error) => {
          tracePerformance(false, null, null, log)
          commit('logSlack', {
            name: `fn: getCampaigns | call: getDocs`,
            err: error,
          })
          reject(error)
        })
    })
  },
  saveCampaign({ commit, state }, data) {
    logger('ACTION-FIREBASE saveCampaign', data, 'i')
    const log = tracePerformance(true, state.performance, 'SAVECAMPAIGN', null)
    return new Promise((resolve, reject) => {
      const collectionRef = collection(db, CAMPAIGN_DETAILS)
      addDoc(collectionRef, {
        id: data.id,
        name: data.name,
        active: true,
        data_save: false,
        winner_is: '',
      })
        .then((docCampaign) => {
          const docRef = doc(db, CAMPAIGN_DETAILS, docCampaign.id)
          updateDoc(docRef, {
            id_doc: docCampaign.id,
          })
            .then(() => {
              tracePerformance(false, null, null, log)
              resolve()
            })
            .catch((error) => {
              tracePerformance(false, null, null, log)
              commit('logSlack', {
                name: `fn: saveCampaign | call: updateDoc`,
                err: error,
              })
              reject(error)
            })
        })
        .catch((error) => {
          tracePerformance(false, null, null, log)
          commit('logSlack', {
            name: `fn: saveCampaign | call: addDoc`,
            err: error,
          })
          reject(error)
        })
    })
  },
  updateCampaign({ dispatch, commit, getters, state }, data) {
    logger('ACTION-FIREBASE updateCampaign', data, 'i')
    const log = tracePerformance(
      true,
      state.performance,
      'UPDATECAMPAIGN',
      null
    )
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
      const docRef = doc(db, CAMPAIGN_DETAILS, data.id_doc)
      updateDoc(docRef, {
        active: false,
        data_save: true,
        winner_is: {
          campaign_veryshort: campaignVeryshort.uid,
          campaign_short: campaignShort.uid,
          campaign: campaign.uid,
        },
      })
        .then(() => {
          tracePerformance(false, null, null, log)
          if (campaign !== '') {
            dispatch('updateWinnerCampaign', {
              id_doc: campaign.id_doc,
              type: 'campaigns',
            }).then(() => {
              resolve()
            })
          } else if (campaignShort !== '') {
            dispatch('updateWinnerCampaign', {
              id_doc: campaignShort.id_doc,
              type: 'campaigns_short',
            }).then(() => {
              resolve()
            })
          } else if (campaignVeryshort !== '') {
            dispatch('updateWinnerCampaign', {
              id_doc: campaignVeryshort.id_doc,
              type: 'campaigns_veryshort',
            }).then(() => {
              resolve()
            })
          } else {
            resolve()
          }
        })
        .catch((error) => {
          tracePerformance(false, null, null, log)
          commit('logSlack', {
            name: `fn: updateCampaign | call: updateDoc | data: idDoc=${data.id_doc}`,
            err: error,
          })
          reject(error)
        })
    })
  },
  updateWinnerCampaign({ dispatch, commit, state }, data) {
    logger('ACTION-FIREBASE updateWinnerCampaign', data, 'i')
    const log = tracePerformance(
      true,
      state.performance,
      'UPDATEUSERCAMPAIGN',
      null
    )
    return new Promise((resolve, reject) => {
      const body = {}
      body[data.type] = state.userDetailsFirebase[data.type] + 1
      const dataUpdate = Object.assign(
        {},
        {
          last_updated: Timestamp.now(),
        },
        body
      )
      const docRef = doc(db, USER_DETAILS, data.id_doc)
      getDoc(docRef)
        .then(() => {
          updateDoc(docRef, dataUpdate)
            .then(() => {
              tracePerformance(false, null, null, log)
              resolve()
            })
            .catch((error) => {
              tracePerformance(false, null, null, log)
              commit('logSlack', {
                name: `fn: updateWinnerCampaign | call: updateDoc | data: idDoc=${data.id_doc}`,
                err: error,
              })
              reject(error)
            })
        })
        .catch((error) => {
          tracePerformance(false, null, null, log)
          commit('logSlack', {
            name: `fn: updateWinnerCampaign | call: getDoc | data: idDoc=${data.id_doc}`,
            err: error,
          })
          reject(error)
        })
    })
  },
  resetCampaign({ dispatch, commit, state }, campaign) {
    logger('ACTION-FIREBASE resetCampaign', campaign, 'i')
    const log = tracePerformance(true, state.performance, 'RESETCAMPAIGN', null)
    return new Promise((resolve, reject) => {
      const body = Object.assign(
        {},
        state.modelResetCampaign,
        campaign
          ? {
              active_campaign: campaign,
            }
          : {}
      )
      const collectionRef = collection(db, USER_DETAILS)
      getDocs(collectionRef)
        .then((data) => {
          const users = []
          data.forEach((d) => {
            users.push(d.data())
          })
          const updateUsers = async (users) => {
            await asyncForEach(users, async (user) => {
              const docRef = doc(db, USER_DETAILS, user.id_doc)
              await updateDoc(docRef, body)
            })
            tracePerformance(false, null, null, log)
            dispatch('getChampions').then(() => {
              resolve()
            })
          }
          updateUsers(users)
        })
        .catch((error) => {
          tracePerformance(false, null, null, log)
          commit('logSlack', {
            name: `fn: resetCampaign | call: getDocs`,
            err: error,
          })
          reject(error)
        })
    })
  },
  reportAIssueList({ commit, state }) {
    logger('ACTION-FIREBASE reportAIssueList', null, 'i')
    const log = tracePerformance(
      true,
      state.performance,
      'REPORTISSUELIST',
      null
    )
    return new Promise((resolve, reject) => {
      const queryRef = query(
        collection(db, ISSUE_DETAILS),
        orderBy('date_open', 'desc')
      )
      getDocs(queryRef)
        .then((docs) => {
          const list = []
          docs.forEach((doc) => {
            list.push(doc.data())
          })
          tracePerformance(false, null, null, log)
          commit('setReportIssueList', list)
          resolve()
        })
        .catch((error) => {
          tracePerformance(false, null, null, log)
          commit('logSlack', {
            name: `fn: reportAIssueList | call: getDocs`,
            err: error,
          })
          reject(error)
        })
    })
  },
  reportAIssue({ state, commit, dispatch }, data) {
    logger('ACTION-FIREBASE reportAIssue', data, 'i')
    const log = tracePerformance(true, state.performance, 'REPORTISSUE', null)
    return new Promise((resolve, reject) => {
      const body = Object.assign({}, data, {
        date_close: null,
        status: 'open', // open, close, in progress
        priority: 'low', // low, medium, high
        uid: state.userDetailsFirebase.uid,
        id: Timestamp.now().valueOf().toString(),
        date_open: Timestamp.now(),
      })
      const collectionRef = collection(db, ISSUE_DETAILS)
      addDoc(collectionRef, body)
        .then(() => {
          tracePerformance(false, null, null, log)
          resolve()
        })
        .catch((error) => {
          tracePerformance(false, null, null, log)
          commit('logSlack', {
            name: `fn: reportAIssue | call: addDoc | data: uid=${state.userDetailsFirebase.uid}`,
            err: error,
          })
          reject(error)
        })
    })
  },
  logErrors({ state, commit }, data) {
    logger('ACTION-FIREBASE logErrors', data, 'i')
    const log = tracePerformance(true, state.performance, 'ERRORS', null)
    const body = Object.assign({}, data, {
      date: Timestamp.now(),
    })
    addDoc(collection(db, ERROR_DETAILS), body)
      .then(() => {
        tracePerformance(false, null, null, log)
      })
      .catch((error) => {
        tracePerformance(false, null, null, log)
        commit('logSlack', {
          name: `fn: logErrors | call: addDoc`,
          err: error,
        })
      })
  },
  dataFirebaseInit({ commit, dispatch, state }, id) {
    logger('ACTION-FIREBASE dataFirebaseInit', id, 'i')
    return new Promise((resolve) => {
      const value = id || state.userDetailsFirebase.id_doc
      const check = !!id
      dispatch('getDetailsUser', { value, check }).then((resp) => {
        if (id) {
          dispatch('ws/loginUser', resp, { root: true })
        }
        dispatch('getChampions').then(() => {
          resolve(resp)
        })
      })
    })
  },
  getRemoteConfigFirebase({ commit, state }, remoteConfig) {
    logger('ACTION-FIREBASE getRemoteConfigFirebase', null, 'i')
    const log = tracePerformance(
      true,
      state.performance,
      'GETREMOTECONFIG',
      null
    )
    return new Promise((resolve, reject) => {
      if (!remoteConfig._isInitializationComplete) {
        fetchAndActivate(remoteConfig)
          .then(() => {
            tracePerformance(false, null, null, log)
            commit('setRemoteConfig', remoteConfig)
            resolve()
          })
          .catch((error) => {
            tracePerformance(false, null, null, log)
            commit('logSlack', {
              name: `fn: getRemoteConfigFirebase | call: fetchAndActivate`,
              err: error,
            })
            reject(error)
          })
      } else {
        tracePerformance(false, null, null, log)
        commit('setRemoteConfig', remoteConfig)
        resolve()
      }
    })
  },
}
