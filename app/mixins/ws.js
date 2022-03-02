import { mapState } from 'vuex'
import { logger, play, randomColor } from '~/utils'

export default {
  data() {
    return {
      win: new Audio('./sounds/win.mp3'),
      lose: new Audio('./sounds/lose.mp3'),
      usersColor: [],
    }
  },
  sockets: {
    // users login
    loginUsersSocketEmit(users) {
      logger('SOCKETS loginUsersSocketEmit', users, 'i')
      this.$store.commit(`ws/setLoginUsersSocket`, users)
    },
    // user, room
    askJoinMatchSocketEmit(data) {
      logger('SOCKETS askJoinMatchSocketEmit', data, 'i')
      this.$store.commit(`game/toggleModal`, {
        type: 'alert',
        message: this.$t('invite.message_share_1'),
        title: this.$t('invite.title_share'),
        share: true,
        data,
      })
    },
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
      }
    },
    // user
    joinRoomChatSocketEmit(user) {
      logger('SOCKETS joinRoomChatSocketEmit', user, 'i')
      const userJoin = user.user ? user.user : user
      this.$store.commit(`game/writeMessage`, {
        user: userJoin,
        message: `${userJoin.name} is joined`,
        welcome: true,
        color: this.setColor(userJoin),
      })
    },
    // user, message
    newMessageSocketEmit(data) {
      logger('SOCKETS newMessageSocketEmit', data, 'i')
      this.$store.commit(`game/writeMessage`, {
        user: data.user,
        message: data.message,
        global: data.global,
        color: this.setColor(data.user),
      })
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
          if (data.userTurn.match === 0) {
            this.$store.commit('game/newGame', data.userTurn.turnOn)
          }
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
  methods: {
    setColor(userJoin) {
      const checkUser = this.usersColor.filter((u) => u.uid === userJoin.uid)
      let color = randomColor()
      if (checkUser.length > 0) {
        color = checkUser[0].color
      } else {
        this.usersColor.push({
          uid: userJoin.uid,
          color,
        })
      }
      return color
    },
  },
}
