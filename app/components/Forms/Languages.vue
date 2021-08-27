<template>
  <div class="wrapper-form-languages flex">
    <div v-for="r in langs" :key="r.code" class="radio-button">
      <label class="radio">
        <span class="radio__input">
          <input
            :id="r.code"
            v-model="currentLang"
            type="radio"
            name="languages"
            :value="r.code"
          />
          <span class="radio__control"></span>
        </span>
        <span class="radio__label">{{ $t(r.name) }}</span>
      </label>
    </div>
  </div>
</template>

<script>
import { getLocalStorageKey, setLocalStorageKey } from '~/utils'

export default {
  data() {
    return {
      langs: [
        {
          code: 'en',
          name: 'language.en',
        },
        {
          code: 'it',
          name: 'language.it',
        },
      ],
      currentLang: this.$i18n.locale,
    }
  },
  watch: {
    currentLang() {
      this.changeHandler(this.currentLang)
    },
  },
  mounted() {
    this.currentLang = getLocalStorageKey('lang') || this.$i18n.locale
  },
  methods: {
    changeHandler(lang) {
      if (getLocalStorageKey('lang') !== lang) {
        setLocalStorageKey('lang', lang)
      }
      this.$i18n.locale = lang
    },
  },
}
</script>
