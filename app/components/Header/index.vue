<template>
  <div class="wrapper-header">
    <h1>
      {{ $t('nameapp') }}
      <div v-if="menu" class="wrapper-invite">
        <span
          v-touch="() => $router.push({ name: 'game-invite' })"
          class="yamicons mdi mdi-account-details-outline medium"
        ></span>
        <span v-if="getUsersLogin.length > 0" class="notification flex-center">
          {{ getUsersLogin.length }}
        </span>
      </div>
    </h1>
    <p v-if="campaignActive && $route.name === 'home'" class="center">
      <i>{{ currentCampaign.name }}</i>
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    menu: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapState('firebase', {
      userFirebase: (state) => state.userFirebase,
    }),
    ...mapState('game', {
      currentCampaign: (state) => state.currentCampaign,
      campaignActive: (state) => state.campaignActive,
    }),
    ...mapState('ws', {
      loginUsersSocket: (state) => state.loginUsersSocket,
    }),
    getUsersLogin() {
      return this.loginUsersSocket.length > 0
        ? this.loginUsersSocket.filter((u) => u.uid !== this.userFirebase.uid)
        : []
    },
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
  .wrapper-invite {
    @include position(absolute, 0.9rem 1rem null null);
    .notification {
      @include position(absolute, -0.4rem -0.5rem null null);
      @include size(1rem);
      @extend %strong;
      @extend %notify;
      border-radius: 50%;
      background: $primary;
      color: $color-1;
    }
  }
}
</style>
