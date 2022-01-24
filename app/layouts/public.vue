<template>
  <Layout>
    <Header :menu="false"></Header>
    <div>
      <div class="container-app-offline">
        <nuxt />
      </div>
      <Footer></Footer>
    </div>

    <!-- Alert -->
    <Alert :message="$t('alert.message')"></Alert>
  </Layout>
</template>

<script>
import firebase from '~/server/api/firebase'
import ThemeMixin from '~/mixins/theme'
import { logger, isProd } from '~/utils'

export default {
  mixins: [ThemeMixin],
  head() {
    return {
      bodyAttrs: {
        class: `public ${this.bodyClass}`,
      },
    }
  },
  sockets: {
    // users login
    loginUsersSocketEmit(users) {
      logger('SOCKETS loginUsersSocketEmit', users, 'i')
      this.$store.commit(`ws/setLoginUsersSocket`, users)
    },
  },
  beforeMount() {
    if (isProd()) {
      const analytics = firebase.getAnalytics()
      this.$store.commit(`setAnalytics`, analytics)
    }
  },
}
</script>

<style lang="scss">
@import '../assets/scss/offline';
</style>
