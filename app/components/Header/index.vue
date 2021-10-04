<template>
  <h1>
    {{ $t('nameapp') }}
    <span
      v-if="$route.name === 'release'"
      v-touch="() => $router.push({ name: 'index' })"
      class="yamicons mdi mdi-chevron-left medium"
    ></span>
  </h1>
</template>
