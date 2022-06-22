export default {
  methods: {
    actionsHandler(data) {
      if (data.name === 'submenu') {
        this.$store.commit(`game/showSubMenu`, true)
      } else {
        this.$store.commit(`game/showSubMenu`, false)
        this.$router.push({ name: data.name })
      }
    },
    getIconName(elm) {
      return this.$route.name === elm.name
        ? elm.icon.replace('-outline', '')
        : elm.icon
    },
  },
}
