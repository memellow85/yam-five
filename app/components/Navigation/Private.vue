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
          <span
            v-if="
              showNotificationChat &&
              m.name === 'game-chat' &&
              $route.name !== 'game-chat'
            "
            :class="'notification-circle'"
          ></span>
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
              selected: $route.name === m.name,
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
import NavigationMixin from '~/mixins/navigation'
import { play, bigMenuIphone, isIphone } from '~/utils'

export default {
  mixins: [NavigationMixin],
  data() {
    return {
      bigMenuIphone,
      isIphone,
      showNotificationChat: false,
      timerNotificationShow: 5000,
      dices: new Audio('./sounds/dices.mp3'),
      menuLeft: [
        {
          name: 'home',
          icon: 'gamepad-variant-outline',
        },
        {
          name: 'game-chat',
          icon: 'chat-outline',
        },
      ],
      menuRight: [
        {
          name: 'game-ranking',
          icon: 'arm-flex-outline',
        },
        {
          name: 'submenu',
          icon: 'menu',
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
      messageChat: (state) => state.messageChat,
      messageChatGlobal: (state) => state.messageChatGlobal,
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
  watch: {
    messageChat() {
      if (this.$route.name !== 'game-chat') this.showNotificationChatHandler()
    },
    messageChatGlobal() {
      if (this.$route.name !== 'game-chat') this.showNotificationChatHandler()
    },
  },
  methods: {
    showNotificationChatHandler() {
      this.showNotificationChat = true
      setTimeout(() => {
        this.showNotificationChat = false
      }, this.timerNotificationShow)
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
  nav {
    @include position(relative, null);
    @include padding(null 1rem);
    @include size(auto, 100%);
    ul {
      width: calc(calc(100vw - 8rem) / 2);
      justify-content: space-around;
      li {
        @include position(relative, null);
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
