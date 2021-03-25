import Vue from 'vue'
import VueI18n from 'vue-i18n'

const it = require('~/locales/it.json')
const en = require('~/locales/en.json')

Vue.use(VueI18n)

export default ({ app }) => {
  app.i18n = new VueI18n({
    locale: navigator.language.split('-')[0],
    fallbackLocale: 'en',
    messages: {
      en,
      it,
    },
  })
}
