<template>
  <q-page class="login-page-container">
    <div class="row full-height">
      <div class="col-lg-8 col-md-7 col-sm-6 login-image-section">
        Logo + Imagen
      </div>
      <div class="col-lg-4 col-md-5 col-sm-6 q-pa-lg flex justify-center">
        <login-component />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// Components
import LoginComponent from 'components/LoginComponents/LoginComponent.vue';

</script>

<style lang="scss" scoped>
.login-page-container {
  height: 100vh;

  .login-image-section {
    background: $grey-base;
  }

}
</style>
