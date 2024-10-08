<template>
  <div>
    <q-card class="full-width q-py-md q-px-lg q-pb-lg">
      <div class="flex justify-between items-center q-mb-sm no-wrap">
        <h6 class="q-my-none w-full q-py-md">{{ props.title }}</h6>
        <div class="flex gap-sm justify-end w-60">
          <q-select
            outlined
            dense
            v-model="year"
            use-input
            hide-selected
            fill-input
            class="w-45"
            option-label="label"
            option-value="value"
            :options="yearOptions"
            @update:model-value="getStatsData"
          >
            <template v-slot:prepend><q-icon name="mdi-chart-timeline-variant" /></template>
          </q-select>
        </div>
      </div>

      <VueApexCharts
        v-if="series.length"
        type="bar"
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
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
// Services
import DashboardService from 'src/services/dashboard.service';

interface Props {
  title: string,
}
const props = defineProps<Props>();

const { t } = useI18n();

const currentYear = new Date().getFullYear();

const yearOptions = ref<any>([
  { value: currentYear, label: currentYear },
  { value: currentYear - 1, label: currentYear - 1 },
  { value: currentYear - 2, label: currentYear - 2 },
]);

const series = ref<any>([]);

const year = ref<any>(null);
const isLoading = ref(false);

const chartOptions = {
  chart: {
    parentHeightOffset: 0,
    type: 'bar',
    stacked: 1,
    toolbar: {
      show: false
    },
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 0,
    lineCap: 'round',
    colors: ['#fff']
  },
  colors: ['#696cff', '#8592A3'],
  grid: {
    show: true,
    padding: {
      left: 8,
      top: -45,
      right: 6,
      bottom: 10
    }
  },
  plotOptions: {
    bar: {
      borderRadius: 7,
      columnWidth: '36%',
      borderRadiusApplication: 'around',
      borderRadiusWhenStacked: 'all'
    }
  },
  xaxis: {
    axisTicks: {
      show: false
    },
    crosshairs: {
      opacity: 0
    },
    axisBorder: {
      show: false
    },
    categories: [t('months.abbr.jan'), t('months.abbr.feb'), t('months.abbr.mar'), t('months.abbr.apr'), t('months.abbr.may'), t('months.abbr.jun'), t('months.abbr.jul'), t('months.abbr.aug'), t('months.abbr.sep'), t('months.abbr.oct'), t('months.abbr.nov'), t('months.abbr.dec')],
    labels: {
      style: {
        fontSize: '12px',
        colors: '#616161',
      }
    }
  },
  yaxis: {
    show: false
  },
  responsive: [{
    breakpoint: 1400,
    options: {
      plotOptions: {
        bar: {
          columnWidth: '45%'
        }
      }
    }
  }, {
    breakpoint: 1300,
    options: {
      plotOptions: {
        bar: {
          columnWidth: '45%'
        }
      }
    }
  }, {
    breakpoint: 992,
    options: {
      plotOptions: {
        bar: {
          columnWidth: '40%',
          borderRadius: 8
        }
      }
    }
  }, {
    breakpoint: 768,
    options: {
      plotOptions: {
        bar: {
          columnWidth: '48%'
        }
      }
    }
  }, {
    breakpoint: 700,
    options: {
      plotOptions: {
        bar: {
          columnWidth: '40%',
          borderRadius: 8
        }
      }
    }
  }, {
    breakpoint: 550,
    options: {
      plotOptions: {
        bar: {
          columnWidth: '40%'
        }
      }
    }
  }, {
    breakpoint: 400,
    options: {
      plotOptions: {
        bar: {
          columnWidth: '45%'
        }
      }
    }
  }, {
    breakpoint: 375,
    options: {
      plotOptions: {
        bar: {
          columnWidth: '50%'
        }
      }
    }
  }]
};

const getStatsData = async () => {
  isLoading.value = true;

  const { data } = await DashboardService.getSalesRentalsData(year.value.value);

  series.value = [
    {
      name: t('stats.sales'),
      data: Object.values(data?.data?.sale),
    },
    {
      name: t('stats.rentals'),
      data: Object.values(data?.data?.rent),
    }
  ];

  isLoading.value = false;
}

onMounted(async () => {
  // Set year
  year.value = yearOptions.value[0];

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
