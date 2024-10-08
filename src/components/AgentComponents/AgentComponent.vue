<template>
  <div>
    <q-card>
      <div class="q-px-md q-py-lg">
        <div class="row">
          <div class="col-sm-6 col-12 q-py-xs">
            <q-input
              outlined
              dense
              v-model="searchText"
              debounce="1000"
              :placeholder="$t('global.search')"
              @update:modelValue="searchAgent"
            ><template v-slot:prepend><q-icon name="mdi-magnify" /></template></q-input>
          </div>
          <div class="col-sm-6 col-12 flex justify-end gap-sm q-py-xs">
            <q-btn :loading="isLoadingExport" color="grey-12" icon="mdi-database-export-outline" class="q-px-lg shadow-0 text-grey" :ripple="false" @click="exportAgents">{{ $t('global.export') }}</q-btn>
            <q-btn color="primary" icon="mdi-plus" class="q-px-lg" :ripple="false" @click="openDialogSave(false)">{{ $t('agent.addAgent') }}</q-btn>
          </div>
        </div>
      </div>
      <q-table
        row-key="name"
        :rows="agentList"
        :columns="columns"
        :loading="loadingTable"
        :rows-per-page-options="[0]"
        v-model:pagination="paginationRef"
        @request="onRequestPagination"
      >
        <template v-slot:body-cell-display_name="props">
          <q-td :props="props">
            <div class="flex no-wrap items-center gap-sm">
              <q-avatar size="40px" color="white" text-color="white"><img :src="props.row.avatar" alt=""></q-avatar>
              {{ props.row.display_name }}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-total_rent_commissions="props">
          <q-td :props="props">{{ props.row.total_rent_commissions }}$</q-td>
        </template>
        <template v-slot:body-cell-total_sales_commissions="props">
          <q-td :props="props">{{ props.row.total_sales_commissions }}$</q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="actions">
            <q-btn dense round flat color="grey" icon="mdi-eye-outline" @click="openAgentDetails(props.row.id)"></q-btn>
            <q-btn dense round flat color="grey" icon="mdi-square-edit-outline" @click="openDialogSave(true, props.row.id)"></q-btn>
            <q-btn dense round flat color="grey" icon="mdi-trash-can-outline" @click="openDialogDelete(props.row.id)"></q-btn>
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

    <q-dialog
      v-model="agentFormDialog"
      full-height
      position="right"
      square
      maximized
    >
      <q-card class="dialog-card">
        <div class="q-px-lg q-py-md flex items-center dialog-title">
          <h6 class="text-h6 q-ma-none">{{ formModeEdit ? $t('agent.editAgent') : $t('agent.addAgent') }}</h6>
          <q-space />
          <q-icon name="close" size="sm" class="cursor-pointer" @click="agentFormDialog = false" />
        </div>
        <q-separator />
        <div class="q-px-lg q-py-md">
          <agent-form-component
            ref="formData"
            :is-edit="formModeEdit"
          />
          <q-btn :loading="isLoadingSave" color="primary" class="full-width text-capitalize q-mt-md" @click="saveAgent">{{ $t('global.save') }}</q-btn>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="deleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div class="flex no-wrap items-center gap-sm">
            <q-icon size="md" name="mdi-delete-outline" color="negative" />
            <span>{{ $t('global.deleteMessage') }}</span>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn outline :label="$t('global.cancel')" color="primary" class="no-box-shadow" :ripple="false" @click="deleteDialog = false" />
          <q-btn :loading="isLoadingDelete" :label="$t('global.accept')" color="primary" class="no-box-shadow" :ripple="false" @click="deleteAgent" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { AxiosResponse } from 'axios';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
// Services
import AgentsService from 'src/services/agents.service';
// Store
import { useAgentStore } from 'src/stores/agent.store';
// Components
import AgentFormComponent from 'components/AgentComponents/AgentFormComponent.vue';
// Constants
import { ROWS_PER_PAGE } from 'src/constants/global.constant';

const { t } = useI18n();
const $q = useQuasar();
const router = useRouter();
const agentStore = useAgentStore();

const columns = [
  { name: 'display_name', label: t('agent.name'), field: 'name', align: 'left' },
  { name: 'email', label: t('agent.email'), field: 'email', align: 'left' },
  { name: 'total_rent_commissions', label: t('agent.rentalCommissions'), field: 'total_rent_commissions', align: 'center' },
  { name: 'total_sales_commissions', label: t('agent.salesCommissions'), field: 'total_sales_commissions', align: 'center' },
  { name: 'actions', label: t('global.actions'), field: '', align: 'right' },
]

const paginationRef = ref({
  page: 1,
  rowsPerPage: ROWS_PER_PAGE,
  rowsNumber: 0,
});

const searchText = ref('');

const agentFormDialog = ref(false);
const deleteDialog = ref(false);

const loadingTable = ref(false);
const isLoadingSave = ref(false);
const isLoadingDelete = ref(false);
const isLoadingExport = ref(false);

const formModeEdit = ref(false);
const formData = ref<typeof AgentFormComponent | null>(null);

const agentList = ref([]);

const agentId = computed(() => agentStore.getAgentId);
/**
 *
 */
const getAgents = async (isPagination = false) => {
  loadingTable.value = true;

  if (!isPagination) {
    paginationRef.value.page = 1;
  }

  const { data } = await AgentsService.getAgents(searchText.value, paginationRef.value.page);
  agentList.value = data?.data?.items || [];
  paginationRef.value.rowsNumber = data?.data?.total || 0;

  loadingTable.value = false;
}

/**
 *
 */
const searchAgent = async (value: string) => {
  searchText.value = value;
  await getAgents();
}

/**
 *
 */
const onRequestPagination = async ({ pagination }: any) => {
  paginationRef.value.page = pagination.page  || 1;

  await getAgents(true);
}

/**
 *
 */
const openAgentDetails = (id: string) => {
  agentStore.setAgentId(id);
  router.push({ name: 'agentDetails', params: { id: agentId.value } });
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
const saveAgent = async () => {
  isLoadingSave.value = true;

  if (await validateForm()) {
    const payload = new FormData();
    payload.append('email', formData.value?.formData.form.email);
    payload.append('first_name', formData.value?.formData.form.first_name);
    payload.append('last_name', formData.value?.formData.form.last_name);

    if (formData.value?.formData.form.image) {
      payload.append('image', formData.value?.formData.form.image);
    }

    if (formModeEdit.value) {
      try {
        await AgentsService.updateAgent(agentId.value, payload);
        $q.notify({ message: t('global.successUpdateMessage'), color: 'green', position: 'bottom' });
      } catch (error) {
        $q.notify({ message: t('global.errorMessage'), color: 'red', position: 'bottom' });
      }
    } else {
      payload.append('username', formData.value?.formData.form.username);
      payload.append('password', formData.value?.formData.form.password);

      try {
        await AgentsService.createAgent(payload);
        $q.notify({ message: t('global.successCreateMessage'), color: 'green', position: 'bottom' });
      } catch (error) {
        $q.notify({ message: t('global.errorMessage'), color: 'red', position: 'bottom' });
      }
    }

    await getAgents();
    agentFormDialog.value = false;
  }

  isLoadingSave.value = false;
}

/**
 *
 */
const deleteAgent = async () => {
  try {
    await AgentsService.deleteAgent(agentId.value);
    $q.notify({ message: t('global.successDeleteMessage'), color: 'green', position: 'bottom' });
  } catch (error) {
    $q.notify({ message: t('global.errorMessage'), color: 'red', position: 'bottom' });
  }

  deleteDialog.value = false;
  await getAgents();
}

/**
 *
 */
const exportAgents = async () => {
  isLoadingExport.value = true;

  const response: AxiosResponse<Blob> = await AgentsService.getAgentsExport({
    search: searchText.value,
  });

  const fileBlob = response.data;
  const fileUrl = URL.createObjectURL(fileBlob);
  const downloadLink = document.createElement('a');
  downloadLink.href = fileUrl;
  downloadLink.download = 'agents';
  downloadLink.click();

  URL.revokeObjectURL(fileUrl);

  isLoadingExport.value = false;
}

/**
 *
 */
const openDialogSave = (modeEdit: boolean, agentId?: string) => {
  formModeEdit.value = modeEdit;

  if (agentId)
    agentStore.setAgentId(agentId);

  agentFormDialog.value = true;
}

/**
 *
 */
const openDialogDelete = (agentId: string) => {
  if (agentId)
    agentStore.setAgentId(agentId);

  deleteDialog.value = true;
}

onMounted(async () => {
  await getAgents();
})
</script>

<style scoped lang="scss">

</style>
