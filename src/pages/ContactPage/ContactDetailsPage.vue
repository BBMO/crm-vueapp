<template>
  <q-page class="q-page-general">
    <div class="row">
      <div class="col-12 col-md-4 q-mb-lg q-pr-sm contact-details-section">
        <contact-details-component />
      </div>
      <div class="col-12 col-md-8 q-pl-sm contact-information-section">
        <contact-details-agent-component />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// Components
import ContactDetailsComponent from 'components/ContactComponent/ContactDetailsComponent.vue';
import ContactDetailsAgentComponent from 'components/ContactComponent/ContactDetailsAgentComponent.vue';

</script>

<style scoped lang="scss">
@media screen and (max-width: 1023px) {
  .contact-details-section,
  .contact-information-section {
    padding: 0;
  }
}
</style>
