<template>
  <div class="wrapper-form-sounds flex">
    <div v-for="r in helpers" :key="r.code" class="radio-button">
      <label class="radio">
        <span class="radio__input">
          <input
            :id="r.code"
            v-model="currentHelper"
            type="radio"
            name="helper"
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
      currentHelper: 'yes',
      helpers: [
        {
          code: 'yes',
          name: 'helper.yes',
        },
        {
          code: 'no',
          name: 'helper.no',
        },
      ],
    }
  },
  watch: {
    currentHelper() {
      this.changeHandler(this.currentHelper)
    },
  },
  mounted() {
    if (getLocalStorageKey('helper')) {
      this.currentHelper = getLocalStorageKey('helper')
    } else {
      this.currentHelper = 'yes'
      setLocalStorageKey('helper', 'yes')
    }
  },
  methods: {
    changeHandler(helper) {
      if (getLocalStorageKey('helper') !== helper) {
        setLocalStorageKey('helper', helper)
      }
    },
  },
}
</script>
