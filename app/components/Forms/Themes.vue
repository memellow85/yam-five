<template>
  <div class="wrapper-form-sounds flex">
    <div v-for="r in themes" :key="r.code" class="radio-button">
      <label class="radio">
        <span class="radio__input">
          <input
            :id="r.code"
            v-model="currentTheme"
            type="radio"
            name="theme"
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
      currentTheme: 'default',
      themes: [
        {
          code: 'default',
          name: 'themes.default',
        },
        {
          code: 'dark',
          name: 'themes.dark',
        },
      ],
    }
  },
  watch: {
    currentTheme() {
      this.changeHandler(this.currentTheme)
    },
  },
  mounted() {
    this.currentTheme = getLocalStorageKey('theme')
      ? getLocalStorageKey('theme')
      : 'default'
  },
  methods: {
    changeHandler(theme) {
      if (getLocalStorageKey('theme') !== theme) {
        setLocalStorageKey('theme', theme)
        this.$nuxt.$emit('updateThemeHandler')
      }
    },
  },
}
</script>
