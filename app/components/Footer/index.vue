<template>
  <article class="footer-offline">
    <p class="small flex-center">
      Copyright &copy; {{ new Date().getFullYear() }} -
      <span @click="releaseHandler">Release</span>:
      {{ pkg.version }}
      <span class="yamicons mdi mdi-github small" @click="githubHandler"></span>
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
  methods: {
    releaseHandler() {
      this.$store.commit(`game/toggleModal`, 'release')
    },
    githubHandler() {
      window.open(this.pkg.homepage, '_blank')
    },
  },
}
</script>
