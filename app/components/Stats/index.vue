<template>
  <div class="wrapper-stats">
    <p>{{ $t('stats.actual_roll') }}</p>
    <ul class="inline">
      <li>
        <p>
          {{ $t('stats.dices') }}1:
          <strong>{{ dices['one'].value ? dices['one'].value : '-' }}</strong>
        </p>
      </li>
      <li>
        <p>
          {{ $t('stats.dices') }}2:
          <strong>{{ dices['two'].value ? dices['two'].value : '-' }}</strong>
        </p>
      </li>
      <li>
        <p>
          {{ $t('stats.dices') }}3:
          <strong>{{
            dices['three'].value ? dices['three'].value : '-'
          }}</strong>
        </p>
      </li>
      <li>
        <p>
          {{ $t('stats.dices') }}4:
          <strong>{{ dices['four'].value ? dices['four'].value : '-' }}</strong>
        </p>
      </li>
      <li>
        <p>
          {{ $t('stats.dices') }}5:
          <strong>{{ dices['five'].value ? dices['five'].value : '-' }}</strong>
        </p>
      </li>
    </ul>
    <p>
      {{ $t('stats.tot_actual_roll') }}
      <strong>{{ dices.tot ? dices.tot : '-' }}</strong>
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('game', {
      dices: (state) => state.dices,
    }),
  },
}
</script>

<style lang="scss" scoped>
.wrapper-stats {
  @include margin(null null 0.6rem);
  p {
    @include margin(0.5rem null);
    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  ul {
    li {
      @include size(20%, auto);
    }
  }
}
</style>
