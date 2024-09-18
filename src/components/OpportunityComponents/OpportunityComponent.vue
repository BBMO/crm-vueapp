<template>
  <div>
    <q-card v-if="!isLoading" class="property-container">
      <div class="q-px-md q-py-lg flex justify-end gap-md">
        <q-btn color="grey-12" icon="mdi-database-export-outline" class="q-px-lg shadow-0 text-grey" :ripple="false">{{ $t('global.export') }}</q-btn>
        <q-btn color="primary" icon="mdi-plus" class="q-px-lg" :ripple="false" @click="openDialogSave(false)">{{ $t('opportunity.addOpportunity') }}</q-btn>
      </div>
      <q-table
        hide-bottom
        row-key="name"
        :rows="opportunityList"
        :columns="columns"
        :hide-pagination="true"
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-contact="props">
          <q-td :props="props">
            <p class="q-ma-none text-capitalize">{{ props.row.contact.first_name }} {{ props.row.contact.last_name }}</p>
            <p class="text-caption text-grey q-ma-none">{{ $t('opportunity.form.agent')}}: {{ props.row.agent.name }}</p>
          </q-td>
        </template>
        <template v-slot:body-cell-property="props">
          <q-td :props="props">{{ props.row.property.title }}</q-td>
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
        <template v-slot:body-cell-amount="props">
          <q-td :props="props">${{ props.row.amount }}</q-td>
        </template>
        <template v-slot:body-cell-state="props">
          <q-td :props="props">
            <span class="relative-position q-pa-xs">
              <span
                class="absolute full-width full-height"
                style="top: 0; left: 0; opacity: 0.1; border-radius: 6px;"
                :style="{ background: props.row.state.color }"
              ></span>
              <span class="q-pa-sm text-weight-medium" :style="{ color: props.row.state.color }"> {{ props.row.state.name }} </span>
            </span>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="actions">
            <q-btn dense round flat color="grey" icon="mdi-square-edit-outline" @click="openDialogSave(true, props.row)"></q-btn>
            <q-btn dense round flat color="grey" icon="mdi-trash-can-outline" @click="deleteOpportunity(props.row.id)"></q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>
    <div v-if="isLoading" class="full-width full-height flex align-center justify-center">
      <q-spinner color="primary" size="3em" />
    </div>

    <q-dialog
      v-model="opportunityFormDialog"
      full-height
      position="right"
      square
      maximized
    >
      <q-card class="dialog-card">
        <div class="q-pa-lg flex items-center dialog-title">
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
          <q-btn :loading="isLoadingSave" color="primary" class="full-width text-capitalize" @click="saveOpportunity">{{ $t('global.save') }}</q-btn>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
// Interfaces
import type { OpportunityDetailsInterface } from 'src/interfaces/opportunity.interface';
// Constants
import { GLOBAL } from 'src/constants/global.constant';
// Services
import OpportunitiesService from 'src/services/opportunities.service';
// Components
import OpportunityFormComponent from 'components/OpportunityComponents/OpportunityFormComponent.vue';

const { t } = useI18n();

const columns = [
  { name: 'contact', label: t('opportunity.form.contact'), field: 'contact', align: 'left' },
  { name: 'property', label: t('opportunity.form.property'), field: 'property', align: 'left' },
  { name: 'available_for', label: t('opportunity.form.availableFor'), field: 'available_for', align: 'left' },
  { name: 'amount', label: t('opportunity.form.amount'), field: 'amount', align: 'left' },
  { name: 'state', label: t('opportunity.form.state'), field: 'state', align: 'left' },
  { name: 'actions', label: t('global.actions'), field: '', align: 'right' },
]

const isLoading = ref(false);
const isLoadingSave = ref(false);

const opportunityFormDialog = ref(false);
const formModeEdit = ref(false);

const opportunityDetails = ref<OpportunityDetailsInterface | null>(null);
const formData = ref<typeof OpportunityFormComponent | null>(null);
const opportunityList = ref([]);

/**
 *
 */
const getOpportunities = async () => {
  const { data } = await OpportunitiesService.getOpportunities();
  opportunityList.value = data?.data?.items;
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
      state_id: formData.value?.formData.form.state_id.id
    }

    if (formModeEdit.value && opportunityDetails.value) {
      const opportunityId = opportunityDetails.value.id;
      await OpportunitiesService.updateOpportunity(opportunityId, payload);
    } else {
      await OpportunitiesService.createOpportunity(payload);
    }
  }

  isLoadingSave.value = false;
  opportunityFormDialog.value = false;

  await getOpportunities();
}

/**
 *
 */
const deleteOpportunity = async (opportunityId: string) => {
  await OpportunitiesService.deleteOpportunity(opportunityId);
  await getOpportunities();
}

onMounted(async () => {
  isLoading.value = true;
  await getOpportunities();
  isLoading.value = false;
})
</script>

<style scoped lang="scss">

</style>
