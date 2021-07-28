<template>
  <transition
    name="overlay"
    :duration="{ enter: 0, leave: 500 }"
    enter-active-class="animated"
    leave-active-class="animated"
  >
    <div v-if="showAlert" class="wrapper-modal">
      <div class="overlay-modal" @click="closeHandler"></div>
      <div class="content-modal">
        <h3>{{ message }}</h3>
        <div class="flex-between">
          <button class="red" @click="closeHandler">
            {{ $t('alert.no') }}
          </button>
          <button @click="confirmHandler">{{ $t('alert.yes') }}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    message: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState('game', {
      showAlert: (state) => state.showAlert,
    }),
  },
  methods: {
    closeHandler() {
      this.$store.commit(`game/toggleModal`, 'alert')
    },
    confirmHandler() {
      this.$store.commit(`game/toggleModal`, 'alert')
      this.$nuxt.$emit('confirmSubmitHandler')
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper-modal {
  @include position(fixed, 0 0);
  opacity: 1;
  &.animated {
    opacity: 0;
  }
  .overlay-modal {
    @include position(relative, 0 0);
    @include size(100vw, 100vh);
    background: $bck-overlay;
  }
  .content-modal {
    @include position(absolute, 50% 50%);
    @include size(70%, 5.5rem);
    @include padding(1rem);
    transform: translate(-50%, -50%);
    background: $white;
    h3 {
      @include margin(0);
      @include padding(0 null 1rem);
    }
  }
}
</style>
