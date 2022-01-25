<template>
  <section class="wrapper-page">
    <TitlePage label="invite" icon="account-details-outline"></TitlePage>
    <div class="main wrapper-invite body-scroll-lock-ignore-inner">
      <article>
        <ul>
          <li class="flex header">
            <div class="col_1">
              <p>{{ $t('invite.th_1') }}</p>
            </div>
            <div class="col_2">
              <p>{{ $t('invite.th_3') }}</p>
            </div>
            <div class="col_3 full">
              <p>{{ $t('invite.th_2') }}</p>
            </div>
          </li>
          <li
            v-for="u in loginUsersSocket"
            :key="u.id"
            :class="[
              'flex',
              {
                io: u.uid === userFirebase.uid,
                busy: u.busy,
              },
            ]"
          >
            <div class="col_1">
              <p>{{ u.name }}</p>
            </div>
            <div class="col_2">
              <p>
                <span :class="['circle', { red: u.busy }]"></span>
              </p>
            </div>
            <div class="col_3 full">
              <span
                v-touch="() => inviteHandler(u)"
                :class="`yamicons mdi mdi-email-fast-outline`"
              ></span>
            </div>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import ScrollMixin from '~/mixins/scroll'
import AnalyticsMixin from '~/mixins/analytics'

export default {
  mixins: [ScrollMixin, AnalyticsMixin],
  layout: 'private',
  middleware: ['authenticated'],
  computed: {
    ...mapState('firebase', {
      userFirebase: (state) => state.userFirebase,
    }),
    ...mapState('ws', {
      userSocket: (state) => state.userSocket,
      loginUsersSocket: (state) => state.loginUsersSocket,
    }),
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

<style lang="scss" scoped>
.wrapper-invite {
  @extend %fakeTable;
  ul {
    li {
      &.io,
      &.busy {
        .col_3 {
          span {
            &.yamicons {
              &:before {
                @include themed() {
                  color: t($key-color-3);
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
