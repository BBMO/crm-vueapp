<template>
  <div class="q-pt-md">
    <q-form ref="formRef">
      <div class="q-py-md">
        <q-input
          outlined
          dense
          v-model="form.name"
          :label="$t('setting.form.name')"
          :rules="[
            (val: any) => validateRequired(val) || $t('validation.requiredField'),
          ]"
        ></q-input>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
// Interfaces
import type { AppConfigInterface } from 'src/interfaces/app.interface';
// Composable
import useValidate from 'src/composable/useValidate';

interface Props {
  isEdit: boolean;
  formDetails: AppConfigInterface;
}
const props = defineProps<Props>()

const { validateRequired } = useValidate();

const form = ref({
  name: '',
});
const formRef = ref();

const formData = computed(() => {
  return {
    form: form.value,
  }
});

/**
 *
 */
const validateForm = async () => {
  return await formRef.value.validate();
}

onMounted(() => {
  if (props.isEdit) {
    form.value = {
      name: props.formDetails.name,
    };
  }
})

defineExpose({
  formData,
  validateForm,
});
</script>

<style scoped lang="scss">

</style>
