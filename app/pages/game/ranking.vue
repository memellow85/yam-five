<template>
  <section class="wrapper-page">
    <TitlePage label="champions" icon="arm-flex-outline"></TitlePage>
    <div class="main">
      <article class="wrapper-tabs-form">
        <ul class="inline custom-tabs">
          <li
            v-touch="() => setTab('current', false)"
            :class="['center', { active: tab === 'current' }]"
          >
            <h4>{{ $t('champions.title_1') }}</h4>
          </li>
          <li
            v-if="campaignActive"
            v-touch="() => setTab('campaign', false)"
            :class="['center info', { active: tab === 'campaign' }]"
          >
            <h4>{{ $t('champions.title_3') }}</h4>
            <p class="small">
              {{ $t('champions.sub_title_3') + endOfCampaign }}
            </p>
          </li>
          <li
            v-touch="() => setTab('older', false)"
            :class="['center', { active: tab === 'older' }]"
          >
            <h4>{{ $t('champions.title_2') }}</h4>
          </li>
        </ul>
        <div class="wrapper-championship body-scroll-lock-ignore-inner">
          <ul v-if="tab !== 'current'" class="inline custom-tabs">
            <li
              v-touch="() => setTab(getSubTab(tab, 'score_veryshort'), true)"
              :class="[
                'center',
                {
                  active:
                    subTab === 'score_veryshort' ||
                    subTab === 'campaign_score_veryshort',
                },
              ]"
            >
              <h4>{{ $t('champions.tab_3') }}</h4>
            </li>
            <li
              v-touch="() => setTab(getSubTab(tab, 'score_short'), true)"
              :class="[
                'center',
                {
                  active:
                    subTab === 'score_short' ||
                    subTab === 'campaign_score_short',
                },
              ]"
            >
              <h4>{{ $t('champions.tab_2') }}</h4>
            </li>
            <li
              v-touch="() => setTab(getSubTab(tab, 'score'), true)"
              :class="[
                'center',
                { active: subTab === 'score' || subTab === 'campaign_score' },
              ]"
            >
              <h4>{{ $t('champions.tab_1') }}</h4>
            </li>
          </ul>
          <ul v-if="viewRanking > 0">
            <li class="flex header">
              <div class="col_1">
                <p>{{ $t('champions.th_1') }}</p>
              </div>
              <div v-if="tab === 'older'" class="col_2">
                <p>{{ $t('champions.th_7') }}</p>
              </div>
              <div :class="['col_3', { full: tab !== 'older' }]">
                <p>{{ $t('champions.th_8') }}</p>
              </div>
            </li>
            <li
              v-for="(u, index) in viewRanking > 1
                ? getTypeChampions(subTab)
                : usersOrderedSocket"
              :key="u.id"
              :class="[
                'flex',
                {
                  io:
                    u.uid === userFirebase.uid ||
                    (u.user && u.user.uid === userFirebase.uid),
                },
              ]"
            >
              <div class="col_1">
                <p>
                  {{ index + 1 }}) {{ viewRanking > 1 ? u.name : u.user.name }}
                  <span v-if="u.turnOn" class="circle"></span>
                </p>
              </div>
              <div v-if="tab === 'older'" class="col_2">
                <p v-if="u.tot_campaigns > 0">
                  <span :class="`yamicons mdi mdi-medal-outline`"></span>
                  <span>({{ u.tot_campaigns }})</span>
                </p>
                <p v-else>-</p>
              </div>
              <div :class="['col_3', { full: tab !== 'older' }]">
                <p>
                  <span
                    v-if="index <= 2"
                    :class="`yamicons mdi mdi-${
                      index === 0
                        ? 'podium-gold'
                        : index === 1
                        ? 'podium-silver'
                        : 'podium-bronze'
                    }`"
                  ></span>
                  <span>{{ u.tot }}</span>
                </p>
              </div>
            </li>
          </ul>
          <ul v-if="viewRanking < 0">
            <li class="empty-state flex-center">
              <span class="yamicons mdi mdi-chart-line-variant"></span>
              <p>
                {{
                  viewRanking === -1
                    ? $t('champions.empty_1')
                    : $t('champions.empty_2')
                }}
              </p>
            </li>
          </ul>
        </div>
      </article>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { format } from 'timeago.js'
import ScrollMixin from '~/mixins/scroll'
import AnalyticsMixin from '~/mixins/analytics'

export default {
  mixins: [ScrollMixin, AnalyticsMixin],
  layout: 'private',
  middleware: ['authenticated'],
  data() {
    return {
      tab: 'current',
      subTab: 'score_veryshort',
    }
  },
  computed: {
    ...mapState('firebase', {
      userFirebase: (state) => state.userFirebase,
    }),
    ...mapState('ws', {
      usersOrderedSocket: (state) => state.usersOrderedSocket,
    }),
    ...mapState('game', {
      currentCampaign: (state) => state.currentCampaign,
      campaignActive: (state) => state.campaignActive,
    }),
    ...mapGetters('firebase', ['getTypeChampions']),
    endOfCampaign() {
      return this.currentCampaign
        ? format(
            new Date(this.currentCampaign.end.replaceAll('-', '/')).valueOf()
          )
        : '-'
    },
    viewRanking() {
      if (this.tab === 'current') {
        if (this.usersOrderedSocket.length > 0) {
          return 1
        } else {
          return -1
        }
      } else if (this.getTypeChampions(this.subTab).length > 0) {
        return 2
      } else {
        return -2
      }
    },
  },
  methods: {
    getSubTab(tab, subtab) {
      return tab === 'campaign' ? `${tab}_${subtab}` : subtab
    },
    setTab(tab, subtab) {
      if (!subtab) {
        this.tab = tab
        if (tab === 'campaign') {
          if (!this.subTab.includes('campaign_')) {
            this.subTab = `campaign_${this.subTab}`
          }
        } else if (this.subTab.includes('campaign_')) {
          this.subTab = this.subTab.replace('campaign_', '')
        }
      } else {
        this.subTab = tab
      }
    },
  },
}
</script>

<style lang="scss" scoped>
ul {
  li {
    &.info {
      h4 {
        @include margin(1rem null 0.1rem);
      }
      p {
        @include margin(null null 0.2rem);
      }
    }
  }
}
.wrapper-championship {
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
  ul {
    li {
      &.header {
        @include margin(null null 0.5rem);
        border-bottom: $border-base-tab;
        @include themed() {
          border-color: t($key-color-2);
        }
        p {
          @include size(auto, 2.5rem);
        }
      }
      &.hide {
        display: none;
      }
      &.io {
        p {
          color: $primary;
        }
      }
      .col_1 {
        @include size(50%, auto);
        display: flex;
        align-items: center;
        justify-content: flex-start;
      }
      .col_2 {
        @include margin(null 1.5rem null);
      }
      .col_2,
      .col_3 {
        @include size(25%, auto);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        &.full {
          @include size(50%, auto);
        }
        p {
          justify-content: flex-end;
          &:last-child {
            @include size(3.5rem, auto);
          }
          span {
            &:not(.yamicons) {
              text-align: right;
              min-width: 3rem;
            }
            &.yamicons {
              @include margin(null 0.5rem null null);
              &:before {
                color: $gold;
              }
              &.mdi-podium-silver {
                &:before {
                  color: $silver;
                }
              }
              &.mdi-podium-bronze {
                &:before {
                  color: $bronze;
                }
              }
            }
          }
        }
      }
      .col_3 {
        p {
          min-width: 5rem;
        }
      }
      p {
        @include size(auto, 1.7rem);
        display: flex;
        align-items: center;
      }
      &.empty-state {
        @include size(100%, 9rem);
        border-bottom: 0;
        flex-flow: column;
        p {
          justify-content: center;
        }
      }
    }
  }
}
</style>
