<template>
  <FormsLoginRegistration login></FormsLoginRegistration>
</template>

<script>
export default {
  layout: 'offline',
  mounted() {
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
