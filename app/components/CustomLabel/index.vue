<template>
  <div :class="['wrapper-label flex', className]">
    <span v-if="iconLeft" :class="`yamicons mdi mdi-${iconLeft}`"></span>
    <p class="small">{{ text }}</p>
    <span v-if="iconRight" :class="`yamicons mdi mdi-${iconRight}`"></span>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '',
    },
    iconLeft: {
      type: String,
      default: '',
    },
    iconRight: {
      type: String,
      default: '',
    },
    className: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper-label {
  @include padding(0.2rem 0.4rem);
  border-radius: $rounded-small;
  border: $border-base;
  &.red {
    border-color: $error;
    background: $error-bck;
  }
  &.green {
    border-color: $primary;
    background: $success-bck;
  }
  &.yellow {
    border-color: $warning;
    background: $warning-bck;
  }
}
</style>
