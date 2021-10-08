<template>
  <div
    v-touch="() => clickDiceHandler(dice)"
    :class="`container-dice dice-${newValue} ${dice.block ? 'block' : ''}`"
  >
    <div class="wrapper-dice">
      <div
        :class="`content-dice dice-${newValue}`"
        :style="
          navigationRoute
            ? ''
            : !dice.block
            ? `transition: transform ${equalValue ? '0.6' : '1.2'}s;`
            : ''
        "
      >
        <div class="dice-face front flex-center">
          <span class="dot"></span>
        </div>
        <div class="dice-face front inner flex-center"></div>
        <div class="dice-face back flex">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <div class="dice-face back inner flex"></div>
        <div class="dice-face right flex">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <div class="dice-face right inner flex"></div>
        <div class="dice-face left flex">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <div class="dice-face left inner flex"></div>
        <div class="dice-face top flex">
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <div class="dice-face top inner flex"></div>
        <div class="dice-face bottom flex">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <div class="dice-face bottom inner flex"></div>
        <div class="dice-face cover x flex"></div>
        <div class="dice-face cover y flex"></div>
        <div class="dice-face cover z flex"></div>
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
    beforeDice: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      newValue: null,
      equalValue: false,
      blockValue: false,
      // blockDice: false,
    }
  },
  computed: {
    ...mapState('game', {
      played: (state) => state.played,
      navigationRoute: (state) => state.navigationRoute,
      blockAnimate: (state) => state.blockAnimate,
    }),
  },
  watch: {
    $props: {
      handler() {
        if (
          (!this.blockAnimate && !this.navigationRoute) ||
          this.navigationRoute
        ) {
          this.getAnimateCurrentDice()
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    getAnimateCurrentDice() {
      // console.log(this.beforeDice, this.dice, this.blockDice, this.equalValue)
      if (!this.dice.block) {
        if (this.navigationRoute) {
          this.newValue = this.dice.value
        } else if (
          Object.keys(this.beforeDice).length > 0 &&
          this.dice.value === this.beforeDice.value
        ) {
          this.equalValue = true
          if (this.dice.value >= 1 && this.dice.value <= 4) {
            this.newValue = this.dice.value + 2
          } else if (this.dice.value >= 5) {
            this.newValue = this.dice.value - 2
          }
          setTimeout(() => {
            this.newValue = this.dice.value
          }, 600)
        } else if (
          Object.keys(this.beforeDice).length === 0 &&
          this.dice.value === 1
        ) {
          this.newValue = this.dice.value + 2
          setTimeout(() => {
            this.newValue = this.dice.value
          }, 600)
        } else {
          this.equalValue = false
          this.newValue = this.dice.value
        }
      } else if (this.navigationRoute) {
        this.newValue = this.dice.value
      }
      /* if (
        Object.keys(this.beforeDice).length > 0 &&
        this.dice.value === this.beforeDice.value
      ) {
        if (!this.dice.block) {
          this.blockValue = false
          this.equalValue = true
          if (
            this.navigationRoute ||
            (!this.blockDice && typeof this.blockDice === 'boolean')
          ) {
            this.newValue = this.dice.value
          } else {
            if (this.dice.value >= 1 && this.dice.value <= 4) {
              this.newValue = this.dice.value + 2
            } else if (this.dice.value >= 5) {
              this.newValue = this.dice.value - 2
            }
            setTimeout(() => {
              this.newValue = this.dice.value
            }, 600)
          }
        } else {
          this.blockValue = true
          this.newValue = this.dice.value
        }
      } else if (Object.keys(this.beforeDice).length > 0) {
        this.blockValue = false
        this.equalValue = false
        this.newValue = this.dice.value
      } else if (
        Object.keys(this.beforeDice).length === 0 &&
        this.dice.value === 1
      ) {
        if (!this.dice.block) {
          this.blockValue = false
          this.equalValue = true
          if (
            this.navigationRoute ||
            (!this.blockDice && typeof this.blockDice === 'boolean')
          ) {
            this.newValue = this.dice.value
          } else {
            this.newValue = this.dice.value + 2
            setTimeout(() => {
              this.newValue = this.dice.value
            }, 600)
          }
        } else {
          this.blockValue = true
          this.newValue = this.dice.value
        }
      } else {
        this.blockValue = false
        this.equalValue = false
        this.newValue = this.dice.value
      } */
    },
    clickDiceHandler(dice) {
      if (this.played < 3) {
        // this.blockDice = !dice.block
        this.$store.commit(`game/blockAnimate`, true)
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
      // transition: transform 0.6s;
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
