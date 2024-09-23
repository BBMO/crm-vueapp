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
    </q-form>
    <div v-if="isLoading" class="full-width full-height flex align-center justify-center q-my-lg">
      <q-spinner color="primary" size="3em" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
// Interfaces
import type { ContactFormInterface } from 'src/interfaces/contact.interface';
// Constants
import { GLOBAL } from 'src/constants/global.constant';
// Composable
import useValidate  from 'src/composable/useValidate';
// Store
import { useContactStore } from 'src/stores/contact.store';
// Services
import ContactsService from 'src/services/contacts.service';

interface Props {
  isEdit: boolean;
}
const props = defineProps<Props>()

const { t } = useI18n();
const { validateRequired, validateRequiredSelect } = useValidate();
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
});
const formRef = ref();

const contactId = computed(() => contactStore.getContactId);
const formData = computed(() => {
  return {
    form: form.value,
  }
});

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
      attachment: null,
    };

    isLoading.value = false;
  }
})

defineExpose({
  formData,
  validateForm,
});
</script>

<style scoped lang="scss">

</style>
