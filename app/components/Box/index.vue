<template>
  <article :class="className">
    <div v-if="!showHelp" class="effect-border"></div>
    <span
      :class="`yamicons small mdi mdi-${showHelp ? 'close' : 'help'}`"
      @click="toogleHelp"
    ></span>
    <h5>{{ title }}</h5>
    <div class="container-box">
      <slot></slot>
    </div>
    <transition
      name="overlay"
      :duration="{ enter: 0, leave: 500 }"
      enter-active-class="animated"
      leave-active-class="animated"
    >
      <div v-if="showHelp" class="overlay">
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
/*
article {
  @include position(relative, null);
  @include size(230px, 160px);
  @include padding(10px);
  // border: $border-base;
  border-radius: 5px;
  overflow: hidden;
  background: $color-2;
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
    @include size(100%, 5px);
  }
  h5 {
    @extend %h5;
    text-align: center;
    line-height: 1.5;
  }
  .container-box {
    @include size(100%, 138px);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }
  .yamicons {
    @include position(absolute, 7px 7px null null);
  }
  .overlay {
    @include position(absolute, null null 0 0);
    @include size(100%, 60%);
    opacity: 1;
    transition: all 0.3s;
    border-width: 5px;
    border-top-style: solid;
    border-radius: 5px;
    background: $white;
    display: flex;
    justify-content: center;
    align-items: center;
    &.animated {
      bottom: -60%;
      opacity: 0;
    }
  }
}
*/
</style>
