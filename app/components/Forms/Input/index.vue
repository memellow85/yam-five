<template>
  <div :class="['wrapper-input', { 'write-mode': writeMode }]">
    <label v-if="showLabel" :for="name">{{ name }}</label>
    <span
      v-if="icon && showIcon"
      :class="`yamicons small mdi mdi-${icon}`"
    ></span>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
      debug: 'label',
    },
    showLabel: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
      default: '',
    },
    showIcon: {
      type: Boolean,
      default: true,
    },
    writeMode: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper-input {
  @include font-size(0px, 1);
  &.write-mode {
    @include position(relative, null);
    @include margin(null null 0 null);
    border-radius: $rounded;
    box-shadow: inset 0 0.1rem 0.3rem $color-5;
    button {
      @include position(absolute, 0.5rem 0.5rem null null);
    }
  }
}
</style>
