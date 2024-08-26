<template>
  <q-layout view="lHh Lpr lFf">
    <header-component />
    <q-page-container>
      <router-view />
    </q-page-container>
    <footer-component />
  </q-layout>
</template>

<script setup lang="ts">
// Components
import HeaderComponent from 'components/AppComponents/HeaderComponent.vue';
import FooterComponent from 'components/AppComponents/FooterComponent.vue';

</script>

<style lang="scss" scoped>
.q-layout {
  background-color: var(--q-base-color);
}
</style>
