<template>
  <div
    v-resize
    v-visibility-change="visibilityChange"
    @orientationHandler="orientationHandler"
  >
    <h1>{{ $t('nameapp') }}</h1>
    <nuxt />
    <!-- Notification -->
    <LazyNotification :show-notification="showNotification"></LazyNotification>

    <!-- Overlay help -->
    <LazyOverlay :show-overlay="showHelp">
      <LazyViewHelp></LazyViewHelp>
    </LazyOverlay>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { resize } from '~/directives/resize'

export default {
  directives: { resize },
  data() {
    return {
      timeReset: null,
      visible: true,
    }
  },
  computed: {
    ...mapState({
      userFirebase: (state) => state.userFirebase,
      isLeave: (state) => state.isLeave,
    }),
    ...mapState('game', {
      showNotification: (state) => state.showNotification,
      showHelp: (state) => state.showHelp,
    }),
  },
  created() {
    this.$nuxt.$on('refreshPWAHandler', () => {
      this.refreshPWAHandler()
    })
  },
  destroyed() {
    this.$nuxt.$off('refreshPWAHandler')
  },
  methods: {
    refreshPWAHandler() {
      window.location.reload()
    },
    visibilityChange() {
      if (this.userFirebase) {
        if (!this.visible) {
          clearTimeout(this.timeReset)
        } else {
          this.timeReset = setTimeout(() => {
            if (!this.isLeave) {
              this.$store.dispatch('logout').then(() => {
                this.$router.push('/')
              })
            } else {
              this.$store.dispatch('logoutRoom').then(() => {
                this.$store.dispatch('logout').then(() => {
                  this.$router.push('/')
                })
              })
            }
          }, 180000)
        }
      }
      this.visible = !this.visible
    },
    orientationHandler(ev) {
      if (ev === 90) {
        this.$store.commit('game/toggleNotification', {
          message: this.$t('home.notification_2'),
          type: 'warning',
        })
      } else {
        this.$store.commit('game/toggleNotification')
      }
    },
  },
}
</script>

<style lang="scss">
@import '../assets/scss/common/normalizer';

h1 {
  @extend %h1;
  // @include margin(11px null null null);
  @include font-size(26px, 1);
  @include size(100%, 60px);
  line-height: 50px;
  text-align: center;
}

.container-app {
  @include position(relative, null);
  @include size(100vw, calc(100vh - 60px));
  overflow: hidden;
}
</style>
