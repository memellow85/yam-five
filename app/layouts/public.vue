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
      firebase.analytics()
      const perf = firebase.performance()
      this.$store.commit(`setPerformance`, perf)
    }
  },
}
</script>

<style lang="scss">
@import '../assets/scss/offline';
</style>
