<template>
  <section class="wrapper-page">
    <TitlePage label="issue" icon="alert"></TitlePage>
    <div class="main body-scroll-lock-ignore-inner">
      <article v-for="i in issueList" :key="i.id">
        <Issue :data="i"></Issue>
      </article>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import WsMixin from '~/mixins/ws'
import ScrollMixin from '~/mixins/scroll'
import AnalyticsMixin from '~/mixins/analytics'

export default {
  mixins: [WsMixin, ScrollMixin, AnalyticsMixin],
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
