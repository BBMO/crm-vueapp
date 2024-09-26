<template>
  <q-card class="full-width">
    <div class="q-pa-md flex items-center gap-sm">
      <h6 class="text-subtitle1 q-ma-none text-weight-medium">{{ $t('agent.opportunities') }}</h6>
    </div>
    <q-table
      row-key="name"
      :rows="opportunityList"
      :columns="columns"
      :loading="loadingTable"
      :hide-pagination="true"
      :rows-per-page-options="[0]"
    >
      <template v-slot:body="props">
        <q-tr :props="props" class="disabled">
          <q-td>
            <p class="q-ma-none text-capitalize">{{ props.row.contact.first_name }} {{ props.row.contact.last_name }}</p>
            <p class="text-caption text-grey q-ma-none">{{ $t('opportunity.form.agent')}}: {{ props.row.agent.name }}</p>
          </q-td>
          <q-td>{{ props.row.property.title }}</q-td>
          <q-td>
            <span class="flex items-center gap-xs text-capitalize">
              <span class="relative-position flex items-center justify-center" style="width: 30px; height: 30px;">
                <span
                  class="absolute full-width full-height border-radius"
                  style="top: 0; left: 0; opacity: 0.2;"
                  :style="{ background: props.row.property.available_for === GLOBAL.SALE ? 'cyan' : 'indigo' }"
                ></span>
                <q-icon
                  size="xs"
                  :name="props.row.property.available_for === GLOBAL.SALE ? 'mdi-account-cash-outline' : 'mdi-account-key-outline'"
                  :color="props.row.property.available_for === GLOBAL.SALE ? 'cyan' : 'indigo'"
                />
              </span>
              {{ props.row.property.available_for === GLOBAL.SALE ? t('property.sale') : t('property.rental') }}
            </span>
          </q-td>
          <q-td>${{ props.row.amount }}</q-td>
          <q-td>
            <span class="relative-position q-pa-xs">
              <span
                class="absolute full-width full-height"
                style="top: 0; left: 0; opacity: 0.1; border-radius: 6px;"
                :style="{ background: props.row.state.color }"
              ></span>
              <span class="q-pa-sm text-weight-medium" :style="{ color: props.row.state.color }"> {{ props.row.state.name }} </span>
            </span>
          </q-td>
          <q-td class="text-center">
            <q-toggle v-model="props.row.finished" color="primary"/>
          </q-td>
        </q-tr>
      </template>
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>
      <template v-slot:no-data>
        <div class="full-width flex column items-center q-my-md">
          <q-icon size="md" name="mdi-alert" color="grey" />
          <p class="text-weight-medium q-ma-none q-py-xs text-grey">{{ $t('global.noDataAvailable') }}</p>
        </div>
      </template>
    </q-table>
  </q-card>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
// Constants
import { GLOBAL } from 'src/constants/global.constant';
// Store
import { useAgentStore } from 'stores/agent.store';
// Services
import AgentService from 'src/services/agents.service';

const { t } = useI18n();
const agentStore = useAgentStore();

const columns = [
  { name: 'contact', label: t('opportunity.form.contact'), field: 'contact', align: 'left' },
  { name: 'property', label: t('opportunity.form.property'), field: 'property', align: 'left' },
  { name: 'available_for', label: t('opportunity.form.availableFor'), field: 'available_for', align: 'left' },
  { name: 'amount', label: t('opportunity.form.amount'), field: 'amount', align: 'left' },
  { name: 'state', label: t('opportunity.form.state'), field: 'state', align: 'left' },
  { name: 'finished', label: t('global.finished'), field: '', align: 'center' },
]

const loadingTable = ref(false);

const opportunityList = ref([]);

const agentId = computed(() => agentStore.getAgentId);
/**
 *
 */
const getOpportunities = async () => {
  loadingTable.value = true;

  const { data } = await AgentService.getAgentOpportunities(agentId.value);
  opportunityList.value = data?.data?.items?.map((item: any) => ({
    ...item,
    finished: item.finished_at !== null
  })) || [];

  loadingTable.value = false;
}

onMounted(() => {
  getOpportunities();
})
</script>

<style scoped lang="scss">
.q-table {
  .disabled {
    opacity: 1 !important;

    :deep(.q-toggle), :deep(.q-btn) {
      pointer-events: none;
    }
  }
}
</style>
