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
import WsMixin from '@/mixins/ws'

export default {
  mixins: [WsMixin],
  middleware: ['authenticated'],
  mounted() {
    document.querySelector('.body-scroll-lock-ignore-inner').addEventListener(
      'touchmove',
      function (event) {
        event.stopPropagation()
      },
      { passive: false }
    )
  },
}
</script>
