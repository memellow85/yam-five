<template>
  <FormsLoginRegistration login></FormsLoginRegistration>
</template>

<script>
import AnalyticsMixin from '~/mixins/analytics'

export default {
  mixins: [AnalyticsMixin],
  layout: 'public',
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
