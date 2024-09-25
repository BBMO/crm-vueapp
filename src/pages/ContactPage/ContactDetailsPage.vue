<template>
  <q-page class="q-page-general">
    <div class="flex items-center gap-xs q-mb-lg">
      <q-icon size="xs" color="primary" name="mdi-arrow-left"/>
      <p class="text-subtitle2 text-weight-medium text-primary q-ma-none cursor-pointer" @click="backToList">{{ $t('global.back') }}</p>
    </div>
    <div class="row">
      <div class="col-12 col-md-4 q-mb-lg q-pr-sm contact-details-section">
        <contact-details-component />
      </div>
      <div class="col-12 col-md-8 q-pl-sm contact-information-section">
        <div class="flex column gap-md">
          <contact-details-properties-component />
          <contact-details-opportunities-component />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
// Components
import ContactDetailsComponent from 'components/ContactComponents/ContactDetailsComponent.vue';
import ContactDetailsPropertiesComponent from 'components/ContactComponents/ContactDetailsPropertiesComponent.vue';
import ContactDetailsOpportunitiesComponent from 'components/ContactComponents/ContactDetailsOpportunitiesComponent.vue';

const router = useRouter();

const backToList = () => {
  router.push({ name: 'contacts' });
};
</script>

<style scoped lang="scss">
@media screen and (max-width: 1023px) {
  .contact-details-section,
  .contact-information-section {
    padding: 0;
  }
}
</style>
