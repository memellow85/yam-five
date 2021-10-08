<template>
  <footer :class="[{ big: isIphone() && bigMenuIphone() }]">
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
        <li
          v-for="m in menuRight"
          :key="m.name"
          v-touch="() => actionsHandler(m)"
          :class="{ selected: $route.name === m.name }"
        >
          <span :class="`yamicons mdi mdi-${getIconName(m)}`"></span>
        </li>
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
      dices: new Audio('./sounds/dices.mp3'),
      menuLeft: [
        {
          name: 'home',
          icon: 'gamepad-variant-outline',
        },
        {
          name: 'game-games',
          icon: 'view-grid-outline',
        },
        {
          name: 'game-stats',
          icon: 'chart-box-outline',
        },
      ],
      menuRight: [
        {
          name: 'game-help',
          icon: 'account-question-outline',
        },
        {
          name: 'game-ranking',
          icon: 'arm-flex-outline',
        },
        {
          name: 'game-config',
          icon: 'cog-outline',
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
          !this.userSocket.turnOn ||
          !this.startGame ||
          this.newGame ||
          this.disabledButtonGame ||
          this.played === 0
        )
      }
    },
    notification() {
      return this.startGame && this.userSocket.turnOn && !this.newGame
    },
  },
  methods: {
    getIconName(elm) {
      return this.$route.name === elm.name
        ? elm.icon.replace('-outline', '')
        : elm.icon
    },
    actionsHandler(data) {
      this.$router.push({ name: data.name })
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
            this.$store.commit('game/disabledPossibilityGame', this.played)
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
  // background: $color-8;
  &.big {
    @include size(100%, 4.5rem);
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
