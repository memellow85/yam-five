<template>
  <FormsLoginRegistration login></FormsLoginRegistration>
</template>

<script>
export default {
  layout: 'public',
  mounted() {
    console.log(this.$ga)
    window.addEventListener(
      'touchmove',
      function (event) {
        event.preventDefault()
      },
      { passive: false }
    )
  },
}
</script>
