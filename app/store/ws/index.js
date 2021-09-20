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
  },
  updateTotalSocket(state, total) {
    logger('COMMIT-WS updateTotalSocket', total, 'i')
    state.userSocket.tot = total.global
    state.userSocket.num = total.number
    state.userSocket.extra = total.extra
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
  socketEmit({ commit, state, rootState }, { action, payload }) {
    logger('ACTION-WS socketEmit', { action, payload }, 'i')
    const key = action.replace('_', '').toUpperCase()
    const log = trace(true, rootState.performance, key, null)
    this._vm.$socket.client.emit(action, payload, () => {
      trace(false, null, null, log)
      logger('socketEmit actions response', null, 'i')
    })
  },
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
  joinRoomSocket({ dispatch, state }, data) {
    logger('ACTION-WS joinRoomSocket', data, 'i')
    dispatch('socketEmit', {
      action: 'join_room',
      payload: data,
    })
  },
  startGameSocket({ dispatch, state }) {
    logger('ACTION-WS startGameSocket', null, 'i')
    dispatch('socketEmit', {
      action: 'start_game',
      payload: state.userSocket,
    })
  },
  updateGameSocket({ dispatch, state }) {
    logger('ACTION-WS updateGameSocket', null, 'i')
    dispatch('socketEmit', {
      action: 'update_game',
      payload: state.userSocket,
    })
  },
  leftRoomSocket({ commit, dispatch }) {
    logger('ACTION-WS leftRoomSocket', null, 'i')
    dispatch('socketEmit', {
      action: 'left_room',
      payload: null,
    })
    commit('clearDataSocket')
    commit('game/newGame', false, { root: true })
    commit('game/initMatch', null, { root: true })
    commit('game/initDices', null, { root: true })
    commit('game/resetTurn', null, { root: true })
    commit('game/startGame', null, { root: true })
    // commit('game/intoRoom', false)
  },
  finishTurnSocket({ commit, dispatch, state, rootState }, total) {
    logger('ACTION-WS finishTurnSocket', null, 'i')
    commit('updateTotalSocket', total)
    const log = trace(
      true,
      rootState.performance,
      'finish_turn'.toUpperCase(),
      null
    )
    this._vm.$socket.client.emit('finish_turn', state.userSocket, () => {
      trace(false, null, null, log)
      dispatch('finishGameSocket', null)
    })
    /* dispatch('socketEmit', {
      action: 'finish_turn',
      payload: state.userSocket,
    }) */
  },
  finishGameSocket({ dispatch, state }) {
    logger('ACTION-WS finishGameSocket', null, 'i')
    dispatch('socketEmit', {
      action: 'finish_game',
      payload: state.userSocket,
    })
  },
}
