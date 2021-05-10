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
  top: 1rem;
  left: 1rem;
}
%topright {
  top: 1rem;
  right: 1rem;
}
%bottomright {
  bottom: 1rem;
  right: 1rem;
}
%bottomleft {
  bottom: 1rem;
  left: 1rem;
}
%center {
  @include margin(-0.4rem null null -0.4rem);
  top: 50%;
  left: 50%;
}
%centerright {
  @include margin(-0.4rem null null);
  top: 50%;
  right: 1rem;
}
%centerleft {
  @include margin(-0.4rem null null);
  top: 50%;
  left: 1rem;
}

$dim: 5rem;
$rag: 2.5rem;

.container-dice {
  @include padding(0.5rem null);
  &.block {
    .wrapper-dice {
      .content-dice {
        .dice-face {
          background: $color-2;
          .dot {
            background: $color-5;
          }
        }
      }
    }
  }
  .wrapper-dice {
    @include size($dim);
    @include margin(null 0.7rem);
    perspective: 12.5rem;
    .content-dice {
      @include size(100%);
      @include position(relative, null);
      transform-style: preserve-3d;
      transform: translateZ(-$rag);
      transition: transform 1s;
      &.dice-1 {
        @include transformDice(-$rag, 0deg, 'y');
      }
      &.dice-2 {
        @include transformDice(-$rag, -90deg, 'x');
      }
      &.dice-3 {
        @include transformDice(-$rag, 90deg, 'y');
      }
      &.dice-4 {
        @include transformDice(-$rag, -90deg, 'y');
      }
      &.dice-5 {
        @include transformDice(-$rag, 90deg, 'x');
      }
      &.dice-6 {
        @include transformDice(-$rag, -180deg, 'y');
      }
      .dice-face {
        @include size($dim);
        @include position(absolute, null);
        @extend %flex;
        flex-direction: column;
        background: $white;
        box-shadow: $dice-shadow;
        border-radius: 0.7rem;
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
          transform: translateZ(0);
          &.x {
            transform: rotateY(90deg);
          }
          &.z {
            transform: rotateX(90deg);
          }
        }
        .dot {
          @include size(0.7rem);
          background: $color-8;
          border-radius: 50%;
        }
        &.front {
          @include transformDice($rag, 0deg, 'y', true);
          @extend %flex;
          @extend %flexCenter;
          &.inner {
            @include transformDice(2.4rem, 0deg, 'y', true);
          }
        }
        &.right {
          @include transformDice($rag, 90deg, 'y', true);
          &.inner {
            @include transformDice(2.4rem, 90deg, 'y', true);
          }
        }
        &.back {
          @include transformDice($rag, 180deg, 'y', true);
          &.inner {
            @include transformDice(2.4rem, 180deg, 'y', true);
          }
        }
        &.left {
          @include transformDice($rag, -90deg, 'y', true);
          &.inner {
            @include transformDice(2.4rem, -90deg, 'y', true);
          }
        }
        &.top {
          @include transformDice($rag, 90deg, 'x', true);
          &.inner {
            @include transformDice(2.4rem, 90deg, 'x', true);
          }
        }
        &.bottom {
          @include transformDice($rag, -90deg, 'x', true);
          &.inner {
            @include transformDice(2.4rem, -90deg, 'x', true);
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
}
</style>
