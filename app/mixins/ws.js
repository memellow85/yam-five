import { logger } from '~/utils'

export default {
  sockets: {
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
      const message =
        notificationInfo.count === 0
          ? this.$t('notification.win')
          : this.$t('notification.lose') + notificationInfo.name
      this.$store.commit('game/toggleNotification', {
        type,
        message,
      })
      this.$store.dispatch(`firebase/updateRecordUser`, notificationInfo.user)
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
  },
}
