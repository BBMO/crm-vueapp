<template>
  <div>
    <q-form v-if="!isLoading" ref="formRef">
      <div class="q-py-sm">
        <label>{{ $t('property.form.agent') }}</label>
        <q-select
          outlined
          dense
          v-model="form.agent_id"
          use-input
          hide-selected
          fill-input
          input-debounce="1000"
          option-label="name"
          option-value="id"
          :options="agentsSelect"
          :disable="!getIsAdmin()"
          :rules="[
            (val: any) => validateRequiredSelect(val.id) || $t('validation.requiredField'),
          ]"
          @filter="filterAgentSelect"
          @update:modelValue="updateAgentSelect"
        >
          <template v-slot:prepend><q-icon name="mdi-account-outline" /></template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">{{ $t('global.noResults') }}</q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="q-py-sm">
        <label>{{ $t('opportunity.form.property') }}</label>
        <q-select
          outlined
          dense
          v-model="form.property_id"
          use-input
          hide-selected
          fill-input
          input-debounce="1000"
          option-label="name"
          option-value="id"
          :options="propertiesSelect"
          :disable="hasProperties"
          :rules="[
            (val: any) => validateRequiredSelect(val.id) || $t('validation.requiredField'),
          ]"
          @filter="filterPropertySelect"
          @update:modelValue="updatePropertySelect"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">{{ $t('global.noResults') }}</q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
      <div class="q-py-sm">
        <label>{{ $t('opportunity.form.contact') }}</label>
        <q-select
          outlined
          dense
          v-model="form.contact_id"
          use-input
          hide-selected
          fill-input
          input-debounce="1000"
          option-label="name"
          option-value="id"
          :options="contactsSelect"
          :rules="[
            (val: any) => validateRequiredSelect(val.id) || $t('validation.requiredField'),
          ]"
          @filter="filterContactSelect"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">{{ $t('global.noResults') }}</q-item-section>
            </q-item>
          </template>
        </q-select>
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
    <div v-if="isLoading" class="full-width full-height flex align-center justify-center">
      <q-spinner color="primary" size="3em" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';
// Interfaces
import type {CommonSelectInterface} from 'src/interfaces/app.interface';
import type {
  OpportunityDetailsInterface,
  OpportunityFormInterface,
  OpportunitySelectPropertyInterface
} from 'src/interfaces/opportunity.interface';
// Composable
import useValidate from 'src/composable/useValidate';
import useRole from 'src/composable/useRole';
// Services
import OpportunitiesService from 'src/services/opportunities.service';
import ContactsService from 'src/services/contacts.service';
import PropertiesService from 'src/services/properties.service';
import AgentsService from 'src/services/agents.service';

interface Props {
  isEdit: boolean;
  formDetails: OpportunityDetailsInterface | null;
}
const props = defineProps<Props>()

const { validateRequired, validateRequiredSelect } = useValidate();
const { getIsAdmin, getWpUserId } = useRole();

const isLoading = ref(false);
const hasProperties = ref(false);

const form = ref<OpportunityFormInterface>({
  agent_id: {
    id: '',
    name: ''
  },
  property_id: {
    id: '',
    name: ''
  },
  contact_id: {
    id: '',
    name: ''
  },
  amount: '',
  state_id: {
    id: '',
    name: ''
  },
  finished: false
});
const formRef = ref();

const agentId = ref('');

const contactsSelect = ref<CommonSelectInterface[]>([]);
const propertiesSelect = ref<OpportunitySelectPropertyInterface[]>([]);
const opportunityStatesSelect = ref<CommonSelectInterface[]>([]);
const agentsSelect = ref<CommonSelectInterface[]>([]);

const formData = computed(() => {
  return {
    form: form.value,
  }
});

/**
 *
 */
const getSelectPropertiesData = async (keyword?: string) => {
  const { data } = await PropertiesService.getProperties({
    agent_id: agentId.value,
    keyword: keyword || ''
  });

  propertiesSelect.value = data?.data?.items.map((item: any) => ({
    id: item.id,
    name: item.title,
    price: item.price
  })) || [];
}

/**
 *
 */
const getSelectsData = async () => {
  const { data: contactsData } = await ContactsService.getContacts();
  contactsSelect.value = contactsData?.data?.items.map((item: any) => ({
    id: item.id,
    name: `${item.first_name} ${item.last_name}`
  })) || [];

  const { data: opportunityStatesData } = await OpportunitiesService.getOpportunityStates();
  opportunityStatesSelect.value = opportunityStatesData?.data?.map((item: any) => ({
    id: item.id,
    name: item.name
  })) || [];

  const { data: agentsData } = await AgentsService.getAgents();
  agentsSelect.value = agentsData?.data?.items.map((agent: any) => ({
    id: agent.id,
    name: agent.display_name,
  })) || [];
}

/**
 *
 */
const filterAgentSelect = (value: string, update: any) => {
  update( async () => {
    const { data } = await AgentsService.getAgents(value);
    agentsSelect.value = data?.data?.items.map((agent: any) => ({
      id: agent.id,
      name: agent.display_name,
    })) || [];
  })
}

/**
 *
 */
const filterContactSelect = (value: string, update: any) => {
  update(async () => {
    const { data } = await ContactsService.getContacts({ search: value });
    contactsSelect.value = data?.data?.items.map((item: any) => ({
      id: item.id,
      name: `${item.first_name} ${item.last_name}`
    })) || [];
  })
}

/**
 *
 */
const filterPropertySelect = (value: string, update: any) => {
  update(async () => {
    await getSelectPropertiesData(value);
  })
}

/**
 *
 */
const updateAgentSelect = async (value: CommonSelectInterface) => {
  agentId.value = value.id;
  await getSelectPropertiesData();
  hasProperties.value = false;
}

/**
 *
 */
const updatePropertySelect = (value: CommonSelectInterface) => {
  form.value.amount = propertiesSelect.value.find((property: any) => property.id === value.id)?.price || '';
}

/**
 *
 */
const validateForm = async () => {
  return await formRef.value.validate();
}

onMounted(async () => {
  isLoading.value = true;
  hasProperties.value = true;

  await getSelectsData();

  if (props.isEdit && props.formDetails) {
    form.value = {
      agent_id: {
        id: props.formDetails.agent.id,
        name: props.formDetails.agent.name,
      },
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
      finished: props.formDetails.finished_at !== null
    };
  }

  if (!getIsAdmin()) {
    agentId.value = getWpUserId();

    form.value.agent_id = {
      id: getWpUserId(),
      name: agentsSelect.value.find((agent: CommonSelectInterface) => agent.id == getWpUserId())?.name || '',
    }

    await getSelectPropertiesData();
    hasProperties.value = false;
  }

  isLoading.value = false;
});

defineExpose({
  formData,
  validateForm,
});
</script>

<style scoped lang="scss">

</style>
