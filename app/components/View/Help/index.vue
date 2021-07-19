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
export default {
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
