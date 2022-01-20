import cloneDeep from 'lodash/cloneDeep'
import {
  getRandomNumberCube,
  calculateActualGame,
  logger,
  setStatisticsDice,
  generateRandomRoom,
  getLocalStorageKey,
  checkPossibleActiveDice,
} from '~/utils'
import {
  dicesTypesCabled,
  playedListCabled,
  dices,
  match,
  probablyExitNumbers,
  numberTotalGames,
} from '~/lists'

/**
 * State
 */
export const state = () => ({
  showHelp: false,
  showConfig: false,
  showChampionsShip: false,
  showSchema: false,
  showAlert: false,
  messageAlert: null,
  titleAlert: '',
  newVersion: null,
  updateVersion: false,
  showRelease: false,
  showNotification: false,
  notificationTypes: null,
  notificationMessage: null,
  notificationTimer: false,
  notificationSound: true,
  buttonAddToHome: false,
  globalTotal: 0,
  numberTotalGames: numberTotalGames(),
  currentGame: getLocalStorageKey('game') ? getLocalStorageKey('game') : 'all',
  currentGamePlayed: [],
  dices,
  beforeDices: {},
  game: match(),
  playedList: playedListCabled,
  played: 3,
  playedView: 'down',
  startGame: null,
  newGame: false,
  activeGame: false,
  navigationRoute: null,
  probablyExitNumbers,
  totalHistorical: [],
  disabledButtonGame: false,
  animateBtnDice: false,
  fastGame: false,
  blockAnimate: false,
  currentCampaign: null,
  campaignActive: false,
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
    state.showAlert = false
    state.showRelease = false
  },
  toggleModal(state, data) {
    logger('COMMIT-GAME toggleModal', data, 'i')
    const type = typeof data === 'string' ? data : data.type
    if (data.update) {
      state.messageAlert = typeof data === 'string' ? null : data.message
      state.titleAlert = typeof data === 'string' ? '' : data.title
      state.updateVersion = typeof data === 'string' ? false : data.update
      state.newVersion = typeof data === 'string' ? null : data.version
    }
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
      case 'release':
        state.showRelease = !state.showRelease
        break
      case 'alert':
        state.showAlert = !state.showAlert
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
  blockAnimate(state, value) {
    logger('COMMIT-GAME blockAnimate', value, 'i')
    state.blockAnimate = value
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
    state.probablyExitNumbers = setStatisticsDice(
      state.probablyExitNumbers,
      state.dices
    )

    state.currentGamePlayed.map((g) => {
      Object.keys(state.game[g].data).map((d) => {
        if (
          state.game[g].data[d].active &&
          state.game[g].data[d].value === '-'
        ) {
          state.game[g].data[d].icon =
            getLocalStorageKey('helper') === 'no'
              ? 'plus-box'
              : checkPossibleActiveDice(
                  state.game[g].data[d],
                  state.dices,
                  state.game[g].data[d].name === 'min'
                    ? state.game[g].data.max
                    : state.game[g].data.min
                )
              ? 'plus-box'
              : 'trash-can'
        }
        return true
      })
      return true
    })
  },
  activeGame(state) {
    logger('COMMIT-GAME activeGame', null, 'i')
    if (!state.activeGame) {
      state.currentGamePlayed.map((g) => {
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
    state.currentGamePlayed.map((g) => {
      Object.keys(state.game[g].data).map((d) => {
        state.game[g].data[d].active = false
        return true
      })
      return true
    })
  },
  setActualValue(state, data) {
    logger('COMMIT-GAME setActualValue', data, 'i')
    state.currentGamePlayed.map((g) => {
      if (g === state.playedView) {
        const sum = calculateActualGame(
          data,
          state.dices,
          data.name === 'min' ? state.game[g].data.max : state.game[g].data.min
        )
        state.totalHistorical.push(sum)
        state.game[g].data[data.name].value = sum
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
    state.currentGamePlayed.map((g) => {
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
      state.notificationSound = !data.withoutSound
      state.showNotification = true
      state.notificationTypes = data.type
      state.notificationMessage = data.message
      state.buttonAddToHome = data.buttonAddToHome
        ? data.buttonAddToHome
        : false
      state.notificationTimer = !data.buttonAddToHome
    } else {
      state.notificationSound = true
      state.notificationTimer = false
      state.showNotification = false
      state.notificationTypes = null
      state.notificationMessage = null
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
    state.numberTotalGames = numberTotalGames()
    state.currentGamePlayed.map((g) => {
      Object.keys(state.game[g].data).map((d) => {
        if (state.game[g].data[d].value !== '-') {
          state.globalTotal += parseInt(state.game[g].data[d].value)

          /**
           * Calcolo bonus
           */
          // Number
          if (d === 'one') {
            if (
              state.game[g].data.one.value !== '-' &&
              state.game[g].data.two.value !== '-' &&
              state.game[g].data.three.value !== '-' &&
              state.game[g].data.four.value !== '-' &&
              state.game[g].data.five.value !== '-' &&
              state.game[g].data.six.value !== '-'
            ) {
              const totDices =
                state.game[g].data.one.value +
                state.game[g].data.two.value +
                state.game[g].data.three.value +
                state.game[g].data.four.value +
                state.game[g].data.five.value +
                state.game[g].data.six.value
              if (totDices > 60) {
                state.globalTotal += 20
                state.game[g].bonusNumber60 = true
              }
              if (totDices > 70) {
                state.globalTotal += 30
                state.game[g].bonusNumber70 = true
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
            state.numberTotalGames[g] += state.game[g].data[d].value
          }

          // Bonus min max
          if (d === 'min') {
            if (state.game[g].data.max.value !== '-') {
              const totMinMax =
                state.game[g].data[d].value + state.game[g].data.max.value
              if (totMinMax >= 50) {
                state.globalTotal += 30
                state.game[g].bonusMinMax = true
              }
            }
          }

          // Bonus extra
          if (
            state.game[g].data[d].value > 0 &&
            (d === 'poker' || d === 'mineleven')
          ) {
            state.globalTotal += 30
          }
          if (state.game[g].data[d].value > 0 && d === 'full') {
            state.globalTotal += 20
          }
          if (state.game[g].data[d].value > 0 && d === 'scale') {
            state.globalTotal += 40
          }
          if (state.game[g].data[d].value > 0 && d === 'yam') {
            state.globalTotal += 50
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
    state.numberTotalGames = numberTotalGames()
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
    state.currentGamePlayed = state.playedList
      .filter((p) => p.view.includes(state.currentGame))
      .map((p) => p.name)
  },
  setNavigationRoute(state, value) {
    logger('COMMIT-GAME navigationRoute', value, 'i')
    state.navigationRoute = value
  },
  resetStats(state) {
    logger('COMMIT-GAME resetStats', null, 'i')
    state.probablyExitNumbers = probablyExitNumbers
    state.totalHistorical = []
  },
  setDisabledButtonGame(state, value) {
    logger('COMMIT-GAME setDisabledButtonGame', value, 'i')
    state.disabledButtonGame = value
  },
  setFastGame(state, value) {
    logger('COMMIT-GAME setFastGame', value, 'i')
    state.fastGame = value
  },
  setAnimateBtn(state, value) {
    logger('COMMIT-GAME setAnimateBtn', value, 'i')
    state.animateBtnDice = value
  },
  setCurrentCampaign(state, campaigns) {
    logger('COMMIT-GAME setCurrentCampaign', campaigns, 'i')
    state.campaignActive = campaigns.length === 1
    state.currentCampaign = campaigns.length === 1 ? campaigns[0] : null
  },
}

/**
 * Actions
 */
export const actions = {
  resetGame({ commit }) {
    commit('newGame', false)
    commit('initMatch')
    commit('initDices')
    commit('resetTurn')
    commit('startGame')
    commit('resetStats')
  },
  fastGame({ commit, dispatch, rootState }) {
    logger('ACTION-GAME fastGame', null, 'i')
    commit('setFastGame', true)
    dispatch(
      'ws/addUserSocket',
      {
        user: rootState.firebase.userDetailsFirebase,
        room: generateRandomRoom(8),
        match: 13,
        type: 'veryshort',
        method: 'create',
      },
      { root: true }
    )
  },
  playedDecrease({ commit, state }) {
    logger('ACTION-GAME playedDecrease', null, 'i')
    commit('disabledPossibilityGame', state.played)
    if (state.played !== 0) {
      commit('playedDecrease')
      commit('setDice')
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
    commit('blockAnimate', false)
    commit('setGlobalTotal')
    commit('initDices')
    commit('resetTurn')
    commit('resetGame')
    commit('ws/updateTotalSocket', state.globalTotal, { root: true })
    dispatch('ws/finishTurnSocket', null, { root: true })
  },
}
