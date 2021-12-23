import { mapState } from 'vuex'
import { logger, play } from '~/utils'

export default {
  data() {
    return {
      win: new Audio('./sounds/win.mp3'),
      lose: new Audio('./sounds/lose.mp3'),
    }
  },
  sockets: {
    // user, users
    joinRoomSocketEmit(data) {
      logger('SOCKETS joinRoomSocketEmit', data, 'i')
      if (Object.keys(data).length === 2) {
        this.$store.commit(`ws/setUserSocket`, data.user)
        this.$store.commit('game/startGame', false)
      }
      this.$store.commit(`ws/updateUsersSocket`, data.users)
      this.$router.push('/home')
      if (this.fastGame) {
        this.$store.dispatch('ws/startGameSocket')
        // this.$store.commit(`game/setFastGame`, false)
      }
    },
    // user, users
    startGameSocketEmit(data) {
      logger('SOCKETS startGameSocketEmit', data, 'i')
      this.$store.commit(`ws/updateUsersSocket`, data.users)
      this.$store.commit('ws/setUserTurnSocket', data.user.user)
      this.$store.commit('game/startGame', true)
      this.$store.commit('game/initDices')
      this.$store.commit('game/resetStats')
      if (this.fastGame) {
        this.$store.commit(`game/setFastGame`, false)
      }
    },
    updateGameSocketEmit(users) {
      logger('SOCKETS updateGameSocketEmit', users, 'i')
      this.$store.commit(`ws/updateUsersSocket`, users)
      this.$store.commit('game/newGame', false)
      this.$store.commit('game/initMatch')
      this.$store.commit('game/initDices')
      this.$store.commit('game/resetStats')
    },
    finishGameSocketEmit(users) {
      logger('SOCKETS finishGameSocketEmit', users, 'i')
      let type = ''
      let message = ''
      const currentUser = users.filter(
        (u) => u.user.uid === this.userDetailsFirebase.uid
      )[0]
      if (users[0].user.uid === this.userDetailsFirebase.uid) {
        type = 'success'
        message = this.$t('notification.win')
        play(this.win)
      } else {
        type = 'alert'
        message = this.$t('notification.lose') + users[0].user.name
        play(this.lose)
      }
      this.$store.commit('game/toggleNotification', {
        type,
        message,
      })
      this.$store
        .dispatch(`firebase/updateRecordUser`, {
          details: currentUser,
          chart_1: this.totalHistorical,
          chart_2: this.probablyExitNumbers,
        })
        .then(() => {
          this.$store.commit('game/newGame', currentUser.turnOn)
          this.$store.commit(`game/resetTurn`)
        })
    },
    finishTurnSocketEmit(data) {
      logger('SOCKETS finishTurnSocketEmit', data, 'i')
      this.$store.commit(`ws/updateUsersSocket`, data.usersIntoRoom)
      this.$store.commit('ws/setUserTurnSocket', data.userTurn)
      if (data.userTurn.uid === this.userDetailsFirebase.uid) {
        this.$store.commit(`game/setDisabledButtonGame`, false)
      }

      const mapGames = {}
      Object.keys(this.game).map((t) => {
        if (this.currentGamePlayed.includes(t)) {
          mapGames[t] = 0
          Object.keys(this.game[t].data).map((g) => {
            if (this.game[t].data[g].value !== '-') {
              mapGames[t]++
            }
          })
        }
      })
      let check = false
      Object.keys(mapGames).map((g) => {
        check = mapGames[g] === 13
      })
      if (check) {
        this.$store.dispatch('ws/finishGameSocket')
      }
    },
    // user, users, room
    leftRoomSocketEmit(data) {
      logger('SOCKETS leftRoomSocketEmit', data, 'i')
      if (data) {
        this.$store.commit(`ws/updateUsersSocket`, data.users)
        if (data.userTurn) {
          this.$store.commit('ws/setUserTurnSocket', data.userTurn)
        }
        this.$store.commit(`game/toggleNotification`, {
          type: 'alert',
          message: data.user.name + this.$t('home.notification_3'),
        })
      }
    },
    socketErrorEmit(err) {
      logger('SOCKETS socketErrorEmit', err, 'i')
      this.$store.dispatch(`firebase/logErrors`, {
        message: err.message,
        type: 'error_socket',
      })
    },
    /* socketDisconnectEmit() {
      logger('SOCKETS socketDisconnectEmit', null, 'i')
      this.$store.dispatch(`firebase/logErrors`, {
        message: this.$t('alert.socket_disconnect'),
        type: 'disconnect_socket',
      })
    }, */
  },
  computed: {
    ...mapState('game', {
      totalHistorical: (state) => state.totalHistorical,
      probablyExitNumbers: (state) => state.probablyExitNumbers,
      fastGame: (state) => state.fastGame,
      currentGamePlayed: (state) => state.currentGamePlayed,
      game: (state) => state.game,
    }),
    ...mapState('firebase', {
      userDetailsFirebase: (state) => state.userDetailsFirebase,
    }),
  },
}
