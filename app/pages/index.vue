<template>
  <div class="container-app">
    <FormsLoginRegistration login></FormsLoginRegistration>

    <div v-for="wo in workbox" :key="wo">
      {{ wo }}
    </div>

    <article class="article-offline">
      <p class="small">
        Copyright &copy; {{ new Date().getFullYear() }} - Release:
        {{ pkg.version }}
      </p>
    </article>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Package from '../../package.json'

export default {
  transition: 'slide-bottom',
  data() {
    return {
      pkg: Package,
    }
  },
  computed: {
    ...mapState({
      workbox: (state) => state.workbox,
    }),
  },
}
</script>

<style lang="scss" scoped>
::v-deep .wrapper-offline {
  @include margin(-115px null null -40%);
  @include size(80%, 230px);
}
</style>
