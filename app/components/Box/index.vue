<template>
  <article :class="className">
    <div v-if="!showHelp" class="effect-border"></div>
    <span
      v-touch="toogleHelp"
      :class="`yamicons small mdi mdi-${showHelp ? 'close' : 'help'}`"
    ></span>
    <h5>{{ title }}</h5>
    <div class="container-box flex-center">
      <slot></slot>
    </div>
    <transition
      name="overlay"
      :duration="{ enter: 0, leave: 500 }"
      enter-active-class="animated"
      leave-active-class="animated"
    >
      <div v-if="showHelp" class="overlay flex-center">
        <h5 v-html="info"></h5>
      </div>
    </transition>
  </article>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    info: {
      type: String,
      default: '',
    },
    className: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showHelp: false,
    }
  },
  methods: {
    toogleHelp() {
      this.showHelp = !this.showHelp
    },
  },
}
</script>

<style lang="scss" scoped>
article {
  @include position(relative, null);
  @include size(14rem, 10rem);
  @include padding(0.7rem);
  @include themed() {
    background: t($key-color-2);
  }
  border-radius: $rounded-small;
  // background: $color-2;
  overflow: hidden;
  &.single {
    .effect-border {
      background: $alternative-1;
    }
    .overlay {
      border-color: $alternative-1;
    }
  }
  &.maxmin {
    .effect-border {
      background: $alternative-2;
    }
    .overlay {
      border-color: $alternative-2;
    }
  }
  &.extra1 {
    .effect-border {
      background: $alternative-3;
    }
    .overlay {
      border-color: $alternative-3;
    }
  }
  &.extra2 {
    .effect-border {
      background: $alternative-4;
    }
    .overlay {
      border-color: $alternative-4;
    }
  }
  .effect-border {
    @include position(absolute, null null 0 0);
    @include size(100%, 0.3rem);
  }
  .container-box {
    @include size(100%, 8.5rem);
    flex-wrap: wrap;
  }
  .yamicons {
    @include position(absolute, 0.8rem 0.7rem null null);
  }
  .overlay {
    @include position(absolute, null null 0 0);
    @include size(100%, 60%);
    @include themed() {
      background: t($key-color-0);
    }
    border-radius: $rounded-small;
    // background: $white;
    transition: all 0.3s;
    opacity: 1;
    border-width: 0.3rem;
    border-top-style: solid;
    &.animated {
      bottom: -60%;
      opacity: 0;
    }
  }
}
</style>
