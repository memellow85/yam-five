<template>
  <footer>
    <nav>
      <ul>
        <li v-for="m in menuLeft" :key="m.name" @click="actionsHandler(m)">
          <span :class="`yamicons mdi mdi-${m.icon}`"></span>
        </li>
      </ul>
      <div :class="['game', { disabled: disabled }]" @click="gameHandler">
        <span
          v-if="detailsRoom && detailsRoom.active && !newGame"
          class="notification"
        >
          {{ played }}
        </span>
        <span class="yamicons mdi mdi-cube-outline"></span>
      </div>
      <ul>
        <li v-for="m in menuRight" :key="m.name" @click="actionsHandler(m)">
          <span :class="`yamicons mdi mdi-${m.icon}`"></span>
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
          name: 'config',
          icon: 'cog-outline',
        },
        {
          name: 'help',
          icon: 'help-circle-outline',
        },
      ],
      menuRight: [
        {
          name: 'schema',
          icon: 'view-grid-outline',
        },
        {
          name: 'champions',
          icon: 'chart-line-variant',
        },
      ],
    }
  },
  computed: {
    ...mapState('game', {
      played: (state) => state.played,
      newGame: (state) => state.newGame,
    }),
    ...mapState({
      detailsRoom: (state) => state.detailsRoom,
      userFirebaseGame: (state) => state.userFirebaseGame,
    }),
    disabled() {
      return (
        (this.userFirebaseGame && !this.userFirebaseGame.turnOn) ||
        !this.detailsRoom
      )
    },
  },
  methods: {
    actionsHandler(data) {
      this.$store.commit('game/toogleModal', data.name)
    },
    gameHandler() {
      if (!this.disabled) {
        if (this.newGame) {
          this.$store.dispatch('game/reinitGame')
        } else if (this.detailsRoom.active) {
          this.$store.dispatch('game/playedDecrese')
          this.$store.commit('game/disabledPossibilityGame', this.played)
        } else {
          this.$store.dispatch('startGame')
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
footer {
  @include position(absolute, null null 0 0);
  @include size(100%, 60px);
  background: $color-8;
  nav {
    @include position(relative, null);
    @include size(calc(100% - 20px), 100%);
    @include padding(0 10px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    ul {
      @include size(auto, 40px);
      align-items: center;
      display: flex;
      min-width: 130px;
      li {
        border: 0;
        justify-content: center;
        .yamicons {
          &::before {
            color: $white;
          }
        }
      }
    }
    .game {
      @include position(absolute, -10px null null 50%);
      @include size(50px);
      @include margin(null null null -25px);
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background: $primary;
      .notification {
        @extend %strong;
        @extend %notify;
        @include position(absolute, -2px -2px null null);
        @include size(15px);
        border-radius: 50%;
        background: $color-4;
        color: $color-8;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .yamicons {
        &::before {
          color: $white;
          font-size: 30px;
        }
      }
      &.disabled {
        background: $color-4;
      }
    }
  }
}
</style>
