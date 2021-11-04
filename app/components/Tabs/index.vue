<template>
  <section class="flex-center">
    <div>
      <ul class="flex">
        <template v-for="t in playedList">
          <li
            v-if="t.view.includes(currentGame)"
            :key="t.id"
            v-touch="() => changePlayedHandler(t.name)"
            :class="[{ selected: t.selected }]"
          >
            <span
              :class="[`yamicons mdi mdi-${t.icon}`, { selected: t.selected }]"
            ></span>
            <p :class="['small', { selected: t.selected }]">
              {{ $t('tab.' + t.name) }}
            </p>
          </li>
        </template>
      </ul>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('game', {
      playedList: (state) => state.playedList,
      currentGame: (state) => state.currentGame,
    }),
  },
  methods: {
    changePlayedHandler(value) {
      this.$store.commit('game/changePlayedView', value)
    },
  },
}
</script>

<style lang="scss" scoped>
section {
  ul {
    @include padding(null 0.7rem);
    @include themed() {
      background: t($key-color-2);
    }
    // background: $color-2;
    border-radius: $rounded-small;
    li {
      @include padding(0.3rem 0.7rem);
      text-align: center;
      p {
        @include padding(0.1rem null null null);
      }
    }
  }
}
</style>
