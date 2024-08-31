<template>
  <div class="q-pt-md">
    <q-form @submit="onsubmit">
      <div class="row">
        <div class="col-12 q-py-md">
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

        <div class="col-12 q-pb-md form-color-section">
          <label>{{ $t('setting.form.color') }}</label>
          <q-color
            v-model="form.color"
            no-footer
            default-view="palette"
            class="q-mt-xs"
          />
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
// Composable
import useValidate  from 'src/composable/useValidate';

const { validateRequired } = useValidate();

const form = ref({
  name: '',
  color: '#696CFF'
});

const onsubmit = () => {
  console.log(form.value);
};

</script>

<style scoped lang="scss">
.form-color-section {
  label {
    color: rgba(0, 0, 0, 0.6);
  }

  :deep(.q-color-picker) {
    max-width: 200px;
  }
}
</style>
