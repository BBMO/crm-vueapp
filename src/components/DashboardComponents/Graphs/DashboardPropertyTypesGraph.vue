<template>
  <div>
    <q-card class="full-width full-height q-py-md q-px-lg q-pb-lg">
      <h6 class="q-my-none w-full q-pa-xs">{{ props.title }}</h6>

      <VueApexCharts
        v-if="series.length"
        type="polarArea"
        height="350"
        :options="chartOptions"
        :series="series"
      />
      <div v-else class="full-width full-height flex items-center justify-center q-py-xl">
        <q-spinner v-if="isLoading" color="primary" size="3em" class="q-my-md" />
      </div>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts';
import { computed, onMounted, ref } from 'vue';
// Services
import DashboardService from 'src/services/dashboard.service';

interface Props {
  title: string,
}
const props = defineProps<Props>();

const series = ref<any>([]);
const labels = ref<any>(['aaaaa', 'aaaaa']);

const isLoading = ref(false);

const chartOptions = computed(() => ({
  chart: {
    type: 'polarArea',
  },
  stroke: {
    colors: ['#fff']
  },
  fill: {
    opacity: 0.8
  },
  labels: labels.value,
  // legend: {
  //   show: false,
  // },
  responsive: [{
    breakpoint: 480,
    options: {
      legend: {
        position: 'bottom'
      }
    }
  }]
}));

const getStatsData = async () => {
  isLoading.value = true;

  const { data } = await DashboardService.getPropertyTypesGraphData();

  series.value = [];
  labels.value = [];

  data?.data?.map((item: any) => {
    series.value.push(item.quantity);
    labels.value.push(item.type);
  });

  isLoading.value = false;
}

onMounted(async () => {
  await getStatsData();
})

</script>

<style scoped lang="scss">
.w-60 {
  width: 60%;
}
.w-45 {
  width: 45%;
}
</style>
