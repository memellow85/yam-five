<template>
  <div class="wrapper-release">
    <h2 class="green">
      <strong>{{ data.version }}</strong>
    </h2>
    <h3>
      <i>{{ data.title }}</i>
    </h3>
    <p class="small">{{ date }}</p>
    <ul class="release">
      <li v-for="m in data.messages" :key="m.id">
        <p>{{ m }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import { format } from 'timeago.js'

export default {
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      date: format(this.data.date),
    }
  },
}
</script>

<style lang="scss" scoped>
.wrapper-release {
  @extend %borderBottom;
  h3 {
    @include margin(0.3rem null 0.5rem);
  }
}
</style>
