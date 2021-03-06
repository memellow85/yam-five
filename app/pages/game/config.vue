<template>
  <section class="wrapper-page">
    <article class="flex-between">
      <h3>
        <span class="yamicons mdi mdi-cog-outline"></span>
        {{ $t('view.configuration') }}
      </h3>
      <button v-touch="leaveAppHandler" class="small grey">
        <span>{{ $t('config.btn_3') }}</span>
      </button>
    </article>
    <div class="main body-scroll-lock-ignore-inner">
      <article class="wrapper-welcome">
        <h2>
          {{ $t('config.title_6') }}
          {{ userDetailsFirebase ? userDetailsFirebase.name : '-' }}
        </h2>
        <div class="flex-between">
          <p>
            {{ $t('config.message_3') }}:
            {{ dateLastMatch }}
          </p>
          <p>
            {{ $t('config.message_4') }}:
            {{ userDetailsFirebase ? userDetailsFirebase.match : '-' }}
          </p>
        </div>
        <div v-if="campaignActive">
          <h4>{{ $t('config.message_6') }}</h4>
          <div class="flex-between">
            <p>{{ currentCampaign.name }}</p>
            <p>{{ currentCampaign.end }}</p>
          </div>
        </div>
      </article>
      <article>
        <h4>{{ $t('config.title_10') }}</h4>
        <FormsHelper></FormsHelper>
      </article>
      <article class="wrapper-tabs-form">
        <ul class="inline custom-tabs">
          <li
            v-touch="() => setTab('create')"
            :class="[
              'center',
              { active: tab === 'create', disabled: userSocket },
            ]"
          >
            <h4>{{ $t('config.tab_1') }}</h4>
          </li>
          <li
            v-touch="() => setTab('join')"
            :class="[
              'center',
              { active: tab === 'join', disabled: userSocket },
            ]"
          >
            <h4>{{ $t('config.tab_2') }}</h4>
          </li>
        </ul>
        <div v-if="tab === 'create' && !userSocket" class="wrapper-forms">
          <h4>{{ $t('config.title_3') }}</h4>
          <FormsGames></FormsGames>
        </div>
        <FormsJoin v-if="!userSocket" :tab="tab"></FormsJoin>
        <p v-else class="text-inner">
          {{ $t('config.join_1') }}<strong>{{ userSocket.room }}</strong>
          {{ $t('config.join_2') }}<strong>{{ usersSocket.length - 1 }}</strong>
          {{ $t('config.join_3') }}
        </p>
        <div v-if="userSocket" class="container-btn flex">
          <button v-touch="leaveHandler">
            <span>{{ $t('config.btn_2') }}</span>
          </button>
        </div>
      </article>
      <article>
        <h4>{{ $t('config.title_7') }}</h4>
        <FormsSounds></FormsSounds>
      </article>
      <article>
        <h4>{{ $t('config.title_9') }}</h4>
        <FormsThemes></FormsThemes>
      </article>
      <article>
        <h4>{{ $t('config.title_2') }}</h4>
        <FormsLanguages></FormsLanguages>
      </article>
      <article>
        <h4>{{ $t('config.title_8') }}</h4>
        <div class="flex-between">
          <p>{{ $t('config.message_5') }}</p>
          <button
            v-clipboard:copy="$t('copy.copy_message')"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            class="white"
          >
            <span>{{ $t('config.btn_6') }}</span>
          </button>
        </div>
      </article>
      <article>
        <h4>{{ $t('config.title_5') }}</h4>
        <FormsBugsFeatures></FormsBugsFeatures>
      </article>
      <article>
        <h4>{{ $t('config.title_4') }}</h4>
        <div class="flex-between">
          <p>{{ $t('config.message_1') }}</p>
          <button v-touch="resetTotalHandler" class="white">
            <span>{{ $t('config.btn_5') }}</span>
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import ScrollMixin from '~/mixins/scroll'
import AnalyticsMixin from '~/mixins/analytics'
import ClipboardMixin from '~/mixins/clipboard'
import { toDateTime, formatDate } from '~/utils'

export default {
  mixins: [ScrollMixin, AnalyticsMixin, ClipboardMixin],
  layout: 'private',
  middleware: ['authenticated'],
  data() {
    return {
      tab: 'create',
    }
  },
  computed: {
    ...mapState('ws', {
      userSocket: (state) => state.userSocket,
      usersSocket: (state) => state.usersSocket,
    }),
    ...mapState('firebase', {
      userDetailsFirebase: (state) => state.userDetailsFirebase,
    }),
    ...mapState('game', {
      campaignActive: (state) => state.campaignActive,
      currentCampaign: (state) => state.currentCampaign,
    }),
    dateLastMatch() {
      if (this.userDetailsFirebase) {
        return formatDate(
          toDateTime(this.userDetailsFirebase.last_updated.seconds)
        )
      } else {
        return '-'
      }
    },
  },
  created() {
    this.$nuxt.$on('confirmSubmitHandler', () => {
      this.confirmSubmitReset()
    })
  },
  destroyed() {
    this.$nuxt.$off('confirmSubmitHandler')
  },
  methods: {
    setTab(tab) {
      this.tab = tab
    },
    leaveHandler($event, logout = false) {
      this.$store.dispatch('ws/leftRoomSocket')
      if (logout) {
        this.$store.dispatch('firebase/logout').then(() => {
          this.$router.push('/')
        })
      }
    },
    leaveAppHandler() {
      this.leaveHandler(null, true)
    },
    resetTotalHandler() {
      this.$store.commit(`game/toggleModal`, 'alert')
    },
    confirmSubmitReset() {
      this.logCustomEvent('reset_record')
      this.$store.dispatch(`firebase/resetRecordUser`).then(() => {
        this.$store.commit('game/toggleNotification', {
          type: 'success',
          message: this.$t('config.message_2'),
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper-welcome {
  @extend %borderBottom;
  h2 {
    @include margin(null null 0.3rem null);
  }
}
</style>
