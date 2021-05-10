<template>
  <section class="overlay-view">
    <article>
      <h3>
        <span class="yamicons mdi mdi-chart-line-variant"></span>
        {{ $t('champions.title_1') }}
      </h3>
      <div class="wrapper-championship">
        <ul v-if="usersRealTimeChampions.length > 0">
          <li class="flex">
            <span>{{ $t('champions.th_1') }}</span>
            <span>{{ $t('champions.th_4') }}</span>
          </li>
          <li
            v-for="(u, index) in usersRealTimeChampions"
            :key="u.id"
            class="flex"
          >
            <span>
              {{ index + 1 }}
              {{ u.uid === userFirebase.uid ? $t('champions.io') : u.name }}
            </span>
            <span>{{ u.tot }}</span>
          </li>
        </ul>
        <ul v-else>
          <li class="empty-state flex-center">
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
          <li class="flex">
            <p>{{ $t('champions.th_1') }}</p>
            <p>{{ $t('champions.th_8') }}</p>
          </li>
          <li v-for="(u, index) in usersChampions" :key="u.id" class="flex">
            <p>
              {{ index + 1 }}
              {{ u.uid === userFirebase.uid ? $t('champions.io') : u.name }}
            </p>
            <p>{{ u.tot }}</p>
          </li>
        </ul>
        <ul v-else>
          <li class="empty-state flex-center">
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
  article {
    ul {
      li {
        p {
          @include size(calc(100% - 10rem), auto);
          text-align: right;
          line-height: 1.5;
          &:first-child {
            @include size(10rem, auto);
            text-align: left;
          }
        }
        &.empty-state {
          @include size(100%, 9rem);
          flex-flow: column;
          p {
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
