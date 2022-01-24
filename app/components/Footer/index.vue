<template>
  <article class="footer-offline">
    <p class="small flex-center">
      Copyright &copy; {{ new Date().getFullYear() }} -
      <span v-touch="releaseHandler">Release</span>:
      {{ pkg.version }}
      <span
        v-touch="githubHandler"
        class="yamicons mdi mdi-github small"
      ></span>
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
      this.$store.commit(`game/toggleOverlay`, 'release')
    },
    githubHandler() {
      window.open(this.pkg.homepage, '_blank')
    },
  },
}
</script>
