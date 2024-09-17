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
            <q-btn dense round flat color="grey" icon="mdi-square-edit-outline" @click="openDialogSave(true, props.row)"></q-btn>
            <q-btn dense round flat color="grey" icon="mdi-trash-can-outline" @click="deleteContact(props.row.ID)"></q-btn>
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
          Formulario
          <q-btn :loading="isLoadingSave" color="primary" class="full-width text-capitalize" @click="saveAgent">{{ $t('global.save') }}</q-btn>
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
const saveAgent = () => {

}

/**
 *
 */
const deleteContact = async (agentId: string) => {
  console.log(agentId);
  await getAgents();
}

/**
 *
 */
const openDialogSave = (modeEdit: boolean, details?: any) => {
  formModeEdit.value = modeEdit;

  if (details) {
    console.log(details);
  }

  agentFormDialog.value = true;
}

onMounted(async () => {
  await getAgents();
})
</script>

<style scoped lang="scss">

</style>
