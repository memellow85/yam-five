<template>
  <article class="footer-offline">
    <p class="small">
      Copyright &copy; {{ new Date().getFullYear() }} - Release:
      {{ pkg.version }}
    </p>
  </article>
</template>

<script>
import Package from '../../../package.json'

export default {
  data() {
    return {
      pkg: Package,
    }
  },
}
</script>

<style lang="scss" scoped>
.footer-offline {
  @extend %flexCenter;
  @include size(100%, 2.5rem);
}
</style>
