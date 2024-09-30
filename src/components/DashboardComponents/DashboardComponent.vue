<template>
  <div>
    <div v-if="!isLoading" class="flex gap-md">
      <q-card class="full-width q-py-md">
        <h6 class="q-px-lg q-mt-none q-mb-md">{{ $t('stats.propertyStats') }}</h6>
        <dashboard-global-stats-component :stats="propertyStatistics" />
      </q-card>
      <div class="full-width graphs-section">
        <q-card class="q-py-md">
          <h6 class="q-px-lg q-mt-none q-mb-md">{{ $t('stats.currentPreviousMonthSales') }}</h6>
          <dashboard-graph-component :seriesData="graphSalesData" />
        </q-card>
        <q-card class="full-width q-py-md">
          <h6 class="q-px-lg q-mt-none q-mb-md">{{ $t('stats.currentPreviousMonthRents') }}</h6>
          <dashboard-graph-component :seriesData="graphRentalsData" />
        </q-card>
      </div>
      <q-card class="full-width q-py-md">
        <h6 class="q-px-lg q-mt-none q-mb-md">{{ $t('stats.opportunitiesStats') }}</h6>
        <dashboard-global-stats-component :stats="opportunityStatistics" />
      </q-card>
      <div class="row full-width tables-section">
        <div class="col-lg-4 col-md-6 col-12 agent-sales">
          <dashboard-agents-top-component class="full-height" :title="t('agent.topAgentsSales')" :agent-top-data="topAgentsSalesData" />
        </div>
        <div class="col-lg-4 col-md-6 col-12 agent-rentals">
          <dashboard-agents-top-component class="full-height" :title="t('agent.topAgentsRentals')" :agent-top-data="topAgentsRentalsData" />
        </div>
        <div class="col-lg-4 col-12 properties">
          <dashboard-properties-component class="full-height" :title="t('property.latestProperties')" :properties-data="topPropertiesData" />
        </div>
      </div>
      <q-card class="full-width q-py-md">
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
// Services
import DashboardService from 'src/services/dashboard.service';
import PropertiesService from 'src/services/properties.service';
// Constants
import { GLOBAL } from 'src/constants/global.constant';
// Components
import DashboardGlobalStatsComponent from 'components/DashboardComponents/DashboardGlobalStatsComponent.vue';
import DashboardGraphComponent from 'components/DashboardComponents/DashboardGraphComponent.vue';
import DashboardAgentsTopComponent from 'components/DashboardComponents/DashboardAgentsTopComponent.vue';
import DashboardPropertiesComponent from 'components/DashboardComponents/DashboardPropertiesComponent.vue';

const { t } = useI18n();
const propertyStore = usePropertyStore();
const opportunityStore = useOpportunityStore();
const contactStore = useContactStore();

const isLoading = ref(false);
const graphRentalsData = ref([]);
const graphSalesData = ref([]);
const topAgentsSalesData = ref([]);
const topAgentsRentalsData = ref([]);
const topPropertiesData = ref([]);

const propertyStatistics = computed(() => propertyStore.getPropertyStats);
const opportunityStatistics = computed(() => opportunityStore.getOpportunityStats);
const contactStatistics = computed(() => contactStore.getContactStats);

onMounted(async () => {
  isLoading.value = true;

  await propertyStore.fetchPropertyStats(t);
  await opportunityStore.fetchOpportunityStats(t);
  await contactStore.fetchContactStats(t);

  const { data: dataRentals } = await DashboardService.getDashboardGraphRentals();
  graphRentalsData.value = dataRentals.data;

  const { data: dataSales } = await DashboardService.getDashboardGraphSales();
  graphSalesData.value = dataSales.data;

  const { data: dataTopAgentsSales } = await DashboardService.getTopAgentsSales();
  topAgentsSalesData.value = dataTopAgentsSales.data;

  const { data: dataTopAgentsRentals } = await DashboardService.getTopAgentsRentals();
  topAgentsRentalsData.value = dataTopAgentsRentals.data;

  const { data: dataTopProperties } = await PropertiesService.getProperties({
    enabled: 1,
    status: GLOBAL.AVAILABLE,
  })
  topPropertiesData.value = dataTopProperties.data?.items;

  isLoading.value = false;
})
</script>

<style scoped lang="scss">
.graphs-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

.tables-section {
  .agent-rentals {
    padding-left: 10px;
    padding-right: 10px;
  }

  @media screen and (max-width: 1440px) {
    .agent-sales { padding-right: 10px; }
    .agent-rentals { padding-right: 0; }
    .properties { padding-top: 15px; }
  }

  @media screen and (max-width: 1023px) {
    .agent-sales { padding-right: 0 }

    .agent-rentals {
      padding-left: 0;
      padding-top: 15px;
    }
  }
}
</style>
