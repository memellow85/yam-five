<template>
  <div class="wrapper-header">
    <h1>
      {{ $t('nameapp') }}
      <span
        v-if="$route.name === 'release'"
        v-touch="() => $router.push({ name: 'index' })"
        class="yamicons mdi mdi-chevron-left medium"
      ></span>
    </h1>
    <p v-if="campaignActive && $route.name === 'home'" class="center">
      <i>{{ currentCampaign.name }}</i>
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('game', {
      currentCampaign: (state) => state.currentCampaign,
      campaignActive: (state) => state.campaignActive,
    }),
  },
}
</script>

<style lang="scss" scoped>
.wrapper-header {
  @include size(100%, 5rem);
  overflow: hidden;
  p {
    @include margin(0.7rem null null);
  }
}
</style>
