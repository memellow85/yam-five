<template>
  <div class="container-app">
    <!-- Contenuto centrale -->
    <div class="wrapper-main">
      <div class="container-match">
        <template v-if="isLoadingRoom">
          <p>{{ $t('home.message_0') }}</p>
        </template>
        <template v-if="isLoadingLeftRoom">
          <p>{{ $t('home.message_4') }}</p>
        </template>
        <template v-if="!detailsRoom && !isLoadingRoom && !isLoadingLeftRoom">
          <p>{{ $t('home.message_1') }}</p>
          <button @click="joinAmatch">{{ $t('home.btn_1') }}</button>
        </template>
        <p
          v-if="
            detailsRoom &&
            !detailsRoom.active &&
            !isLoadingRoom &&
            !isLoadingLeftRoom
          "
        >
          {{ $t('home.message_2_a') }} <strong>{{ detailsRoom.room }}</strong
          >. <br />{{ $t('home.message_2_b') }}
        </p>
        <template
          v-if="
            detailsRoom &&
            detailsRoom.active &&
            !isLoadingRoom &&
            !isLoadingLeftRoom
          "
        >
          <div class="box-dice">
            <Dice :dice="dices.one"></Dice>
            <Dice :dice="dices.two"></Dice>
            <Dice :dice="dices.three"></Dice>
            <div class="break"></div>
            <Dice :dice="dices.four"></Dice>
            <Dice :dice="dices.five"></Dice>
          </div>
          <p>
            {{ $t('home.message_3_a') }} <strong>{{ 3 - played }}</strong>
            {{ $t('home.message_3_b') }} <strong>{{ dices.tot }}</strong>
          </p>
        </template>
      </div>

      <!-- Tabs di navigazione tra giocate -->
      <Tabs></Tabs>

      <!-- Set delle giocate -->
      <div class="container-box body-scroll-lock-ignore">
        <div class="wrapper-box">
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
    <LazyOverlay :show-overlay="showConfig" :height-overlay="421">
      <LazyViewConfig></LazyViewConfig>
    </LazyOverlay>
    <LazyOverlay :show-overlay="showSchema" :height-overlay="507">
      <LazyViewSchemas></LazyViewSchemas>
    </LazyOverlay>
    <LazyOverlay :show-overlay="showChampionsShip" :height-overlay="453">
      <LazyViewChampion></LazyViewChampion>
    </LazyOverlay>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import NoSleep from 'nosleep.js'

export default {
  middleware: ['authenticated'],
  transition: 'slide-bottom',
  data() {
    return {
      noSleep: new NoSleep(),
      moveTop: null,
    }
  },
  computed: {
    ...mapState('game', {
      playedView: (state) => state.playedView,
      game: (state) => state.game,
      dices: (state) => state.dices,
      played: (state) => state.played,
      showSchema: (state) => state.showSchema,
      showChampionsShip: (state) => state.showChampionsShip,
      showConfig: (state) => state.showConfig,
    }),
    ...mapState({
      userFirebase: (state) => state.userFirebase,
      userFirebaseGame: (state) => state.userFirebaseGame,
      detailsRoom: (state) => state.detailsRoom,
      isLoadingRoom: (state) => state.isLoadingRoom,
      isLoadingLeftRoom: (state) => state.isLoadingLeftRoom,
    }),
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
      this.$store.commit('game/toogleModal', 'config')
    },
  },
}
</script>

<style lang="scss" scoped>
/*
.container-app {
  .wrapper-main {
    @include position(absolute, 30% null null 50%);
    @include size(100%, auto);
    transform: translate(-50%, -30%);
    overflow: hidden;
  }
  p {
    @include padding(0 10px);
  }
  button {
    @include margin(10px null null null);
  }
  .container-match {
    @include size(100%, calc(100vh - 430px));
    // @include size(100%, 250px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    > p {
      line-height: 20px;
      text-align: center;
    }
    .box-dice {
      @include margin(null null 10px null);
      @include size(100%, 185px);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
    }
  }
  .container-box {
    -webkit-overflow-scrolling: touch;
    overflow: auto;
    display: flex;
    .wrapper-box {
      @include padding(10px);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: nowrap;
      ::v-deep article {
        @include margin(null 10px null null);
        &:last-child {
          @include margin(null 0 null null);
        }
      }
    }
  }
}
*/
</style>
