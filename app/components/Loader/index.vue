<template>
  <div v-if="standard" :class="['wrapper-loader is-medium', { standard }]">
    <div class="conteiner-loader">
      <span>•</span><span>•</span><span>•</span>
    </div>
  </div>
  <div
    v-else
    :class="['wrapper-loader flex flex-center', { custom: !standard }]"
  >
    <span
      :class="`yamicons mdi mdi-dice-${getRandomNumberCube()}-outline`"
    ></span>
  </div>
</template>

<script>
import { getRandomNumberCube } from '~/utils'

export default {
  props: {
    standard: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      getRandomNumberCube,
    }
  },
}
</script>

<style lang="scss" scoped>
@keyframes wave {
  0% {
    opacity: 0.2;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}

@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.wrapper-loader {
  &.is-small {
    @include font-size(12px, 1);
  }
  &.is-medium {
    @include font-size(16px, 1);
  }
  &.is-large {
    @include font-size(22px, 1);
  }
  &.standard {
    display: inline-block;
    span {
      @include margin(null 0.15rem null null);
      color: $white;
      animation-name: wave;
      animation-duration: 1.4s;
      animation-iteration-count: infinite;
      animation-fill-mode: both;
      &:last-child {
        @include margin(0);
      }
      &:nth-child(2) {
        animation-delay: 0.2s;
      }
      &:nth-child(3) {
        animation-delay: 0.4s;
      }
    }
  }
  &.custom {
    span {
      color: $white;
      animation: spin 3s linear infinite;
    }
  }
}
</style>
