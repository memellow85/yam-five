<template>
  <Layout>
    <div>
      <nuxt />
    </div>

    <!-- Navigation -->
    <NavigationPrivate></NavigationPrivate>

    <!-- Alert -->
    <Alert :message="$t('alert.message')"></Alert>
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
