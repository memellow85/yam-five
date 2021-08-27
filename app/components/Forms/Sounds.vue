<template>
  <div class="wrapper-form-sounds flex">
    <div v-for="r in sounds" :key="r.code" class="radio-button">
      <label class="radio">
        <span class="radio__input">
          <input
            :id="r.code"
            v-model="currentSound"
            type="radio"
            name="sounds"
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
import { getLocalStorageKey, setLocalStorageKey } from '~/utils'

export default {
  data() {
    return {
      currentSound: 'yes',
      sounds: [
        {
          code: 'yes',
          name: 'sound.yes',
        },
        {
          code: 'no',
          name: 'sound.no',
        },
      ],
    }
  },
  watch: {
    currentSound() {
      this.changeHandler(this.currentSound)
    },
  },
  mounted() {
    this.currentSound = getLocalStorageKey('sound')
      ? getLocalStorageKey('sound')
      : 'yes'
  },
  methods: {
    changeHandler(sound) {
      if (getLocalStorageKey('sound') !== sound) {
        setLocalStorageKey('sound', sound)
      }
    },
  },
}
</script>
