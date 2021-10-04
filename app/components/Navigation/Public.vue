<template>
  <div class="container-btn">
    <button
      v-if="login"
      v-touch="submitHandler"
      class="full"
      :disabled="disabled"
    >
      <Loader v-if="loader"></Loader>
      <span v-else>{{ $t('login.btn_1') }}</span>
    </button>
    <button
      v-if="registration"
      v-touch="submitHandler"
      class="full"
      :disabled="disabled"
    >
      <Loader v-if="loader"></Loader>
      <span v-else>{{ $t('login.btn_2') }}</span>
    </button>
    <button
      v-if="recovery"
      v-touch="submitHandler"
      class="full"
      :disabled="disabled"
    >
      <Loader v-if="loader"></Loader>
      <span v-else>{{ $t('recovery.btn') }}</span>
    </button>

    <div class="wrapper-button">
      <nuxt-link
        :to="login ? { name: 'offline-registration' } : { name: 'index' }"
      >
        {{ login ? $t('login.btn_2') : $t('login.title_1') }}
      </nuxt-link>
      <span>-</span>
      <nuxt-link
        :to="
          registration || login
            ? { name: 'offline-recovery' }
            : { name: 'offline-registration' }
        "
      >
        {{ registration || login ? $t('recovery.btn') : $t('login.btn_2') }}
      </nuxt-link>
      <p>
        {{ $t('login.link_message') }}
        <a
          v-touch="showHelpHandler"
          class="custom-link"
          href="javascript: void(0)"
        >
          {{ $t('login.link_1') }}
        </a>
      </p>
      <Copy></Copy>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    login: {
      type: Boolean,
      default: false,
    },
    registration: {
      type: Boolean,
      default: false,
    },
    recovery: {
      type: Boolean,
      default: false,
    },
    loader: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    showHelpHandler() {
      this.$store.commit('game/toggleModal', 'help')
    },
    submitHandler() {
      this.$nuxt.$emit('submitHandler')
    },
  },
}
</script>
