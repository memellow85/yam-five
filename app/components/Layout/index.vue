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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { resize } from '~/directives/resize'
import { getLocalStorageKey, setLocalStorageKey } from '~/utils'

export default {
  directives: { resize },
  data() {
    return {
      timeReset: null,
      visible: true,
      deferredPrompt: null,
    }
  },
  head() {
    return {
      link: [
        {
          rel: 'canonical',
          href: 'https://yamfive-app.herokuapp.com/' + this.$route.path,
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
    }),
    ...mapState('ws', {
      userSocket: (state) => state.userSocket,
    }),
  },
  created() {
    // TODO Update con funzione
    if (process.env.NODE_ENV === 'production') {
      if (location.protocol !== 'https:') {
        location.replace(
          `https:${location.href.substring(location.protocol.length)}`
        )
      }
    }

    this.$nuxt.$on('refreshPWAHandler', () => {
      this.refreshPWAHandler()
    })
    this.$nuxt.$on('addToHomeHandler', () => {
      this.addToHomeHandler()
    })

    if (getLocalStorageKey('version') !== process.env.NUXT_ENV_APP_VERSION) {
      this.$store.commit('game/toggleNotification', {
        type: 'warning',
        message: this.$t('alert.message_update'),
        buttonRefresh: true,
      })
    }
  },
  beforeMount() {
    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault()
      setLocalStorageKey('version', process.env.NUXT_ENV_APP_VERSION)
      this.deferredPrompt = event
      this.$store.commit('game/toggleNotification', {
        type: 'warning',
        message: 'Add to home YamFive',
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
    refreshPWAHandler() {
      setLocalStorageKey('version', process.env.NUXT_ENV_APP_VERSION)
      window.location.reload()
    },
    async addToHomeHandler() {
      this.$store.commit('game/toggleNotification', null)
      this.deferredPrompt.prompt()
      await this.deferredPrompt.userChoice
      this.deferredPrompt = null
    },
    visibilityChange() {
      if (this.userFirebase) {
        if (!this.visible) {
          clearTimeout(this.timeReset)
        } else {
          this.timeReset = setTimeout(() => {
            this.$store.dispatch('ws/leftRoomSocket')
            this.$store.dispatch('firebase/logout').then(() => {
              this.$router.push('/')
            })
          }, 300000)
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
