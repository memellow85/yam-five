<template>
  <section class="wrapper-page">
    <TitlePage label="chat" icon="chat-outline"></TitlePage>
    <div class="main">
      <article>
        <ul class="inline custom-tabs">
          <li
            v-touch="() => setTab(true)"
            :class="['center', { active: global }]"
          >
            <h4>{{ $t('chat.title_tab_1') }}</h4>
          </li>
          <li
            v-touch="() => setTab(false)"
            :class="['center', { active: !global }]"
          >
            <h4>{{ $t('chat.title_tab_2') }}</h4>
          </li>
        </ul>
        <div class="wrapper-chat body-scroll-lock-ignore-inner">
          <p v-if="!userSocket && !global">{{ $t('chat.message_no_room') }}</p>
          <template v-for="(m, k) in messages">
            <div
              :key="k"
              :class="[
                'wrapper-message',
                {
                  right: m.user.uid === userDetailsFirebase.uid,
                  center: m.welcome,
                },
              ]"
            >
              <p class="small" :style="`color: #${m.color}`">
                {{ m.user.name }} {{ $t('chat.write') }}
              </p>
              <p class="medium">{{ m.message }}</p>
            </div>
          </template>
        </div>
        <FormsInput
          :name="$t('chat.name_input')"
          :show-label="false"
          write-mode
          class="textinput"
        >
          <input
            id="newMessage"
            v-model="newMessage"
            autocomplete="off"
            name="name"
            type="text"
            class="big blank-input"
            :placeholder="$t('chat.name_input')"
            @keypress.enter="writeMessage"
          />
          <button
            v-touch="writeMessage"
            class="sendMode"
            :disabled="disabledButton"
          >
            <span class="yamicons small mdi mdi-send-outline"></span>
          </button>
        </FormsInput>
      </article>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import ScrollMixin from '~/mixins/scroll'
import AnalyticsMixin from '~/mixins/analytics'

export default {
  mixins: [ScrollMixin, AnalyticsMixin],
  layout: 'private',
  middleware: ['authenticated'],
  data() {
    return {
      newMessage: '',
      global: true,
    }
  },
  computed: {
    ...mapState('firebase', {
      userDetailsFirebase: (state) => state.userDetailsFirebase,
    }),
    ...mapState('ws', {
      userSocket: (state) => state.userSocket,
    }),
    ...mapState('game', {
      messageChat: (state) => state.messageChat,
      messageChatGlobal: (state) => state.messageChatGlobal,
    }),
    disabledButton() {
      return this.global
        ? this.newMessage === ''
        : !this.userSocket || this.newMessage === ''
    },
    messages() {
      return this.global ? this.messageChatGlobal : this.messageChat
    },
  },
  methods: {
    writeMessage() {
      if (
        (!this.global && this.newMessage !== '' && this.userSocket) ||
        (this.global && this.newMessage !== '')
      ) {
        this.$store.dispatch(`ws/writeMessageSocket`, {
          user: this.global ? this.userDetailsFirebase : this.userSocket,
          message: this.newMessage,
          global: this.global,
        })
        this.newMessage = ''
      }
    },
    setTab(value) {
      this.global = value
    },
  },
}
</script>

<style lang="scss" scoped>
.main {
  article {
    overflow: hidden;
  }
}
.wrapper-chat {
  @include padding(null null 1rem null);
  @include size(100%, calc(calc(100vh - 56px) - 13rem));
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
  > p {
    @include padding(1rem null null);
  }
  .wrapper-message {
    @extend %flex;
    flex-direction: column;
    align-items: flex-start;
    @include padding(0.5rem null null);
    &:first-child {
      @include padding(1.5rem null null);
    }
    &:last-child {
      @include padding(0.5rem null 1.5rem);
    }
    &.right {
      align-items: flex-end;
    }
    p {
      &.small {
        @include padding(0.3rem null);
      }
      &.medium {
        @include padding(0.3rem 0.6rem);
        max-width: 60%;
        border: $border-base;
        border-radius: $rounded;
      }
    }
  }
}
</style>
