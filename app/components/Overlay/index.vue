<template>
  <transition
    name="overlay"
    :duration="{ enter: 0, leave: 500 }"
    enter-active-class="animated"
    leave-active-class="animated"
  >
    <div v-if="showOverlay" class="overlay-container">
      <div
        v-touch="() => $store.commit('game/resetModal')"
        class="overlay-mask"
        :style="`height: calc(100vh - (${heightOverlay}rem))`"
      ></div>
      <div class="overlay-content" :style="`height: ${heightOverlay}rem`">
        <div
          v-touch="() => $store.commit('game/resetModal')"
          class="overlay-close"
        >
          <span class="yamicons mdi mdi-close"></span>
        </div>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    showOverlay: {
      type: Boolean,
      default: false,
    },
    heightOverlay: {
      type: Number,
      default: 30,
    },
  },
}
</script>

<style lang="scss" scoped>
.overlay-container {
  @include position(fixed, null null 0 0);
  @include size(100%);
  transition: all 0.5s;
  z-index: 9;
  opacity: 1;
  &.animated {
    opacity: 0;
    bottom: -100%;
  }
  .overlay-mask {
    @include size(100%, 0);
    transition: all 1s;
  }
  .overlay-content {
    @include position(relative, null);
    @include size(100vw, 0);
    border-top: $border-base;
    border-top-left-radius: $rounded;
    border-top-right-radius: $rounded;
    @include themed() {
      border-color: t($key-color-2);
      background: t($key-color-0);
    }
    // background: $white;
    .overlay-close {
      @include position(absolute, 0.8rem 0.8rem null null);
    }
  }
  ::v-deep {
    @extend %overlaySection;
  }
}
</style>
