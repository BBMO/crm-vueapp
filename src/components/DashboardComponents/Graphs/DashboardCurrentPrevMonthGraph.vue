<template>
  <div>
    <q-card class="full-width full-height q-py-md q-px-lg">
      <div class="row items-start header-table">
        <div class="col-sm-5 col-12 q-pa-xs">
          <h6 class="q-my-none">{{ props.title }}</h6>
        </div>
        <div class="col-sm-7 col-12 q-pa-xs flex justify-end">
          <div class="q-pa-xs select-container">
            <q-select
              outlined
              dense
              v-model="type"
              use-input
              hide-selected
              fill-input
              option-label="label"
              option-value="value"
              :options="typeOptions"
              @update:model-value="getStatsData"
            >
              <template v-slot:prepend><q-icon name="mdi-chart-timeline-variant" /></template>
            </q-select>
          </div>
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
        </div>
      </div>

      <VueApexCharts
        v-if="series.length"
        type="line"
        height="320"
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
      <div class="text-grey-14 q-mt-md">* {{ $t('stats.topAgentsDesc') }}</div>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
// Constants
import { GLOBAL, MONTHS } from 'src/constants/global.constant';
// Services
import DashboardService from 'src/services/dashboard.service';

interface Props {
  title: any,
}
const props = defineProps<Props>();

const { t } = useI18n();

const monthOptions = ref<any>(
  MONTHS.map((month: any) => {
    return {
      ...month,
      label: t(`months.${month.label}`),
    }
  })
)

const typeOptions = ref<any>([
  { value: GLOBAL.SALE, label: t('stats.sales') },
  { value: GLOBAL.RENTAL, label: t('stats.rentals') },
]);

const series = ref<any>([]);
const month = ref<any>(null);
const type = ref<any>(null);
const isLoading = ref(false);

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
      enabledOnSeries: [0],
      color: '#000'
    }
  },
  grid: {
    show: true,
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
  },
  tooltip: {
    x: {
      formatter: function(value: any) {
        let date = new Date(value);

        return `${date.getUTCDate()} ${t(`months.abbr.number.${month.value.value}`)} vs ${t(`months.abbr.number.${(month.value.value === 1) ? 12 : month.value.value - 1}`)}`;
      }
    },
    y: {
      formatter: function(value: any) {
        return `${value}$`;
      }
    }
  }
};

const getStatsData = async () => {
  isLoading.value = true;

  const { data } = await DashboardService.getTopCurrentPrevMonthGraphData(type.value.value, month.value.value);

  series.value = [];

  // Format current_month from prop series
  const dataCurrentMonth = data?.data?.current_month?.map((item: any) => {
    return { x: item.date, y: item.amount };
  });

  if (dataCurrentMonth && dataCurrentMonth.length) {
    series.value.push({
      name: t(`months.number.${month.value.value}`),
      data: dataCurrentMonth,
    });
  }

  // Format last_month from prop series
  const dataPreviousMonth = data?.data?.last_month?.map((item: any) => {
    return { x: item.date, y: item.amount };
  });

  if (dataPreviousMonth && dataPreviousMonth.length) {
    series.value.push({
      name: t(`months.number.${(month.value.value === 1) ? 12 : month.value.value - 1}`),
      data: dataPreviousMonth,
      opacity: 0.3  // Lower opacity for previous month
    });
  }

  isLoading.value = false;
}

onMounted(async () => {
  // Set month
  month.value = await monthOptions.value[new Date().getMonth()];
  type.value = typeOptions.value[0];

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
