<template>
  <div class="container-btn">
    <button
      v-if="login"
      class="full"
      :disabled="disabled"
      @click="submitHandler"
    >
      <Loader v-if="loader"></Loader>
      <span v-else>{{ $t('login.btn_1') }}</span>
    </button>
    <button
      v-if="registration"
      class="full"
      :disabled="disabled"
      @click="submitHandler"
    >
      <Loader v-if="loader"></Loader>
      <span v-else>{{ $t('login.btn_2') }}</span>
    </button>
    <button
      v-if="recovery"
      class="full"
      :disabled="disabled"
      @click="submitHandler"
    >
      <Loader v-if="loader"></Loader>
      <span v-else>{{ $t('recovery.btn') }}</span>
    </button>
    <div class="wrapper-button">
      <nuxt-link :to="login ? '/registration' : '/'">
        {{ login ? $t('login.btn_2') : $t('login.title_1') }}
      </nuxt-link>
      <span>-</span>
      <nuxt-link :to="registration || login ? '/recovery' : '/registration'">
        {{ registration || login ? $t('recovery.btn') : $t('login.btn_2') }}
      </nuxt-link>
      <p>
        {{ $t('login.link_message') }}
        <a class="custom-link" href="javascript: void(0)" @click="showHelp">
          {{ $t('login.link_1') }}
        </a>
      </p>
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
    showHelp() {
      this.$store.commit('game/toggleModal', 'help')
    },
    submitHandler() {
      this.$nuxt.$emit('submitHandler')
    },
  },
}
</script>
