<template>
  <div
    :class="`container-dice dice-${dice.value} ${dice.block ? 'block' : ''}`"
    @click="clickDiceHandler(dice)"
  >
    <div class="wrapper-dice">
      <div :class="`content-dice dice-${dice.value}`">
        <div class="dice-face front">
          <span class="dot"></span>
        </div>
        <div class="dice-face front inner"></div>
        <div class="dice-face back">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <div class="dice-face back inner"></div>
        <div class="dice-face right">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <div class="dice-face right inner"></div>
        <div class="dice-face left">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <div class="dice-face left inner"></div>
        <div class="dice-face top">
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <div class="dice-face top inner"></div>
        <div class="dice-face bottom">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <div class="dice-face bottom inner"></div>
        <div class="dice-face cover x"></div>
        <div class="dice-face cover y"></div>
        <div class="dice-face cover z"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    dice: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  computed: {
    ...mapState('game', {
      played: (state) => state.played,
    }),
  },
  methods: {
    clickDiceHandler(dice) {
      if (this.played < 3) {
        this.$store.commit('game/blockDice', dice)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
%topleft {
  top: 15px;
  left: 15px;
}
%topright {
  top: 15px;
  right: 15px;
}
%bottomright {
  bottom: 15px;
  right: 15px;
}
%bottomleft {
  bottom: 15px;
  left: 15px;
}
%center {
  @include margin(-5px null null -5px);
  top: 50%;
  left: 50%;
}
%centerright {
  @include margin(-5px null null);
  top: 50%;
  right: 15px;
}
%centerleft {
  @include margin(-5px null null);
  top: 50%;
  left: 15px;
}
.wrapper-dice {
  @include size(80px);
  @include margin(null 10px);
  perspective: 200px;
  .content-dice {
    @include size(100%);
    position: relative;
    transform-style: preserve-3d;
    transform: translateZ(-40px);
    transition: transform 1s;
    &.dice-1 {
      @include transformDice(-40px, 0deg, 'y');
    }
    &.dice-2 {
      @include transformDice(-40px, -90deg, 'x');
    }
    &.dice-3 {
      @include transformDice(-40px, 90deg, 'y');
    }
    &.dice-4 {
      @include transformDice(-40px, -90deg, 'y');
    }
    &.dice-5 {
      @include transformDice(-40px, 90deg, 'x');
    }
    &.dice-6 {
      @include transformDice(-40px, -180deg, 'y');
    }
    .dice-face {
      @include size(80px);
      @include position(absolute, null);
      display: flex;
      flex-direction: column;
      background: $white;
      box-shadow: $dice-shadow;
      border-radius: 10px;
      .block & {
        background: $color-1;
        .dot {
          background: $color-5;
        }
      }
      &.inner {
        background: $color-4;
        box-shadow: none;
      }
      &.cover {
        background: $color-3;
        box-shadow: none;
      }
      &.cover {
        border-radius: 0;
        transform: translateZ(0px);
        &.x {
          transform: rotateY(90deg);
        }
        &.z {
          transform: rotateX(90deg);
        }
      }
      .dot {
        @include size(10px);
        background: $color-9;
        border-radius: 50%;
      }
      &.front {
        @include transformDice(40px, 0deg, 'y', true);
        justify-content: center;
        align-items: center;
        &.inner {
          @include transformDice(38px, 0deg, 'y', true);
        }
      }
      &.right {
        @include transformDice(40px, 90deg, 'y', true);
        &.inner {
          @include transformDice(38px, 90deg, 'y', true);
        }
      }
      &.back {
        @include transformDice(40px, 180deg, 'y', true);
        &.inner {
          @include transformDice(38px, 180deg, 'y', true);
        }
      }
      &.left {
        @include transformDice(40px, -90deg, 'y', true);
        &.inner {
          @include transformDice(38px, -90deg, 'y', true);
        }
      }
      &.top {
        @include transformDice(40px, 90deg, 'x', true);
        &.inner {
          @include transformDice(38px, 90deg, 'x', true);
        }
      }
      &.bottom {
        @include transformDice(40px, -90deg, 'x', true);
        &.inner {
          @include transformDice(38px, -90deg, 'x', true);
        }
      }
      &.right,
      &.back,
      &.left,
      &.top,
      &.bottom {
        .dot {
          @include position(absolute, null);
          &:nth-child(1) {
            @extend %topleft;
          }
          &:nth-child(2) {
            @extend %bottomright;
          }
        }
      }
      &.left,
      &.bottom {
        .dot {
          &:nth-child(3) {
            @extend %center;
          }
        }
      }
      &.right,
      &.back {
        .dot {
          &:nth-child(3) {
            @extend %topright;
          }
          &:nth-child(4) {
            @extend %bottomleft;
          }
        }
      }
      &.bottom {
        .dot {
          &:nth-child(4) {
            @extend %topright;
          }
          &:nth-child(5) {
            @extend %bottomleft;
          }
        }
      }
      &.back {
        .dot {
          &:nth-child(5) {
            @extend %centerleft;
          }
          &:nth-child(6) {
            @extend %centerright;
          }
        }
      }
    }
  }
}
</style>
