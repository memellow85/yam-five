import { getLocalStorageKey } from '~/utils'

export default {
  data() {
    return {
      bodyClass: '',
    }
  },
  created() {
    this.updateThemeHandler()
    this.$nuxt.$on('updateThemeHandler', () => {
      this.updateThemeHandler()
    })
  },
  methods: {
    updateThemeHandler() {
      if (getLocalStorageKey('theme') !== 'dynamic') {
        this.bodyClass = `theme--${getLocalStorageKey('theme') || 'default'}`
      } else {
        this.checkDynamicThemeByHour()
      }
    },
    checkDynamicThemeByHour() {
      const nowHours = new Date().getHours()
      this.bodyClass =
        (nowHours >= 18 && nowHours < 24) || (nowHours >= 0 && nowHours < 7)
          ? `theme--dark`
          : `theme--default`
    },
  },
}
