<template>
  <q-page class="q-page-general">
    <div class="flex items-center gap-xs q-mb-sm">
      <q-icon size="xs" color="primary" name="mdi-arrow-left"/>
      <p class="text-subtitle2 text-weight-medium text-primary q-ma-none cursor-pointer" @click="backToList">{{ $t('global.back') }}</p>
    </div>
    <property-form-component />
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
// Components
import PropertyFormComponent from 'components/PropertyComponents/PropertyFormComponent.vue';

const router = useRouter();

const backToList = () => {
  router.push({ name: 'properties' });
};
</script>

<style scoped lang="scss">

</style>
