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
import HeaderComponent from 'components/AppComponents/HeaderComponent/HeaderComponent.vue';
import FooterComponent from 'components/AppComponents/FooterComponent/FooterComponent.vue';

</script>

<style lang="scss" scoped>
.q-layout {
  background-color: $grey-base;
}
</style>
