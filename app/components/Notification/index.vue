<template>
  <transition
    name="overlay"
    :duration="{ enter: 0, leave: 500 }"
    enter-active-class="animated"
    leave-active-class="animated"
  >
    <div v-if="showNotification" class="notification-container">
      <div
        v-touch="() => $store.commit('game/toggleNotification', null)"
        class="notification-mask"
      ></div>
      <div
        v-touch="() => $store.commit('game/toggleNotification', null)"
        :class="['notification-content flex-between', notificationTypes]"
      >
        <p class="flex">
          <span
            :class="[
              'yamicons mdi',
              {
                'mdi-close-thick': notificationTypes === 'alert',
                'mdi-alert-rhombus': notificationTypes === 'warning',
                'mdi-glass-wine': notificationTypes === 'success',
              },
            ]"
          ></span>
          {{ notificationMessage }}
        </p>
        <button v-if="buttonAddToHome" v-touch="addToHome">
          {{ $t('notification.add') }}
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import { play } from '~/utils'

export default {
  props: {
    showNotification: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      sound: new Audio('./sounds/notification.mp3'),
    }
  },
  computed: {
    ...mapState('game', {
      notificationTypes: (state) => state.notificationTypes,
      notificationMessage: (state) => state.notificationMessage,
      notificationTimer: (state) => state.notificationTimer,
      notificationSound: (state) => state.notificationSound,
      buttonAddToHome: (state) => state.buttonAddToHome,
    }),
  },
  watch: {
    $props: {
      handler() {
        if (this.showNotification && this.notificationSound) {
          play(this.sound)
        }
        if (this.notificationTimer && this.showNotification) {
          setTimeout(() => {
            this.$store.commit('game/toggleNotification', null)
          }, 2500)
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    addToHome() {
      this.$nuxt.$emit('addToHomeHandler')
    },
  },
}
</script>

<style lang="scss" scoped>
.notification-container {
  @include position(fixed, null null 0 0);
  @include size(100%);
  transition: all 0.5s;
  z-index: 100;
  opacity: 1;
  &.animated {
    opacity: 0;
    bottom: -100%;
  }
  .notification-mask {
    @include size(100%, calc(100% - 5rem));
    transition: all 1s;
  }
  .notification-content {
    @include padding(1rem);
    @include size(calc(100vw - 2rem), 3rem);
    border-width: 0.05rem;
    border-top-style: solid;
    p {
      color: $color-9;
      span {
        @include margin(null 0.4rem null null);
      }
    }
    &.alert {
      background: $error-bck;
      border-color: $error;
      .yamicons {
        &:before {
          color: $error;
        }
      }
      button {
        background: $error;
        border-color: $error;
      }
    }
    &.warning {
      background: $warning-bck;
      border-color: $warning;
      .yamicons {
        &:before {
          color: $warning;
        }
      }
      button {
        background: $warning;
        border-color: $warning;
      }
    }
    &.success {
      background: $success-bck;
      border-color: $primary;
      .yamicons {
        &:before {
          color: $primary;
        }
      }
      button {
        background: $primary;
        border-color: $primary;
      }
    }
  }
}
</style>
