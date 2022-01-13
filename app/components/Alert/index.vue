<template>
  <transition
    name="overlay"
    :duration="{ enter: 0, leave: 500 }"
    enter-active-class="animated"
    leave-active-class="animated"
  >
    <div v-if="showAlert" class="wrapper-modal">
      <div v-touch="closeHandler" class="overlay-modal"></div>
      <div :class="['content-modal', { version: updateVersion }]">
        <div class="content-modal-top">
          <h3>
            <span
              :class="[
                'yamicons mdi',
                {
                  'mdi-cellphone-arrow-down': updateVersion,
                  'mdi-alert-rhombus': !updateVersion,
                },
              ]"
            ></span>
            {{ getTitle() }}
          </h3>
          <p v-if="updateVersion" v-html="getMessage()"></p>
          <p v-else>{{ message }}</p>
        </div>
        <div
          :class="[
            { 'flex-between': !updateVersion, 'flex-center': updateVersion },
          ]"
        >
          <button v-if="!updateVersion" v-touch="closeHandler" class="red">
            {{ $t('alert.no') }}
          </button>
          <button v-if="!updateVersion" v-touch="confirmHandler">
            {{ $t('alert.yes') }}
          </button>
          <button v-if="updateVersion" v-touch="updateHandler">
            {{ $t('alert.update') }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex'
import { versionsRelease } from '~/lists/versions.js'

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
      messageAlert: (state) => state.messageAlert,
      titleAlert: (state) => state.titleAlert,
      updateVersion: (state) => state.updateVersion,
    }),
  },
  methods: {
    getTitle() {
      return this.updateVersion ? this.titleAlert : this.$t('alert.title')
    },
    getMessage() {
      return `${
        this.messageAlert
      }<br /><br />${versionsRelease[0].messages.join(
        '<br />'
      )}<br /><br />${this.$t('alert.message_update_2')}`
    },
    closeHandler() {
      this.$store.commit(`game/toggleModal`, 'alert')
    },
    confirmHandler() {
      this.$store.commit(`game/toggleModal`, 'alert')
      this.$nuxt.$emit('confirmSubmitHandler')
    },
    updateHandler() {
      this.$store.commit(`game/toggleModal`, 'alert')
      this.$nuxt.$emit('refreshPWAHandler')
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
    @include themed() {
      background: rgba(t($key-color-8), 0.5);
    }
  }
  .content-modal {
    @include position(absolute, 50% 50%);
    @include size(70%, 7.5rem);
    @include padding(1rem);
    border-radius: $rounded;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .content-modal-top {
      h3 {
        @include margin(0 0 1rem 0);
      }
    }
    @include themed() {
      background: t($key-color-0);
    }
    &.version {
      @include size(70%, 15.5rem);
    }
  }
}
</style>
