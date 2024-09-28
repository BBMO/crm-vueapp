<template>
  <q-page class="q-page-general">
    <div class="flex column items-center justify-center q-mt-xl">
      <h2 class="q-ma-none">404</h2>
      <h6 class="q-ma-none">{{ t('global.pageNotFound') }}</h6>
      <q-img src="src/assets/404-error.png" alt="404"/>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped lang="scss">
.q-img {
  max-width: 500px;
}
</style>
