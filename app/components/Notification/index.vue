<template>
  <transition
    name="overlay"
    :duration="{ enter: 0, leave: 500 }"
    enter-active-class="animated"
    leave-active-class="animated"
  >
    <div v-if="showNotification" class="notification-container">
      <div
        class="notification-mask"
        @click="$store.commit('game/toggleNotification', null)"
      ></div>
      <div
        :class="['notification-content', notificationTypes]"
        @click="$store.commit('game/toggleNotification', null)"
      >
        <p>
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
        <button v-if="buttonRefresh" @click="refreshPWA">
          {{ $t('notification.refresh') }}
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    showNotification: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState('game', {
      notificationTypes: (state) => state.notificationTypes,
      notificationMessage: (state) => state.notificationMessage,
      buttonRefresh: (state) => state.buttonRefresh,
    }),
  },
  methods: {
    refreshPWA() {
      this.$nuxt.$emit('refreshPWAHandler')
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
    @include size(100%, calc(100% - 80px));
    transition: all 1s;
  }
  .notification-content {
    @include padding(15px);
    @include size(calc(100vw - 30px), 50px);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-width: 1px;
    border-top-style: solid;
    display: flex;
    align-items: center;
    justify-content: space-between;
    p {
      @extend %strong;
      display: flex;
      align-items: center;
      span {
        @include margin(null 5px null null);
      }
    }
    &.alert {
      background: $error-bck;
      border-color: $error;
      p {
        span {
          color: $error;
        }
      }
      button {
        background: $error;
      }
    }
    &.warning {
      background: $warning-bck;
      border-color: $warning;
      p {
        span {
          color: $warning;
        }
      }
      button {
        background: $warning;
      }
    }
    &.success {
      background: $success-bck;
      border-color: $primary;
      p {
        span {
          color: $primary;
        }
      }
      button {
        background: $primary;
      }
    }
  }
}
</style>
