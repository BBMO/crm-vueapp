<template>
  <div>
    <q-form v-if="!isLoading" ref="formRef">
      <div class="q-py-sm q-mb-lg">
        <div class="flex justify-center">
          <q-img
            :src="form.attachment ? form.attachment : 'https://i.ibb.co/0Jmshvb/no-image.png'"
            class="bg-lightGray cursor-pointer border-radius"
            max-width="100px"
            max-height="100px"
            height="100px"
            width="100px"
            @click="openFileDialog"
          ></q-img>
        </div>
        <input
          type="file"
          ref="fileInput"
          style="display: none"
          @change="updateImage"
        />
      </div>
      <div class="q-py-xs">
        <label>{{ $t('contact.form.firstName') }}</label>
        <q-input
          outlined
          dense
          v-model="form.first_name"
          :rules="[
            (val: any) => validateRequired(val) || $t('validation.requiredField'),
          ]"
        ></q-input>
      </div>
      <div class="q-py-xs">
        <label>{{ $t('contact.form.lastName') }}</label>
        <q-input
          outlined
          dense
          v-model="form.last_name"
          :rules="[
            (val: any) => validateRequired(val) || $t('validation.requiredField'),
          ]"
        ></q-input>
      </div>
      <div class="q-py-xs">
        <label>{{ $t('contact.form.email') }}</label>
        <q-input
          outlined
          dense
          v-model="form.email"
          :rules="[
            (val: any) => validateRequired(val) || $t('validation.requiredField'),
          ]"
        ></q-input>
      </div>
      <div class="q-py-xs">
        <label>{{ $t('contact.form.phone') }}</label>
        <q-input
          outlined
          dense
          v-model="form.phone"
          :rules="[
            (val: any) => validateRequired(val) || $t('validation.requiredField'),
          ]"
        ></q-input>
      </div>
      <div class="q-py-xs">
        <label>{{ $t('contact.form.address') }}</label>
        <q-input
          outlined
          dense
          v-model="form.address"
          :rules="[
            (val: any) => validateRequired(val) || $t('validation.requiredField'),
          ]"
        ></q-input>
      </div>
      <div class="q-py-xs">
        <label>{{ $t('contact.form.type') }}</label>
        <q-select
          outlined
          dense
          v-model="form.type"
          option-label="label"
          option-value="value"
          :options="typeContact"
          :rules="[
            (val: any) => validateRequiredSelect(val) || $t('validation.requiredField'),
          ]"
        ></q-select>
      </div>
      <div v-if="getIsAdmin()" class="q-py-xs">
        <label>{{ $t('contact.form.agent') }}</label>
        <q-select
          outlined
          dense
          v-model="form.agent"
          use-input
          hide-selected
          fill-input
          input-debounce="1000"
          option-label="name"
          option-value="id"
          :options="agentsSelect"
          @filter="filterAgentSelect"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">{{ $t('global.noResults') }}</q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </q-form>
    <div v-if="isLoading" class="full-width full-height flex align-center justify-center q-my-lg">
      <q-spinner color="primary" size="3em" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';
// Interfaces
import type { ContactFormInterface } from 'src/interfaces/contact.interface';
import type { CommonSelectInterface } from 'src/interfaces/app.interface';
// Constants
import { GLOBAL } from 'src/constants/global.constant';
// Composable
import useValidate  from 'src/composable/useValidate';
import useRole from 'src/composable/useRole';
// Store
import { useContactStore } from 'src/stores/contact.store';
// Services
import ContactsService from 'src/services/contacts.service';
import AgentsService from 'src/services/agents.service';

interface Props {
  isEdit: boolean;
}
const props = defineProps<Props>()

const { t } = useI18n();
const { validateRequired, validateRequiredSelect } = useValidate();
const { getIsAdmin, getWpUserId } = useRole();
const contactStore = useContactStore();

const typeContact = [
  { label: t('contact.client'), value: GLOBAL.CLIENT },
  { label: t('contact.lead'), value: GLOBAL.LEAD },
];

const isLoading = ref(false);

const fileInput = ref<HTMLElement | null>(null);

const form = ref<ContactFormInterface>({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  type: {
    label: '',
    value: '',
  },
  image: null,
  attachment: null as string | null,
  agent: {
    id: '',
    name: '',
  }
});
const formRef = ref();

const agentsSelect: Ref<CommonSelectInterface[]> = ref([]);

const contactId = computed(() => contactStore.getContactId);
const formData = computed(() => {
  return {
    form: form.value,
  }
});

/**
 *
 */
const getSelectsData = async () => {
  const { data } = await AgentsService.getAgents();
  agentsSelect.value = data?.data?.items.map((agent: any) => ({
    id: agent.id,
    name: agent.display_name,
  })) || [];
};

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
const openFileDialog = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const updateImage = (event: any) => {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) {
        form.value.attachment = (e.target.result as string) ?? '';
        form.value.image = file;
      }
    };
    reader.readAsDataURL(file);
  }
};

/**
 *
 */
const validateForm = async () => {
  return await formRef.value.validate();
}

onMounted(async () => {
  await getSelectsData();

  if (props.isEdit) {
    isLoading.value = true;

    const { data } = await ContactsService.getContact(contactId.value);
    form.value = {
      ...form.value,
      first_name: data?.data.first_name,
      last_name: data?.data.last_name,
      email: data?.data.email,
      phone: data?.data.phone,
      address: data?.data.address,
      type: {
        label: data?.data.type === GLOBAL.CLIENT ? t('contact.client') : t('contact.lead'),
        value: data?.data.type,
      },
      attachment: data?.data.attachment_url,
      agent: {
        id: data?.data.agent ? data?.data.agent.id : '',
        name: data?.data.agent ? data?.data.agent.name : '',
      }
    };

    isLoading.value = false;
  }

  if (!getIsAdmin()) {
    form.value.agent = {
      id: getWpUserId(),
      name: agentsSelect.value.find((agent: CommonSelectInterface) => agent.id == getWpUserId())?.name || '',
    }
  }
})

defineExpose({
  formData,
  validateForm,
});
</script>

<style scoped lang="scss">

</style>
