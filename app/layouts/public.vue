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

export default {
  head() {
    return {
      bodyAttrs: {
        class: 'public',
      },
    }
  },
  mounted() {
    const perf = firebase.performance()
    this.$store.commit(`setPerformance`, perf)

    if (
      process.env.NUXT_ENV_NODE_ENV === 'production' ||
      process.env.NUXT_ENV_NODE_ENV === 'beta'
    ) {
      firebase.analytics()
    }
  },
}
</script>

<style lang="scss">
@import '../assets/scss/offline';
</style>
