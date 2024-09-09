<template>
  <div>
    <div class="q-pb-lg flex row justify-between">
      <h5 class="q-ma-none">{{ $t('setting.property') }} {{ $t('setting.features') }}</h5>
      <q-btn color="primary" icon="mdi-plus-circle-outline" :ripple="false" @click="openDialogSave(false)">{{ $t('setting.addFeature') }}</q-btn>
    </div>

    <div>
      <q-table
        hide-bottom
        row-key="name"
        :rows="propertyFeaturesList"
        :columns="columns"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="actions">
            <q-btn dense round flat color="grey" icon="mdi-square-edit-outline" @click="openDialogSave(true, props.row)"></q-btn>
            <q-btn dense round flat color="grey" icon="mdi-trash-can-outline" @click="deletePropertyFeature(props.row.id)"></q-btn>
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
          <h6 class="text-h6 q-ma-none">{{ formModeEdit ? $t('setting.editFeature') : $t('setting.addFeature')}}</h6>
          <q-space />
          <q-icon name="close" size="sm" class="cursor-pointer" @click="dialogSave = false" />
        </div>
        <q-separator />
        <div class="q-pa-lg">
          <basic-form-component
            ref="formData"
            :is-edit="formModeEdit"
            :form-details="propertyFeatureDetails"
          />
          <q-btn :loading="isLoadingSave" color="primary" class="full-width text-capitalize" @click="savePropertyFeature">{{ $t('global.save') }}</q-btn>
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
import PropertiesService from 'src/services/properties.service';
// Components
import BasicFormComponent from 'components/SettingComponents/Forms/BasicFormComponent.vue';

const { t } = useI18n();

const columns = [
  { name: 'name', label: t('global.name'), field: 'name', align: 'left' },
  { name: 'properties', label: t('global.quantity'), field: 'properties', align: 'center' },
  { name: 'actions', label: t('global.actions'), field: '', align: 'right' },
]

const dialogSave = ref(false);
const isLoadingSave = ref(false);

const formModeEdit = ref(false);
const propertyFeatureDetails = ref<AppConfigInterface>({
  id: '',
  name: '',
  properties: '',
});

const formData = ref<typeof BasicFormComponent | null>(null);
const propertyFeaturesList = ref([]);

/**
 *
 */
const validateForm = async () => {
  return await formData.value?.validateForm();
}

/**
 *
 */
const getPropertyFeatures = async () => {
  const {data} = await PropertiesService.getPropertyFeatures();

  if (data) {
    propertyFeaturesList.value = data?.data;
  }
}

const savePropertyFeature = async () => {
  isLoadingSave.value = true;

  if (await validateForm()) {
    const payload = formData.value?.formData.form;

    if (formModeEdit.value) {
      await PropertiesService.updatePropertyFeature(propertyFeatureDetails.value.id, payload);
    } else {
      await PropertiesService.createPropertyFeature(payload);
    }

    await getPropertyFeatures();
    dialogSave.value = false;
  }

  isLoadingSave.value = false;
}

/**
 *
 */
const deletePropertyFeature = async (typeId: string) => {
  await PropertiesService.deletePropertyFeature(typeId);
  await getPropertyFeatures();
}

/**
 *
 */
const openDialogSave = (modeEdit: boolean, details?: AppConfigInterface) => {
  formModeEdit.value = modeEdit;

  if (details) {
    propertyFeatureDetails.value = details;
  }

  dialogSave.value = true;
}

onMounted(async () => {
  await getPropertyFeatures();
});
</script>

<style scoped lang="scss">

</style>
