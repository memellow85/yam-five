<template>
  <div class="wrapper-form-games">
    <div v-for="r in games" :key="r.code" class="radio-button">
      <label class="radio">
        <span class="radio__input">
          <input
            :id="r.code"
            v-model="currentGameLocal"
            :disabled="intoRoom"
            type="radio"
            name="games"
            :value="r.code"
          />
          <span class="radio__control"></span>
        </span>
        <span class="radio__label">{{ r.name }}</span>
      </label>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      games: [
        {
          code: 'all',
          name: this.$t('games.all'),
        },
        {
          code: 'short',
          name: this.$t('games.short'),
        },
        {
          code: 'veryshort',
          name: this.$t('games.veryshort'),
        },
      ],
      currentGameLocal: '',
    }
  },
  computed: {
    ...mapState('game', {
      currentGame: (state) => state.currentGame,
      intoRoom: (state) => state.intoRoom,
    }),
    ...mapState({
      user: (state) => state.user,
    }),
  },
  watch: {
    currentGameLocal() {
      this.$store.commit('game/changeGames', this.currentGameLocal)
      if (this.currentGameLocal === 'veryshort') {
        this.$store.commit('game/changePlayedView', 'free')
      } else {
        this.$store.commit('game/changePlayedView', 'down')
      }
    },
  },
  mounted() {
    this.currentGameLocal = this.currentGame
  },
}
</script>

<style lang="scss" scoped>
/*
.wrapper-form-games {
  display: flex;
}
*/
</style>
