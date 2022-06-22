<template>
  <Layout>
    <nuxt />
    <!-- Navigation -->
    <NavigationPrivate></NavigationPrivate>
  </Layout>
</template>

<script>
import NoSleep from 'nosleep.js'
import ThemeMixin from '~/mixins/theme'
import WsMixin from '~/mixins/ws'

export default {
  mixins: [ThemeMixin, WsMixin],
  data() {
    return {
      noSleep: new NoSleep(),
    }
  },
  head() {
    return {
      bodyAttrs: {
        class: this.bodyClass,
      },
    }
  },
  mounted() {
    this.noSleep.enable()
  },
}
</script>
