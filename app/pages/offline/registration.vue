<template>
  <FormsLoginRegistration></FormsLoginRegistration>
</template>

<script>
export default {
  layout: 'public',
  mounted() {
    console.log(this, this.$ga)
    this.$ga.event('public_pages', 'mounted', 'registration', true)
  },
}
</script>
