<template>
  <section class="wrapper-page">
    <TitlePage label="help" icon="account-question-outline"></TitlePage>
    <div class="main">
      <article class="wrapper-help body-scroll-lock-ignore-inner">
        <Rule></Rule>
      </article>
    </div>
  </section>
</template>

<script>
import ScrollMixin from '~/mixins/scroll'
import AnalyticsMixin from '~/mixins/analytics'

export default {
  mixins: [ScrollMixin, AnalyticsMixin],
  layout: 'private',
  middleware: ['authenticated'],
}
</script>
