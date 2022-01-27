<template>
  <footer :class="[{ big: isIphone() && bigMenuIphone() }]">
    <transition
      name="overlay"
      :duration="{ enter: 0, leave: 500 }"
      enter-active-class="animated"
      leave-active-class="animated"
    >
      <div
        v-if="showSubMenu"
        class="submenu flex"
        :style="`top:-${subMenu.length * 3.5}rem`"
      >
        <ul>
          <li
            v-for="m in subMenu"
            :key="m.name"
            v-touch="() => actionsHandler(m)"
            :class="['flex-center', { selected: $route.name === m.name }]"
          >
            <span :class="`yamicons mdi mdi-${getIconName(m)}`"></span>
            <span
              v-if="m.name === 'game-chat' || m.name === 'game-invite'"
              :class="'notification'"
            ></span>
          </li>
        </ul>
      </div>
    </transition>
    <nav class="flex-between">
      <ul class="inline flex">
        <li
          v-for="m in menuLeft"
          :key="m.name"
          v-touch="() => actionsHandler(m)"
          :class="{ selected: $route.name === m.name }"
        >
          <span :class="`yamicons mdi mdi-${getIconName(m)}`"></span>
        </li>
      </ul>
      <div
        v-touch="gameHandler"
        :class="[
          'game flex-center',
          { disabled: disabled, animateBtnDice: animateBtnDice },
        ]"
      >
        <span v-if="notification" class="notification flex-center">
          {{ played }}
        </span>
        <span class="yamicons mdi mdi-cube-outline"></span>
      </div>
      <ul class="inline flex">
        <template v-for="m in menuRight">
          <li
            :key="m.name"
            v-touch="() => actionsHandler(m)"
            :class="{
              selected:
                $route.name === m.name || (showSubMenu && m.name === 'submenu'),
            }"
          >
            <span
              :class="`yamicons mdi mdi-${
                m.name !== 'submenu' ? getIconName(m) : m.icon
              }`"
            ></span>
          </li>
        </template>
      </ul>
    </nav>
  </footer>
</template>

<script>
import { mapState } from 'vuex'
import { play, bigMenuIphone, isIphone } from '~/utils'

export default {
  data() {
    return {
      bigMenuIphone,
      isIphone,
      showSubMenu: false,
      dices: new Audio('./sounds/dices.mp3'),
      subMenu: [
        {
          name: 'game-help',
          icon: 'head-question-outline',
        },
        {
          name: 'game-stats',
          icon: 'chart-box-outline',
        },
        {
          name: 'game-games',
          icon: 'view-grid-outline',
        },
      ],
      menuLeft: [
        {
          name: 'home',
          icon: 'gamepad-variant-outline',
        },
        {
          name: 'game-chat',
          icon: 'chat-outline',
        },
        {
          name: 'game-invite',
          icon: 'account-plus-outline',
        },
      ],
      menuRight: [
        {
          name: 'game-ranking',
          icon: 'arm-flex-outline',
        },
        {
          name: 'game-config',
          icon: 'cog-outline',
        },
        {
          name: 'submenu',
          icon: 'dots-vertical',
        },
      ],
    }
  },
  computed: {
    ...mapState('game', {
      played: (state) => state.played,
      startGame: (state) => state.startGame,
      newGame: (state) => state.newGame,
      disabledButtonGame: (state) => state.disabledButtonGame,
      animateBtnDice: (state) => state.animateBtnDice,
    }),
    ...mapState('ws', {
      userSocket: (state) => state.userSocket,
    }),
    disabled() {
      if (this.$route.name !== 'home') {
        return true
      } else {
        return (
          this.startGame === null ||
          !this.userSocket ||
          !this.userSocket.turnOn ||
          !this.startGame ||
          this.newGame ||
          this.disabledButtonGame ||
          this.played === 0
        )
      }
    },
    notification() {
      return (
        this.startGame &&
        this.userSocket &&
        this.userSocket.turnOn &&
        !this.newGame
      )
    },
  },
  methods: {
    getIconName(elm) {
      return this.$route.name === elm.name
        ? elm.icon.replace('-outline', '')
        : elm.icon
    },
    actionsHandler(data) {
      if (data.name === 'submenu') {
        this.showSubMenu = !this.showSubMenu
      } else {
        if (this.subMenu.filter((m) => m.name === data.name).length > 0) {
          this.showSubMenu = !this.showSubMenu
        }
        this.$router.push({ name: data.name })
      }
    },
    gameHandler() {
      if (!this.disabled) {
        if (this.startGame) {
          play(this.dices)
          this.$store.commit(`game/blockAnimate`, false)
          this.$store.commit(`game/setDisabledButtonGame`, true)
          this.$store.commit(`game/setNavigationRoute`, false)
          this.$store.commit(`game/activeGame`)

          setTimeout(() => {
            this.$store.dispatch('game/playedDecrease')
          }, 200)

          setTimeout(() => {
            this.$store.commit(`game/setDisabledButtonGame`, false)
          }, 1200)
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@keyframes blinker {
  0% {
    background: $primary;
  }
  50% {
    background: $color-4;
  }
  100% {
    background: $primary;
  }
}

footer {
  @include position(absolute, null null 0 0);
  @include size(100%, 3.5rem);
  @include themed() {
    background: t($key-color-nav);
  }
  &.big {
    @include size(100%, 4.5rem);
  }
  .submenu {
    @include position(absolute, null 0 null null);
    @include size(3.5rem, auto);
    @include themed() {
      background: t($key-color-nav);
    }
    border-radius: 0.5rem 0 0 0;
    transition: all 0.3s;
    opacity: 1;
    &.animated {
      top: 0;
      opacity: 0;
    }
    ul {
      @include size(100%, auto);
      li {
        @include size(100%, 3.5rem);
        &.selected {
          .yamicons {
            &::before {
              color: $primary;
            }
          }
        }
        .yamicons {
          &::before {
            color: $color-2;
          }
        }
      }
    }
  }
  nav {
    @include position(relative, null);
    @include padding(null 1rem);
    @include size(auto, 100%);
    ul {
      width: calc(calc(100vw - 8rem) / 2);
      justify-content: space-between;
      li {
        &.selected {
          .yamicons {
            &::before {
              color: $primary;
            }
          }
        }
        .yamicons {
          &::before {
            color: $color-2;
          }
        }
      }
    }
    .game {
      @include position(absolute, -1rem null null 50%);
      @include size(3.6rem);
      @include margin(null null null -1.8rem);
      border-radius: 50%;
      background: $primary;
      &.animateBtnDice {
        animation: 0.8s blinker linear infinite;
      }
      .notification {
        @include position(absolute, -0.1rem -0.1rem null null);
        @include size(1rem);
        @extend %strong;
        @extend %notify;
        border-radius: 50%;
        background: $color-4;
        color: $color-8;
      }
      .yamicons {
        &::before {
          color: $white;
          font-size: 2.2rem;
        }
      }
      &.disabled {
        background: $color-4;
      }
    }
  }
}
</style>
