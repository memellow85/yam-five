export default {
  methods: {
    leaveAppHandler() {
      this.$store.commit(`game/showSubMenu`, false)
      this.$store.dispatch('ws/leftRoomSocket')
      this.$store.dispatch('firebase/logout').then(() => {
        this.$router.push('/')
      })
    },
  },
}
