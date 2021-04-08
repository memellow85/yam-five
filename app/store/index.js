import { auth, db, utils } from '~/plugins/firebase.js'

export const strict = false

/**
 * Functions
 */
const compare = (a, b) => {
  if (a.tot > b.tot) return -1
  if (b.tot > a.tot) return 1
  return 0
}

const order = (a, b) => {
  if (a.order > b.order) return 1
  if (b.order > a.order) return -1
  return 0
}

const deleteRoom = async (db, doc, resolve, dispatch) => {
  await db.batch().delete(doc.ref).commit()
  dispatch('leftRoom')
  resolve()
}

/**
 * State
 */
export const state = () => ({
  userFirebase: null,
  userDetailsFirebase: null,
  userFirebaseGame: null,
  usersFirebase: [],
  detailsRoom: null,
  typeMatch: null,
  usersRealTimeChampions: [],
  usersChampions: [],
  unsubscribeRealTimeBD: null,
  unsubscribeRealTimeChampions: null,
  isLeave: false,
  isLoadingRoom: false,
  isLoadingLeftRoom: false,
})

/**
 * Mutations
 */
export const mutations = {
  setUserFirebase(state, user) {
    state.userFirebase = user
    /* console.log(
      'COMMIT userFirebase',
      state.userFirebase.uid,
      state.userFirebase
    ) */
  },
  setUserDetailsFirebase(state, user) {
    state.userDetailsFirebase = user
    // console.log('COMMIT userDetailsFirebase', state.userDetailsFirebase)
  },
  setDetailsRoom(state, data) {
    state.detailsRoom = data
    state.usersFirebase = data.users
    state.userFirebaseGame = data.users.filter(
      (u) => u.uid === state.userFirebase.uid
    )[0]
    state.typeMatch = data.type
    state.usersRealTimeChampions = data.users.sort((a, b) => b.tot - a.tot)
    // console.log('COMMIT detailsRoom', state.detailsRoom)
    // console.log('COMMIT usersFirebase', state.usersFirebase)
    // console.log('COMMIT userFirebaseGame', state.userFirebaseGame)
  },
  setNextTurn(state, data) {
    // console.log('COMMIT setNextTurn', data)
    const userTurn = state.usersFirebase.filter((u) => u.turnOn)[0]
    const newOrder = userTurn.order + 1
    state.usersFirebase.map((u) => {
      if (u.uid === state.userFirebaseGame.uid) {
        u.tot = data.global
        u.num = data.number
        u.extra = data.extra
      }
      if (u.uid === userTurn.uid) {
        u.turnOn = false
      }
      if (u.order === newOrder) {
        u.turnOn = true
      }
    })
    if (state.usersFirebase.filter((u) => u.turnOn).length === 0) {
      const orderList = state.usersFirebase.sort(order)[0]
      state.usersFirebase.map((u) => {
        if (u.uid === orderList.uid) {
          u.turnOn = true
        }
      })
    }
  },
  setChampions(state, data) {
    state.usersChampions = []
    data.forEach((d) => {
      const user = d.data()
      const objTmp = {
        uid: user.uid,
        name: user.name,
        tot: user.score + user.score_short + user.score_veryshort,
      }
      state.usersChampions.push(objTmp)
      state.usersChampions = state.usersChampions.sort(compare)
    })
    // console.log('COMMIT usersChampions', state.usersChampions)
  },
  clearData(state) {
    // console.log('COMMIT clearData')
    state.userFirebase = null
    state.userDetailsFirebase = null
    state.userFirebaseGame = null
    state.usersFirebase = []
    state.detailsRoom = null
    state.typeMatch = null
    state.usersRealTimeChampions = []
    state.isLeave = false
  },
  clearDataRoom(state) {
    // console.log('COMMIT clearDataRoom')
    state.userFirebaseGame = null
    state.usersFirebase = []
    state.detailsRoom = null
    state.typeMatch = null
    state.usersRealTimeChampions = []
    state.isLeave = false
  },
  setLeave(state, value) {
    // console.log('COMMIT setLeave')
    state.isLeave = value
  },
  setLoadingRoom(state, value) {
    // console.log('COMMIT setLoadingRoom')
    state.isLoadingRoom = value
  },
  setLoadingLeftRoom(state, value) {
    // console.log('COMMIT setLoadingLeftRoom')
    state.isLoadingLeftRoom = value
  },
}

/**
 * Actions
 */
export const actions = {
  logout({ commit }) {
    // console.log('ACTION logout')
    return new Promise((resolve) => {
      auth.signOut().then(() => {
        commit('clearData')
        resolve()
      })
    })
  },
  login({ commit, dispatch }, data) {
    // console.log('ACTION login', data)
    return new Promise((resolve, reject) => {
      auth
        .signInWithEmailAndPassword(data.email, data.password)
        .then((user) => {
          commit('setUserFirebase', user.user)
          dispatch('getDetailsUser', user.user.uid).then(() => {
            resolve()
          })
          dispatch('getChampions')
        })
        .catch((error) => {
          reject(error.message)
        })
    })
  },
  recovery({ commit }, data) {
    // console.log('ACTION recovery', data)
    return new Promise((resolve, reject) => {
      auth
        .sendPasswordResetEmail(data.recovery)
        .then(() => {
          resolve()
        })
        .catch((error) => {
          reject(error.message)
        })
    })
  },
  getDetailsUser({ commit }, uid) {
    // console.log('ACTION getDetailsUser', uid)
    return new Promise((resolve, reject) => {
      db.collection('users')
        .where('uid', '==', uid)
        .get()
        .then((resp) => {
          resp.forEach((doc) => {
            commit('setUserDetailsFirebase', doc.data())
          })
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getChampions({ commit }, list) {
    // console.log('ACTION getChampions', list)
    // const orderBy = list || 'score'
    db.collection('users')
      // .orderBy(orderBy, 'desc')
      // .limit(6)
      .get()
      .then((data) => {
        commit('setChampions', data.docs)
      })
  },
  registration({ dispatch }, data) {
    // console.log('ACTION registration', data)
    return new Promise((resolve, reject) => {
      auth
        .createUserWithEmailAndPassword(data.email, data.password)
        .then(() => {
          const user = auth.currentUser
          user.sendEmailVerification()
          dispatch('registrationDocUser', {
            name: data.name,
            uid: user.uid,
          }).then(() => {
            resolve()
          })
        })
        .catch((error) => {
          reject(error.message)
        })
    })
  },
  registrationDocUser({ commit }, data) {
    // console.log('ACTION registrationDocUser', data)
    return new Promise((resolve, reject) => {
      db.collection('users')
        .add({
          name: data.name,
          uid: data.uid,
          match: 0,
          score: 0,
          score_short: 0,
          score_veryshort: 0,
          last_updated: utils.Timestamp.now(),
        })
        .then(() => {
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  joinRoomsFirebase({ commit, dispatch }, user) {
    // console.log('ACTION joinRoomsFirebase', user)
    commit('setLoadingRoom', true)
    const ref = db.collection('rooms').doc(user.room)
    ref.get().then((doc) => {
      const data = {}
      if (doc.exists) {
        const dataDoc = doc.data()
        if (!dataDoc.active) {
          const orderNumber = dataDoc.users.length + 1
          data.users = utils.FieldValue.arrayUnion({
            uid: user.user.uid,
            name: user.user.name,
            tot: 0,
            num: 0,
            extra: 0,
            turnOn: false,
            isCreated: false,
            order: orderNumber,
          })
          data.match = dataDoc.reinit * orderNumber
          ref.update(data).then(() => {
            commit('setLeave', true)
            commit('setLoadingRoom', false)
            commit('game/initDices', {}, { root: true })
            dispatch('readRealTimeDB', user.room)
          })
        } else {
          commit('setLeave', false)
          commit('setLoadingRoom', false)
          commit(
            'game/toggleNotification',
            {
              type: 'alert',
              message: 'Game already started.',
            },
            { root: true }
          )
        }
      } else {
        commit('setLeave', false)
        commit('setLoadingRoom', false)
        commit(
          'game/toggleNotification',
          {
            type: 'alert',
            message: 'Game not exist.',
          },
          { root: true }
        )
      }
    })
  },
  createRoomsFirebase({ commit, dispatch }, user) {
    // console.log('ACTION createRoomsFirebase', user)
    commit('setLoadingRoom', true)
    const ref = db.collection('rooms').doc(user.room)
    ref.get().then((doc) => {
      const data = {}
      if (!doc.exists) {
        data.room = user.room
        data.match = user.match
        data.reinit = user.match
        data.type = user.type
        data.created = utils.Timestamp.now()
        data.active = false
        data.users = utils.FieldValue.arrayUnion({
          uid: user.user.uid,
          name: user.user.name,
          tot: 0,
          num: 0,
          extra: 0,
          turnOn: true,
          isCreated: true,
          order: 1,
        })
        ref.set(data).then(() => {
          commit('setLeave', true)
          commit('setLoadingRoom', false)
          // Ascoltare in real time la stanza
          dispatch('readRealTimeDB', user.room)
        })
      } else {
        commit('setLeave', false)
        commit('setLoadingRoom', false)
        commit(
          'game/toggleNotification',
          {
            type: 'alert',
            message: 'Game already exist.',
          },
          { root: true }
        )
      }
    })
  },
  readRealTimeDB({ commit, state, dispatch }, room) {
    // console.log('ACTION readRealTimeDB', room)
    state.unsubscribeRealTimeBD = db
      .collection('rooms')
      .doc(room)
      .onSnapshot(
        (data) => {
          const d = data.data()
          if (d) {
            if (d.match !== 0) {
              commit('setDetailsRoom', d)
              if (!d.active) {
                commit('game/changeGames', d.type, { root: true })
                if (d.type === 'veryshort') {
                  commit('game/changePlayedView', 'free', { root: true })
                } else {
                  commit('game/changePlayedView', 'down', { root: true })
                }
              }
            } else {
              const orderUser = d.users.sort(compare)
              if (orderUser[0].uid === state.userFirebase.uid) {
                commit(
                  'game/toggleNotification',
                  {
                    type: 'success',
                    message: `You win with ${state.userFirebaseGame.tot} points`,
                  },
                  { root: true }
                )
                dispatch('updateRecordUser', true)
              } else {
                commit(
                  'game/toggleNotification',
                  {
                    type: 'alert',
                    message: `You lost with ${state.userFirebaseGame.tot} points`,
                  },
                  { root: true }
                )
                dispatch('updateRecordUser', false)
              }
            }
          }
        },
        () => {
          dispatch('logout')
        }
      )
  },
  updateRecordUser({ dispatch, commit, state }, deleteLeft) {
    // console.log('ACTION updateRecordUser')
    const data = {
      match: state.userDetailsFirebase.match + 1,
    }
    const ref = db.collection('users')
    const filterForRef = ref.where('uid', '==', state.userFirebaseGame.uid)
    filterForRef.get().then((snapshot) => {
      snapshot.docs.forEach((doc) => {
        const dataDetail = doc.data()
        if (dataDetail.uid === state.userFirebaseGame.uid) {
          const refObj = ref.doc(doc.id)
          switch (state.detailsRoom.type) {
            case 'short':
              if (dataDetail.score_short < state.userFirebaseGame.tot) {
                data.score_short = state.userFirebaseGame.tot
              }
              break
            case 'veryshort':
              if (dataDetail.score_veryshort < state.userFirebaseGame.tot) {
                data.score_veryshort = state.userFirebaseGame.tot
              }
              break
            default:
              if (dataDetail.score < state.userFirebaseGame.tot) {
                data.score = state.userFirebaseGame.tot
              }
          }
          data.last_updated = utils.Timestamp.now()
          db.batch().update(refObj, data).commit()
          dispatch('getChampions')
          if (deleteLeft) {
            dispatch('deleteLeftRoom')
          } else {
            dispatch('leftRoom')
          }
        }
      })
    })
  },
  checkNextTurn({ commit, state }, data) {
    // console.log('ACTION checkNextTurn', data)
    commit('setNextTurn', data)
    const ref = db.collection('rooms').doc(state.detailsRoom.room)
    const dataUpdate = {}
    dataUpdate.users = state.usersFirebase
    dataUpdate.match = state.detailsRoom.match - 1
    ref.update(dataUpdate)
  },
  startGame({ commit, state }) {
    // console.log('ACTION startGame')
    db.collection('rooms')
      .doc(state.detailsRoom.room)
      .update({
        active: true,
      })
      .then(() => {
        commit('game/startGame', true, { root: true })
        commit('game/initDices', null, { root: true })
      })
  },
  /**
   * Cancellazione real time
   */
  unsetRealTimeDB({ state }) {
    // console.log('ACTION unsetRealTimeDB')
    state.unsubscribeRealTimeBD()
  },
  /**
   * Abbandona la stanza
   */
  leftRoom({ dispatch, commit }) {
    // console.log('ACTION leftRoom')
    dispatch('game/newGame', false, { root: true })
    commit('clearDataRoom')
    commit('setLoadingLeftRoom', false)
    dispatch('unsetRealTimeDB')
  },
  /**
   * Cancella la stnza
   */
  deleteLeftRoom({ dispatch, commit, state }) {
    // console.log('ACTION deleteLeftRoom')
    commit('setLoadingLeftRoom', true)
    return new Promise((resolve) => {
      db.collection('rooms')
        .get()
        .then((snapshot) => {
          snapshot.docs.forEach((doc) => {
            const data = doc.data()
            if (data.room === state.detailsRoom.room) {
              // db.batch().delete(doc.ref).commit()
              deleteRoom(db, doc, resolve, dispatch)
              // dispatch('leftRoom')
              // resolve()
            }
          })
        })
    })
  },
  /**
   * Esci dalla stanza
   */
  logoutRoom({ dispatch, commit, state }) {
    // console.log('ACTION logoutRoom')
    if (state.detailsRoom && state.detailsRoom.room) {
      return new Promise((resolve) => {
        const ref = db.collection('rooms').doc(state.detailsRoom.room)
        ref.get().then((data) => {
          const d = data.data()
          if (d) {
            dispatch('deleteLeftRoom').then(() => {
              resolve()
            })
          } else {
            commit('setLoadingLeftRoom', true)
            dispatch('leftRoom')
            resolve()
          }
        })
      })
    }
  },
}
