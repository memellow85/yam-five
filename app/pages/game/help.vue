<template>
  <section class="wrapper-page">
    <article>
      <h3>
        <span class="yamicons mdi mdi-account-question-outline"></span>
        {{ $t('help.title_1') }}
      </h3>
    </article>
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
