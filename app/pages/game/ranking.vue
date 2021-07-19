<template>
  <section class="wrapper-page">
    <article>
      <h3>
        <span class="yamicons mdi mdi-arm-flex-outline"></span>
        {{ $t('champions.title_1') }}
      </h3>
    </article>
    <div class="main">
      <article class="wrapper-tabs-form">
        <ul class="inline custom-tabs">
          <li
            :class="['center', { active: tab === 'current' }]"
            @click="tab = 'current'"
          >
            <h4>{{ $t('champions.title_1') }}</h4>
          </li>
          <li
            :class="['center', { active: tab === 'older' }]"
            @click="tab = 'older'"
          >
            <h4>{{ $t('champions.title_2') }}</h4>
          </li>
        </ul>
        <div class="wrapper-championship body-scroll-lock-ignore-inner">
          <ul v-if="tab === 'older'" class="inline custom-tabs">
            <li
              :class="['center', { active: subTab === 'score' }]"
              @click="subTab = 'score'"
            >
              <h4>{{ $t('champions.tab_1') }}</h4>
            </li>
            <li
              :class="['center', { active: subTab === 'score_short' }]"
              @click="subTab = 'score_short'"
            >
              <h4>{{ $t('champions.tab_2') }}</h4>
            </li>
            <li
              :class="['center', { active: subTab === 'score_veryshort' }]"
              @click="subTab = 'score_veryshort'"
            >
              <h4>{{ $t('champions.tab_3') }}</h4>
            </li>
          </ul>
          <ul v-if="viewRanking > 0">
            <li class="flex header">
              <div class="col_1">
                <p>{{ $t('champions.th_1') }}</p>
              </div>
              <div class="col_2">
                <p>{{ $t('champions.th_4') }}</p>
              </div>
            </li>
            <li
              v-for="(u, index) in viewRanking > 1
                ? getTypeChampions(subTab)
                : usersOrderedSocket"
              :key="u.id"
              :class="['flex', { io: u.uid === userFirebase.uid }]"
            >
              <div class="col_1">
                <p>{{ index + 1 }}) {{ u.name }}</p>
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
import WsMixin from '@/mixins/ws'

export default {
  mixins: [WsMixin],
  middleware: ['authenticated'],
  data() {
    return {
      tab: 'current',
      subTab: 'score',
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
  mounted() {
    document.querySelector('.body-scroll-lock-ignore-inner').addEventListener(
      'touchmove',
      function (event) {
        event.stopPropagation()
      },
      { passive: false }
    )
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
        border-bottom: $border-base-tab;
        p {
          @include size(auto, 2.5rem);
        }
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
