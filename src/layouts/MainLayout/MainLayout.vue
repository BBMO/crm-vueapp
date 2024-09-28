<template>
  <q-layout view="lHh Lpr lFf" class="layout-app">
    <header-component />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
// Components
import HeaderComponent from 'components/AppComponents/HeaderComponent.vue';

</script>

<style lang="scss" scoped>
.q-layout {
  background-color: var(--q-base-color);
}
</style>
