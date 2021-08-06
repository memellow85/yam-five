<template>
  <div class="wrapper-form-games flex">
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
        <span class="radio__label">{{ $t(r.name) }}</span>
      </label>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getLocalStorageKey, setLocalStorageKey } from '~/utils'

export default {
  data() {
    return {
      games: [
        {
          code: 'all',
          name: 'games.all',
        },
        {
          code: 'short',
          name: 'games.short',
        },
        {
          code: 'veryshort',
          name: 'games.veryshort',
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
  },
  watch: {
    currentGameLocal() {
      this.$store.commit('game/changeGames', this.currentGameLocal)
      if (getLocalStorageKey('game') !== this.currentGameLocal) {
        setLocalStorageKey('game', this.currentGameLocal)
      }
    },
  },
  mounted() {
    const game = getLocalStorageKey('game')
    if (game !== this.currentGame) {
      setLocalStorageKey('game', this.currentGame)
    }
    this.currentGameLocal = game || this.currentGame
  },
}
</script>
