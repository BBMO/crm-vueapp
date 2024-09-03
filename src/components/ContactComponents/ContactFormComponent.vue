<template>
  <div class="q-pt-md">
    <q-form @submit="onsubmit">
      <div class="row">
        <div class="col-12 q-py-md">
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
        <div class="col-12 q-py-md">
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
        <div class="col-12 q-py-md">
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
        <div class="col-12 q-py-md">
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
        <div class="col-12 q-py-md">
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
        <div class="col-12 q-py-md">
          <q-select
            outlined
            dense
            v-model="form.type"
            :label="$t('contact.form.type')"
            :options="typeContact"
            :rules="[
              (val: any) => validateRequired(val) || $t('validation.requiredField'),
            ]"
          ></q-select>
        </div>

        <div class="col-12 q-pt-lg q-pb-md">
          <q-btn type="submit" color="primary" class="full-width text-capitalize">
            {{ $t('global.save') }}
          </q-btn>
        </div>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
// Composable
import useValidate  from 'src/composable/useValidate';
// Constants
import { GLOBAL } from 'src/constants/global.constant';

const { t } = useI18n();
const { validateRequired } = useValidate();

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  interest: '',
  type: '',
});

const typeContact = [
  { label: t('contact.client'), value: GLOBAL.CLIENT },
  { label: t('contact.lead'), value: GLOBAL.LEAD },
];

const onsubmit = () => {
  console.log(form.value);
};

</script>

<style scoped lang="scss">

</style>
