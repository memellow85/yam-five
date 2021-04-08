<template>
  <div class="container-app">
    <FormsRecovery></FormsRecovery>
    <Footer></Footer>
  </div>
</template>

<script>
export default {
  transition: 'slide-bottom',
}
</script>

<style lang="scss" scoped>
::v-deep .wrapper-offline {
  @include margin(-90px null null -40%);
  @include size(80%, 180px);
}
</style>
