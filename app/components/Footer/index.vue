<template>
  <article class="article-offline">
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
