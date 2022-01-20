<template>
  <div
    :class="[
      'cube flex-center',
      dimension,
      {
        red: data.active && !disabledButtonGame && data.icon === 'trash-can',
        green: data.active && !disabledButtonGame && data.icon === 'plus-box',
      },
    ]"
  >
    <template v-if="data.active && !disabledButtonGame">
      <div class="box-action flex-center">
        <span
          v-touch="submitValue"
          :class="`yamicons mdi mdi-${data.icon}-outline`"
        ></span>
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
import { mapState } from 'vuex'

export default {
  props: {
    dimension: {
      type: String,
      default: 'small',
    },
    data: {
      type: Object,
      default() {
        return { value: '-', name: '', label: '', active: false, icon: '' }
      },
      required: false,
    },
  },
  computed: {
    ...mapState('game', {
      disabledButtonGame: (state) => state.disabledButtonGame,
    }),
  },
  methods: {
    submitValue() {
      if (this.data.active) {
        this.$store.dispatch('game/setActualValue', this.data)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.cube {
  @include margin(0.3rem);
  @include themed() {
    background: t($key-color-1);
  }
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
