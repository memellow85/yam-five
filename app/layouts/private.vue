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
    if (process.env.NODE_ENV === 'production') {
      firebase.analytics()
    }
  },
}
</script>
