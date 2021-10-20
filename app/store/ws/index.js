import { logger, trace } from '~/utils'

const translateMessageError = (number) => {
  let message = ''
  switch (number) {
    case '100':
      message = 'Error code 100: Room already exists!'
      break
    case '200':
      message = 'Error code 200: The match is already started!'
      break
    case '300':
      message = 'Error code 300: Generic error!'
      break
  }
  return message
}

/**
 * State
 */
export const state = () => ({
  userSocket: null,
  usersSocket: [],
  usersOrderedSocket: [],
  userTurnSocket: null,
})

/**
 * Getters
 */
export const getters = {}

/**
 * Mutations
 */
export const mutations = {
  setUserSocket(state, user) {
    logger('COMMIT-WS setUserSocket', user, 'i')
    state.userSocket = user
  },
  updateUsersSocket(state, users) {
    logger('COMMIT-WS updateUsersSocket', users, 'i')
    state.usersSocket = users
    state.usersOrderedSocket = users.sort((a, b) => b.tot - a.tot)
  },
  clearDataSocket(state) {
    logger('COMMIT-WS clearDataSocket', null, 'i')
    state.userSocket = null
    state.usersSocket = []
    state.usersOrderedSocket = []
    state.userTurnSocket = null
  },
  updateTotalSocket(state, total) {
    logger('COMMIT-WS updateTotalSocket', total, 'i')
    state.userSocket.tot = total
  },
  setUserTurnSocket(state, user) {
    logger('COMMIT-WS setUserTurnSocket', user, 'i')
    state.userTurnSocket = null
    state.userTurnSocket = user
    state.userSocket = state.usersSocket.find(
      (u) => u.user.uid === state.userSocket.user.uid
    )
  },
}

/**
 * Actions
 */
export const actions = {
  addUserSocket({ commit, dispatch, rootState }, user) {
    logger('ACTION-WS addUserSocket', user, 'i')
    const log = trace(true, rootState.performance, 'ADDUSER', null)
    this._vm.$socket.client.emit('add_user', user, (data) => {
      trace(false, null, null, log)
      if (
        data.error &&
        (data.error === '100' || data.error === '200' || data.error === '300')
      ) {
        commit(
          'game/toggleNotification',
          {
            type: 'alert',
            message: translateMessageError(data.error),
          },
          { root: true }
        )
      } else {
        commit('setUserSocket', data)
        commit(`game/changeGames`, data.type, { root: true })
        dispatch('joinRoomSocket', data)
      }
    })
  },
  joinRoomSocket({ state }, data) {
    logger('ACTION-WS joinRoomSocket', data, 'i')
    this._vm.$socket.client.emit('join_room', data)
  },
  startGameSocket({ state }) {
    logger('ACTION-WS startGameSocket', null, 'i')
    this._vm.$socket.client.emit('start_game', state.userSocket)
  },
  updateGameSocket({ state }) {
    logger('ACTION-WS updateGameSocket', null, 'i')
    this._vm.$socket.client.emit('update_game', state.userSocket)
  },
  leftRoomSocket({ commit, dispatch }) {
    logger('ACTION-WS leftRoomSocket', null, 'i')
    this._vm.$socket.client.emit('left_room')
    commit('clearDataSocket')
    dispatch('game/resetGame', null, { root: true })
  },
  finishTurnSocket({ commit, dispatch, state, rootState }) {
    logger('ACTION-WS finishTurnSocket', null, 'i')
    const log = trace(
      true,
      rootState.performance,
      'finish_turn'.toUpperCase(),
      null
    )
    this._vm.$socket.client.emit('finish_turn', state.userSocket, (data) => {
      trace(false, null, null, log)
      commit(`updateUsersSocket`, data.usersIntoRoom)
      commit('setUserTurnSocket', data.userTurn)
      if (data.userTurn.uid === rootState.firebase.userDetailsFirebase.uid) {
        commit(`game/setDisabledButtonGame`, false, { root: true })
      }
      dispatch('finishGameSocket', null)
    })
  },
  finishGameSocket({ state }) {
    logger('ACTION-WS finishGameSocket', null, 'i')
    this._vm.$socket.client.emit('finish_game', state.userSocket)
  },
}
