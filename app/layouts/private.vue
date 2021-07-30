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
