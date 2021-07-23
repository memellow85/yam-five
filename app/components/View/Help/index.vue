<template>
  <section class="overlay-view">
    <article>
      <h3>
        <span class="yamicons mdi mdi-help-circle-outline"></span>
        {{ $t('help.title_1') }}
      </h3>
    </article>
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
