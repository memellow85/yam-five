<template>
  <section class="wrapper-page">
    <TitlePage label="schemas" icon="view-grid-outline"></TitlePage>
    <div class="main">
      <article>
        <Stats></Stats>
      </article>
      <article>
        <div class="schema-container">
          <div class="schema-column">
            <div>&nbsp;</div>
            <div><p>1</p></div>
            <div><p>2</p></div>
            <div><p>3</p></div>
            <div><p>4</p></div>
            <div><p>5</p></div>
            <div><p>6</p></div>
            <div><p>Min</p></div>
            <div><p>Max</p></div>
            <div><p>&lt;= 11</p></div>
            <div><p>Full</p></div>
            <div><p>Poker</p></div>
            <div>
              <p>{{ $t('schemas.scale') }}</p>
            </div>
            <div>
              <p>{{ $t('schemas.yam') }}</p>
            </div>
          </div>
          <template v-for="(ga, index) in game">
            <div :key="index" class="schema-column">
              <div><span :class="`yamicons mdi mdi-${ga.icon}`"></span></div>
              <div
                v-for="(g, i) in ga.data"
                :key="i"
                :class="[
                  'cube',
                  {
                    red: g.active && getChangeValue(index, i),
                    green: g.active && !getChangeValue(index, i),
                  },
                ]"
              >
                <span
                  v-if="
                    playedList
                      .filter((p) => p.name === index)[0]
                      .view.includes(currentGame)
                      ? g.active
                      : false
                  "
                  v-longPress
                  :class="`yamicons mdi mdi-${
                    getChangeValue(index, i)
                      ? 'trash-can-outline'
                      : 'plus-box-outline'
                  }`"
                  @click="submitValue(g, index, i)"
                  @longPressStart="longPressStart(index, i)"
                ></span>
                <p v-else>{{ g.value }}</p>
              </div>
            </div>
          </template>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import WsMixin from '~/mixins/ws'
import AnalyticsMixin from '~/mixins/analytics'
import { longPress } from '~/directives/longpress'

export default {
  directives: { longPress },
  mixins: [WsMixin, AnalyticsMixin],
  layout: 'private',
  middleware: ['authenticated'],
  data() {
    return {
      changeValue: {},
    }
  },
  computed: {
    ...mapState('game', {
      game: (state) => state.game,
      playedList: (state) => state.playedList,
      currentGame: (state) => state.currentGame,
    }),
  },
  methods: {
    submitValue(data, index, i) {
      if (data.active) {
        this.$store.commit('game/changePlayedView', index)

        // eslint-disable-next-line no-prototype-builtins
        if (this.changeValue.hasOwnProperty(index)) {
          // eslint-disable-next-line no-prototype-builtins
          if (this.changeValue[index].hasOwnProperty(i)) {
            this.changeValue[index][i] = false
            this.$store.dispatch('game/resetActualValue', data)
          } else {
            this.$store.dispatch('game/setActualValue', data)
          }
        } else {
          this.$store.dispatch('game/setActualValue', data)
        }
      }
    },
    longPressStart(index, i) {
      const tmp = Object.assign({}, this.changeValue)
      // eslint-disable-next-line no-prototype-builtins
      if (tmp.hasOwnProperty(index)) {
        // eslint-disable-next-line no-prototype-builtins
        tmp[index][i] = !tmp[index].hasOwnProperty(i)
      } else {
        tmp[index] = {}
        tmp[index][i] = true
      }
      this.changeValue = {}
      this.changeValue = tmp
    },
    getChangeValue(index, i) {
      // eslint-disable-next-line no-prototype-builtins
      if (this.changeValue.hasOwnProperty(index)) {
        // eslint-disable-next-line no-prototype-builtins
        if (this.changeValue[index].hasOwnProperty(i)) {
          return this.changeValue[index][i]
        } else {
          return false
        }
      } else {
        return false
      }
    },
  },
}
</script>

<style lang="scss" scoped>
section {
  article {
    .schema-container {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      .schema-column {
        @include size(3rem, auto);
        &:first-child {
          @include size(4rem, auto);
        }
        .cube {
          &.red {
            .yamicons {
              &:before {
                color: $error;
              }
            }
          }
          &.green {
            .yamicons {
              &:before {
                color: $primary;
              }
            }
          }
        }
        > div {
          @include size(100%, 2rem);
          @extend %flex;
          @extend %flexCenter;
        }
      }
    }
  }
}
</style>
