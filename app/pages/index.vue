<template>
  <div class="container-app">
    <login-registration login></login-registration>
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
import LoginRegistration from '~/components/Forms/LoginRegistration'

export default {
  components: { LoginRegistration },
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
  @include margin(-115px null null -40%);
  @include size(80%, 230px);
}
</style>
