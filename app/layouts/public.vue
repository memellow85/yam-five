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
export default {
  head() {
    return {
      bodyAttrs: {
        class: 'public',
      },
    }
  },
}
</script>

<style lang="scss">
@import '../assets/scss/offline';
</style>
