<template>
  <div
    v-resize
    v-visibility-change="visibilityChange"
    @orientationHandler="orientationHandler"
  >
    <slot></slot>
    <LazyNotification :show-notification="showNotification"></LazyNotification>
    <LazyOverlay :show-overlay="showHelp">
      <LazyViewHelp></LazyViewHelp>
    </LazyOverlay>
    <LazyOverlay :show-overlay="showRelease">
      <LazyViewRelease></LazyViewRelease>
    </LazyOverlay>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { resize } from '~/directives/resize'
import { setLocalStorageKey, isProd } from '~/utils'

export default {
  directives: { resize },
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
    }),
    ...mapState('game', {
      showNotification: (state) => state.showNotification,
      showHelp: (state) => state.showHelp,
      showRelease: (state) => state.showRelease,
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
    this.$nuxt.$off('addToHomeHandler')
  },
  methods: {
    refreshPWAHandler(version) {
      setLocalStorageKey('version', version)
      window.location.reload()
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
            this.$store.dispatch('ws/leftRoomSocket')
            this.$store.dispatch('firebase/logout').then(() => {
              this.$router.push('/')
            })
          }, 300000)
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
