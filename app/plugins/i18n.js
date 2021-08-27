import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { getLocalStorageKey, setLocalStorageKey } from '~/utils'

const it = require('~/locales/it.json')
const en = require('~/locales/en.json')

Vue.use(VueI18n)

export default ({ app }) => {
  let lang = ''
  if (getLocalStorageKey('lang')) {
    lang = getLocalStorageKey('lang')
  } else {
    lang = navigator.language.split('-')[0]
    setLocalStorageKey('lang', navigator.language.split('-')[0])
  }

  app.i18n = new VueI18n({
    locale: lang,
    fallbackLocale: 'en',
    messages: {
      en,
      it,
    },
  })
}
