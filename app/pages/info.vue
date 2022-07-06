<template>
  <section :class="['wrapper-page', { big: isIphone() && bigMenuIphone() }]">
    <TitlePage label="personal_info" icon="shield-account-outline"></TitlePage>
    <div class="main wrapper-help body-scroll-lock-ignore-inner">
      <article>
        <Avatar
          v-if="refreshCmp"
          :selected="userDetailsFirebase"
          :list="listAvatar"
          :detail-position="'left'"
        ></Avatar>
      </article>
      <article>
        <div class="wrapper-more-info flex-between">
          <div>
            <h4>{{ $t('personal_info.message_1') }}</h4>
            <p>
              {{ dateLastMatch }}
            </p>
          </div>
          <div>
            <h4>{{ $t('personal_info.message_2') }}</h4>
            <p>
              {{ userDetailsFirebase ? userDetailsFirebase.match : '-' }}
            </p>
          </div>
        </div>
        <template v-if="campaignActive">
          <div class="wrapper-more-info flex-between">
            <div>
              <h4>{{ $t('personal_info.message_3') }}</h4>
              <p>{{ currentCampaign.name }}</p>
            </div>
            <div>
              <h4>{{ $t('personal_info.message_4') }}</h4>
              <p>{{ currentCampaign.end }}</p>
            </div>
          </div>
        </template>
      </article>
      <article>
        <h4>{{ $t('personal_info.message_5') }}</h4>
        <Avatar
          v-if="refreshCmp"
          :single="false"
          :selected="userDetailsFirebase"
          :list="listAvatar"
          reset
        ></Avatar>
      </article>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import ScrollMixin from '~/mixins/scroll'
import AnalyticsMixin from '~/mixins/analytics'
import { bigMenuIphone, isIphone, toDateTime, formatDate } from '~/utils'

export default {
  mixins: [ScrollMixin, AnalyticsMixin],
  layout: 'private',
  middleware: ['authenticated'],
  data() {
    return {
      bigMenuIphone,
      isIphone,
      refreshCmp: true,
    }
  },
  computed: {
    ...mapState('firebase', {
      listAvatar: (state) => state.listAvatar,
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
    this.$nuxt.$on('selectedTypeHandler', (img) => {
      this.$store.dispatch(`firebase/updateAvatar`, img).then(() => {
        this.refreshCmp = false
        this.$nextTick(() => {
          this.refreshCmp = true
        })
      })
    })
  },
  destroyed() {
    this.$nuxt.$off('selectedTypeHandler')
  },
}
</script>

<style lang="scss" scoped>
.wrapper-more-info {
  > div {
    @include size(50%, auto);
  }
}
::v-deep .wrapper-user {
  @include margin(null null 1rem null);
}
</style>

