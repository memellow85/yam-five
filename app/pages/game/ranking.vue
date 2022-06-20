<template>
  <section :class="['wrapper-page', { big: isIphone() && bigMenuIphone() }]">
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
import { bigMenuIphone, isIphone } from '~/utils'

export default {
  mixins: [ScrollMixin, AnalyticsMixin],
  layout: 'private',
  middleware: ['authenticated'],
  data() {
    return {
      bigMenuIphone,
      isIphone,
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
  @extend %fakeTable;
}
</style>
