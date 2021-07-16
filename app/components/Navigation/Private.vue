<template>
  <footer>
    <nav class="flex-between">
      <ul class="inline">
        <li
          v-for="m in menuLeft"
          :key="m.name"
          :class="{ selected: $route.name === m.name }"
          @click="actionsHandler(m)"
        >
          <span :class="`yamicons mdi mdi-${getIconName(m)}`"></span>
        </li>
      </ul>
      <div
        :class="['game flex-center', { disabled: disabled }]"
        @click="gameHandler"
      >
        <span v-if="notification" class="notification flex-center">
          {{ played }}
        </span>
        <span class="yamicons mdi mdi-cube-outline"></span>
      </div>
      <ul class="inline">
        <li
          v-for="m in menuRight"
          :key="m.name"
          :class="{ selected: $route.name === m.name }"
          @click="actionsHandler(m)"
        >
          <span :class="`yamicons mdi mdi-${getIconName(m)}`"></span>
        </li>
      </ul>
    </nav>
  </footer>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
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
    }),
    ...mapState('ws', {
      userSocket: (state) => state.userSocket,
    }),
    disabled() {
      return (
        this.startGame === null ||
        !this.userSocket.turnOn ||
        !this.startGame ||
        this.newGame
      )
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
      this.$store.commit(`game/setNavigationRoute`, false)
      if (!this.disabled) {
        if (this.startGame) {
          this.$store.commit(`game/activeGame`)
          setTimeout(() => {
            this.$store.dispatch('game/playedDecrease')
            this.$store.commit('game/disabledPossibilityGame', this.played)
          }, 100)
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
footer {
  @include position(absolute, null null 0 0);
  @include size(100%, 3.5rem);
  background: $color-8;
  nav {
    @include position(relative, null);
    @include padding(null 0.5rem);
    @include size(auto, 100%);
    ul {
      li {
        @include margin(null 0.8rem);
        &.selected {
          .yamicons {
            &::before {
              color: $primary;
            }
          }
        }
        .yamicons {
          &::before {
            color: $white;
          }
        }
      }
    }
    .game {
      @include position(absolute, -1rem null null 50%);
      @include size(3.2rem);
      @include margin(null null null -1.6rem);
      border-radius: 50%;
      background: $primary;
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
