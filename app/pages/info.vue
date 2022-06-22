<template>
  <section :class="['wrapper-page', { big: isIphone() && bigMenuIphone() }]">
    <TitlePage label="personal_info" icon="shield-account-outline"></TitlePage>
    <div class="main wrapper-help body-scroll-lock-ignore-inner">
      <article>
        <div class="flex wrapper-user">
          <div class="avatar flex-center">{{ firstLetter }}</div>
          <div>
            <p>{{ $t('personal_info.title') }}</p>
            <h2>{{ userDetailsFirebase ? userDetailsFirebase.name : '-' }}</h2>
          </div>
        </div>
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
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import ScrollMixin from '~/mixins/scroll'
import AnalyticsMixin from '~/mixins/analytics'
import PersonalInfoMixin from '~/mixins/personal_info'
import { bigMenuIphone, isIphone, toDateTime, formatDate } from '~/utils'

export default {
  mixins: [ScrollMixin, AnalyticsMixin, PersonalInfoMixin],
  layout: 'private',
  middleware: ['authenticated'],
  data() {
    return {
      bigMenuIphone,
      isIphone,
    }
  },
  computed: {
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
}
</script>

<style lang="scss">
.wrapper-more-info {
  > div {
    @include size(50%, auto);
  }
}
.wrapper-user {
  @include margin(null null 1rem null);
  .avatar {
    @include margin(null 0.5rem null null);
  }
  p {
    @include margin(null null 0.3rem null);
  }
}
</style>

