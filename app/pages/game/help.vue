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
import WsMixin from '~/mixins/ws'
import ScrollMixin from '~/mixins/scroll'

export default {
  mixins: [WsMixin, ScrollMixin],
  layout: 'private',
  middleware: ['authenticated'],
}
</script>
