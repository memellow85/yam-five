<template>
  <article>
    <h3>
      <span :class="`yamicons mdi mdi-${icon}`"></span>
      {{ $t(`${label}.title_1`) }}
    </h3>
  </article>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
  },
}
</script>
