export default {
  methods: {
    onCopy() {
      this.$store.commit('game/toggleNotification', {
        type: 'success',
        message: `${this.$t('copy.alert_message_success')}`,
      })
    },
    onError() {
      this.$store.commit('game/toggleNotification', {
        type: 'alert',
        message: `${this.$t('copy.alert_message_error')}`,
      })
    },
  },
}
