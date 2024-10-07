<template>
  <div>
    <div v-if="!isLoading" class="flex gap-md">
      <q-card class="full-width q-py-md">
        <h6 class="q-px-lg q-mt-none q-mb-md">{{ $t('stats.propertyStats') }}</h6>
        <dashboard-global-stats-component :stats="propertyStatistics" />
      </q-card>
      <div class="full-width graphs-section">
        <dashboard-top-agents-graph :type="GLOBAL.SALE" :title="$t('agent.topAgentsSales')" />
        <dashboard-top-agents-graph :type="GLOBAL.RENTAL" :title="$t('agent.topAgentsRentals')" />
      </div>
      <q-card class="full-width q-py-md">
        <h6 class="q-px-lg q-mt-none q-mb-md">{{ $t('stats.opportunitiesStats') }}</h6>
        <dashboard-global-stats-component :stats="opportunityStatistics" />
      </q-card>
      <div class="full-width graphs-section">
        <dashboard-sales-rentals-qty-graph :title="$t('stats.salesRentalsQty')" />
        <dashboard-current-prev-month-graph :title="$t('stats.currentPreviousMonth')" />
      </div>
      <div class="full-width graphs-section">
        <dashboard-property-types-graph :title="$t('stats.propertyTypes')" />
      </div>
      <div class="row full-width tables-section">
        <div class="col-lg-4 col-md-6 col-12 agent-sales">

        </div>
        <div class="col-lg-4 col-md-6 col-12 agent-rentals">

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
import PropertiesService from 'src/services/properties.service';
// Constants
import { GLOBAL } from 'src/constants/global.constant';
// Components
import DashboardGlobalStatsComponent from 'components/DashboardComponents/DashboardGlobalStatsComponent.vue';
import DashboardPropertiesComponent from 'components/DashboardComponents/DashboardPropertiesComponent.vue';
// Graphs
import DashboardTopAgentsGraph from 'components/DashboardComponents/DashboardTopAgentsGraph.vue';
import DashboardSalesRentalsQtyGraph from 'components/DashboardComponents/DashboardSalesRentalsQtyGraph.vue';
import DashboardCurrentPrevMonthGraph from 'components/DashboardComponents/DashboardCurrentPrevMonthGraph.vue';
import DashboardPropertyTypesGraph from 'components/DashboardComponents/DashboardPropertyTypesGraph.vue';

const { t } = useI18n();
const propertyStore = usePropertyStore();
const opportunityStore = useOpportunityStore();
const contactStore = useContactStore();

const isLoading = ref(false);
const topPropertiesData = ref([]);

const propertyStatistics = computed(() => propertyStore.getPropertyStats);
const opportunityStatistics = computed(() => opportunityStore.getOpportunityStats);
const contactStatistics = computed(() => contactStore.getContactStats);

onMounted(async () => {
  isLoading.value = true;

  await propertyStore.fetchPropertyStats(t);
  await opportunityStore.fetchOpportunityStats(t);
  await contactStore.fetchContactStats(t);

  const { data: dataTopProperties } = await PropertiesService.getProperties({
    enabled: 1,
    status: GLOBAL.AVAILABLE,
  })
  topPropertiesData.value = dataTopProperties.data?.items.slice(0, 5);

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
