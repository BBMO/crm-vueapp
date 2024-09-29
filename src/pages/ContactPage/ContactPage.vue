<template>
  <q-page class="q-page-general">
    <div class="stats-section">
      <stats-card-component
        v-for="(item, index) in contactStatistics" :key="index"
        :stats="item"
      />
    </div>
    <div class="q-py-lg">
      <contact-component />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
// Store
import { useContactStore } from 'src/stores/contact.store';
// Components
import StatsCardComponent from 'components/AppComponents/StatsCardComponent.vue';
import ContactComponent from 'components/ContactComponents/ContactComponent.vue';

const { t } = useI18n();
const contactStore = useContactStore();

const contactStatistics = computed(() => contactStore.getContactStats);

onMounted(() => {
  contactStore.fetchContactStats(t);
})
</script>

<style scoped lang="scss">
.stats-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

@media screen and (max-width: 768px) {
  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 320px) {
  .stats-section {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
