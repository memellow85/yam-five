<template>
  <div class="wrapper-animation-menu">
    <NavigationSubNavigation></NavigationSubNavigation>
    <div
      v-resize
      v-visibility-change="visibilityChange"
      :class="['wrapper-layout', { active: showSubMenu }]"
      @orientationHandler="orientationHandler"
    >
      <slot></slot>

      <LazyNotification
        :show-notification="showNotification"
      ></LazyNotification>
      <LazyOverlay :show-overlay="showHelp">
        <LazyViewHelp></LazyViewHelp>
      </LazyOverlay>
      <LazyOverlay :show-overlay="showRelease">
        <LazyViewRelease></LazyViewRelease>
      </LazyOverlay>

      <!-- Alert -->
      <Alert :message="$t('alert.message')"></Alert>
    </div>

    <div
      :class="['mask-overlay-menu', { active: showSubMenu }]"
      @click="closeMenu"
    ></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { resize } from '~/directives/resize'
import ExitMixin from '~/mixins/exit'
import { setLocalStorageKey, isProd } from '~/utils'

export default {
  directives: { resize },
  mixins: [ExitMixin],
  data() {
    return {
      timeReset: null,
      deferredPrompt: null,
    }
  },
  head() {
    return {
      link: [
        {
          rel: 'canonical',
          href: `${process.env.NUXT_ENV_PROD}${this.$route.path}`,
        },
      ],
      meta: [
        {
          name: 'theme-color',
          content:
            localStorage.getItem('yamfive_theme') === 'default'
              ? '#fff'
              : '#343A40',
        },
      ],
    }
  },
  computed: {
    ...mapState('firebase', {
      userFirebase: (state) => state.userFirebase,
      userDetailsFirebase: (state) => state.userDetailsFirebase,
    }),
    ...mapState('game', {
      showNotification: (state) => state.showNotification,
      showHelp: (state) => state.showHelp,
      showRelease: (state) => state.showRelease,
      showSubMenu: (state) => state.showSubMenu,
    }),
    ...mapState('ws', {
      userSocket: (state) => state.userSocket,
    }),
  },
  created() {
    if (isProd()) {
      if (location.protocol !== 'https:') {
        location.replace(
          `https:${location.href.substring(location.protocol.length)}`
        )
      }
    }

    this.$nuxt.$on('refreshPWAHandler', (version) => {
      this.refreshPWAHandler(version)
    })
    this.$nuxt.$on('confirmShareHandler', (data) => {
      this.confirmShareHandler(data)
    })
    this.$nuxt.$on('addToHomeHandler', () => {
      this.addToHomeHandler()
    })
  },
  beforeMount() {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault()
      this.deferredPrompt = event
      this.$store.commit('game/toggleNotification', {
        type: 'warning',
        message: this.$t('alert.add_to_home'),
        buttonAddToHome: true,
      })
    })

    window.addEventListener('appinstalled', () => {
      this.$store.commit('game/toggleNotification', null)
      this.deferredPrompt = null
    })
  },
  destroyed() {
    this.$nuxt.$off('refreshPWAHandler')
    this.$nuxt.$off('confirmShareHandler')
    this.$nuxt.$off('addToHomeHandler')
  },
  methods: {
    closeMenu() {
      this.$store.commit(`game/showSubMenu`, false)
    },
    refreshPWAHandler(version) {
      setLocalStorageKey('version', version)
      window.location.reload()
    },
    confirmShareHandler(data) {
      this.$store.dispatch(`ws/addUserSocket`, {
        user: this.userDetailsFirebase,
        room: data.room,
        match: 0,
        type: '',
        method: 'join',
      })
    },
    async addToHomeHandler() {
      this.$store.commit('game/toggleNotification', null)
      this.deferredPrompt.prompt()
      await this.deferredPrompt.userChoice
      this.deferredPrompt = null
    },
    visibilityChange(evt, hidden) {
      if (this.userFirebase) {
        if (!hidden) {
          clearTimeout(this.timeReset)
          this.timeReset = null
        } else {
          this.timeReset = setTimeout(() => {
            this.leaveAppHandler()
          }, 30000)
        }
      }
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

<style lang="scss" scoped>
.wrapper-animation-menu {
  @include position(relative, null);
  @include size(100%, 100vh);
  @include themed() {
    background: t($key-color-nav);
  }
  overflow: hidden;
  .mask-overlay-menu {
    @include position(absolute, 0 null null 0);
    @include size(100%);
    overflow: hidden;
    visibility: hidden;
    z-index: 21;
    &.active {
      cursor: pointer;
      @include scale(0.85);
      visibility: visible;
      margin-left: -12rem;
    }
  }
  .wrapper-layout {
    @include position(relative, null);
    @include size(100%);
    @include transition(all 0.2s ease-in);
    @include themed() {
      background: t($key-color-0);
    }
    overflow: hidden;
    visibility: visible;
    z-index: 20;
    &.active {
      @include scale(0.85);
      margin-left: -12rem;
    }
  }
}
</style>
