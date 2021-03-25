<template>
  <section>
    <article>
      <h3>
        <span class="yamicons mdi mdi-cog-outline"></span>
        {{ $t('view.configuration') }}
      </h3>
    </article>
    <article>
      <h4>{{ $t('config.title_2') }}</h4>
      <Languages></Languages>
    </article>
    <article class="wrapper-tabs-form">
      <ul class="custom-tabs">
        <li
          :class="{ active: tab === 'create', disabled: detailsRoom }"
          @click="tab = 'create'"
        >
          <h4>{{ $t('config.tab_1') }}</h4>
        </li>
        <li
          :class="{ active: tab === 'join', disabled: detailsRoom }"
          @click="tab = 'join'"
        >
          <h4>{{ $t('config.tab_2') }}</h4>
        </li>
      </ul>
      <div v-if="tab === 'create' && !detailsRoom" class="wrapper-forms">
        <h4>{{ $t('config.title_3') }}</h4>
        <Games></Games>
      </div>
      <Join v-if="!detailsRoom" :tab="tab"></Join>
      <p v-else>
        {{ $t('config.join_1') }}<strong>{{ detailsRoom.room }}</strong>
        {{ $t('config.join_2') }}<strong>{{ usersFirebase.length - 1 }}</strong>
        {{ $t('config.join_3') }}
      </p>
      <div v-if="detailsRoom" class="container-btn">
        <button @click="leaveHandler">
          <Loader v-if="isLoadingLeftRoom"></Loader>
          <span v-else>{{ $t('config.btn_2') }}</span>
        </button>
      </div>
    </article>
    <article>
      <div class="exit" @click="leaveAppHandler">
        <span class="yamicons mdi mdi-exit-run"></span>
        <p>{{ $t('config.btn_3') }}</p>
      </div>
    </article>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import Join from '~/components/Forms/Join'
import Languages from '~/components/Forms/Languages'
import Games from '~/components/Forms/Games'
import Loader from '~/components/Loader'

export default {
  name: 'Configurations',
  components: { Join, Languages, Games, Loader },
  data() {
    return {
      tab: 'create',
    }
  },
  computed: {
    ...mapState({
      userFirebase: (state) => state.userFirebase,
      usersFirebase: (state) => state.usersFirebase,
      detailsRoom: (state) => state.detailsRoom,
      isLeave: (state) => state.isLeave,
      isLoadingLeftRoom: (state) => state.isLoadingLeftRoom,
    }),
  },
  methods: {
    leaveHandler() {
      this.$store.dispatch('logoutRoom')
    },
    leaveAppHandler() {
      this.$store.commit('game/toogleModal', 'config')
      if (!this.isLeave) {
        this.$store.dispatch('logout').then(() => {
          this.$router.push('/')
        })
      } else {
        this.$store.dispatch('logoutRoom').then(() => {
          this.$store.dispatch('logout').then(() => {
            this.$router.push('/')
          })
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
section {
  @include padding(15px);
  article {
    @include margin(null null 40px);
    &.wrapper-tabs-form {
      @include size(100%, 189px);
      p {
        @include padding(15px null);
        @include font-size(14px, 1);
      }
      .container-btn {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
    h3 {
      @include margin(null null 10px null);
    }
    ul {
      display: flex;
      &.custom-tabs {
        border-bottom: $border-base;
      }
      li {
        &.active {
          border-bottom: $border-base-active;
        }
        &.disabled {
          border-bottom: none;
        }
      }
    }
    .wrapper-forms {
      @include padding(10px 5px null 5px);
    }
    .exit {
      @include padding(15px null null null);
      border-top: $border-base;
      display: flex;
      justify-items: center;
      align-items: center;
      p {
        @include margin(null null null 5px);
      }
    }
    &:first-child {
      @include margin(null null 10px);
    }
    &:last-child {
      @include margin(null null 0);
      text-align: center;
    }
  }
}
</style>
