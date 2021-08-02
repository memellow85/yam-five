<template>
  <div class="wrapper-issue">
    <p class="small">{{ $t('issue.open') }}: {{ date }}</p>
    <p>{{ data.message }}</p>
    <div class="wrapper-tags flex">
      <CustomLabel
        :text="data.type"
        :class-name="data.type === 'bug' ? 'red' : 'green'"
      ></CustomLabel>
      <CustomLabel
        :text="data.status"
        :class-name="
          data.status === 'open'
            ? 'red'
            : data.status === 'close'
            ? 'green'
            : 'yellow'
        "
      ></CustomLabel>
      <CustomLabel :text="data.priority" class-name="red"></CustomLabel>
    </div>
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
      date: format(this.data.date_open.seconds * 1000),
    }
  },
}
</script>

<style lang="scss" scoped>
.wrapper-issue {
  @include margin(null null 0.8rem);
  @include padding(null null 0.8rem);
  border-bottom: $border-base;
  p {
    &.small {
      @include margin(null null 0.3rem null);
    }
  }
  .wrapper-tags {
    @include margin(0.5rem null null null);
    ::v-deep .wrapper-label {
      @include margin(null 0.3rem null null);
    }
  }
}
</style>
