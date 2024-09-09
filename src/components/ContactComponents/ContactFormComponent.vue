<template>
  <div class="q-pt-md">
    <q-form ref="formRef">
      <div class="q-py-md q-mb-lg">
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
      <div class="q-py-md">
        <q-input
          outlined
          dense
          v-model="form.first_name"
          :label="$t('contact.form.firstName')"
          :rules="[
            (val: any) => validateRequired(val) || $t('validation.requiredField'),
          ]"
        ></q-input>
      </div>
      <div class="q-py-md">
        <q-input
          outlined
          dense
          v-model="form.last_name"
          :label="$t('contact.form.lastName')"
          :rules="[
            (val: any) => validateRequired(val) || $t('validation.requiredField'),
          ]"
        ></q-input>
      </div>
      <div class="q-py-md">
        <q-input
          outlined
          dense
          v-model="form.email"
          :label="$t('contact.form.email')"
          :rules="[
            (val: any) => validateRequired(val) || $t('validation.requiredField'),
          ]"
        ></q-input>
      </div>
      <div class="q-py-md">
        <q-input
          outlined
          dense
          v-model="form.phone"
          :label="$t('contact.form.phone')"
          :rules="[
            (val: any) => validateRequired(val) || $t('validation.requiredField'),
          ]"
        ></q-input>
      </div>
      <div class="q-py-md">
        <q-input
          outlined
          dense
          v-model="form.address"
          :label="$t('contact.form.address')"
          :rules="[
            (val: any) => validateRequired(val) || $t('validation.requiredField'),
          ]"
        ></q-input>
      </div>
      <div class="q-py-md">
        <q-select
          outlined
          dense
          v-model="form.type"
          :options="typeContact"
          :label="$t('contact.form.type')"
          :rules="[
            (val: any) => validateRequiredSelect(val) || $t('validation.requiredField'),
          ]"
          @update:modelValue="updateType"
        ></q-select>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
// Interfaces
import { ContactFormInterface } from 'src/interfaces/contact.interface';
// Constants
import { GLOBAL } from 'src/constants/global.constant';
// Composable
import useValidate  from 'src/composable/useValidate';

interface Props {
  isEdit: boolean;
  formDetails: ContactFormInterface;
}
const props = defineProps<Props>()

const { t } = useI18n();
const { validateRequired, validateRequiredSelect } = useValidate();

const fileInput = ref<HTMLElement | null>(null);

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  interest: '',
  type: '',
  attachment: null as string | null,
});
const formRef = ref();

const formData = computed(() => {
  return {
    form: form.value,
  }
});

const typeContact = [
  { label: t('contact.client'), value: GLOBAL.CLIENT },
  { label: t('contact.lead'), value: GLOBAL.LEAD },
];

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
      }
    };
    reader.readAsDataURL(file);
  }
};

/**
 *
 */
const updateType = (type: {label: string, value: string}) => {
  form.value.type = type.value;
};

/**
 *
 */
const validateForm = async () => {
  return await formRef.value.validate();
}

onMounted(() => {
  if (props.isEdit) {
    form.value = {
      first_name: props.formDetails.first_name,
      last_name: props.formDetails.last_name,
      email: props.formDetails.email,
      phone: props.formDetails.phone,
      address: props.formDetails.address,
      interest: props.formDetails.interest,
      type: props.formDetails.type,
      attachment: null,
    };
  }
})

defineExpose({
  formData,
  validateForm,
});
</script>

<style scoped lang="scss">
label {
  color: rgba(0, 0, 0, 0.6);
}
</style>
