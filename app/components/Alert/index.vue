<template>
  <transition
    name="overlay"
    :duration="{ enter: 0, leave: 500 }"
    enter-active-class="animated"
    leave-active-class="animated"
  >
    <div v-if="showAlert" class="wrapper-modal">
      <div v-touch="closeHandler" class="overlay-modal"></div>
      <div :class="['content-modal', { version: typeModal === 'update' }]">
        <div class="content-modal-top">
          <h3>
            <span
              :class="[
                'yamicons mdi',
                {
                  'mdi-cellphone-arrow-down': useVersion,
                  'mdi-alert-rhombus': !useVersion,
                },
              ]"
            ></span>
            {{ getTitle() }}
          </h3>
          <p v-html="getMessage()"></p>
        </div>
        <div
          :class="[
            { 'flex-between': multipleButton, 'flex-center': useVersion },
          ]"
        >
          <button v-if="multipleButton" v-touch="closeHandler" class="red">
            {{ $t('alert.no') }}
          </button>
          <button v-if="multipleButton" v-touch="confirmHandler">
            {{ $t('alert.yes') }}
          </button>
          <button v-if="useVersion" v-touch="updateHandler">
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
      messageModal: (state) => state.messageModal,
      titleModal: (state) => state.titleModal,
      typeModal: (state) => state.typeModal,
      dataModal: (state) => state.dataModal,
      newVersion: (state) => state.newVersion,
    }),
    multipleButton() {
      return this.typeModal === 'share' || !this.typeModal
    },
    useVersion() {
      return this.typeModal === 'update'
    },
  },
  methods: {
    getTitle() {
      switch (this.typeModal) {
        case 'update':
        case 'share':
          return this.titleModal
        default:
          return this.$t('alert.title')
      }
    },
    getMessage() {
      switch (this.typeModal) {
        case 'update':
          return `${
            this.messageModal
          }<br /><br />${versionsRelease[0].messages.join(
            '<br />'
          )}<br /><br />${this.$t('alert.message_update_2')}`
        case 'share':
          return this.messageModal
        default:
          return this.message
      }
    },
    closeHandler() {
      this.$store.commit(`game/toggleModal`, 'alert')
    },
    confirmHandler() {
      this.$store.commit(`game/toggleModal`, 'alert')
      if (this.typeModal === 'share')
        this.$nuxt.$emit('confirmShareHandler', this.dataModal)
      else this.$nuxt.$emit('confirmSubmitHandler')
    },
    updateHandler() {
      this.$store.commit(`game/toggleModal`, 'alert')
      this.$nuxt.$emit('refreshPWAHandler', this.newVersion)
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
