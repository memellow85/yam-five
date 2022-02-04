<template>
  <div>
    <Header></Header>
    <div class="container-app">
      <!-- Contenuto centrale -->
      <div
        :class="[
          'wrapper-main flex-without-align',
          { big: isIphone() && bigMenuIphone() },
        ]"
      >
        <div class="container-match flex-center">
          <template v-if="!startGame && userSocket === null">
            <p>{{ $t('home.message_1') }}</p>
            <div class="container-button-match flex-center">
              <button v-touch="createSingleFastMatch">
                {{ $t('home.btn_4') }}
              </button>
            </div>
            <p>{{ $t('home.message_2') }}</p>
            <div class="container-button-match flex-center">
              <a
                v-touch="joinAmatch"
                class="custom-link"
                href="javascript: void(0)"
                >{{ $t('home.btn_1') }}</a
              >
            </div>
          </template>
          <template v-if="fastGame">
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
          </template>
          <template v-if="!fastGame">
            <template
              v-if="
                !startGame && userSocket && Object.keys(userSocket).length > 0
              "
            >
              <p v-if="userSocket.turnOn">
                {{ $t('home.message_2_a') }}
                <strong>{{ userSocket.room }}</strong
                >. <br />{{ $t('home.message_2_b') }}
              </p>
              <div v-else class="wrapper-wait">
                <p>{{ $t('home.message_2_c') }}</p>
                <div class="wrapper-wait-icon">
                  <span
                    :class="`yamicons mdi mdi-dice-${getRandomNumberCube()}-outline`"
                  ></span>
                </div>
              </div>
              <button v-if="userSocket.turnOn" v-touch="startAgame">
                {{ $t('home.btn_2') }}
              </button>
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
              <div class="wrapper-wait">
                <p>{{ $t('home.message_7') }}</p>
                <div class="wrapper-wait-icon">
                  <span
                    :class="`yamicons mdi mdi-dice-${getRandomNumberCube()}-outline`"
                  ></span>
                </div>
              </div>
            </template>
          </template>
          <template v-if="newGame && !fastGame">
            <p>{{ $t('home.message_6') }}</p>
            <button v-touch="startNewGame">{{ $t('home.btn_3') }}</button>
          </template>

          <div
            v-show="
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
          </div>
        </div>

        <div class="wrapper-games">
          <!-- Tabs di navigazione tra giocate -->
          <Tabs></Tabs>

          <!-- Set delle giocate -->
          <div class="container-box body-scroll-lock-ignore-inner">
            <div class="wrapper-box flex-center">
              <Box
                :class-name="'single'"
                :title="`${$t('home.title_1')} (${
                  numberTotalGames[playedView]
                })`"
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ScrollMixin from '~/mixins/scroll'
import AnalyticsMixin from '~/mixins/analytics'
import { bigMenuIphone, isIphone, getRandomNumberCube } from '~/utils'

export default {
  mixins: [ScrollMixin, AnalyticsMixin],
  beforeRouteLeave(to, from, next) {
    this.$store.commit(`game/setNavigationRoute`, true)
    this.$store.commit(`game/setDisabledButtonGame`, true)
    next()
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit(`game/setDisabledButtonGame`, false)
    })
  },
  layout: 'private',
  middleware: ['authenticated'],
  data() {
    return {
      bigMenuIphone,
      isIphone,
      getRandomNumberCube,
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
      numberTotalGames: (state) => state.numberTotalGames,
      fastGame: (state) => state.fastGame,
    }),
    ...mapState('ws', {
      userSocket: (state) => state.userSocket,
      userTurnSocket: (state) => state.userTurnSocket,
    }),
  },
  watch: {
    userTurnSocket() {
      if (this.userSocket && !this.userSocket.turnOn) {
        this.$store.commit('game/toggleNotification', {
          type: 'warning',
          message: `${this.$t('home.notification_1')} ${
            this.userTurnSocket.name
          }`,
        })
      } else {
        this.$store.commit('game/toggleNotification', null)
      }
    },
  },
  methods: {
    joinAmatch() {
      this.$router.push({ name: 'game-config' })
    },
    startAgame() {
      this.animateBtn()
      this.$store.dispatch('ws/startGameSocket')
    },
    startNewGame() {
      this.animateBtn()
      this.$store.dispatch('ws/updateGameSocket')
    },
    createSingleFastMatch() {
      this.$store.dispatch(`game/fastGame`)
    },
    animateBtn() {
      this.$store.commit(`game/setAnimateBtn`, true)
      setTimeout(() => {
        this.$store.commit(`game/setAnimateBtn`, false)
      }, 1500)
    },
  },
}
</script>

<style lang="scss" scoped>
@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.container-app {
  .wrapper-main {
    @include size(100%, calc(100vh - 8.5rem));
    flex-direction: column;
    &.big {
      @include size(100%, calc(100vh - 9.5rem));
    }
  }
  button {
    @include margin(0.7rem null null);
  }
  .container-match {
    @include size(calc(100% - 2rem), 100%);
    @include padding(null 1rem);
    flex-direction: column;
    text-align: center;
    > p {
      line-height: 1.2rem;
    }
    .box-dice {
      @include margin(null null 0.7rem null);
      flex-wrap: wrap;
    }
    .container-button-match {
      @include margin(0.7rem null);
      button {
        @include margin(0 null);
      }
    }
  }
  .container-box {
    -webkit-overflow-scrolling: touch;
    overflow-x: auto;
    display: flex;
    .wrapper-box {
      @include padding(0.7rem 0.7rem 1.2rem);
      flex-wrap: nowrap;
      ::v-deep article {
        @include margin(null 0.7rem null null);
        &:last-child {
          @include margin(null 0 null null);
        }
      }
    }
  }
  .wrapper-wait {
    .wrapper-wait-icon {
      @include margin(0.7rem null null null);
      span {
        animation: spin 4s linear infinite;
      }
    }
  }
}
</style>
