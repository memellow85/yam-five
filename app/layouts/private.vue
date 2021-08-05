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

export default {
  mounted() {
    if (
      process.env.NUXT_ENV_NODE_ENV === 'production' ||
      process.env.NUXT_ENV_NODE_ENV === 'beta'
    ) {
      firebase.analytics()
    }
  },
}
</script>
