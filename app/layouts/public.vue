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
    console.log('mounted', firebase)
    const perf = firebase.performance()
    console.log('mounted', perf)
    this.$store.commit(`setPerformance`, perf)
  },
}
</script>

<style lang="scss">
@import '../assets/scss/offline';
</style>
