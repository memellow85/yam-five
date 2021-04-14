<template>
  <div>
    <div class="container-app-offline">
      <FormsLoginRegistration login></FormsLoginRegistration>
    </div>
    <Footer></Footer>
  </div>
</template>

<script>
export default {
  transition: 'slide-bottom',
}
</script>

<style lang="scss" scoped>
/*
::v-deep .wrapper-offline {
  @include margin(-115px null null -40%);
  @include size(80%, 230px);
}
*/
</style>
