import { logger } from '~/utils'

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
  socketEmit({ commit, state }, { action, payload }) {
    logger('ACTION-WS socketEmit', { action, payload }, 'i')
    this._vm.$socket.client.emit(action, payload, (data) => {
      logger('socketEmit actions response', data, 'i')
    })
  },
  addUserSocket({ commit, dispatch }, user) {
    logger('ACTION-WS addUserSocket', user, 'i')
    this._vm.$socket.client.emit('add_user', user, (data) => {
      if (
        data.error &&
        (data.error === '100' || data.error === '200' || data.error === '300')
      ) {
        commit(
          'game/toggleNotification',
          {
            type: 'alert',
            message: data.error,
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
  finishTurnSocket({ commit, dispatch, state }, total) {
    logger('ACTION-WS finishTurnSocket', null, 'i')
    commit('updateTotalSocket', total)
    dispatch('socketEmit', {
      action: 'finish_turn',
      payload: state.userSocket,
    })
  },
  finishGameSocket({ dispatch, state }) {
    logger('ACTION-WS finishGameSocket', null, 'i')
    dispatch('socketEmit', {
      action: 'finish_game',
      payload: state.userSocket,
    })
  },
}
