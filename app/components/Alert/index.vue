<template>
  <transition
    name="overlay"
    :duration="{ enter: 0, leave: 500 }"
    enter-active-class="animated"
    leave-active-class="animated"
  >
    <div v-if="showAlert" class="wrapper-modal">
      <div v-touch="closeHandler" class="overlay-modal"></div>
      <div class="content-modal">
        <h3>{{ message }}</h3>
        <div class="flex-between">
          <button v-touch="closeHandler" class="red">
            {{ $t('alert.no') }}
          </button>
          <button v-touch="confirmHandler">{{ $t('alert.yes') }}</button>
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
    // background: $bck-overlay;
    @include themed() {
      background: rgba(t($key-color-8), 0.5);
    }
  }
  .content-modal {
    @include position(absolute, 50% 50%);
    @include size(70%, 5.5rem);
    @include padding(1rem);
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // background: $white;
    @include themed() {
      background: t($key-color-0);
    }
    h3 {
      @include margin(0);
    }
  }
}
</style>
