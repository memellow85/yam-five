<template>
  <section class="wrapper-page">
    <article class="flex-between">
      <h3>
        <span class="yamicons mdi mdi-cog-outline"></span>
        {{ $t('view.configuration') }}
      </h3>
      <button class="small" @click="leaveAppHandler">
        <span>{{ $t('config.btn_3') }}</span>
      </button>
    </article>
    <div class="main">
      <article>
        <h4>{{ $t('config.title_2') }}</h4>
        <FormsLanguages></FormsLanguages>
      </article>
      <article class="wrapper-tabs-form">
        <ul class="inline custom-tabs">
          <li
            :class="[
              'center',
              { active: tab === 'create', disabled: userSocket },
            ]"
            @click="tab = 'create'"
          >
            <h4>{{ $t('config.tab_1') }}</h4>
          </li>
          <li
            :class="[
              'center',
              { active: tab === 'join', disabled: userSocket },
            ]"
            @click="tab = 'join'"
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
          <button @click="leaveHandler">
            <span>{{ $t('config.btn_2') }}</span>
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import WsMixin from '@/mixins/ws'

export default {
  mixins: [WsMixin],
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
  },
  methods: {
    leaveHandler() {
      this.$store.dispatch('ws/leftRoomSocket')
    },
    leaveAppHandler() {
      // this.$store.commit('game/toggleModal', 'config')
      this.leaveHandler()
      this.$store.dispatch('firebase/logout').then(() => {
        this.$router.push('/')
      })
    },
  },
}
</script>
