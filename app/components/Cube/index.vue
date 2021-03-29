<template>
  <div
    :class="[
      'cube',
      dimension,
      { red: data.active && changeValue, green: data.active && !changeValue },
    ]"
  >
    <template v-if="data.active">
      <span
        v-longPress
        :class="`yamicons mdi mdi-${
          changeValue ? 'trash-can-outline' : 'plus-box-outline'
        }`"
        @click="submitValue"
        @longPressStart="longPressStart"
      ></span>
      <p>{{ data.label }}</p>
    </template>
    <template v-else>
      <p>{{ data.value }}</p>
      <p>{{ data.label }}</p>
    </template>
  </div>
</template>

<script>
import { longPress } from '~/directives/longpress'

export default {
  directives: { longPress },
  props: {
    dimension: {
      type: String,
      default: 'small',
    },
    data: {
      type: Object,
      default() {
        return { value: '-', name: '', label: '', active: false }
      },
      required: false,
    },
  },
  data() {
    return {
      changeValue: false,
    }
  },
  methods: {
    submitValue() {
      if (this.data.active) {
        if (!this.changeValue) {
          this.$store.dispatch('game/setActualValue', this.data)
        } else {
          this.$store.dispatch('game/resetActualValue', this.data)
        }
        this.changeValue = false
      }
    },
    longPressStart() {
      this.changeValue = !this.changeValue
    },
  },
}
</script>

<style lang="scss" scoped>
.cube {
  @include margin(5px);
  background: $color-1;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .yamicons {
    // -moz-touch-callout: none;
    -webkit-touch-callout: none;
    -moz-user-select: none;
    -webkit-user-select: none;
  }
  &.red {
    .yamicons {
      &:before {
        color: $error;
      }
    }
    p {
      color: $error;
    }
  }
  &.green {
    .yamicons {
      &:before {
        color: $primary;
      }
    }
    p {
      color: $primary;
    }
  }
  p {
    @extend %strong;
    @include font-size(10px, 1);
    &:first-child {
      @include font-size(20px, 28px);
    }
  }
  &.small {
    @include size(50px);
  }
  &.medium {
    @include size(60px);
  }
  &.big {
    @include size(70px);
  }
}
</style>
