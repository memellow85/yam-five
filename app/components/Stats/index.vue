<template>
  <div class="wrapper-stats">
    <p>{{ $t('stats.actual_roll') }}</p>
    <ul class="inline">
      <li>
        <p>
          {{ $t('stats.dices') }}1:
          {{ dices['one'].value ? dices['one'].value : '-' }}
        </p>
      </li>
      <li>
        <p>
          {{ $t('stats.dices') }}2:
          {{ dices['two'].value ? dices['two'].value : '-' }}
        </p>
      </li>
      <li>
        <p>
          {{ $t('stats.dices') }}3:
          {{ dices['three'].value ? dices['three'].value : '-' }}
        </p>
      </li>
      <li>
        <p>
          {{ $t('stats.dices') }}4:
          {{ dices['four'].value ? dices['four'].value : '-' }}
        </p>
      </li>
      <li>
        <p>
          {{ $t('stats.dices') }}5:
          {{ dices['five'].value ? dices['five'].value : '-' }}
        </p>
      </li>
    </ul>
    <p>{{ $t('stats.tot_actual_roll') }} {{ dices.tot ? dices.tot : '-' }}</p>
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
