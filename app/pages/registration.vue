<template>
  <div class="container-app">
    <FormsLoginRegistration></FormsLoginRegistration>
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
  @include margin(-145px null null -40%);
  @include size(80%, 290px);
}
</style>
