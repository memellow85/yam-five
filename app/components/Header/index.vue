<template>
  <h1>
    {{ $t('nameapp') }}
    <span
      v-if="$route.name === 'release'"
      class="yamicons mdi mdi-chevron-left medium"
      @click="$router.push({ name: 'index' })"
    ></span>
  </h1>
</template>
