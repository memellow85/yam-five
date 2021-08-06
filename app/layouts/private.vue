<template>
  <Layout>
    <div>
      <nuxt />
    </div>

    <!-- Navigation -->
    <NavigationPrivate></NavigationPrivate>

    <!-- Alert -->
    <Alert :message="$t('alert.message')"></Alert>
  </Layout>
</template>

<script>
import firebase from '~/server/api/firebase'
import { isProd } from '~/utils'

export default {
  mounted() {
    if (isProd()) {
      firebase.analytics()
    }
  },
}
</script>
