<template>
  <p>
    {{ $t('copy.message') }}
    <a
      v-clipboard:copy="$t('copy.copy_message')"
      v-clipboard:success="onCopy"
      v-clipboard:error="onError"
      class="custom-link"
      href="javascript: void(0)"
    >
      {{ $t('copy.button') }}
    </a>
  </p>
</template>

<script>
import ClipboardMixin from '~/mixins/clipboard'

export default {
  mixins: [ClipboardMixin],
}
</script>
