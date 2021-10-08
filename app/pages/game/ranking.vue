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
            v-touch="() => setTab('older', false)"
            :class="['center', { active: tab === 'older' }]"
          >
            <h4>{{ $t('champions.title_2') }}</h4>
          </li>
        </ul>
        <div class="wrapper-championship body-scroll-lock-ignore-inner">
          <ul v-if="tab === 'older'" class="inline custom-tabs">
            <li
              v-touch="() => setTab('score_veryshort', true)"
              :class="['center', { active: subTab === 'score_veryshort' }]"
            >
              <h4>{{ $t('champions.tab_3') }}</h4>
            </li>
            <li
              v-touch="() => setTab('score_short', true)"
              :class="['center', { active: subTab === 'score_short' }]"
            >
              <h4>{{ $t('champions.tab_2') }}</h4>
            </li>
            <li
              v-touch="() => setTab('score', true)"
              :class="['center', { active: subTab === 'score' }]"
            >
              <h4>{{ $t('champions.tab_1') }}</h4>
            </li>
          </ul>
          <ul v-if="viewRanking > 0">
            <li class="flex header">
              <div class="col_1">
                <p>{{ $t('champions.th_1') }}</p>
              </div>
              <div class="col_2">
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
                  hide: hideList.includes(u.uid) && tab !== 'current',
                  io:
                    u.uid === userFirebase.uid ||
                    (u.user && u.user.uid === userFirebase.uid),
                },
              ]"
            >
              <div class="col_1">
                <p>
                  {{ index + 1 }}) {{ viewRanking > 1 ? u.name : u.user.name }}
                </p>
              </div>
              <div class="col_2">
                <p>{{ u.tot }}</p>
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
import WsMixin from '~/mixins/ws'
import ScrollMixin from '~/mixins/scroll'
import AnalyticsMixin from '~/mixins/analytics'

export default {
  mixins: [WsMixin, ScrollMixin, AnalyticsMixin],
  layout: 'private',
  middleware: ['authenticated'],
  data() {
    return {
      tab: 'current',
      subTab: 'score_veryshort',
      hideList: [process.env.NUXT_ENV_USER_HIDE],
    }
  },
  computed: {
    ...mapState('firebase', {
      userFirebase: (state) => state.userFirebase,
    }),
    ...mapState('ws', {
      usersOrderedSocket: (state) => state.usersOrderedSocket,
    }),
    ...mapGetters('firebase', ['getTypeChampions']),
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
    setTab(tab, subtab) {
      if (!subtab) {
        this.tab = tab
      } else {
        this.subTab = tab
      }
    },
  },
}
</script>

<style lang="scss" scoped>
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
      .col_1,
      .col_2 {
        @include size(50%, auto);
        display: flex;
        align-items: center;
      }
      .col_1 {
        justify-content: flex-start;
      }
      .col_2 {
        justify-content: flex-end;
        p {
          justify-content: flex-end;
          &:last-child {
            @include size(3.5rem, auto);
          }
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
