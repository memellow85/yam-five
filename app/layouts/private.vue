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
import { getLocalStorageKey } from '~/utils'

export default {
  head() {
    return {
      bodyAttrs: {
        class: `theme--${getLocalStorageKey('theme') || 'default'}`,
      },
    }
  },
}
</script>
