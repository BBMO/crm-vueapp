<template>
  <div>
    <q-card class="opportunity-container">
      <div class="q-px-md q-py-md filters-section">
        <q-expansion-item default-opened>
          <template v-slot:header>
            <div class="flex items-center gap-xs">
              <q-icon size="sm" name="mdi-filter-multiple" />
              <h6 class="q-ma-none text-weight-medium">{{ $t('global.filters') }}</h6>
            </div>
          </template>
          <q-card>
            <q-card-section class="q-px-none q-py-sm">
              <div class="row">
                <div class="col-sm-4 col-12 q-pa-sm">
                  <label>{{ $t('opportunity.form.state') }}</label>
                  <q-select
                    outlined
                    dense
                    v-model="filters.state"
                    option-label="name"
                    option-value="id"
                    :options="opportunityStatesSelect"
                  ></q-select>
                </div>
                <div class="col-sm-4 col-12 q-pa-sm">
                  <label>{{ $t('opportunity.complete') }}</label>
                  <q-select
                    outlined
                    dense
                    v-model="filters.finished"
                    option-label="label"
                    option-value="value"
                    :options="finishedSelect"
                  ></q-select>
                </div>
                <div class="col-sm-4 col-12 q-pa-sm">
                  <label>{{ $t('property.form.agent') }}</label>
                  <q-select
                    outlined
                    dense
                    v-model="filters.agent"
                    use-input
                    hide-selected
                    fill-input
                    input-debounce="1000"
                    option-label="name"
                    option-value="id"
                    :options="agentsSelect"
                    :disable="!getIsAdmin()"
                    @filter="filterAgentSelect"
                  >
                    <template v-slot:prepend><q-icon name="mdi-account-outline" /></template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">{{ $t('global.noResults') }}</q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
              </div>
              <div class="flex justify-end gap-sm q-px-sm q-mt-md">
                <q-btn outline color="negative" class="no-box-shadow" :ripple="false" @click="clearFilters">{{ $t('global.cleanFilters') }}</q-btn>
                <q-btn outline color="primary" icon="mdi-magnify" class="no-box-shadow" :ripple="false" @click="applyFilters">{{ $t('global.searchFilters') }}</q-btn>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>
      <q-separator />
      <div class="q-px-md q-py-lg flex justify-end gap-md">
        <q-btn :loading="isLoadingExport" color="grey-12" icon="mdi-database-export-outline" class="q-px-lg shadow-0 text-grey" :ripple="false" @click="exportOpportunities">{{ $t('global.export') }}</q-btn>
        <q-btn color="primary" icon="mdi-plus" class="q-px-lg" :ripple="false" @click="openDialogSave(false)">{{ $t('opportunity.addOpportunity') }}</q-btn>
      </div>
      <q-table
        row-key="name"
        :rows="opportunityList"
        :columns="columns"
        :loading="loadingTable"
        :rows-per-page-options="[0]"
        v-model:pagination="paginationRef"
        @request="onRequestPagination"
      >
        <template v-slot:body="props">
          <q-tr :props="props" :class="{ disabled: props.row.finished_at !== null }">
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
                    :style="{ background: props.row.purpose === GLOBAL.SALE ? 'cyan' : 'indigo' }"
                  ></span>
                  <q-icon
                    size="xs"
                    :name="props.row.purpose === GLOBAL.SALE ? 'mdi-account-cash-outline' : 'mdi-account-key-outline'"
                    :color="props.row.purpose === GLOBAL.SALE ? 'cyan' : 'indigo'"
                  />
                </span>
                {{ props.row.purpose === GLOBAL.SALE ? t('property.sale') : t('property.rental') }}
              </span>
            </q-td>
            <q-td>{{ props.row.amount }}$</q-td>
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
              <q-toggle v-model="props.row.finished" color="primary" @update:modelValue="openDialogFinished(props.row)" />
            </q-td>
            <q-td class="text-right actions">
              <q-btn dense round flat color="grey" icon="mdi-square-edit-outline" @click="openDialogSave(true, props.row)"></q-btn>
              <q-btn dense round flat color="grey" icon="mdi-trash-can-outline" @click="openDialogDelete(props.row.id)"></q-btn>
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

    <q-dialog
      v-model="opportunityFormDialog"
      full-height
      position="right"
      square
      maximized
    >
      <q-card class="dialog-card">
        <div class="q-px-lg q-py-md flex items-center dialog-title">
          <h6 class="text-h6 q-ma-none">{{ formModeEdit ? $t('opportunity.editOpportunity') : $t('opportunity.addOpportunity') }}</h6>
          <q-space />
          <q-icon name="close" size="sm" class="cursor-pointer" @click="opportunityFormDialog = false" />
        </div>
        <q-separator />
        <div class="q-pa-lg">
          <opportunity-form-component
            ref="formData"
            :is-edit="formModeEdit"
            :form-details="opportunityDetails"
          />
          <q-btn :loading="isLoadingSave" color="primary" class="full-width text-capitalize q-mt-md" @click="saveOpportunity">{{ $t('global.save') }}</q-btn>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="opportunityFinishedDialog"
      persistent
    >
      <q-card>
        <q-card-section class="row items-center">
          <div class="flex no-wrap gap-sm">
            <q-icon size="md" name="mdi-lock-alert" color="negative" />
            <span class="q-ml-sm">{{ $t('opportunity.messageConfirmationFinished') }}</span>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
            <q-btn outline :label="$t('global.cancel')" color="primary" :ripple="false" @click="cancelDialogFinished" />
            <q-btn :loading="isLoadingFinished" :label="$t('global.accept')" color="primary" :ripple="false" @click="updateFinished" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="deleteDialog"
      persistent
    >
      <q-card>
        <q-card-section class="row items-center">
          <div class="flex no-wrap items-center gap-sm">
            <q-icon size="md" name="mdi-delete-outline" color="negative" />
            <span>{{ $t('global.deleteMessage') }}</span>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn outline :label="$t('global.cancel')" color="primary" class="no-box-shadow" :ripple="false" @click="deleteDialog = false" />
          <q-btn :loading="isLoadingDelete" :label="$t('global.accept')" color="primary" class="no-box-shadow" :ripple="false" @click="deleteOpportunity" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import {onMounted, Ref, ref} from 'vue';
import type { AxiosResponse } from 'axios';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
// Interfaces
import type { OpportunityDetailsInterface } from 'src/interfaces/opportunity.interface';
import type { CommonSelectInterface } from 'src/interfaces/app.interface';
// Composable
import useRole from 'src/composable/useRole';
// Constants
import { GLOBAL, ROWS_PER_PAGE } from 'src/constants/global.constant';
// Store
import { useOpportunityStore } from 'src/stores/opportunity.store';
// Services
import OpportunitiesService from 'src/services/opportunities.service';
import AgentsService from 'src/services/agents.service';
// Components
import OpportunityFormComponent from 'components/OpportunityComponents/OpportunityFormComponent.vue';

const { t } = useI18n();
const $q = useQuasar();
const { getIsAdmin } = useRole();
const opportunityStore = useOpportunityStore();

const columns = [
  { name: 'contact', label: t('opportunity.form.contact'), field: 'contact', align: 'left' },
  { name: 'property', label: t('opportunity.form.property'), field: 'property', align: 'left' },
  { name: 'available_for', label: t('opportunity.form.availableFor'), field: 'available_for', align: 'left' },
  { name: 'amount', label: t('opportunity.form.amount'), field: 'amount', align: 'left' },
  { name: 'state', label: t('opportunity.form.state'), field: 'state', align: 'left' },
  { name: 'finished', label: t('opportunity.complete'), field: '', align: 'center' },
  { name: 'actions', label: t('global.actions'), field: '', align: 'right' },
]

const finishedSelect = [
  { label: t('global.finished'), value: '1' },
  { label: t('global.notFinished'), value: '0' },
  { label: t('global.all'), value: '' },
]

const filters = ref({
  state: {
    id: '',
    name: ''
  },
  agent: {
    id: '',
    name: ''
  },
  finished: {
    label: '',
    value: ''
  },
  page: 1
});

const paginationRef = ref({
  page: 1,
  rowsPerPage: ROWS_PER_PAGE,
  rowsNumber: 0,
});

const payloadFilters = ref<any>({});

const loadingTable = ref(false);
const isLoadingSave = ref(false);
const isLoadingFinished = ref(false);
const isLoadingDelete = ref(false);
const isLoadingExport = ref(false);

const opportunityFormDialog = ref(false);
const opportunityFinishedDialog = ref(false);
const deleteDialog = ref(false);

const formModeEdit = ref(false);
const opportunityDetails = ref<OpportunityDetailsInterface | null>(null);
const formData = ref<typeof OpportunityFormComponent | null>(null);
const opportunityList = ref<OpportunityDetailsInterface[]>([]);

const opportunityId = ref('');
const opportunityFinished = ref(false);

const opportunityStatesSelect = ref<CommonSelectInterface[]>([]);
const agentsSelect: Ref<CommonSelectInterface[]> = ref([]);

/**
 *
 */
const getSelectsData = async () => {
  const { data: opportunityStatesData } = await OpportunitiesService.getOpportunityStates();
  opportunityStatesSelect.value = opportunityStatesData?.data?.map((item: any) => ({
    id: item.id,
    name: item.name
  })) || [];

  const { data: agentsData } = await AgentsService.getAgents();
  agentsSelect.value = agentsData?.data?.items.map((agent: any) => ({
    id: agent.id,
    name: agent.display_name,
  })) || [];
};

/**
 *
 */
const getOpportunities = async (isPagination = false) => {
  loadingTable.value = true;

  if (!isPagination) {
    filters.value.page = 1;
    paginationRef.value.page = 1;
  }

  payloadFilters.value = {
    state_id: filters.value.state.id,
    agent_id: filters.value.agent.id,
    page: filters.value.page
  };

  if (filters.value.finished.value) {
    payloadFilters.value.finished = filters.value.finished.value === '1';
  }

  const { data } = await OpportunitiesService.getOpportunities(payloadFilters.value);
  opportunityList.value = data?.data?.items?.map((item: any) => ({
    ...item,
    finished: item.finished_at !== null
  })) || [];
  paginationRef.value.rowsNumber = data?.data?.total || 0;

  loadingTable.value = false;
}

/**
 *
 */
const applyFilters = async () => {
  await getOpportunities();
}

/**
 *
 */
const filterAgentSelect = (value: string, update: any) => {
  update( async () => {
    const { data } = await AgentsService.getAgents(value);
    agentsSelect.value = data?.data?.items.map((agent: any) => ({
      id: agent.id,
      name: agent.display_name,
    })) || [];
  })
}

/**
 *
 */
const clearFilters = () => {
  filters.value = {
    state: {
      id: '',
      name: ''
    },
    agent: {
      id: '',
      name: ''
    },
    finished: {
      label: '',
      value: '',
    },
    page: 1
  };

  payloadFilters.value = {};
  paginationRef.value.page = 1;
  getOpportunities();
}

/**
 *
 */
const onRequestPagination = async ({ pagination }: any) => {
  paginationRef.value.page = pagination.page  || 1;
  filters.value.page = pagination.page;

  await getOpportunities(true);
}

/**
 *
 */
const validateForm = async () => {
  return await formData.value?.validateForm();
}

/**
 *
 */
const saveOpportunity = async () => {
  isLoadingSave.value = true;

  if (await validateForm()) {
    const payload = {
      contact_id: formData.value?.formData.form.contact_id.id,
      property_id: formData.value?.formData.form.property_id.id,
      amount: formData.value?.formData.form.amount,
      state_id: formData.value?.formData.form.state_id.id,
      agent_id: formData.value?.formData.form.agent_id.id,
    }

    if (formModeEdit.value && opportunityDetails.value) {
      const opportunityId = opportunityDetails.value.id;

      try {
        await OpportunitiesService.updateOpportunity(opportunityId, payload);
        $q.notify({ message: t('global.successUpdateMessage'), color: 'green', position: 'bottom' });
      } catch (error) {
        $q.notify({ message: t('global.errorMessage'), color: 'red', position: 'bottom' });
      }
    } else {
      try {
        await OpportunitiesService.createOpportunity(payload);
        $q.notify({ message: t('global.successCreateMessage'), color: 'green', position: 'bottom' });
      } catch (error) {
        $q.notify({ message: t('global.errorMessage'), color: 'red', position: 'bottom' });
      }
    }
  }

  isLoadingSave.value = false;
  opportunityFormDialog.value = false;

  await opportunityStore.fetchOpportunityStats(t);
  await getOpportunities();
}

/**
 *
 */
const deleteOpportunity = async () => {
  try {
    await OpportunitiesService.deleteOpportunity(opportunityId.value);
    $q.notify({ message: t('global.successDeleteMessage'), color: 'green', position: 'bottom' });
  } catch (error) {
    $q.notify({ message: t('global.errorMessage'), color: 'red', position: 'bottom' });
  }

  await opportunityStore.fetchOpportunityStats(t);
  deleteDialog.value = false;
  await getOpportunities();
}

/**
 *
 */
const exportOpportunities = async () => {
  isLoadingExport.value = true;

  const payloadFilters: any = {
    state_id: filters.value.state.id,
    agent_id: filters.value.agent.id,
  };

  if (filters.value.finished.value) {
    payloadFilters.finished = filters.value.finished.value === '1';
  }

  const response: AxiosResponse<Blob> = await OpportunitiesService.getOpportunitiesExport(payloadFilters.value);

  const fileBlob = response.data;
  const fileUrl = URL.createObjectURL(fileBlob);
  const downloadLink = document.createElement('a');
  downloadLink.href = fileUrl;
  downloadLink.download = 'opportunities';
  downloadLink.click();

  URL.revokeObjectURL(fileUrl);

  isLoadingExport.value = false;
}

/**
 *
 */
const openDialogSave = (modeEdit: boolean, details?: OpportunityDetailsInterface) => {
  formModeEdit.value = modeEdit;

  if (details) { opportunityDetails.value = details; }

  opportunityFormDialog.value = true;
}

/**
 *
 */
const updateFinished = async () => {
  isLoadingFinished.value = true;

  const payload = {
    finished: opportunityFinished.value
  }

  try {
    await OpportunitiesService.updateOpportunity(opportunityId.value, payload);
    $q.notify({ message: t('global.successUpdateMessage'), color: 'green', position: 'bottom' });
  } catch (error) {
    $q.notify({ message: t('global.errorMessage'), color: 'red', position: 'bottom' });
  }

  await opportunityStore.fetchOpportunityStats(t);
  await getOpportunities();
  isLoadingFinished.value = false;
  opportunityFinishedDialog.value = false;
}

/**
 *
 */
const openDialogFinished = (opportunity: OpportunityDetailsInterface) => {
  opportunityFinishedDialog.value = true;
  opportunityId.value = opportunity.id;
  opportunityFinished.value = opportunity.finished ?? false;
}

/**
 *
 */
const cancelDialogFinished = () => {
  opportunityFinishedDialog.value = false;

  opportunityList.value = opportunityList.value.map((item) => {
    if (item.id === opportunityId.value) {
      item.finished = !opportunityFinished.value;
    }

    return item;
  });
}

/**
 *
 */
const openDialogDelete = (id: string) => {
  opportunityId.value = id;
  deleteDialog.value = true;
}

onMounted(async () => {
  await getOpportunities();
  await getSelectsData();
})
</script>

<style scoped lang="scss">
.opportunity-container {
  .filters-section {
    :deep(.q-item) {
      display: flex;
      justify-content: space-between;
      padding: 0;
    }

    :deep(.q-item .q-focus-helper) {
      display: none;
    }

    :deep(.q-item .q-item__section) {
      padding: 0;
    }
  }

  .q-table {
    .disabled {
      :deep(.q-toggle), :deep(.q-btn) {
        pointer-events: none;
      }
    }
  }
}
</style>
