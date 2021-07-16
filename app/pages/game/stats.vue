<template>
  <section class="wrapper-page">
    <article>
      <h3>
        <span class="yamicons mdi mdi-chart-box-outline"></span>
        {{ $t('stats.title_1') }}
      </h3>
    </article>
    <div class="main">
      <article>
        <Stats></Stats>
      </article>
    </div>
  </section>
</template>

<script>
import WsMixin from '@/mixins/ws'

export default {
  mixins: [WsMixin],
  middleware: ['authenticated'],
}
</script>
