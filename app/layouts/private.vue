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
import ThemeMixin from '~/mixins/theme'

export default {
  mixins: [ThemeMixin],
  head() {
    return {
      bodyAttrs: {
        class: this.bodyClass,
      },
    }
  },
}
</script>
