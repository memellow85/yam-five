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
      this.bodyClass = `theme--${getLocalStorageKey('theme') || 'default'}`
    },
  },
}
