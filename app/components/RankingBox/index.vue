<template>
  <div :class="['wrapper-ranking-box flex-between', { io: current }]">
    <div class="flex">
      <Avatar
        :selected="live > 1 || action.length > 0 ? infoUser : infoUser.user"
        :list="listAvatar"
        :dimension="'small'"
        :detail-position="'left'"
        hide-name
      ></Avatar>
      <p>
        {{ live > 1 || action.length > 0 ? infoUser.name : infoUser.user.name }}
      </p>
    </div>
    <div class="flex-end">
      <div v-if="action.length > 0" class="wrapper-actions">
        <span
          v-for="a in action"
          :key="a.id"
          v-touch="() => actionHandler(a.action)"
          :class="`yamicons mdi mdi-${a.icon} ${infoUser.busy ? 'busy' : ''}`"
        ></span>
      </div>
      <template v-else>
        <div class="wrapper-performance flex-end">
          <span :class="`yamicons mdi mdi-medal-outline`"></span>
          <p>{{ infoUser.tot_campaigns }}</p>
        </div>
        <div class="wrapper-performance flex-end">
          <span
            v-if="index <= 2"
            :class="`yamicons mdi mdi-${
              index === 0
                ? 'podium-gold'
                : index === 1
                ? 'podium-silver'
                : 'podium-bronze'
            }`"
          ></span>
          <h3>{{ infoUser.tot }}</h3>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    infoUser: {
      type: Object,
      default() {
        return {}
      },
    },
    listAvatar: {
      type: Array,
      default() {
        return []
      },
    },
    index: {
      type: Number,
      default: 0,
    },
    live: {
      type: Number,
      default: 0,
    },
    current: {
      type: Boolean,
      default: false,
    },
    action: {
      type: Array,
      default() {
        return []
      },
    },
  },
  methods: {
    actionHandler(action) {
      this.$nuxt.$emit(action, this.infoUser)
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper-ranking-box {
  @include margin(0.5rem null null null);
  border: $border-base;
  border-radius: $rounded-small;
  > div {
    @include padding(0.5rem);
  }
  h3 {
    @include margin(0);
    display: block;
    min-width: 3rem;
    text-align: right;
  }
  p {
    text-align: right;
    display: block;
    min-width: 1rem;
  }
  &.io {
    p,
    h3 {
      @include themed() {
        color: t($key-color-custom-1);
      }
    }
    .wrapper-actions {
      span {
        &.yamicons {
          &:before {
            @include themed() {
              color: t($key-color-3);
            }
          }
        }
        &.busy {
          &.yamicons {
            &:before {
              color: $error;
            }
          }
        }
      }
    }
  }
  .wrapper-performance {
    @include size(7.5rem, auto);
    span {
      @include margin(null 0.5rem null null);
      &.yamicons {
        &:before {
          color: $gold;
        }
        &.mdi-podium-silver {
          &:before {
            color: $silver;
          }
        }
        &.mdi-podium-bronze {
          &:before {
            color: $bronze;
          }
        }
      }
    }
  }
  .wrapper-actions {
    span {
      &.busy {
        &.yamicons {
          &:before {
            color: $error;
          }
        }
      }
    }
  }
}
</style>
