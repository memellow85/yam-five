<template>
  <transition
    name="overlay"
    :duration="{ enter: 0, leave: 500 }"
    enter-active-class="animated"
    leave-active-class="animated"
  >
    <div v-if="showOverlay" class="overlay-container">
      <div
        class="overlay-mask"
        :style="`height: calc(100vh - (${heightOverlay}px))`"
        @click="$store.commit('game/resetModal')"
      ></div>
      <div class="overlay-content" :style="`height: ${heightOverlay}px`">
        <div class="overlay-close" @click="$store.commit('game/resetModal')">
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
      default: 500,
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
    // @include padding(15px);
    @include size(100vw, 0);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    background: $white;
    // box-shadow: $shadow-overlay;
    border-top: $border-base;
    .overlay-close {
      @include position(absolute, 12px 15px null null);
    }
  }
}
</style>
