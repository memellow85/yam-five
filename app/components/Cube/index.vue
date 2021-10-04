<template>
  <div
    :class="[
      'cube flex-center',
      dimension,
      { red: data.active && changeValue, green: data.active && !changeValue },
    ]"
  >
    <template v-if="data.active">
      <div class="box-action flex-center">
        <span
          v-touch="submitValue"
          :class="`yamicons mdi mdi-${
            changeValue ? 'trash-can-outline' : 'plus-box-outline'
          }`"
        ></span>
        <!-- v-longPress
        @longPressStart="longPressStart" -->
      </div>
      <p>{{ $t(data.label) }}</p>
    </template>
    <template v-else>
      <div class="box-action flex-center">
        <p>{{ data.value }}</p>
      </div>
      <p>{{ $t(data.label) }}</p>
    </template>
  </div>
</template>

<script>
// import { longPress } from '~/directives/longpress'

export default {
  // directives: { longPress },
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
        this.$store.commit(`game/setDisabledButtonGame`, true)
        if (!this.changeValue) {
          this.$store.dispatch('game/setActualValue', this.data)
        } else {
          this.$store.dispatch('game/resetActualValue', this.data)
        }
        this.changeValue = false
      }
    },
    /* longPressStart() {
      this.changeValue = !this.changeValue
    }, */
  },
}
</script>

<style lang="scss" scoped>
.cube {
  @include margin(0.3rem);
  background: $color-1;
  border-radius: $rounded-small;
  flex-direction: column;
  .yamicons {
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
  .box-action {
    @include size(1.5rem);
  }
  > p {
    @include font-size(10px, 1);
    @include margin(0.2rem null null);
  }
  &.small {
    @include size(3rem);
  }
  &.medium {
    @include size(3.5rem);
  }
  &.big {
    @include size(4rem);
  }
}
</style>
