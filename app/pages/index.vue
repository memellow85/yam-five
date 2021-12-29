<template>
  <FormsLoginRegistration login></FormsLoginRegistration>
</template>

<script>
import AnalyticsMixin from '~/mixins/analytics'
import RemoteConfigMixin from '~/mixins/remote_config'

export default {
  mixins: [AnalyticsMixin, RemoteConfigMixin],
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
