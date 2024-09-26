<template>
  <q-card class="full-width">
    <div class="q-pa-md flex items-center gap-sm">
      <h6 class="text-subtitle1 q-ma-none text-weight-medium">{{ $t('agent.managedProperties') }}</h6>
    </div>
    <q-table
      row-key="name"
      :rows="propertyList"
      :columns="columns"
      :loading="loadingTable"
      :hide-pagination="true"
      :rows-per-page-options="[0]"
    >
      <template v-slot:body-cell-title="props">
        <q-td :props="props">
          <div class="flex no-wrap items-center gap-sm">
            <q-avatar rounded size="40px" color="white" text-color="white">
              <img :src="props.row.images.length > 0 ? props.row.images[0].url : 'https://i.ibb.co/0Jmshvb/no-image.png'" alt="">
            </q-avatar>
            {{ props.row.title }}
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-type="props">
        <q-td :props="props">{{ props.row.type.name }}</q-td>
      </template>
      <template v-slot:body-cell-available_for="props">
        <q-td :props="props">
          <span class="flex items-center gap-xs text-capitalize">
            <span class="relative-position flex items-center justify-center" style="width: 30px; height: 30px;">
              <span
                class="absolute full-width full-height border-radius"
                style="top: 0; left: 0; opacity: 0.2;"
                :style="{ background: props.row.available_for === GLOBAL.SALE ? 'cyan' : 'indigo' }"
              ></span>
              <q-icon
                size="xs"
                :name="props.row.available_for === GLOBAL.SALE ? 'mdi-account-cash-outline' : 'mdi-account-key-outline'"
                :color="props.row.available_for === GLOBAL.SALE ? 'cyan' : 'indigo'"
              />
            </span>
            {{ props.row.available_for === GLOBAL.SALE ? t('property.sale') : t('property.rental') }}
          </span>
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <span class="relative-position q-pa-xs">
            <span
              class="absolute full-width full-height"
              style="top: 0; left: 0; opacity: 0.1; border-radius: 6px;"
              :style="{ background: props.row.status === GLOBAL.AVAILABLE ? 'green' : 'orange' }"
            ></span>
            <span class="q-pa-sm text-weight-medium" :style="{ color: props.row.status === GLOBAL.AVAILABLE ? 'green' : 'orange' }">
              {{ statusSelect.find(item => item.value === props.row.status)?.label }}
            </span>
          </span>
        </q-td>
      </template>
      <template v-slot:body-cell-price="props">
        <q-td :props="props">${{ props.row.price }}</q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="actions">
          <q-btn dense round flat color="grey" icon="mdi-open-in-new" @click="viewProperty(props.row.url)"></q-btn>
        </q-td>
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
  { name: 'title', label: t('property.title'), field: 'title', align: 'left' },
  { name: 'type', label: t('property.form.type'), field: 'type', align: 'left' },
  { name: 'available_for', label: t('property.form.availableFor'), field: 'available_for', align: 'left' },
  { name: 'status', label: t('property.form.status'), field: 'city', align: 'left' },
  { name: 'price', label: t('property.form.price'), field: 'price', align: 'left' },
  { name: 'actions', field: '', align: 'right' },
]

const statusSelect = [
  { label: t('property.available'), value: GLOBAL.AVAILABLE },
  { label: t('property.rented'), value: GLOBAL.RENTED },
  { label: t('property.sold'), value: GLOBAL.SOLD },
]

const loadingTable = ref(false);

const propertyList = ref([]);

const agentId = computed(() => agentStore.getAgentId);
/**
 *
 */
const getProperties = async () => {
  loadingTable.value = true;

  const { data } = await AgentService.getAgentProperties(agentId.value);
  propertyList.value = data?.data?.items || [];

  loadingTable.value = false;
}

/**
 *
 */
const viewProperty = (url: string) => {
  window.open(url, '_blank');
}

onMounted(() => {
  getProperties();
})
</script>

<style scoped lang="scss">

</style>
