<template>
  <section class="overlay-view">
    <article>
      <h3>
        <span class="yamicons mdi mdi-cog-outline"></span>
        {{ $t('view.configuration') }}
      </h3>
    </article>
    <article>
      <h4>{{ $t('config.title_2') }}</h4>
      <FormsLanguages></FormsLanguages>
    </article>
    <article class="wrapper-tabs-form">
      <ul class="inline custom-tabs">
        <li
          :class="[
            'center',
            { active: tab === 'create', disabled: userSocket },
          ]"
          @click="tab = 'create'"
        >
          <h4>{{ $t('config.tab_1') }}</h4>
        </li>
        <li
          :class="['center', { active: tab === 'join', disabled: userSocket }]"
          @click="tab = 'join'"
        >
          <h4>{{ $t('config.tab_2') }}</h4>
        </li>
      </ul>
      <div v-if="tab === 'create' && !userSocket" class="wrapper-forms">
        <h4>{{ $t('config.title_3') }}</h4>
        <FormsGames></FormsGames>
      </div>
      <FormsJoin v-if="!userSocket" :tab="tab"></FormsJoin>
      <p v-else class="text-inner">
        {{ $t('config.join_1') }}<strong>{{ userSocket.room }}</strong>
        {{ $t('config.join_2') }}<strong>{{ usersSocket.length - 1 }}</strong>
        {{ $t('config.join_3') }}
      </p>
      <div v-if="userSocket" class="container-btn flex">
        <button @click="leaveHandler">
          <span>{{ $t('config.btn_2') }}</span>
        </button>
      </div>
    </article>
    <article>
      <button class="full" @click="leaveAppHandler">
        <span>{{ $t('config.btn_3') }}</span>
      </button>
    </article>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      tab: 'create',
    }
  },
  computed: {
    ...mapState('ws', {
      userSocket: (state) => state.userSocket,
      usersSocket: (state) => state.usersSocket,
    }),
  },
  methods: {
    leaveHandler() {
      this.$store.dispatch('ws/leftRoomSocket')
    },
    leaveAppHandler() {
      this.$store.commit('game/toggleModal', 'config')
      // if (this.userSocket) {
      this.leaveHandler()
      // }
      this.$store.dispatch('firebase/logout').then(() => {
        this.$router.push('/')
      })
    },
  },
}
</script>

<style lang="scss" scoped>
section {
  article {
    @include margin(null null 2rem);
    &:first-child {
      @include margin(null null 0.9rem);
    }
    &:last-child {
      @include margin(null null 0);
    }
    &.wrapper-tabs-form {
      @include size(auto, 14rem);
      .container-btn {
        justify-content: flex-end;
      }
      .text-inner {
        @include padding(1rem null);
      }
    }
    ul {
      li {
        @include size(100%, auto);
        border-bottom: $border-base-tab;
        &.active {
          border-bottom: $border-base-tab-active;
        }
        &.disabled {
          border-bottom: $border-base-tab;
        }
      }
    }
  }
}
</style>
