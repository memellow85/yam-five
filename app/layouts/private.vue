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
    console.log('mounted', process.env.NUXT_ENV_NODE_ENV)
    if (
      process.env.NUXT_ENV_NODE_ENV === 'production' ||
      process.env.NUXT_ENV_NODE_ENV === 'beta'
    ) {
      console.log('init', firebase)
      firebase.analytics()
    }
  },
}
</script>
