<template>
  <section>
    <div>
      <ul>
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
  display: flex;
  justify-content: center;
  align-items: center;
  @include padding(10px 0);
  ul {
    @include size(auto, 40px);
    background: $color-2;
    border-radius: 5px;
    align-items: center;
    display: flex;
    // min-width: 100px;
    @include padding(0 10px);
    li {
      @include padding(null 10px);
      border: 0;
    }
  }
}
</style>
