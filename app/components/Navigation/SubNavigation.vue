<template>
  <div class="wrapper-sub-navigation">
    <span
      class="yamicons medium mdi mdi-close"
      @click="showSubMenuHandler"
    ></span>
    <article class="wrapper-welcome flex-end">
      <Avatar
        v-if="refreshCmp"
        :selected="userDetailsFirebase"
        :list="listAvatar"
        :name="getName"
        :detail-position="'right'"
      ></Avatar>
    </article>
    <article>
      <div class="wrapper-menu flex-end">
        <ul>
          <li
            v-for="m in subMenu"
            :key="m.name"
            v-touch="() => actionsHandler(m)"
            :class="['flex-end', { selected: $route.name === m.name }]"
          >
            <span
              v-if="getUsersLogin.length > 0 && m.name === 'game-invite'"
              :class="'notification-circle flex-center'"
            >
              {{ getUsersLogin.length }}
            </span>
            <p>{{ $t(`submenu.${m.title}`) }}</p>
            <span :class="`yamicons mdi mdi-${getIconName(m)}`"></span>
          </li>
        </ul>
      </div>
    </article>
    <div class="wrapper-buttons flex-end">
      <div>
        <button v-touch="leaveHandler" :disabled="!userSocket" class="big">
          <span>{{ $t('config.btn_2') }}</span>
        </button>
        <button v-touch="leaveAppHandler" class="big grey-light">
          <span>{{ $t('config.btn_3') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import NavigationMixin from '~/mixins/navigation'
import ExitMixin from '~/mixins/exit'

export default {
  mixins: [NavigationMixin, ExitMixin],
  data() {
    return {
      subMenu: [
        {
          title: 'menu_0',
          name: 'info',
          icon: 'shield-account-outline',
        },
        {
          title: 'menu_1',
          name: 'game-help',
          icon: 'head-question-outline',
        },
        {
          title: 'menu_2',
          name: 'game-stats',
          icon: 'chart-box-outline',
        },
        {
          title: 'menu_3',
          name: 'game-games',
          icon: 'view-grid-outline',
        },
        {
          title: 'menu_4',
          name: 'game-invite',
          icon: 'account-plus-outline',
        },
        {
          title: 'menu_5',
          name: 'game-config',
          icon: 'cog-outline',
        },
      ],
      refreshCmp: true,
    }
  },
  computed: {
    ...mapState('firebase', {
      listAvatar: (state) => state.listAvatar,
      userDetailsFirebase: (state) => state.userDetailsFirebase,
      userFirebase: (state) => state.userFirebase,
    }),
    ...mapState('ws', {
      userSocket: (state) => state.userSocket,
      loginUsersSocket: (state) => state.loginUsersSocket,
    }),
    getName() {
      if (this.userDetailsFirebase) {
        return this.userDetailsFirebase.name.split(' ')[0]
      } else {
        return '-'
      }
    },
    getUsersLogin() {
      return this.loginUsersSocket.length > 0
        ? this.loginUsersSocket.filter(
            (u) => this.userFirebase && u.uid !== this.userFirebase.uid
          )
        : []
    },
  },
  watch: {
    userDetailsFirebase: {
      handler() {
        this.refreshCmp = false
        this.$nextTick(() => {
          this.refreshCmp = true
        })
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    showSubMenuHandler() {
      this.$store.commit(`game/showSubMenu`, false)
    },
    leaveHandler() {
      this.$store.dispatch('ws/leftRoomSocket')
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper-sub-navigation {
  @include position(absolute, null);
  @include padding(1.5rem 1.5rem 1.5rem null);
  @include size(calc(100% - 1.5rem), calc(100vh - 3rem));
  color: $white;
  text-align: right;
  z-index: 10;
  > span {
    &:before {
      cursor: pointer;
    }
  }
  .yamicons {
    &:before {
      color: $white;
    }
  }
  .wrapper-menu {
    @include margin(3rem null null);
    li {
      @include position(relative, null);
      @include margin(null null 1rem null);
      cursor: pointer;
      .notification-circle {
        @include position(static, null);
        @include margin(null 0.5rem null null);
      }
      p {
        @include margin(null 1rem null null);
      }
    }
  }
  .wrapper-welcome {
    @include margin(1.5rem null null);
  }
  .wrapper-buttons {
    @include position(absolute, null 1.5rem 1.5rem null);
    button {
      @include margin(0.7rem null null null);
    }
  }
}
</style>
