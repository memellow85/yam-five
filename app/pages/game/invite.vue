<template>
  <section :class="['wrapper-page', { big: isIphone() && bigMenuIphone() }]">
    <TitlePage label="invite" icon="account-details-outline"></TitlePage>
    <div class="main wrapper-invite body-scroll-lock-ignore-inner">
      <article>
        <template v-for="u in loginUsersSocket">
          <RankingBox
            :key="u.uid"
            :info-user="
              u.uid === userDetailsFirebase.uid ? userDetailsFirebase : u
            "
            :list-avatar="listAvatar"
            :current="userFirebase && u.uid === userFirebase.uid"
            :action="listActions"
          ></RankingBox>
        </template>
      </article>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import ScrollMixin from '~/mixins/scroll'
import AnalyticsMixin from '~/mixins/analytics'
import { bigMenuIphone, isIphone } from '~/utils'

export default {
  mixins: [ScrollMixin, AnalyticsMixin],
  layout: 'private',
  middleware: ['authenticated'],
  data() {
    return {
      bigMenuIphone,
      isIphone,
      listActions: [
        {
          id: 1,
          action: 'inviteHandler',
          icon: 'email-fast-outline',
        },
      ],
    }
  },
  computed: {
    ...mapState('firebase', {
      userFirebase: (state) => state.userFirebase,
      userDetailsFirebase: (state) => state.userDetailsFirebase,
      listAvatar: (state) => state.listAvatar,
    }),
    ...mapState('ws', {
      userSocket: (state) => state.userSocket,
      loginUsersSocket: (state) => state.loginUsersSocket,
    }),
  },
  created() {
    this.$nuxt.$on('inviteHandler', (user) => {
      this.inviteHandler(user)
    })
  },
  destroyed() {
    this.$nuxt.$off('inviteHandler')
  },
  methods: {
    inviteHandler(user) {
      if (user.uid !== this.userFirebase.uid && !user.busy) {
        if (this.userSocket && this.userSocket.room) {
          this.$store.dispatch('ws/sendInvite', user)
          this.$store.commit('game/toggleNotification', {
            type: 'success',
            message: this.$t('invite.message_1'),
          })
        } else {
          this.$store.commit('game/toggleNotification', {
            type: 'warning',
            message: this.$t('invite.notification_1'),
          })
        }
      }
    },
  },
}
</script>
