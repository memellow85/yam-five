<template>
  <section :class="['wrapper-page', { big: isIphone() && bigMenuIphone() }]">
    <TitlePage label="schemas" icon="view-grid-outline"></TitlePage>
    <div class="main body-scroll-lock-ignore-inner">
      <article>
        <Stats></Stats>
      </article>
      <article>
        <div class="schema-container flex-between">
          <div class="schema-column">
            <div>&nbsp;</div>
            <div><p>1</p></div>
            <div><p>2</p></div>
            <div><p>3</p></div>
            <div><p>4</p></div>
            <div><p>5</p></div>
            <div><p>6</p></div>
            <div>
              <p>{{ $t('schemas.bonus') }} 60</p>
            </div>
            <div>
              <p>{{ $t('schemas.bonus') }} 70</p>
            </div>
            <div><p>Min</p></div>
            <div><p>Max</p></div>
            <div>
              <p>{{ $t('schemas.bonus') }}</p>
            </div>
            <div><p>&lt;= 11</p></div>
            <div>
              <p>{{ $t('schemas.bonus') }}</p>
            </div>
            <div><p>Full</p></div>
            <div>
              <p>{{ $t('schemas.bonus') }}</p>
            </div>
            <div><p>Poker</p></div>
            <div>
              <p>{{ $t('schemas.bonus') }}</p>
            </div>
            <div>
              <p>{{ $t('schemas.scale') }}</p>
            </div>
            <div>
              <p>{{ $t('schemas.bonus') }}</p>
            </div>
            <div>
              <p>{{ $t('schemas.yam') }}</p>
            </div>
            <div>
              <p>{{ $t('schemas.bonus') }}</p>
            </div>
          </div>
          <template v-for="(ga, index) in game">
            <div :key="index" class="schema-column">
              <div><span :class="`yamicons mdi mdi-${ga.icon}`"></span></div>
              <template v-for="(g, i) in ga.data">
                <div
                  :key="`b_1_${i}`"
                  :class="[
                    'cube',
                    {
                      red: g.active && g.icon === 'trash-can',
                      green: g.active && g.icon === 'plus-box',
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
                    v-touch="() => submitValue(g, index)"
                    :class="`yamicons mdi mdi-${g.icon}-outline`"
                  ></span>
                  <p v-else>{{ g.value }}</p>
                </div>
                <div v-if="includesBonus.includes(i)" :key="`b_2_${i}`">
                  <template v-if="i === 'six'">
                    <span
                      :class="`yamicons mdi mdi-${
                        ga.bonusNumber60 ? 'check-bold' : 'close-thick'
                      }`"
                    ></span>
                    <p>{{ numberTotalGames[index] }}</p>
                  </template>
                  <template v-if="i === 'max'">
                    <span
                      :class="`yamicons mdi mdi-${
                        ga.bonusMinMax ? 'check-bold' : 'close-thick'
                      }`"
                    ></span>
                  </template>
                  <template v-if="includesBonusShort.includes(i)">
                    <span
                      :class="`yamicons mdi mdi-${
                        g.value > 0 ? 'check-bold' : 'close-thick'
                      }`"
                    ></span>
                  </template>
                </div>
                <div v-if="i === 'six'" :key="`b_3_${i}`">
                  <span
                    :class="`yamicons mdi mdi-${
                      ga.bonusNumber70 ? 'check-bold' : 'close-thick'
                    }`"
                  ></span>
                  <p>{{ numberTotalGames[index] }}</p>
                </div>
              </template>
            </div>
          </template>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import AnalyticsMixin from '~/mixins/analytics'
import ScrollMixin from '~/mixins/scroll'
import { bigMenuIphone, isIphone } from '~/utils'

export default {
  mixins: [ScrollMixin, AnalyticsMixin],
  layout: 'private',
  middleware: ['authenticated'],
  data() {
    return {
      bigMenuIphone,
      isIphone,
      changeValue: {},
      includesBonus: [
        'six',
        'max',
        'mineleven',
        'full',
        'poker',
        'scale',
        'yam',
      ],
      includesBonusShort: ['mineleven', 'full', 'poker', 'scale', 'yam'],
    }
  },
  computed: {
    ...mapState('game', {
      game: (state) => state.game,
      playedList: (state) => state.playedList,
      currentGame: (state) => state.currentGame,
      numberTotalGames: (state) => state.numberTotalGames,
    }),
  },
  methods: {
    submitValue(data, index) {
      if (data.active) {
        this.$store.commit('game/changePlayedView', index)
        this.$store.dispatch('game/setActualValue', data)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
section {
  article {
    .schema-container {
      @include margin(null null 1rem);
      align-items: flex-start;
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
