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
              <q-toggle v-model="props.row.finished" color="primary" @update:modelValue="openDialogFinished(props.row)" />
            </q-td>
            <q-td class="text-right actions">
              <q-btn dense round flat color="grey" icon="mdi-square-edit-outline" @click="openDialogSave(true, props.row)"></q-btn>
              <q-btn dense round flat color="grey" icon="mdi-trash-can-outline" @click="deleteOpportunity(props.row.id)"></q-btn>
            </q-td>
          </q-tr>
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

    <q-dialog
      v-model="opportunityFinishedDialog"
      persistent
    >
      <q-card>
        <q-card-section class="row items-center">
          <div class="flex no-wrap gap-sm">
            <q-icon size="md" name="mdi-lock-alert" color="negative"  />
            <span class="q-ml-sm">{{ $t('opportunity.messageConfirmationFinished') }}</span>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
            <q-btn outline :label="$t('global.cancel')" color="primary" :ripple="false" @click="cancelDialogFinished" />
            <q-btn :loading="isLoadingFinished" :label="$t('global.accept')" color="primary" :ripple="false" @click="updateFinished" />
        </q-card-actions>
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
  { name: 'finished', label: t('global.finished'), field: '', align: 'center' },
  { name: 'actions', label: t('global.actions'), field: '', align: 'right' },
]

const isLoading = ref(false);
const isLoadingSave = ref(false);
const isLoadingFinished = ref(false);

const opportunityFormDialog = ref(false);
const opportunityFinishedDialog = ref(false);
const formModeEdit = ref(false);

const opportunityDetails = ref<OpportunityDetailsInterface | null>(null);
const formData = ref<typeof OpportunityFormComponent | null>(null);
const opportunityList = ref<OpportunityDetailsInterface[]>([]);

const opportunityId = ref('');
const opportunityFinished = ref(false);

/**
 *
 */
const getOpportunities = async () => {
  const { data } = await OpportunitiesService.getOpportunities();
  opportunityList.value = data?.data?.items?.map((item: any) => ({
    ...item,
    finished: item.finished_at !== null
  }));
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

/**
 *
 */
const updateFinished = async () => {
  isLoadingFinished.value = true;

  const payload = {
    finished: opportunityFinished.value
  }

  await OpportunitiesService.updateOpportunity(opportunityId.value, payload);
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

onMounted(async () => {
  isLoading.value = true;
  await getOpportunities();
  isLoading.value = false;
})
</script>

<style scoped lang="scss">
.q-table {
  .disabled {
    cursor: not-allowed;

    :deep(.q-toggle), :deep(.q-btn) {
      pointer-events: none;
    }
  }
}
</style>
