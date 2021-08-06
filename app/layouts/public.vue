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
import { isProd } from '~/utils'

export default {
  head() {
    return {
      bodyAttrs: {
        class: 'public',
      },
    }
  },
  mounted() {
    if (isProd()) {
      const perf = firebase.performance()
      console.log(perf, perf.instrumentationEnabled, perf.dataCollectionEnabled)
      this.$store.commit(`setPerformance`, perf)
    }
  },
}
</script>

<style lang="scss">
@import '../assets/scss/offline';
</style>
