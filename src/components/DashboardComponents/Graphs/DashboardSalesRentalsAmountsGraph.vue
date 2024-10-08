<template>
  <div>
    <q-card class="full-width full-height q-py-md q-px-lg q-pb-lg">
      <div class="row items-start header-table">
        <div class="col-sm-5 col-12 q-pa-xs">
          <h6 class="q-my-none">{{ props.title }}</h6>
        </div>
        <div class="col-sm-7 col-12 q-pa-xs flex justify-end">
          <div class="q-pa-xs select-container">
            <q-select
              outlined
              dense
              v-model="agent"
              use-input
              hide-selected
              fill-input
              input-debounce="1000"
              option-label="name"
              option-value="id"
              :options="agentOptions"
              @filter="filterAgentSelect"
              @update:modelValue="getStatsData"
            >
              <template v-slot:prepend><q-icon name="mdi-account-outline" /></template>
              <template v-slot:append v-if="agent"><q-icon name="mdi-delete-outline" color="negative" class="cursor-pointer" @click="cleanSelectedAgent" /></template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">{{ $t('global.noResults') }}</q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
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
import AgentsService from 'src/services/agents.service';
import { GLOBAL } from 'src/constants/global.constant';

interface Props {
  title: string,
}
const props = defineProps<Props>();

const { t } = useI18n();

const currentYear = new Date().getFullYear();

const yearOptions = ref<any>([
  { value: null, label: t('global.all') },
  { value: currentYear, label: currentYear },
  { value: currentYear - 1, label: currentYear - 1 },
  { value: currentYear - 2, label: currentYear - 2 },
]);

const typeOptions = ref<any>([
  { value: GLOBAL.SALE, label: t('stats.sales') },
  { value: GLOBAL.RENTAL, label: t('stats.rentals') },
]);

const agentOptions = ref([]);

const series = ref<any>([]);

const year = ref<any>(null);
const agent = ref<any>(null);
const type = ref<any>(null);
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
    enabled: false,
  },
  colors: ['#696cff'],
  plotOptions: {
    bar: {
      borderRadius: 10,
      columnWidth: '50%',
      borderRadiusApplication: 'around',
      borderRadiusWhenStacked: 'all',
      dataLabels: {
        position: 'top', // top, center, bottom
      },
    }
  },
  xaxis: {
    axisTicks: {
      show: false
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
    },
    crosshairs: {
      fill: {
        type: 'gradient',
        gradient: {
          colorFrom: '#D8E3F0',
          colorTo: '#BED1E6',
          stops: [0, 100],
          opacityFrom: 0.4,
          opacityTo: 0.5,
        }
      }
    },
  },
  yaxis: {
    show: false
  },
};

const filterAgentSelect = (value: string, update: any) => {
  update( async () => {
    const { data } = await AgentsService.getAgents(value);
    agentOptions.value = data?.data?.items.map((agent: any) => ({
      id: agent.id,
      name: agent.display_name,
    })) || [];
  })
}

/**
 *
 */
const cleanSelectedAgent = () => {
  agent.value = null;
  getStatsData();
}

const getStatsData = async () => {
  isLoading.value = true;

  const { data } = await DashboardService.getSalesRentalsAmountsData(type.value.value, year.value.value, agent.value?.id || null);

  series.value = [
    {
      name: t('stats.sales'),
      data: Object.values(data?.data),
    },
  ];

  isLoading.value = false;
}

onMounted(async () => {
  // Set year (current year)
  year.value = yearOptions.value[1];
  type.value = typeOptions.value[0];

  await getStatsData();
})

</script>

<style scoped lang="scss">
.header-table {
  .select-container {
    width: 30%;
  }

  @media screen and (max-width: 1440px) {
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
