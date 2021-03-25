<template>
  <section>
    <article>
      <h3>
        <span class="yamicons mdi mdi-chart-line-variant"></span>
        {{ $t('champions.title_1') }}
      </h3>
      <div class="wrapper-championship">
        <ul v-if="usersRealTimeChampions.length > 0">
          <li>
            <span>{{ $t('champions.th_1') }}</span>
            <span>{{ $t('champions.th_4') }}</span>
          </li>
          <li v-for="(u, index) in usersRealTimeChampions" :key="u.id">
            <span>
              {{ index + 1 }}
              {{ u.uid === userFirebase.uid ? $t('champions.io') : u.name }}
            </span>
            <span>{{ u.tot }}</span>
          </li>
        </ul>
        <ul v-else>
          <li class="empty-state">
            <span class="yamicons mdi mdi-chart-line-variant"></span>
            <p>{{ $t('champions.empty_1') }}</p>
          </li>
        </ul>
      </div>
    </article>
    <article>
      <h3>
        <span class="yamicons mdi mdi-arm-flex-outline"></span>
        {{ $t('champions.title_2') }}
      </h3>
      <div class="wrapper-championship">
        <ul v-if="usersChampions.length > 0">
          <li>
            <span>{{ $t('champions.th_1') }}</span>
            <!-- <span>{{ $t('champions.th_4') }}</span>
            <span>{{ $t('champions.th_6') }}</span>
            <span>{{ $t('champions.th_7') }}</span> -->
            <span>{{ $t('champions.th_8') }}</span>
          </li>
          <li v-for="(u, index) in usersChampions" :key="u.id">
            <span>
              {{ index + 1 }}
              {{ u.uid === userFirebase.uid ? $t('champions.io') : u.name }}
            </span>
            <!-- <span>{{ u.score }}</span>
            <span>{{ u.score_short }}</span> -->
            <span>{{ u.tot }}</span>
          </li>
        </ul>
        <ul v-else>
          <li class="empty-state">
            <span class="yamicons mdi mdi-arm-flex-outline"></span>
            <p>{{ $t('champions.empty_2') }}</p>
          </li>
        </ul>
      </div>
    </article>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ChampionsShip',
  computed: {
    ...mapState({
      userFirebase: (state) => state.userFirebase,
      usersRealTimeChampions: (state) => state.usersRealTimeChampions,
      usersChampions: (state) => state.usersChampions,
    }),
  },
}
</script>

<style lang="scss" scoped>
section {
  @include padding(15px);
  article {
    &:last-child {
      @include margin(null null 0);
    }
    .wrapper-championship {
      overflow-x: hidden;
      overflow-y: auto;
      height: 170px;
    }
    ul {
      li {
        justify-content: space-between;
        span {
          @include size(calc(100% - 160px), auto);
          text-align: right;
          &:first-child {
            @include size(160px, auto);
            text-align: left;
          }
        }
        &.empty-state {
          justify-content: center;
          flex-flow: column;
          height: 150px;
          span {
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
