<template>
  <div>
    <q-form ref="formRef">
      <div class="q-pb-lg flex row justify-between gap-sm">
        <h5 class="q-ma-none">{{ $t('setting.commissions') }} - {{ $t('setting.salesRental') }}</h5>
      </div>
      <q-separator/>
      <div class="q-mt-md">
        <div class="q-py-sm input-commission">
          <label>{{ $t('setting.form.salesCommission') }}</label>
          <q-input
            outlined
            dense
            v-model="form.sale_commission"
            type="number"
            :min="0"
            :max="100"
            :rules="[
              (val: any) => validatePercentage(val) || $t('validation.requiredField'),
              (val: any) => validatePercentageCommission(val) || $t('validation.requiredFieldPercentage'),
            ]"
          ><template v-slot:prepend><q-icon name="mdi-percent-outline" /></template></q-input>
        </div>
        <div class="q-py-sm input-commission">
          <label>{{ $t('setting.form.rentalCommission') }}</label>
          <q-input
            outlined
            dense
            v-model="form.rent_commission"
            type="number"
            :min="0"
            :rules="[
              (val: any) => validatePercentage(val) || $t('validation.requiredField'),
              (val: any) => validatePercentageCommission(val) || $t('validation.requiredFieldPercentage'),
            ]"
          ><template v-slot:prepend><q-icon name="mdi-percent-outline" /></template></q-input>
        </div>
      </div>
      <q-btn :loading="isLoadingSave" color="primary" class="text-capitalize q-px-xl q-mt-sm" :ripple="false" @click="saveCommission">{{ $t('global.save') }}</q-btn>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
// Interfaces
import type { OpportunityCommissionsInterface } from 'src/interfaces/opportunity.interface';
// Composable
import useValidate from 'src/composable/useValidate';
// Services
import OpportunitiesService from 'src/services/opportunities.service';

const { t } = useI18n();
const { validatePercentage, validatePercentageCommission } = useValidate();
const $q = useQuasar();

const isLoadingSave = ref(false);

const form = ref<OpportunityCommissionsInterface>({
  sale_commission: 0,
  rent_commission: 0
});
const formRef = ref();

/**
 *
 */
const validateForm = async () => {
  return await formRef.value.validate();
}

/**
 *
 */
const saveCommission = async () => {
  isLoadingSave.value = true;

  if (await validateForm()) {
    const payload = {
      sale_commission: Number(form.value.sale_commission),
      rent_commission: Number(form.value.rent_commission)
    }

    try {
      await OpportunitiesService.createOpportunitiesCommissions(payload);
      $q.notify({ message: t('global.successSaveMessage'), color: 'green', position: 'bottom' });
    } catch (error) {
      $q.notify({ message: t('global.errorMessage'), color: 'red', position: 'bottom' });
    }
  }

  isLoadingSave.value = false;
}

onMounted(async () => {
  const { data } = await OpportunitiesService.getOpportunitiesCommissions();
  form.value = data?.data || {
    sale_commission: 0,
    rent_commission: 0
  };
})
</script>

<style scoped lang="scss">
.input-commission {
  max-width: 300px;
}
</style>
