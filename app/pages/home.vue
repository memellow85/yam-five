<template>
  <div class="container-app">
    <!-- Contenuto centrale -->
    <div class="wrapper-main">
      <div class="container-match flex-center">
        <template v-if="!startGame && userSocket === null">
          <p>{{ $t('home.message_1') }}</p>
          <button @click="joinAmatch">{{ $t('home.btn_1') }}</button>
        </template>
        <template
          v-if="!startGame && userSocket && Object.keys(userSocket).length > 0"
        >
          <p>
            {{ $t('home.message_2_a') }} <strong>{{ userSocket.room }}</strong
            >. <br />{{ $t('home.message_2_b') }}
          </p>
          <button @click="startAgame">{{ $t('home.btn_2') }}</button>
        </template>
        <template
          v-if="
            !newGame &&
            activeGame &&
            startGame &&
            userSocket &&
            Object.keys(userSocket).length > 0
          "
        >
          <div class="box-dice flex-center">
            <Dice :dice="dices.one" :before-dice="beforeDices.one"></Dice>
            <Dice :dice="dices.two" :before-dice="beforeDices.two"></Dice>
            <Dice :dice="dices.three" :before-dice="beforeDices.three"></Dice>
            <div class="break"></div>
            <Dice :dice="dices.four" :before-dice="beforeDices.four"></Dice>
            <Dice :dice="dices.five" :before-dice="beforeDices.five"></Dice>
          </div>
          <p>
            {{ $t('home.message_3_a') }} <strong>{{ 3 - played }}</strong>
            {{ $t('home.message_3_b') }} <strong>{{ dices.tot }}</strong>
          </p>
        </template>
        <template
          v-if="
            !newGame &&
            !activeGame &&
            startGame &&
            userSocket &&
            Object.keys(userSocket).length > 0 &&
            userSocket.turnOn
          "
        >
          <p>{{ $t('home.message_5') }}</p>
        </template>
        <template
          v-if="
            !newGame &&
            !activeGame &&
            startGame &&
            userSocket &&
            Object.keys(userSocket).length > 0 &&
            !userSocket.turnOn
          "
        >
          <p>{{ $t('home.message_7') }}</p>
        </template>
        <template v-if="newGame">
          <p>{{ $t('home.message_6') }}</p>
          <button @click="startNewGame">{{ $t('home.btn_3') }}</button>
        </template>
      </div>

      <!-- Tabs di navigazione tra giocate -->
      <Tabs></Tabs>

      <!-- Set delle giocate -->
      <div class="container-box body-scroll-lock-ignore">
        <div class="wrapper-box flex-center">
          <Box
            :class-name="'single'"
            :title="$t('home.title_1')"
            :info="$t('home.help_1')"
          >
            <Cube
              :dimension="'medium'"
              :data="game[playedView].data['one']"
            ></Cube>
            <Cube
              :dimension="'medium'"
              :data="game[playedView].data['two']"
            ></Cube>
            <Cube
              :dimension="'medium'"
              :data="game[playedView].data['three']"
            ></Cube>
            <div class="break"></div>
            <Cube
              :dimension="'medium'"
              :data="game[playedView].data['four']"
            ></Cube>
            <Cube
              :dimension="'medium'"
              :data="game[playedView].data['five']"
            ></Cube>
            <Cube
              :dimension="'medium'"
              :data="game[playedView].data['six']"
            ></Cube>
          </Box>
          <Box
            :class-name="'maxmin'"
            :title="$t('home.title_2')"
            :info="$t('home.help_2')"
          >
            <Cube
              :dimension="'big'"
              :data="game[playedView].data['min']"
            ></Cube>
            <Cube
              :dimension="'big'"
              :data="game[playedView].data['max']"
            ></Cube>
          </Box>
          <Box
            :class-name="'extra1'"
            :title="$t('home.title_3')"
            :info="$t('home.help_3')"
          >
            <Cube
              :dimension="'medium'"
              :data="game[playedView].data['mineleven']"
            ></Cube>
            <Cube
              :dimension="'medium'"
              :data="game[playedView].data['full']"
            ></Cube>
            <Cube
              :dimension="'medium'"
              :data="game[playedView].data['poker']"
            ></Cube>
          </Box>
          <Box
            :class-name="'extra2'"
            :title="$t('home.title_4')"
            :info="$t('home.help_4')"
          >
            <Cube
              :dimension="'big'"
              :data="game[playedView].data['scale']"
            ></Cube>
            <Cube
              :dimension="'big'"
              :data="game[playedView].data['yam']"
            ></Cube>
          </Box>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <Navigation></Navigation>

    <!-- All overlay -->
    <LazyOverlay :show-overlay="showConfig" :height-overlay="28">
      <LazyViewConfig></LazyViewConfig>
    </LazyOverlay>
    <LazyOverlay :show-overlay="showSchema" :height-overlay="33">
      <LazyViewSchemas></LazyViewSchemas>
    </LazyOverlay>
    <LazyOverlay :show-overlay="showChampionsShip" :height-overlay="25">
      <LazyViewChampion></LazyViewChampion>
    </LazyOverlay>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import NoSleep from 'nosleep.js'
import { logger } from '~/utils'

export default {
  middleware: ['authenticated'],
  transition: 'slide-bottom',
  data() {
    return {
      noSleep: new NoSleep(),
      moveTop: null,
    }
  },
  sockets: {
    updateUsersSocketEmit(users) {
      logger('SOCKETS updateUsersSocketEmit', users, 'i')
      this.$store.commit(`ws/updateUsersSocket`, users)
    },
    updateUserSocketEmit(user) {
      logger('SOCKETS updateUserSocketEmit', user, 'i')
      this.$store.commit(`ws/setUserSocket`, user)
      this.$store.commit('game/startGame', false)
    },
    setUserTurnSocketEmit(user) {
      logger('SOCKETS setUserTurnSocketEmit', user, 'i')
      this.$store.commit('ws/setUserTurnSocket', user)
    },
    startGameSocketEmit(user) {
      logger('SOCKETS startGameSocketEmit', user, 'i')
      this.$store.commit('game/startGame', true)
      this.$store.commit('game/initDices')
      this.$store.commit('ws/setUserTurnSocket', user)
    },
    winnerIsSocketEmit(notificationInfo) {
      logger('SOCKETS winnerIsSocketEmit', notificationInfo, 'i')
      const type = notificationInfo.count === 0 ? 'success' : 'alert'
      const message =
        notificationInfo.count === 0
          ? this.$t('notification.win')
          : this.$t('notification.lose') + notificationInfo.name
      this.$store.commit('game/toggleNotification', {
        type,
        message,
      })
      this.$store.dispatch(`firebase/updateRecordUser`, notificationInfo.user)
    },
    newGameSocketEmit(value) {
      logger('SOCKETS newGameSocketEmit', value, 'i')
      this.$store.dispatch(`game/newGame`, value)
    },
    userLeaveMatchSocketEmit(user) {
      logger('SOCKETS userLeaveMatchSocketEmit', user, 'i')
      this.$store.commit(`game/toggleNotification`, {
        type: 'alert',
        message: user.user.name + this.$t('home.notification_3'),
      })
    },
  },
  computed: {
    ...mapState('game', {
      startGame: (state) => state.startGame,
      activeGame: (state) => state.activeGame,
      newGame: (state) => state.newGame,
      playedView: (state) => state.playedView,
      game: (state) => state.game,
      dices: (state) => state.dices,
      beforeDices: (state) => state.beforeDices,
      played: (state) => state.played,
      showSchema: (state) => state.showSchema,
      showChampionsShip: (state) => state.showChampionsShip,
      showConfig: (state) => state.showConfig,
    }),
    ...mapState('ws', {
      userSocket: (state) => state.userSocket,
      userTurnSocket: (state) => state.userTurnSocket,
    }),
  },
  watch: {
    userTurnSocket() {
      this.$store.commit('game/resetModal')
      if (!this.userSocket.turnOn) {
        this.$store.commit('game/toggleNotification', {
          type: 'warning',
          message: `${this.$t('home.notification_1')} ${
            this.userTurnSocket.user.name
          }`,
        })
      } else {
        this.$store.commit('game/toggleNotification', null)
      }
    },
  },
  mounted() {
    // No sleep functions
    this.noSleep.enable()
    // Serve per prevenire il bounce su ios
    // Prevents window from moving on touch on older browsers.
    window.addEventListener(
      'touchmove',
      function (event) {
        event.preventDefault()
      },
      { passive: false }
    )

    // Allows content to move on touch.
    document.querySelector('.body-scroll-lock-ignore').addEventListener(
      'touchmove',
      function (event) {
        event.stopPropagation()
      },
      { passive: false }
    )
  },
  methods: {
    joinAmatch() {
      this.$store.commit('game/toggleModal', 'config')
    },
    startAgame() {
      this.$store.dispatch('game/startGame')
    },
    startNewGame() {
      this.$store.dispatch('game/reigniteGame')
    },
  },
}
</script>

<style lang="scss" scoped>
.container-app {
  .wrapper-main {
    @include position(absolute, 4rem null null 50%);
    @include size(100%, auto);
    transform: translate(-50%, 0);
    overflow: hidden;
  }
  button {
    @include margin(0.7rem null null);
  }
  .container-match {
    @include size(calc(100% - 2rem), calc(100vh - 26rem));
    @include padding(null 1rem);
    flex-direction: column;
    overflow: hidden;
    text-align: center;
    > p {
      line-height: 1.2rem;
    }
    .box-dice {
      @include margin(null null 0.7rem null);
      flex-wrap: wrap;
    }
  }
  .container-box {
    -webkit-overflow-scrolling: touch;
    overflow: auto;
    display: flex;
    .wrapper-box {
      @include padding(0.7rem);
      flex-wrap: nowrap;
      ::v-deep article {
        @include margin(null 0.7rem null null);
        &:last-child {
          @include margin(null 0 null null);
        }
      }
    }
  }
}
</style>
