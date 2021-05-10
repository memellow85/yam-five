<template>
  <footer>
    <nav>
      <ul class="inline">
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
      <ul class="inline">
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
  @include size(100%, 3.5rem);
  background: $color-8;
  nav {
    @include position(relative, null);
    @include padding(null 0.5rem);
    @include size(auto, 100%);
    @extend %flex;
    @extend %flexSpaceBetween;
    ul {
      li {
        @include margin(null 1.4rem);
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
      @extend %flex;
      @extend %flexCenter;
      border-radius: 50%;
      background: $primary;
      .notification {
        @include position(absolute, -0.1rem -0.1rem null null);
        @include size(1rem);
        @extend %strong;
        @extend %notify;
        @extend %flex;
        @extend %flexCenter;
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
