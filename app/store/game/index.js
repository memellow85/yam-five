import Dices from '~/models/Dices'
import Match from '~/models/Match'
import { getRandomNumberCube, calculateActualGame } from '~/utils'
import { dicesTypesCabled, gamesTypesCabled, playedListCabled } from '~/lists'

export const strict = false

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
  dices: new Dices(),
  game: new Match(),
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
    // console.log('COMMIT-GAME resetModal')
    state.showSchema = false
    state.showChampionsShip = false
    state.showConfig = false
    state.showHelp = false
  },
  toogleModal(state, type) {
    // console.log('COMMIT-GAME toogleModal', type)
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
  playedDecrese(state) {
    // console.log('COMMIT-GAME playedDecrese')
    state.played = state.played - 1
  },
  changePlayedView(state, value) {
    // console.log('COMMIT-GAME changePlayedView', value)
    state.playedList = state.playedList.map((v) => {
      v.selected = v.name === value
      return v
    })
    state.playedView = value
  },
  startGame(state, value) {
    // console.log('COMMIT-GAME startGame', value)
    state.startGame = value
  },
  blockDice(state, dice) {
    // console.log('COMMIT-GAME blockDice', dice)
    dicesTypesCabled.map((v) => {
      if (state.dices[v].name === dice.name) {
        state.dices[v].block = !state.dices[v].block
      }
      return true
    })
  },
  initDices(state) {
    // console.log('COMMIT-GAME initDices')
    dicesTypesCabled.map((v) => {
      state.dices[v].value = 0
      state.dices[v].name = v
      state.dices[v].block = false
      return true
    })
    state.dices.tot = 0
  },
  setDice(state) {
    // console.log('COMMIT-GAME setDice')
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
    // console.log('COMMIT-GAME activeGame')
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
    // console.log('COMMIT-GAME resetGame')
    gamesTypesCabled.map((g) => {
      Object.keys(state.game[g].data).map((d) => {
        state.game[g].data[d].active = false
        return true
      })
      return true
    })
  },
  setActualValue(state, data) {
    // console.log('COMMIT-GAME setActualValue', data)
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
    // console.log('COMMIT-GAME disabledPossibilityGame', played)
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
    // console.log('COMMIT-GAME resetActualValue', data)
    gamesTypesCabled.map((g) => {
      if (g === state.playedView) {
        state.game[g].data[data.name].value = 0
        state.game[g].data[data.name].active = false
      }
      return true
    })
  },
  toggleNotification(state, data) {
    // console.log('COMMIT-GAME toggleNotification', data)
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
    // console.log('COMMIT-GAME resetTurn')
    state.played = 3
    state.activeGame = false
  },
  setGlobalTotal(state) {
    // console.log('COMMIT-GAME setGlobalTotal')
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
    // console.log('COMMIT-GAME initMatch')
    state.game = new Match()
    state.globalTotal = 0
    state.extraTotal = 0
    state.numberTotal = 0
  },
  newGame(state, value) {
    // console.log('COMMIT-GAME newGame', value)
    state.newGame = value
  },
  changeGames(state, value) {
    // console.log('COMMIT-GAME changeGames', value)
    state.currentGame = value
  },
}

/**
 * Actions
 */
export const actions = {
  reinitGame({ commit }) {
    // console.log('ACTION-GAME reinitGame')
    commit('newGame', false)
  },
  playedDecrese({ commit, state }) {
    // console.log('ACTION-GAME playedDecrese')
    if (state.played !== 0) {
      commit('playedDecrese')
      commit('setDice')
      commit('activeGame')
    }
  },
  setActualValue({ commit, dispatch }, data) {
    // console.log('ACTION-GAME setActualValue', data)
    commit('setActualValue', data)
    dispatch('updateTurnUser')
  },
  resetActualValue({ commit, dispatch }, data) {
    // console.log('ACTION-GAME resetActualValue', data)
    commit('resetActualValue', data)
    dispatch('updateTurnUser')
  },
  updateTurnUser({ commit, dispatch, state }) {
    // console.log('ACTION-GAME updateTurnUser')
    commit('setGlobalTotal')
    commit('resetTurn')
    commit('resetGame')
    commit('initDices')

    dispatch(
      'checkNextTurn',
      {
        global: state.globalTotal,
        extra: state.extraTotal,
        number: state.numberTotal,
      },
      { root: true }
    )
  },
  newGame({ commit }, value) {
    // console.log('ACTION-GAME newGame', value)
    commit('newGame', value)
    commit('initDices')
    commit('initMatch')
  },
}
