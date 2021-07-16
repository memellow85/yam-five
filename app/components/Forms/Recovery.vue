<template>
  <div class="offline">
    <div class="inner-offline">
      <h2>{{ $t('recovery.title') }}</h2>

      <FormsInput
        :name="$t('recovery.form')"
        :show-label="false"
        :icon="'at'"
        :show-icon="recovery === ''"
        :class="['textinput', { focus: focus === 'recovery' }]"
      >
        <input
          id="recovery"
          v-model="recovery"
          autocomplete="off"
          name="recovery"
          type="text"
          class="big"
          :disabled="disabledAll"
          :placeholder="$t('recovery.form')"
          @focus="focus = 'recovery'"
          @blur="focus = ''"
          @keypress.enter="submitHandler"
        />
      </FormsInput>

      <NavigationPublic
        recovery
        :loader="showLoader"
        :disabled="recovery === ''"
      ></NavigationPublic>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      focus: '',
      recovery: '',
      disabledAll: false,
      showLoader: false,
    }
  },
  methods: {
    submitHandler() {
      if (this.recovery !== '') {
        this.disabledAll = true
        this.showLoader = true
        this.$store
          .dispatch('firebase/recovery', {
            recovery: this.recovery,
          })
          .then(() => {
            this.$router.push('/')
          })
          .catch((msg) => {
            this.$store.commit('game/toggleNotification', {
              type: 'alert',
              message: msg,
            })
            this.showLoader = false
            this.disabledAll = false
          })
      }
    },
  },
}
</script>
