<template>
  <div>
    <q-card class="full-width q-py-md q-px-lg">
      <div class="row items-start header-table">
        <div class="col-sm-5 col-12 q-pa-xs">
          <h6 class="q-my-none">{{ props.title }}</h6>
        </div>
        <div class="col-sm-7 col-12 q-pa-xs flex justify-end">
          <div class="q-pa-xs select-container">
            <q-select
              outlined
              dense
              v-model="month"
              use-input
              hide-selected
              fill-input
              option-label="label"
              option-value="value"
              :options="monthOptions"
              @update:model-value="getStatsData"
            >
              <template v-slot:prepend><q-icon name="mdi-finance" /></template>
            </q-select>
          </div>
          <div class="q-pa-xs select-container">
            <q-select
              outlined
              dense
              v-model="year"
              use-input
              hide-selected
              fill-input
              option-label="label"
              option-value="value"
              :options="yearOptions"
              @update:model-value="getStatsData"
            >
              <template v-slot:prepend><q-icon name="mdi-chart-timeline-variant" /></template>
            </q-select>
          </div>
        </div>
      </div>

      <VueApexCharts
        v-if="series.length"
        type="radialBar"
        height="350"
        :options="chartOptions"
        :series="series"
      />
      <div v-else class="full-width full-height flex items-center justify-center q-py-xl">
        <div v-if="!isLoading" class="full-width flex column items-center q-my-md">
          <q-icon size="md" name="mdi-alert" color="grey" />
          <p class="text-weight-medium q-ma-none q-py-xs text-grey">{{ $t('global.noDataAvailable') }}</p>
        </div>
        <q-spinner v-else color="primary" size="3em" class="q-my-md" />
      </div>
      <div class="text-grey-14">* {{ $t('stats.topAgentsDesc') }}</div>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
// Services
import DashboardService from 'src/services/dashboard.service';
// Constants
import { MONTHS } from 'src/constants/global.constant';

interface Props {
  type: any,
  title: string,
}
const props = defineProps<Props>();

const { t } = useI18n();

const currentYear = new Date().getFullYear();

const monthOptions = ref<any>([
  { value: -1, label: t('global.all') },
  ...MONTHS.map((month: any) => {
    return {
      ...month,
      label: t(`months.${month.label}`),
    }
  })
]);

const yearOptions = ref<any>([
  { value: currentYear, label: currentYear },
  { value: currentYear - 1, label: currentYear - 1 },
  { value: currentYear - 2, label: currentYear - 2 },
]);

const series = ref<any>([]);
const amounts = ref<any>([]);
const labels = ref<any>([]);
const colors = ref<any>(['#696cff', '#1ab7ea', '#0084ff', '#39539E', '#0077B5']);

const year = ref<any>(null);
const month = ref<any>(null);
const isLoading = ref(false);

const chartOptions = {
  chart: {
    parentHeightOffset: 0,
    type: 'radialBar',
    dropShadow: {
      top: 10,
      blur: 4,
      left: 0,
      enabled: !0,
      opacity: .04,
      enabledOnSeries: [0],
      color: '#000'
    }
  },
  colors: colors.value,
  plotOptions: {
    radialBar: {
      offsetY: 0,
      startAngle: 0,
      endAngle: 270,
      hollow: {
        margin: 8,
        size: '33%',
        background: 'transparent',
        image: undefined,
      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          show: false,
        }
      },
      barLabels: {
        enabled: true,
        useSeriesColors: true,
        offsetX: -8,
        fontSize: '16px',
        formatter: function(seriesName: string, opts: any) {
          return labels.value[opts.seriesIndex] + ':  ' + (amounts.value[opts.seriesIndex] || 0) + '$';
        },
      },
    }
  },
  responsive: [{
    breakpoint: 480,
    options: {
      legend: {
        show: false
      }
    }
  }]
};

const getStatsData = async () => {
  isLoading.value = true;

  const { data } = await DashboardService.getTopAgentsGraphData(props.type, year.value.value, month.value.value);

  // Get max value of data total_amount
  const maxValue = Math.max(...(data?.data?.map((item: any) => item.total_amount || 0)) || 0);

  labels.value = [];
  amounts.value = [];
  series.value = [];

  data?.data?.map((item: any) => {
    // Display name
    labels.value.push(item.display_name);

    // Total amount
    amounts.value.push(item.total_amount);

    // Percentage calculation based on max value
    series.value.push((item.total_amount / maxValue) * 100);
  });

  isLoading.value = false;
}

onMounted(async () => {
  // Set month & year
  month.value = await monthOptions.value[new Date().getMonth() + 1];
  year.value = yearOptions.value[0];

  await getStatsData();
})

</script>

<style scoped lang="scss">
.header-table {
  .select-container {
    width: 50%;
  }

  @media screen and (max-width: 1440px) {
    .select-container {
      width: 80%;
    }
  }

  @media screen and (max-width: 768px) {
    .select-container {
      width: 50%;
    }
  }

  @media screen and (max-width: 425px) {
    .select-container {
      width: 100%;
    }
  }
}
</style>
