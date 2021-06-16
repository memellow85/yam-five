<template>
  <section class="overlay-view">
    <article>
      <h3>
        <span class="yamicons mdi mdi-chart-line-variant"></span>
        {{ $t('champions.title_1') }}
      </h3>
      <div class="wrapper-championship">
        <ul v-if="usersOrderedSocket.length > 0">
          <li class="flex">
            <p></p>
            <p>{{ $t('champions.th_1') }}</p>
            <p>{{ $t('champions.th_4') }}</p>
          </li>
          <li
            v-for="(u, index) in usersOrderedSocket"
            :key="u.id"
            :class="['flex', { io: u.user.uid === userFirebase.uid }]"
          >
            <p>{{ index + 1 }}</p>
            <p>
              {{ u.user.name }}
            </p>
            <p>{{ u.tot }}</p>
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
            <p></p>
            <p>{{ $t('champions.th_1') }}</p>
            <p>{{ $t('champions.th_8') }}</p>
          </li>
          <li
            v-for="(u, index) in usersChampions"
            :key="u.id"
            :class="['flex', { io: u.uid === userFirebase.uid }]"
          >
            <p>{{ index + 1 }}</p>
            <p>
              {{ u.name }}
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
    ...mapState('firebase', {
      userFirebase: (state) => state.userFirebase,
      usersChampions: (state) => state.usersChampions,
    }),
    ...mapState('ws', {
      usersOrderedSocket: (state) => state.usersOrderedSocket,
    }),
  },
}
</script>

<style lang="scss" scoped>
section {
  article {
    .wrapper-championship {
      @include size(auto, 9rem);
      overflow-x: hidden;
      overflow-y: auto;
    }
    ul {
      li {
        &.io {
          p {
            color: $primary;
          }
        }
        p {
          @include size(10rem, auto);
          text-align: left;
          line-height: 1.5;
          &:first-child {
            @include size(1rem, auto);
          }
          &:last-child {
            @include size(calc(100% - 11rem), auto);
            text-align: right;
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
