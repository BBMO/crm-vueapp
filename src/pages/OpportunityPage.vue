<template>
  <q-page class="q-page-general">
    <div class="stats-section">
      <stats-card-component
        v-for="(item, index) in opportunityStatistics" :key="index"
        :stats="item"
      />
    </div>
    <div class="q-py-lg">
      <opportunity-component />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
// Store
import { useOpportunityStore } from 'src/stores/opportunity.store';
// Components
import StatsCardComponent from 'components/AppComponents/StatsCardComponent.vue';
import OpportunityComponent from 'components/OpportunityComponents/OpportunityComponent.vue';

const { t } = useI18n();
const opportunityStore = useOpportunityStore();

const opportunityStatistics = computed(() => opportunityStore.getOpportunityStats);

onMounted(() => {
  opportunityStore.fetchOpportunityStats(t);
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
