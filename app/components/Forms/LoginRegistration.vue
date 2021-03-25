<template>
  <div class="wrapper-offline">
    <h2>{{ login ? $t('login.title_1') : $t('login.title_2') }}</h2>
    <!-- Name -->
    <TextInput
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
    </TextInput>
    <!-- Email -->
    <TextInput
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
    </TextInput>
    <!-- Password -->
    <TextInput
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
    </TextInput>
    <!-- Conferma password -->
    <TextInput
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
    </TextInput>
    <div class="container-btn">
      <button
        v-if="login"
        class="full"
        :disabled="email === '' || password === ''"
        @click="submitHandler"
      >
        <Loader v-if="showLoader"></Loader>
        <span v-else>{{ $t('login.btn_1') }}</span>
      </button>
      <button
        v-else
        class="full"
        :disabled="
          email === '' ||
          password === '' ||
          conf_password === '' ||
          conf_password !== password
        "
        @click="submitHandler"
      >
        <Loader v-if="showLoader"></Loader>
        <span v-else>{{ $t('login.btn_2') }}</span>
      </button>
      <div class="wrapper-button">
        <nuxt-link :to="login ? '/registration' : '/'">
          {{ login ? $t('login.btn_2') : $t('login.title_1') }}
        </nuxt-link>
        <span>-</span>
        <a class="custom-link" href="javascript: void(0)" @click="showHelp">
          {{ $t('login.link_1') }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '~/components/Loader'
import TextInput from '~/components/Forms/Input'

export default {
  components: { TextInput, Loader },
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
      disabledAll: false,
      showLoader: false,
    }
  },
  methods: {
    showHelp() {
      this.$store.commit('game/toogleModal', 'help')
    },
    submitHandler() {
      if (this.login && this.email !== '' && this.password !== '') {
        this.disabledAll = true
        this.showLoader = true
        this.$store
          .dispatch('login', {
            email: this.email,
            password: this.password,
          })
          .then(() => {
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
          .dispatch('registration', {
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
.wrapper-button {
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    @include margin(null 5px);
    display: block;
  }
}
.focus {
  ::v-deep span {
    &.yamicons {
      &:before {
        color: $primary;
      }
    }
  }
}
input[type='text'],
input[type='password'] {
  &::-webkit-input-placeholder {
    @include padding(null null null 25px);
    color: $color-6;
    line-height: 20px;
  }
}
</style>
