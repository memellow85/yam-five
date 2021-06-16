import cloneDeep from 'lodash/cloneDeep'
import { getRandomNumberCube, calculateActualGame, logger } from '~/utils'
import {
  dicesTypesCabled,
  gamesTypesCabled,
  playedListCabled,
  dices,
  match,
} from '~/lists'

/**
 * State
 */
export const state = () => ({
  showHelp: false,
  showConfig: false,
  showChampionsShip: false,
  showSchema: false,
  showNotification: false,
  notificationTypes: null,
  notificationMessage: null,
  buttonRefresh: false,
  buttonAddToHome: false,
  globalTotal: 0,
  extraTotal: 0,
  numberTotal: 0,
  currentGame: 'all',
  dices,
  beforeDices: {},
  game: match(),
  playedList: playedListCabled,
  played: 3,
  playedView: 'down',
  startGame: null,
  newGame: false,
  activeGame: false,
})

/**
 * Mutations
 */
export const mutations = {
  resetModal(state) {
    logger('COMMIT-GAME resetModal', null, 'i')
    state.showSchema = false
    state.showChampionsShip = false
    state.showConfig = false
    state.showHelp = false
  },
  toggleModal(state, type) {
    logger('COMMIT-GAME toggleModal', type, 'i')
    switch (type) {
      case 'help':
        state.showHelp = !state.showHelp
        break
      case 'config':
        state.showConfig = !state.showConfig
        break
      case 'champions':
        state.showChampionsShip = !state.showChampionsShip
        break
      case 'schema':
        state.showSchema = !state.showSchema
        break
    }
  },
  playedDecrease(state) {
    logger('COMMIT-GAME playedDecrease', null, 'i')
    state.played = state.played - 1
  },
  changePlayedView(state, value) {
    logger('COMMIT-GAME changePlayedView', value, 'i')
    state.playedList = state.playedList.map((v) => {
      v.selected = v.name === value
      return v
    })
    state.playedView = value
  },
  startGame(state, value) {
    logger('COMMIT-GAME startGame', value, 'i')
    state.startGame = value
  },
  blockDice(state, dice) {
    logger('COMMIT-GAME blockDice', dice, 'i')
    dicesTypesCabled.map((v) => {
      if (state.dices[v].name === dice.name) {
        state.dices[v].block = !state.dices[v].block
      }
      return true
    })
  },
  initDices(state) {
    logger('COMMIT-GAME initDices', null, 'i')
    state.beforeDices = {}
    dicesTypesCabled.map((v) => {
      state.dices[v].value = 0
      state.dices[v].name = v
      state.dices[v].block = false
      return true
    })
    state.dices.tot = 0
  },
  setDice(state) {
    logger('COMMIT-GAME setDice', null, 'i')
    if (state.played < 2) {
      state.beforeDices = cloneDeep(state.dices)
    }
    let tot = 0
    dicesTypesCabled.map((v) => {
      if (!state.dices[v].block) {
        state.dices[v].value = getRandomNumberCube()
      }
      tot += state.dices[v].value
      return true
    })
    state.dices.tot = tot
  },
  activeGame(state) {
    logger('COMMIT-GAME activeGame', null, 'i')
    if (!state.activeGame) {
      gamesTypesCabled.map((g) => {
        Object.keys(state.game[g].data).map((d) => {
          if (
            !state.game[g].data[d].active &&
            state.game[g].data[d].value === '-'
          ) {
            state.game[g].data[d].active = true
          }
          return true
        })
        return true
      })
      state.activeGame = true
    }
  },
  resetGame(state) {
    logger('COMMIT-GAME resetGame', null, 'i')
    gamesTypesCabled.map((g) => {
      Object.keys(state.game[g].data).map((d) => {
        state.game[g].data[d].active = false
        return true
      })
      return true
    })
  },
  setActualValue(state, data) {
    logger('COMMIT-GAME setActualValue', data, 'i')
    gamesTypesCabled.map((g) => {
      if (g === state.playedView) {
        state.game[g].data[data.name].value = calculateActualGame(
          data,
          state.dices,
          data.name === 'min' ? state.game[g].data.max : state.game[g].data.min
        )
        state.game[g].data[data.name].active = false
      }
      return true
    })
  },
  disabledPossibilityGame(state, played) {
    logger('COMMIT-GAME disabledPossibilityGame', played, 'i')
    if (played === 1) {
      Object.keys(state.game.dry.data).map((key) => {
        state.game.dry.data[key].active = false
        return true
      })
    }
    let checkDown = false
    Object.keys(state.game.down.data).map((key) => {
      if (state.game.down.data[key].value === '-' && !checkDown) {
        checkDown = true
        state.game.down.data[key].active = true
      } else {
        state.game.down.data[key].active = false
      }
      return true
    })
    let checkUp = false
    Object.keys(state.game.up.data)
      .reverse()
      .map((key) => {
        if (state.game.up.data[key].value === '-' && !checkUp) {
          checkUp = true
          state.game.up.data[key].active = true
        } else {
          state.game.up.data[key].active = false
        }
        return true
      })
  },
  resetActualValue(state, data) {
    logger('COMMIT-GAME resetActualValue', data, 'i')
    gamesTypesCabled.map((g) => {
      if (g === state.playedView) {
        state.game[g].data[data.name].value = 0
        state.game[g].data[data.name].active = false
      }
      return true
    })
  },
  toggleNotification(state, data) {
    logger('COMMIT-GAME toggleNotification', data, 'i')
    if (data) {
      state.showNotification = true
      state.notificationTypes = data.type
      state.notificationMessage = data.message
      state.buttonRefresh = data.buttonRefresh ? data.buttonRefresh : false
      state.buttonAddToHome = data.buttonAddToHome
        ? data.buttonAddToHome
        : false
    } else {
      state.showNotification = false
      state.notificationTypes = null
      state.notificationMessage = null
      state.buttonRefresh = false
      state.buttonAddToHome = false
    }
  },
  resetTurn(state) {
    logger('COMMIT-GAME resetTurn', null, 'i')
    state.played = 3
    state.activeGame = false
  },
  setGlobalTotal(state) {
    logger('COMMIT-GAME setGlobalTotal', null, 'i')
    state.globalTotal = 0
    state.numberTotal = 0
    state.extraTotal = 0
    gamesTypesCabled.map((g) => {
      Object.keys(state.game[g].data).map((d) => {
        if (state.game[g].data[d].value !== '-') {
          state.globalTotal += parseInt(state.game[g].data[d].value)

          /**
           * Calcolo bonus
           */
          // Number
          if (d === 'one') {
            if (
              state.game[g].data.two.value !== '-' &&
              state.game[g].data.three.value !== '-' &&
              state.game[g].data.four.value !== '-' &&
              state.game[g].data.five.value !== '-' &&
              state.game[g].data.six.value !== '-'
            ) {
              const totDices =
                state.game[g].data.two.value +
                state.game[g].data.three.value +
                state.game[g].data.four.value +
                state.game[g].data.five.value +
                state.game[g].data.six.value
              if (totDices > 60) {
                state.globalTotal += 20
                state.numberTotal += 20
              }
              if (totDices > 70) {
                state.globalTotal += 30
                state.numberTotal += 30
              }
            }
          }

          if (
            d === 'one' ||
            d === 'two' ||
            d === 'three' ||
            d === 'four' ||
            d === 'five' ||
            d === 'six'
          ) {
            state.numberTotal += state.game[g].data[d].value
          }

          // Bonus min max
          if (d === 'min') {
            if (state.game[g].data.max.value !== '-') {
              const totMinMax =
                state.game[g].data[d].value + state.game[g].data.max.value
              state.extraTotal += totMinMax
              if (totMinMax > 50) {
                state.globalTotal += 30
                state.extraTotal += 30
              }
            }
          }

          // Bonus extra
          if (
            state.game[g].data[d].value > 0 &&
            (d === 'poker' || d === 'mineleven')
          ) {
            state.globalTotal += 30
            const totExtraPokerEleven = state.game[g].data[d].value + 30
            state.extraTotal += totExtraPokerEleven
          }
          if (state.game[g].data[d].value > 0 && d === 'full') {
            state.globalTotal += 20
            const totExtraFull = state.game[g].data[d].value + 20
            state.extraTotal += totExtraFull
          }
          if (state.game[g].data[d].value > 0 && d === 'scale') {
            state.globalTotal += 40
            const totExtraScale = state.game[g].data[d].value + 40
            state.extraTotal += totExtraScale
          }
          if (state.game[g].data[d].value > 0 && d === 'yam') {
            state.globalTotal += 50
            const totExtraYam = state.game[g].data[d].value + 50
            state.extraTotal += totExtraYam
          }
        }
        return true
      })
      return true
    })
  },
  initMatch(state) {
    logger('COMMIT-GAME initMatch', null, 'i')
    state.game = match()
    state.globalTotal = 0
    state.extraTotal = 0
    state.numberTotal = 0
  },
  newGame(state, value) {
    logger('COMMIT-GAME newGame', value, 'i')
    state.newGame = value
  },
  changeGames(state, value) {
    logger('COMMIT-GAME changeGames', value, 'i')
    state.currentGame = value
    const g = value === 'veryshort' ? 'free' : 'down'
    state.playedList = state.playedList.map((v) => {
      v.selected = v.name === g
      return v
    })
    state.playedView = g
  },
}

/**
 * Actions
 */
export const actions = {
  startGame({ commit, dispatch }) {
    logger('ACTION-GAME startGame', null, 'i')
    dispatch('ws/startGameSocket', {}, { root: true })
    commit('startGame', true)
    commit('initDices')
  },
  reigniteGame({ commit }) {
    logger('ACTION-GAME reigniteGame', null, 'i')
    commit('newGame', false)
    commit('initDices')
    commit('initMatch')
    // Reset classifica ?
  },
  playedDecrease({ commit, state }) {
    logger('ACTION-GAME playedDecrease', null, 'i')
    if (state.played !== 0) {
      commit('playedDecrease')
      commit('setDice')
      // commit('activeGame')
    }
  },
  setActualValue({ commit, dispatch }, data) {
    logger('ACTION-GAME setActualValue', data, 'i')
    commit('setActualValue', data)
    dispatch('updateTurnUser')
  },
  resetActualValue({ commit, dispatch }, data) {
    logger('ACTION-GAME resetActualValue', data, 'i')
    commit('resetActualValue', data)
    dispatch('updateTurnUser')
  },
  updateTurnUser({ commit, dispatch, state }) {
    logger('ACTION-GAME updateTurnUser', null, 'i')
    commit('setGlobalTotal')
    commit('resetTurn')
    commit('resetGame')
    commit('initDices')
    dispatch(
      'ws/finishTurnSocket',
      {
        global: state.globalTotal,
        extra: state.extraTotal,
        number: state.numberTotal,
      },
      { root: true }
    )
    /* dispatch(
      'ws/updateTotalSocket',
      {
        global: state.globalTotal,
        extra: state.extraTotal,
        number: state.numberTotal,
      },
      { root: true }
    ) */
    dispatch('ws/finishGameSocket', null, { root: true })
  },
  newGame({ commit }, value) {
    logger('ACTION-GAME newGame', value, 'i')
    commit('newGame', value)
    // commit('initDices')
    // commit('initMatch')
    commit('resetTurn')
  },
}
