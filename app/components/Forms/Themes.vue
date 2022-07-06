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
import { mapState } from 'vuex'
import { getLocalStorageKey, setLocalStorageKey } from '~/utils'

export default {
  data() {
    return {
      currentTheme: 'default',
      themes: [
        {
          code: 'dynamic',
          name: 'themes.default',
        },
        {
          code: 'default',
          name: 'themes.light',
        },
        {
          code: 'dark',
          name: 'themes.dark',
        },
      ],
    }
  },
  computed: {
    ...mapState('firebase', {
      userDetailsFirebase: (state) => state.userDetailsFirebase,
    }),
  },
  watch: {
    currentTheme() {
      this.changeHandler(this.currentTheme)
    },
  },
  created() {
    this.$nuxt.$on('updateColorHandler', () => {
      this.changeHandler(this.currentTheme)
    })
  },
  mounted() {
    if (getLocalStorageKey('theme')) {
      const theme =
        getLocalStorageKey('theme') === 'dynamic'
          ? 'dynamic'
          : getLocalStorageKey('theme').indexOf('dark') !== -1
          ? 'dark'
          : 'default'
      this.currentTheme = theme
    } else {
      this.currentTheme = 'default'
      setLocalStorageKey('theme', 'default')
    }
  },
  destroyed() {
    this.$nuxt.$off('updateColorHandler')
  },
  methods: {
    changeHandler(theme) {
      if (
        getLocalStorageKey('theme') !== theme ||
        (theme === 'default' &&
          this.userDetailsFirebase &&
          this.userDetailsFirebase.color &&
          this.userDetailsFirebase.color !== '')
      ) {
        let tmpTheme = theme
        if (
          this.userDetailsFirebase.color &&
          this.userDetailsFirebase.color !== '' &&
          theme !== 'dynamic'
        ) {
          tmpTheme =
            theme !== 'default'
              ? `${theme}-${this.userDetailsFirebase.color}`
              : `${this.userDetailsFirebase.color}`
        }
        setLocalStorageKey('theme', tmpTheme)
        this.$nuxt.$emit('updateThemeHandler')
      }
    },
  },
}
</script>
