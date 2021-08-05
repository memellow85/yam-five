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
    console.log('mounted', process.env.NODE_ENV)
    if (process.env.NODE_ENV === 'production') {
      console.log('init', firebase)
      firebase.analytics()
    }
  },
}
</script>
