<template>
  <section :class="['wrapper-page', { big: isIphone() && bigMenuIphone() }]">
    <TitlePage label="invite" icon="shield-account-outline"></TitlePage>
    <div class="main">
      <article class="wrapper-help body-scroll-lock-ignore-inner">info</article>
    </div>
  </section>
</template>

<script>
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
    }
  },
}
</script>

