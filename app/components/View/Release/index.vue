<template>
  <section class="overlay-view">
    <TitlePage label="release" icon="github"></TitlePage>
    <div class="container-scroller-overlay body-scroll-lock-ignore-inner">
      <div>
        <template v-for="r in release_notes">
          <Version :key="r.version" :data="r"></Version>
        </template>
      </div>
    </div>
  </section>
</template>

<script>
import ScrollMixin from '~/mixins/scroll'
import { versionsRelease } from '~/lists/versions'

export default {
  mixins: [ScrollMixin],
  data() {
    return {
      release_notes: versionsRelease,
    }
  },
}
</script>
