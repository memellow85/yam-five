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
    <div class="container-btn">
      <button :disabled="room === ''" @click="submitHandler">
        {{ tab === 'create' ? $t('config.btn_4') : $t('config.btn_1') }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
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
    ...mapState({
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
      this.$store.commit('game/toogleModal', 'config')
      if (this.tab === 'create') {
        this.$store.dispatch('createRoomsFirebase', {
          user: this.userDetailsFirebase,
          room: this.room,
          match,
          type: this.currentGame,
        })
      } else {
        this.$store.dispatch('joinRoomsFirebase', {
          user: this.userDetailsFirebase,
          room: this.room,
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
/*
.wrapper-form-join {
  @include margin(15px null null null);
  .container-btn {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
::v-deep span {
  &.yamicons {
    top: 10px;
  }
}
.focus {
  ::v-deep span {
    &.yamicons {
      &:before {
        color: $primary;
      }
    }
  }
}
input[type='text'] {
  &::-webkit-input-placeholder {
    @include padding(null null null 25px);
    color: $color-6;
    line-height: 20px;
  }
}
*/
</style>
