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
    redirectHome() {
      logger('SOCKETS redirectHome', '', 'i')
      this.$router.push('/home')
      if (this.fastGame) {
        this.$store.dispatch(`game/startGame`)
        this.$store.commit(`game/setFastGame`, false)
      }
    },
    updateUsersSocketEmit(users) {
      logger('SOCKETS updateUsersSocketEmit', users, 'i')
      this.$store.commit(`ws/updateUsersSocket`, users)
    },
    updateUserSocketEmit(user) {
      logger('SOCKETS updateUserSocketEmit', user, 'i')
      this.$store.commit(`ws/setUserSocket`, user)
      this.$store.commit('game/startGame', false)
    },
    setUserTurnSocketEmit(user) {
      logger('SOCKETS setUserTurnSocketEmit', user, 'i')
      if (user.user.uid === this.userDetailsFirebase.uid) {
        this.$store.commit(`game/setDisabledButtonGame`, false)
      }
      this.$store.commit('ws/setUserTurnSocket', user)
    },
    startGameSocketEmit(user) {
      logger('SOCKETS startGameSocketEmit', user, 'i')
      this.$store.commit('game/startGame', true)
      this.$store.commit('game/initDices')
      this.$store.commit('ws/setUserTurnSocket', user)
    },
    winnerIsSocketEmit(notificationInfo) {
      logger('SOCKETS winnerIsSocketEmit', notificationInfo, 'i')
      const type = notificationInfo.count === 0 ? 'success' : 'alert'
      let message = ''
      if (notificationInfo.count === 0) {
        message = this.$t('notification.win')
        play(this.win)
      } else {
        message = this.$t('notification.lose') + notificationInfo.name
        play(this.lose)
      }
      this.$store.commit('game/toggleNotification', {
        type,
        message,
        withoutSound: true,
      })
      this.$store.dispatch(`firebase/updateRecordUser`, {
        details: notificationInfo.user,
        chart_1: this.totalHistorical,
        chart_2: this.probablyExitNumbers,
      })
    },
    newGameSocketEmit(value) {
      logger('SOCKETS newGameSocketEmit', value, 'i')
      this.$store.dispatch(`game/newGame`, value)
    },
    userLeaveMatchSocketEmit(user) {
      logger('SOCKETS userLeaveMatchSocketEmit', user, 'i')
      this.$store.commit(`game/toggleNotification`, {
        type: 'alert',
        message: user.user.name + this.$t('home.notification_3'),
      })
    },
    resetUserSocketEmit() {
      logger('SOCKETS resetUserSocketEmit', null, 'i')
      this.$store.commit('game/newGame', false)
      this.$store.commit('game/initDices')
      this.$store.commit('game/initMatch')
      this.$store.commit('game/resetStats')
    },
    socketErrorEmit(err) {
      logger('SOCKETS socketErrorEmit', err, 'i')
      this.$store.commit(`game/toggleNotification`, {
        type: 'alert',
        message: err.message,
      })
    },
  },
  computed: {
    ...mapState('game', {
      totalHistorical: (state) => state.totalHistorical,
      probablyExitNumbers: (state) => state.probablyExitNumbers,
      fastGame: (state) => state.fastGame,
    }),
    ...mapState('firebase', {
      userDetailsFirebase: (state) => state.userDetailsFirebase,
    }),
  },
}
