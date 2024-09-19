<template>
  <div>
    <q-card>
      <div class="q-px-md q-py-lg flex justify-end gap-md">
        <q-input
          outlined
          dense
          v-model="textSearch"
          :placeholder="$t('global.search')"
        ></q-input>
        <q-btn color="grey-12" icon="mdi-database-export-outline" class="q-px-lg shadow-0 text-grey" :ripple="false">{{ $t('global.export') }}</q-btn>
        <q-btn color="primary" icon="mdi-plus" class="q-px-lg" :ripple="false" @click="openDialogSave(false)">{{ $t('agent.addAgent') }}</q-btn>
      </div>
      <q-table
        hide-bottom
        row-key="name"
        :rows="agentList"
        :columns="columns"
        :hide-pagination="true"
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-display_name="props">
          <q-td :props="props">
            <div class="flex items-center gap-sm">
              <q-avatar size="40px" color="primary" text-color="white"><img src="https://demos.themeselection.com/sneat-vuetify-vuejs-admin-template/demo-1/assets/avatar-1-DL1ARROH.png" alt=""></q-avatar>
              {{ props.row.display_name }}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-user_email="props">
          <q-td :props="props">
            {{ props.row.user_email }}
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="actions">
            <q-btn dense round flat color="grey" icon="mdi-eye-outline" @click="openAgentDetails(props.row.ID)"></q-btn>
            <q-btn dense round flat color="grey" icon="mdi-square-edit-outline" @click="openDialogSave(true, props.row.ID)"></q-btn>
            <q-btn dense round flat color="grey" icon="mdi-trash-can-outline" @click="deleteAgent(props.row.ID)"></q-btn>
          </q-td>
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
        <div class="q-pa-lg flex items-center dialog-title">
          <h6 class="text-h6 q-ma-none">{{ formModeEdit ? $t('agent.editAgent') : $t('agent.addAgent') }}</h6>
          <q-space />
          <q-icon name="close" size="sm" class="cursor-pointer" @click="agentFormDialog = false" />
        </div>
        <q-separator />
        <div class="q-pa-lg">
          <agent-form-component
            ref="formData"
            :is-edit="formModeEdit"
          />
          <q-btn :loading="isLoadingSave" color="primary" class="full-width text-capitalize q-mt-lg" @click="saveAgent">{{ $t('global.save') }}</q-btn>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
// Services
import AgentsService from 'src/services/agents.service';
// Store
import { useAgentStore } from 'src/stores/agent.store';
// Components
import AgentFormComponent from 'components/AgentComponents/AgentFormComponent.vue';

const { t } = useI18n();
const router = useRouter();
const agentStore = useAgentStore();

const columns = [
  { name: 'display_name', label: t('agent.name'), field: 'name', align: 'left' },
  { name: 'user_email', label: t('global.email'), field: 'email', align: 'left' },
  { name: 'actions', label: t('global.actions'), field: '', align: 'right' },
]

const textSearch = ref('');

const agentFormDialog = ref(false);
const isLoadingSave = ref(false);
const formModeEdit = ref(false);

const formData = ref<typeof AgentFormComponent | null>(null);
const agentList = ref([]);

/**
 *
 */
const getAgents = async () => {
  const { data } = await AgentsService.getAgents();

  if (data) {
    agentList.value = data?.data?.items;
  }
}

/**
 *
 */
const openAgentDetails = (agentId: string) => {
  agentStore.setAgentId(agentId);
  router.push({ name: 'agentDetails', params: { id: agentId } });
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
    // TODO: Enviar en el formData la imagen del contacto

    const payload = new FormData();
    payload.append('username', formData.value?.formData.form.username);
    payload.append('email', formData.value?.formData.form.email);
    payload.append('password', formData.value?.formData.form.password);
    payload.append('first_name', formData.value?.formData.form.first_name);
    payload.append('last_name', formData.value?.formData.form.last_name);

    if (formModeEdit.value) {
      console.log('Update agent!!')
    } else {
      await AgentsService.createAgent(payload);
    }

    await getAgents();
    agentFormDialog.value = false;
  }

  isLoadingSave.value = false;
}

/**
 *
 */
const deleteAgent = async (agentId: string) => {
  await AgentsService.deleteAgent(agentId);
  await getAgents();
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

onMounted(async () => {
  await getAgents();
})
</script>

<style scoped lang="scss">

</style>
