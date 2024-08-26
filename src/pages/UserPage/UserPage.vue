<template>
  <q-page class="q-page-general">
    <div class="stats-section">
      <stats-card-component
        v-for="(item, index) in userStatistics" :key="index"
        :title="item.title"
        :subtitle="item.subtitle"
        :quantity="item.quantity"
        :icon="item.icon"
        :color="item.color"
      />
    </div>
    <div class="q-py-lg">
      <user-component />
    </div>
  </q-page>
</template>

<script setup lang="ts">
// Components
import StatsCardComponent from 'components/AppComponents/StatsCardComponent.vue';
import UserComponent from 'components/UserComponents/UserComponent.vue';

const userStatistics = [
  {
    title: 'Session',
    subtitle: 'Total Users',
    quantity: '21,459',
    icon: 'mdi-account',
    color: 'primary'
  },
  {
    title: 'Paid Users',
    subtitle: 'Last Week Analytics',
    quantity: '4,567',
    icon: 'mdi-account',
    color: 'red'
  },
  {
    title: 'Paid Users',
    subtitle: 'Last Week Analytics',
    quantity: '29,120',
    icon: 'mdi-account',
    color: 'orange'
  },
  {
    title: 'Paid Users',
    subtitle: 'Last Week Analytics',
    quantity: '7,200',
    icon: 'mdi-account',
    color: 'positive'
  }
];

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
</style>
