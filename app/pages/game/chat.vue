<template>
  <section class="wrapper-page">
    <TitlePage label="chat" icon="chat-outline"></TitlePage>
    <div class="main wrapper-chat body-scroll-lock-ignore-inner">
      Work in progress
      <pre>{{ messageChat }}</pre>
      <!-- id destra gli altri sinistra -->
      <template v-for="m in messageChat">
        <div
          :key="m"
          :class="['wrapper-message', { right: m.user.user.uid === 1 }]"
        >
          <p v-if="m.user.user.uid === 1">{{ m.user.user.name }}</p>
          <p>{{ m.message }}</p>
        </div>
      </template>
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
  computed: {
    ...mapState('game', {
      messageChat: (state) => state.messageChat,
    }),
  },
  mounted() {
    setInterval(() => {
      this.writeMessage()
    }, 10000)
  },
  methods: {
    writeMessage() {
      this.$store.dispatch(`ws/writeMessageSocket`, 'prova')
    },
  },
}
</script>
