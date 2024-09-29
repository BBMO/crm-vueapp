<template>
  <div>
    <div v-if="!isLoading" class="flex column gap-sm">
      <q-card class="q-py-md">
        <h6 class="q-px-lg q-mt-none q-mb-md">{{ $t('stats.propertyStats') }}</h6>
        <dashboard-global-stats-component :stats="propertyStatistics" />
      </q-card>
      <div>
        Gráficos
      </div>
      <q-card class="q-py-md">
        <h6 class="q-px-lg q-mt-none q-mb-md">{{ $t('stats.opportunitiesStats') }}</h6>
        <dashboard-global-stats-component :stats="opportunityStatistics" />
      </q-card>
      <div>
        Tablas
      </div>
      <q-card class="q-py-md">
        <h6 class="q-px-lg q-mt-none q-mb-md">{{ $t('stats.contactStats') }}</h6>
        <dashboard-global-stats-component :stats="contactStatistics" />
      </q-card>
    </div>
    <div v-if="isLoading" class="full-width full-height flex align-center justify-center q-py-xl">
      <q-spinner color="primary" size="3em" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
// Store
import { usePropertyStore } from 'src/stores/property.store';
import { useOpportunityStore } from 'src/stores/opportunity.store';
import { useContactStore } from 'src/stores/contact.store';
// Components
import DashboardGlobalStatsComponent from 'components/DashboardComponents/DashboardGlobalStatsComponent.vue';

const { t } = useI18n();
const propertyStore = usePropertyStore();
const opportunityStore = useOpportunityStore();
const contactStore = useContactStore();

const isLoading = ref(false);

const propertyStatistics = computed(() => propertyStore.getPropertyStats);
const opportunityStatistics = computed(() => opportunityStore.getOpportunityStats);
const contactStatistics = computed(() => contactStore.getContactStats);

onMounted(async () => {
  isLoading.value = true;

  await propertyStore.fetchPropertyStats(t);
  await opportunityStore.fetchOpportunityStats(t);
  await contactStore.fetchContactStats(t);

  isLoading.value = false;
})
</script>

<style scoped lang="scss">

</style>
