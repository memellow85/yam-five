<template>
  <Layout>
    <Header></Header>
    <div>
      <div class="container-app-offline">
        <nuxt />
      </div>
      <Footer></Footer>
    </div>
  </Layout>
</template>

<script>
import firebase from '~/server/api/firebase'
import ThemeMixin from '~/mixins/theme'
import { isProd } from '~/utils'

export default {
  mixins: [ThemeMixin],
  head() {
    return {
      bodyAttrs: {
        class: `public ${this.bodyClass}`,
      },
    }
  },
  mounted() {
    if (isProd()) {
      const analytics = firebase.getAnalytics()
      this.$store.commit(`setAnalytics`, analytics)
      const perf = firebase.getPerformance(firebase.app)
      this.$store.commit(`setPerformance`, perf)
    }
  },
}
</script>

<style lang="scss">
@import '../assets/scss/offline';
</style>
