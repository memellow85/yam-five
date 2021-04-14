<template>
  <div class="wrapper-form-languages">
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
        <span class="radio__label">{{ r.name }}</span>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      langs: [
        {
          code: 'en',
          name: this.$t('language.en'),
        },
        {
          code: 'it',
          name: this.$t('language.it'),
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
  methods: {
    changeHandler(lang) {
      this.$i18n.locale = lang
    },
  },
}
</script>

<style lang="scss" scoped>
/*
.wrapper-form-languages {
  display: flex;
}
*/
</style>
