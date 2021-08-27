<template>
  <div class="offline">
    <div class="inner-offline">
      <h2>{{ login ? $t('login.title_1') : $t('login.title_2') }}</h2>

      <!-- Name -->
      <FormsInput
        v-if="!login"
        :name="$t('login.form_4')"
        :show-label="false"
        :icon="'account-outline'"
        :show-icon="name === ''"
        :class="['textinput', { focus: focus === 'name' }]"
      >
        <input
          id="name"
          v-model="name"
          autocomplete="off"
          name="name"
          type="text"
          class="big"
          :disabled="disabledAll"
          :placeholder="$t('login.form_4')"
          @focus="focus = 'name'"
          @blur="focus = ''"
          @keypress.enter="submitHandler"
        />
      </FormsInput>

      <!-- Email -->
      <FormsInput
        :name="$t('login.form_1')"
        :show-label="false"
        :icon="'at'"
        :show-icon="email === ''"
        :class="['textinput', { focus: focus === 'email' }]"
      >
        <input
          id="email"
          v-model="email"
          autocomplete="off"
          name="email"
          type="text"
          class="big"
          :disabled="disabledAll"
          :placeholder="$t('login.form_1')"
          @focus="focus = 'email'"
          @blur="focus = ''"
          @keypress.enter="submitHandler"
        />
      </FormsInput>

      <!-- Password -->
      <FormsInput
        :name="$t('login.form_2')"
        :show-label="false"
        :icon="'shield-key-outline'"
        :show-icon="password === ''"
        :class="['textinput', { focus: focus === 'password' }]"
      >
        <input
          id="password"
          v-model="password"
          autocomplete="off"
          name="password"
          type="password"
          class="big"
          :disabled="disabledAll"
          :placeholder="$t('login.form_2')"
          @focus="focus = 'password'"
          @blur="focus = ''"
          @keypress.enter="submitHandler"
        />
      </FormsInput>

      <!-- Conferma password -->
      <FormsInput
        v-if="!login"
        :name="$t('login.form_3')"
        :show-label="false"
        :icon="'shield-key-outline'"
        :show-icon="conf_password === ''"
        :class="['textinput', { focus: focus === 'conf_password' }]"
      >
        <input
          id="conf_password"
          v-model="conf_password"
          autocomplete="off"
          name="conf_password"
          type="password"
          class="big"
          :disabled="disabledAll"
          :placeholder="$t('login.form_3')"
          @focus="focus = 'conf_password'"
          @blur="focus = ''"
          @keypress.enter="submitHandler"
        />
      </FormsInput>

      <div v-if="login" class="wrapper-credential flex">
        <label class="checkbox">
          <span class="checkbox__input">
            <input v-model="credential" type="checkbox" name="credential" />
            <span class="checkbox__control"></span>
          </span>
          <span class="checkbox__label">{{ $t('login.save_credential') }}</span>
        </label>
      </div>

      <NavigationPublic
        :login="login"
        :registration="!login"
        :loader="showLoader"
        :disabled="
          login
            ? email === '' || password === ''
            : email === '' ||
              password === '' ||
              conf_password === '' ||
              conf_password !== password
        "
      ></NavigationPublic>
    </div>
  </div>
</template>

<script>
import { getLocalStorageKey, setLocalStorageKey } from '~/utils'

export default {
  props: {
    login: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      focus: '',
      name: '',
      email: '',
      password: '',
      conf_password: '',
      credential: false,
      disabledAll: false,
      showLoader: false,
    }
  },
  created() {
    this.$nuxt.$on('submitHandler', () => {
      this.submitHandler()
    })
  },
  mounted() {
    this.email = getLocalStorageKey('username')
      ? getLocalStorageKey('username')
      : ''
    this.password = getLocalStorageKey('password')
      ? getLocalStorageKey('password')
      : ''
  },
  destroyed() {
    this.$nuxt.$off('submitHandler')
  },
  methods: {
    submitHandler() {
      if (this.login && this.email !== '' && this.password !== '') {
        this.disabledAll = true
        this.showLoader = true
        this.$store
          .dispatch('firebase/login', {
            email: this.email,
            password: this.password,
          })
          .then(() => {
            if (this.credential) {
              setLocalStorageKey('username', this.email)
              setLocalStorageKey('password', this.password)
            }
            this.$router.push('/home')
          })
          .catch((msg) => {
            this.$store.commit('game/toggleNotification', {
              type: 'alert',
              message: msg,
            })
            this.showLoader = false
            this.disabledAll = false
          })
      } else if (
        this.email !== '' &&
        this.password !== '' &&
        this.conf_password !== '' &&
        this.conf_password === this.password
      ) {
        this.disabledAll = true
        this.showLoader = true
        this.$store
          .dispatch('firebase/registration', {
            email: this.email,
            password: this.password,
            name: this.name,
          })
          .then(() => {
            this.$router.push('/')
            this.showLoader = false
          })
          .catch((msg) => {
            this.$store.commit('game/toggleNotification', {
              type: 'alert',
              message: msg,
            })
            this.showLoader = false
            this.disabledAll = false
          })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper-credential {
  @include margin(null null 1rem);
}
</style>
