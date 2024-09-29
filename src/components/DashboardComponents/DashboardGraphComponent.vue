<template>
  <div class="q-px-md">
    <VueApexCharts type="line" height="250" :options="chartOptions" :series="series"></VueApexCharts>
  </div>
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

interface Props {
  seriesData: any,
}
const props = defineProps<Props>();

const { t } = useI18n();

const series = ref<any>([]);

const chartOptions = {
  chart: {
    parentHeightOffset: 0,
    toolbar: {
      show: false
    },
    dropShadow: {
      top: 14,
      blur: 4,
      left: 0,
      enabled: !0,
      opacity: .04,
      enabledOnSeries: [1],
      color: '#000'
    }
  },
  grid: {
    show: false,
    padding: {
      left: 20,
      top: 0,
      right: 10,
      bottom: 10
    }
  },
  legend: {
    show: false
  },
  colors: ['#696CFF', '#999999'],  // Use different colors for the lines
  markers: {
    size: 5
  },
  stroke: {
    width: [5, 3],
    curve: 'smooth',
    lineCap: 'round',
    dashArray: [0, 8]
  },
  xaxis: {
    type: 'datetime',
    labels: {
      format: 'dd MMM'
    },
    axisTicks: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      show: false
    }
  },
  fill: {
    type: 'solid',
    opacity: [1, 0.4]  // Full opacity for current month, low opacity for previous month
  }
};

onMounted(() => {
  // Format current_month from prop series
  const dataCurrentMonth = props.seriesData?.current_month?.map((item: any) => {
    return { x: item.date, y: item.amount };
  });
  series.value.push({
    name: t('stats.currentMonth'),
    data: dataCurrentMonth,
  });

  // Format last_month from prop series
  const dataPreviousMonth = props.seriesData?.last_month?.map((item: any) => {
    return { x: item.date, y: item.amount };
  });
  series.value.push({
    name: t('stats.previousMonth'),
    data: dataPreviousMonth,
    opacity: 0.3  // Lower opacity for previous month
  });
})

</script>

<style scoped lang="scss">

</style>
