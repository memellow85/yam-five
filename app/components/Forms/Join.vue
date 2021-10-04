<template>
  <div class="wrapper-form-join">
    <FormsInput
      :name="$t('config.form_2')"
      :show-label="false"
      :icon="'door'"
      :show-icon="room === ''"
      :class="['textinput', { focus: focus === 'room' }]"
    >
      <input
        id="room"
        v-model="room"
        autocomplete="off"
        name="room"
        type="text"
        class="big"
        :placeholder="$t('config.form_2')"
        @focus="focus = 'room'"
        @blur="focus = ''"
        @keypress.enter="submitHandler"
      />
    </FormsInput>
    <div class="container-btn flex-end">
      <button v-touch="submitHandler" :disabled="room === ''">
        {{ tab === 'create' ? $t('config.btn_4') : $t('config.btn_1') }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AnalyticsCmpMixin from '~/mixins/analytics_cmp'

export default {
  mixins: [AnalyticsCmpMixin],
  props: {
    tab: {
      type: String,
      default: 'create',
    },
  },
  data() {
    return {
      focus: '',
      room: '',
    }
  },
  computed: {
    ...mapState('game', {
      currentGame: (state) => state.currentGame,
    }),
    ...mapState('firebase', {
      userDetailsFirebase: (state) => state.userDetailsFirebase,
    }),
  },
  methods: {
    submitHandler() {
      let match = 52
      switch (this.currentGame) {
        case 'short':
          match = 26
          break
        case 'veryshort':
          match = 13
          break
      }
      this.logCustomEvent(this.tab)
      this.$store.dispatch(`ws/addUserSocket`, {
        user: this.userDetailsFirebase,
        room: this.room,
        match,
        type: this.currentGame,
        method: this.tab,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper-form-join {
  @include margin(1rem null null);
}
</style>
