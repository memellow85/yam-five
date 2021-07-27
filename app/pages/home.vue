<template>
  <div>
    <Header></Header>
    <div class="container-app">
      <!-- Contenuto centrale -->
      <div class="wrapper-main">
        <div class="container-match flex-center">
          <template v-if="!startGame && userSocket === null">
            <p>{{ $t('home.message_1') }}</p>
            <button @click="joinAmatch">{{ $t('home.btn_1') }}</button>
          </template>
          <template
            v-if="
              !startGame && userSocket && Object.keys(userSocket).length > 0
            "
          >
            <p v-if="userSocket.turnOn">
              {{ $t('home.message_2_a') }} <strong>{{ userSocket.room }}</strong
              >. <br />{{ $t('home.message_2_b') }}
            </p>
            <p v-else>{{ $t('home.message_2_c') }}</p>
            <button v-if="userSocket.turnOn" @click="startAgame">
              {{ $t('home.btn_2') }}
            </button>
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
        <div class="container-box body-scroll-lock-ignore-inner">
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
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import NoSleep from 'nosleep.js'
import WsMixin from '~/mixins/ws'
import ScrollMixin from '~/mixins/scroll'

export default {
  mixins: [WsMixin, ScrollMixin],
  beforeRouteLeave(to, from, next) {
    this.$store.commit(`game/setNavigationRoute`, true)
    this.$store.commit(`game/setDisabledButtonGame`, true)
    next()
  },
  middleware: ['authenticated'],
  data() {
    return {
      noSleep: new NoSleep(),
      moveTop: null,
    }
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
    this.$store.commit(`game/setDisabledButtonGame`, false)
    this.noSleep.enable()
  },
  methods: {
    joinAmatch() {
      this.$router.push({ name: 'game-config' })
    },
    startAgame() {
      this.$store.dispatch('game/startGame')
    },
    startNewGame() {
      this.$store.dispatch('game/reinitGame')
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
    overflow-x: auto;
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
