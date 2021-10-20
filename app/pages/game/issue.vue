<template>
  <section class="wrapper-page">
    <TitlePage label="issue" icon="alert"></TitlePage>
    <div class="main body-scroll-lock-ignore-inner">
      <template v-if="issueList.length > 0">
        <article v-for="i in issueList" :key="i.id">
          <Issue :data="i"></Issue>
        </article>
      </template>
      <article v-else class="flex-center">
        <p>{{ $t('issue.empty') }}</p>
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
      issueList: (state) => state.issueList,
    }),
  },
  mounted() {
    this.$store.dispatch(`firebase/reportAIssueList`)
  },
}
</script>
