<template>
  <div>
    <div class="q-pb-lg flex row justify-between">
      <h5 class="q-ma-none">{{ $t('setting.opportunity') }} {{ $t('setting.states') }}</h5>
      <q-btn color="primary" icon="mdi-plus-circle-outline" :ripple="false" @click="openDialogSave(false)">{{ $t('setting.addState') }}</q-btn>
    </div>

    <div>
      <q-table
        hide-bottom
        row-key="name"
        :rows="opportunityStatesList"
        :columns="columns"
      >
        <template v-slot:body-cell-color="props">
          <q-td :props="props">
            <div class="color-box" :style="{ backgroundColor: props.row.color }"></div>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="actions">
            <q-btn dense round flat color="grey" icon="mdi-square-edit-outline" @click="openDialogSave(true, props.row)"></q-btn>
            <q-btn dense round flat color="grey" icon="mdi-trash-can-outline" @click="deleteOpportunityState(props.row.id)"></q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog
        v-model="dialogSave"
        full-height
        position="right"
        square
        maximized
    >
      <q-card class="dialog-card">
        <div class="q-pa-lg flex items-center dialog-title">
          <h6 class="text-h6 q-ma-none">{{ formModeEdit ? $t('setting.editState') : $t('setting.addState') }}</h6>
          <q-space />
          <q-icon name="close" size="sm" class="cursor-pointer" @click="dialogSave = false" />
        </div>
        <q-separator />
        <div class="q-pa-lg">
            <state-form-component
              ref="formData"
              :is-edit="formModeEdit"
              :form-details="opportunityStateDetails"
            />
            <q-btn :loading="isLoadingSave" color="primary" class="full-width text-capitalize" @click="saveOpportunityState">{{ $t('global.save') }}</q-btn>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
// Interfaces
import type { AppConfigInterface } from 'src/interfaces/app.interface';
// Services
import OpportunitiesService from 'src/services/opportunities.service';
// Components
import StateFormComponent from 'components/SettingComponents/Forms/StateFormComponent.vue';

const { t } = useI18n();

const columns = [
  { name: 'name', label: t('global.name'), field: 'name', align: 'left' },
  { name: 'color', label: t('global.color'), field: 'color', align: 'center' },
  { name: 'actions', label: t('global.actions'), field: '', align: 'right' },
]

const dialogSave = ref(false);
const isLoadingSave = ref(false);

const formModeEdit = ref(false);
const opportunityStateDetails = ref<AppConfigInterface>({
  id: '',
  name: '',
  color: '',
});

const formData = ref<typeof StateFormComponent | null>(null);
const opportunityStatesList = ref([]);

/**
 *
 */
const validateForm = async () => {
  return await formData.value?.validateForm();
}

/**
 *
 */
const getOpportunityStates = async () => {
  const { data } = await OpportunitiesService.getOpportunityStates();

  if (data) {
    opportunityStatesList.value = data?.data;
  }
}

/**
 *
 */
const saveOpportunityState = async () => {
  isLoadingSave.value = true;

  if (await validateForm()) {
    const payload = formData.value?.formData.form;

    if (formModeEdit.value) {
      await OpportunitiesService.updateOpportunityState(opportunityStateDetails.value.id, payload);
    } else {
      await OpportunitiesService.createOpportunityState(payload);
    }

    await getOpportunityStates();
    dialogSave.value = false;
  }

  isLoadingSave.value = false;
}

/**
 *
 */
const deleteOpportunityState = async (typeId: string) => {
  await OpportunitiesService.deleteOpportunityState(typeId);
  await getOpportunityStates();
}

/**
 *
 */
const openDialogSave = (modeEdit: boolean, details?: AppConfigInterface) => {
  formModeEdit.value = modeEdit;

  if (details) {
    opportunityStateDetails.value = details;
  }

  dialogSave.value = true;
}

onMounted(async () => {
  await getOpportunityStates();
});
</script>

<style scoped lang="scss">
.color-box {
  width: 20px;
  height: 20px;
  border-radius: 50px;
  display: inline-block;
}
</style>
