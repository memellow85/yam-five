<template>
  <FormsLoginRegistration></FormsLoginRegistration>
</template>

<script>
export default {
  layout: 'public',
  mounted() {
    this.$ga.event('public_pages', 'mounted', 'registration', true)
  },
}
</script>
