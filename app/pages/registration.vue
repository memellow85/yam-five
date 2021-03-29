<template>
  <div class="container-app">
    <FormsLoginRegistration></FormsLoginRegistration>
    <article class="article-offline">
      <p class="small">
        Copyright &copy; {{ new Date().getFullYear() }} - Release:
        {{ pkg.version }}
      </p>
    </article>
  </div>
</template>

<script>
import Package from '../../package.json'

export default {
  transition: 'slide-bottom',
  data() {
    return {
      pkg: Package,
    }
  },
}
</script>

<style lang="scss" scoped>
::v-deep .wrapper-offline {
  @include margin(-145px null null -40%);
  @include size(80%, 290px);
}
</style>
