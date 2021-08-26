<template>
  <section class="overlay-view">
    <TitlePage label="help" icon="help-circle-outline"></TitlePage>
    <div class="container-scroller-overlay body-scroll-lock-ignore-inner">
      <Rule></Rule>
    </div>
  </section>
</template>

<script>
import ScrollMixin from '~/mixins/scroll'

export default {
  mixins: [ScrollMixin],
}
</script>
