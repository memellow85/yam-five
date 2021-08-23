<template>
  <div class="wrapper-form-bug-feature">
    <div class="flex">
      <div v-for="r in types" :key="r.code" class="radio-button">
        <label class="radio">
          <span class="radio__input">
            <input
              :id="r.code"
              v-model="typeModel"
              type="radio"
              name="bugs_features"
              :value="r.code"
            />
            <span class="radio__control"></span>
          </span>
          <span class="radio__label">{{ $t(r.name) }}</span>
        </label>
      </div>
    </div>
    <FormsInput
      :name="$t('release.form_1')"
      :show-label="false"
      :icon="'message-text-outline'"
      :show-icon="message === ''"
      :class="['textarea', { focus: focus === 'message' }]"
    >
      <textarea
        id="message"
        v-model="message"
        autocomplete="off"
        name="message"
        :placeholder="$t('release.form_1')"
        @focus="focus = 'message'"
        @blur="focus = ''"
        @keypress.enter="submitHandler"
      />
    </FormsInput>
    <div class="container-btn flex-between">
      <a href="javascript: void(0)" @click="issueHandler">
        {{ $t('release.link_1') }}
      </a>
      <button :disabled="message === ''" @click="submitHandler">
        {{ $t('release.btn_1') }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      types: [
        {
          code: 'bug',
          name: 'release.bug',
        },
        {
          code: 'feature',
          name: 'release.feature',
        },
      ],
      typeModel: 'bug',
      focus: '',
      message: '',
    }
  },
  methods: {
    issueHandler() {
      this.$router.push({ name: 'game-issue' })
    },
    submitHandler() {
      if (this.message !== '') {
        this.$store
          .dispatch(`firebase/reportAIssue`, {
            type: this.typeModel,
            message: this.message,
          })
          .then(() => {
            this.$store.commit('game/toggleNotification', {
              type: 'success',
              message: this.$t('release.message_1'),
            })
            this.resetHandler()
          })
          .catch((err) => {
            this.$store.commit('game/toggleNotification', {
              type: 'alert',
              message: err,
            })
          })
      }
    },
    resetHandler() {
      this.typeModel = 'bug'
      this.message = ''
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper-form-bug-feature {
  @include margin(null null 1rem);
  > div {
    &:first-child {
      @include margin(null null 1rem);
    }
  }
}
</style>
