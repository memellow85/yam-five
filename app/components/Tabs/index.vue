<template>
  <section class="flex-center">
    <div>
      <ul class="flex">
        <template v-for="t in playedList">
          <li
            v-if="t.view.includes(currentGame)"
            :key="t.id"
            @click="changePlayedHandler(t.name)"
          >
            <span
              :class="[`yamicons mdi mdi-${t.icon}`, { selected: t.selected }]"
            ></span>
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
  @include padding(1.4rem 0 0.7rem);
  ul {
    @include padding(null 0.7rem);
    @include size(auto, 2.6rem);
    background: $color-2;
    border-radius: $rounded-small;
    li {
      @include padding(null 0.7rem);
    }
  }
}
</style>
