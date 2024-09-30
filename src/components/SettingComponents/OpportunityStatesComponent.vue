<template>
  <div>
    <div class="q-pb-lg flex row justify-between gap-sm">
      <h5 class="q-ma-none">{{ $t('setting.opportunity') }} {{ $t('setting.states') }}</h5>
      <q-btn color="primary" icon="mdi-plus-circle-outline" :ripple="false" @click="openDialogSave(false)">{{ $t('setting.addState') }}</q-btn>
    </div>
    <div>
      <q-table
        row-key="name"
        :rows="opportunityStatesList"
        :columns="columns"
        :loading="loadingTable"
        :hide-pagination="true"
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-color="props">
          <q-td :props="props">
            <div class="color-box" :style="{ backgroundColor: props.row.color }"></div>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="actions">
            <q-btn dense round flat color="grey" icon="mdi-square-edit-outline" @click="openDialogSave(true, props.row)"></q-btn>
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
    </div>

    <q-dialog
      v-model="dialogSave"
      full-height
      position="right"
      square
      maximized
    >
      <q-card class="dialog-card">
        <div class="q-px-lg q-py-md flex items-center dialog-title">
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
          <q-btn :loading="isLoadingDelete" :label="$t('global.accept')" color="primary" class="no-box-shadow" :ripple="false" @click="deleteOpportunityState" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
// Interfaces
import type { AppConfigInterface } from 'src/interfaces/app.interface';
// Services
import OpportunitiesService from 'src/services/opportunities.service';
// Components
import StateFormComponent from 'components/SettingComponents/Forms/StateFormComponent.vue';

const { t } = useI18n();
const $q = useQuasar();

const columns = [
  { name: 'name', label: t('setting.form.name'), field: 'name', align: 'left' },
  { name: 'color', label: t('setting.form.color'), field: 'color', align: 'center' },
  { name: 'actions', label: t('global.actions'), field: '', align: 'right' },
]

const dialogSave = ref(false);
const deleteDialog = ref(false);

const loadingTable = ref(false);
const isLoadingSave = ref(false);
const isLoadingDelete = ref(false);

const formModeEdit = ref(false);
const opportunityStateDetails = ref<AppConfigInterface>({
  id: '',
  name: '',
  color: '',
});

const formData = ref<typeof StateFormComponent | null>(null);
const opportunityStatesList = ref([]);
const opportunityStateId = ref('');

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
  loadingTable.value = true;

  const { data } = await OpportunitiesService.getOpportunityStates();
  opportunityStatesList.value = data?.data || [];

  loadingTable.value = false;
}

/**
 *
 */
const saveOpportunityState = async () => {
  isLoadingSave.value = true;

  if (await validateForm()) {
    const payload = formData.value?.formData.form;

    if (formModeEdit.value) {
      try {
        await OpportunitiesService.updateOpportunityState(opportunityStateDetails.value.id, payload);
        $q.notify({ message: t('global.successUpdateMessage'), color: 'green', position: 'bottom' });
      } catch (error) {
        $q.notify({ message: t('global.errorMessage'), color: 'red', position: 'bottom' });
      }
    } else {
      try {
        await OpportunitiesService.createOpportunityState(payload);
        $q.notify({ message: t('global.successCreateMessage'), color: 'green', position: 'bottom' });
      } catch (error) {
        $q.notify({ message: t('global.errorMessage'), color: 'red', position: 'bottom' });
      }
    }

    await getOpportunityStates();
    dialogSave.value = false;
  }

  isLoadingSave.value = false;
}

/**
 *
 */
const deleteOpportunityState = async () => {
  try {
    await OpportunitiesService.deleteOpportunityState(opportunityStateId.value);
    $q.notify({ message: t('global.successDeleteMessage'), color: 'green', position: 'bottom' });
  } catch (error) {
    $q.notify({ message: t('global.errorMessage'), color: 'red', position: 'bottom' });
  }

  deleteDialog.value = false;
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

/**
 *
 */
const openDialogDelete = (id: string) => {
  opportunityStateId.value = id;
  deleteDialog.value = true;
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
