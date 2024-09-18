<template>
  <div>
    <q-form ref="formRef">
      <div class="q-py-sm">
        <label>{{ $t('opportunity.form.contact') }}</label>
        <q-select
          outlined
          dense
          v-model="form.contact_id"
          option-label="name"
          option-value="id"
          :options="contactsSelect"
          :rules="[
            (val: any) => validateRequiredSelect(val.id) || $t('validation.requiredField'),
          ]"
        ></q-select>
      </div>
      <div class="q-py-sm">
        <label>{{ $t('opportunity.form.property') }}</label>
        <q-select
          outlined
          dense
          v-model="form.property_id"
          option-label="name"
          option-value="id"
          :options="propertiesSelect"
          :rules="[
            (val: any) => validateRequiredSelect(val.id) || $t('validation.requiredField'),
          ]"
        ></q-select>
      </div>
      <div class="q-py-sm">
        <label>{{ $t('opportunity.form.amount') }}</label>
        <q-input
          outlined
          dense
          v-model="form.amount"
          type="number"
          :min="0"
          :rules="[
            (val: any) => validateRequired(val) || $t('validation.requiredField'),
          ]"
        ></q-input>
      </div>
      <div class="q-py-sm">
        <label>{{ $t('opportunity.form.state') }}</label>
        <q-select
          outlined
          dense
          v-model="form.state_id"
          option-label="name"
          option-value="id"
          :options="opportunityStatesSelect"
          :rules="[
            (val: any) => validateRequiredSelect(val.id) || $t('validation.requiredField'),
          ]"
        ></q-select>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
// Interfaces
import type { CommonSelectInterface } from 'src/interfaces/app.interface';
import type { OpportunityFormInterface, OpportunityDetailsInterface } from 'src/interfaces/opportunity.interface';
// Composable
import useValidate  from 'src/composable/useValidate';
// Services
import OpportunitiesService from 'src/services/opportunities.service';
import ContactsService from 'src/services/contacts.service';
import PropertiesService from 'src/services/properties.service';

interface Props {
  isEdit: boolean;
  formDetails: OpportunityDetailsInterface | null;
}
const props = defineProps<Props>()

const { validateRequired, validateRequiredSelect } = useValidate();

const form = ref<OpportunityFormInterface>({
  contact_id: {
    id: '',
    name: ''
  },
  property_id: {
    id: '',
    name: ''
  },
  amount: '',
  state_id: {
    id: '',
    name: ''
  },
});
const formRef = ref();

const contactsSelect = ref<CommonSelectInterface[]>([]);
const propertiesSelect = ref<CommonSelectInterface[]>([]);
const opportunityStatesSelect = ref<CommonSelectInterface[]>([]);

const formData = computed(() => {
  return {
    form: form.value,
  }
});

/**
 *
 */
const getSelectsData = async () => {
  let response;

  response = await ContactsService.getContacts();
  contactsSelect.value = response.data?.data?.items.map((item: any) => ({
    id: item.id,
    name: `${item.first_name} ${item.last_name}`
  }));

  response = await PropertiesService.getProperties();
  propertiesSelect.value = response.data?.data?.items.map((item: any) => ({
    id: item.id,
    name: item.title
  }));

  response = await OpportunitiesService.getOpportunityStates();
  opportunityStatesSelect.value = response.data?.data?.map((item: any) => ({
    id: item.id,
    name: item.name
  }));
}

/**
 *
 */
const validateForm = async () => {
  return await formRef.value.validate();
}

onMounted(() => {
  getSelectsData();

  if (props.isEdit && props.formDetails) {
    form.value = {
      contact_id: {
        name: `${props.formDetails.contact.first_name} ${props.formDetails.contact.last_name}`,
        id: props.formDetails.contact.id
      },
      property_id: {
        name: props.formDetails.property.title,
        id: props.formDetails.property.id
      },
      amount: props.formDetails.amount,
      state_id: props.formDetails.state,
    };
  }
});

defineExpose({
  formData,
  validateForm,
});
</script>

<style scoped lang="scss">

</style>
