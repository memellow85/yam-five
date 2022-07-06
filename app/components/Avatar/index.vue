<template>
  <div
    v-if="single"
    :class="[
      'flex wrapper-user',
      {
        right: detailPosition === 'right',
        left: detailPosition === 'left' || detailPosition === '',
      },
    ]"
  >
    <div
      v-if="detailPosition === 'left' || detailPosition === ''"
      :class="[`avatar flex-center ${dimension}`]"
    >
      <span
        v-if="selectedUser && selectedUser.avatar && selectedUser.avatar !== ''"
        :style="`background-image: url('${getPath}')`"
        class="image"
      ></span>
      <span v-else>{{ firstLetter }}</span>
    </div>
    <div v-if="!hideName">
      <p>{{ $t('personal_info.title') }}</p>
      <h2>{{ selectedUser ? (name ? name : selectedUser.name) : '-' }}</h2>
    </div>
    <div
      v-if="detailPosition === 'right'"
      :class="[`avatar flex-center ${dimension}`]"
    >
      <span
        v-if="selectedUser && selectedUser.avatar && selectedUser.avatar !== ''"
        :style="`background-image: url('${getPath}')`"
        class="image"
      ></span>
      <span v-else>{{ firstLetter }}</span>
    </div>
  </div>
  <div v-else class="wrapper-avatar flex">
    <div
      v-if="reset"
      :class="[
        'avatar-container flex-center',
        {
          selected:
            selectedAvatar === '' ||
            selectedColor === '' ||
            (selectedUser &&
              selectedUser.avatar &&
              selectedUser.avatar === '') ||
            (selectedUser && selectedUser.color && selectedUser.color) === '',
        },
      ]"
    >
      <span
        class="yamicons mdi mdi-cancel flex-center reset"
        @click="selectedHandler()"
      ></span>
    </div>
    <template v-for="data in list">
      <div
        :key="data.code"
        :class="[
          'avatar-container flex-center',
          {
            selected:
              data.code === selectedAvatar ||
              (selectedUser && data.code === selectedUser.avatar) ||
              data.code === selectedColor ||
              (selectedUser && data.code === selectedUser.color),
          },
        ]"
        :style="
          data.code === selectedColor ||
          (selectedUser && data.code === selectedUser.color)
            ? `border-color: ${data.color}`
            : ``
        "
      >
        <span
          :style="
            data.path
              ? `background-image: url('${data.path}')`
              : `background: ${data.color}`
          "
          @click="selectedHandler(data)"
        ></span>
      </div>
    </template>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'

export default {
  props: {
    single: {
      type: Boolean,
      default: true,
    },
    hideName: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: '',
    },
    detailPosition: {
      type: String,
      default: '',
    },
    list: {
      type: Array,
      default() {
        return []
      },
    },
    selected: {
      type: Object,
      default() {
        return {}
      },
    },
    reset: {
      type: Boolean,
      default: false,
    },
    dimension: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      selectedAvatar: null,
      selectedColor: null,
      selectedUser: null,
    }
  },
  computed: {
    getPath() {
      if (this.list.length > 0 && this.selectedUser) {
        const current = this.list.filter(
          (a) => a.code === this.selectedUser.avatar
        )
        return current.length === 1 ? current[0].path : ''
      } else {
        return ''
      }
    },
    firstLetter() {
      if (this.selectedUser) {
        if (this.selectedUser.name.split(' ').length > 1) {
          return (
            this.selectedUser.name.split(' ')[0].charAt(0) +
            this.selectedUser.name.split(' ')[1].charAt(0)
          )
        } else {
          return (
            this.selectedUser.name.split(' ')[0].charAt(0) +
            this.selectedUser.name.split(' ')[0].charAt(1)
          )
        }
      } else {
        return '-'
      }
    },
  },
  mounted() {
    this.selectedUser = cloneDeep(this.selected)
  },
  methods: {
    selectedHandler(data = null) {
      if (data && data.path) {
        this.selectedAvatar = data ? data.code : ''
      } else {
        this.selectedColor = data ? data.code : ''
      }
      this.$nuxt.$emit('selectedTypeHandler', data)
    },
  },
}
</script>

<style lang="scss" scoped>
%avatarStyle {
  @include size(2.5rem);
  cursor: pointer;
  border-radius: $rounded-all;
  background: $color-5;
  background-position: center center;
  background-size: 100%;
}

.wrapper-user {
  &.left {
    .avatar {
      @include margin(null 0.5rem null null);
      &.small {
        @include margin(null 0.2rem null null);
        span {
          @include font-size(10px, 1);
        }
      }
    }
  }
  &.right {
    .avatar {
      @include margin(null null null 0.5rem);
    }
  }
  .avatar {
    @include size(2.5rem);
    @include themed() {
      border-color: t($key-color-custom-1);
    }
    color: $color-9;
    background: $white;
    border-radius: $rounded-all;
    border: $border-base-tab-active;
    text-transform: uppercase;
    &.small {
      @include size(1.5rem);
      span {
        &.image {
          @include size(1.5rem);
        }
      }
    }
    span {
      &.image {
        @extend %avatarStyle;
      }
    }
  }
  p {
    @include margin(null null 0.3rem null);
  }
}
.wrapper-avatar {
  flex-wrap: wrap;
  .avatar-container {
    @include size(2.8rem);
    border-radius: $rounded-all;
    border: 0.15rem solid $white;
    &.selected {
      border: 0.15rem solid $primary;
      @include themed() {
        border-color: t($key-color-custom-1);
      }
    }
    span {
      @extend %avatarStyle;
      &.reset {
        display: flex;
      }
    }
  }
}
</style>
