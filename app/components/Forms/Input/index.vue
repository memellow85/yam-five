<template>
  <div>
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
  },
}
</script>
