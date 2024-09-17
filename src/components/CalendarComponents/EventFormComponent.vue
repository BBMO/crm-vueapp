<template>
  <div class="q-pt-md">
    <q-form ref="formRef" @submit="saveQuote">
      <div class="q-py-xs">
        <label>{{ $t('calendar.form.title') }}</label>
        <q-input
          outlined
          dense
          v-model="form.title"
          :rules="[
            (val: any) => validateRequired(val) || $t('validation.requiredField'),
          ]"
        ></q-input>
      </div>
      <div class="q-py-xs">
        <label>{{ $t('calendar.form.category') }}</label>
        <q-select
          outlined
          dense
          v-model="form.category"
          option-label="name"
          option-value="id"
          :options="quoteCategoriesList"
          :rules="[
            (val: any) => validateRequiredSelect(val) || $t('validation.requiredField'),
          ]"
        ></q-select>
      </div>

      <div class="q-py-xs">
        <label>{{ $t('calendar.form.startDate') }}</label>
        <q-input
          outlined
          dense
          v-model="form.startDate"
          :rules="[
            (val: any) => validateRequired(val) || $t('validation.requiredField'),
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="form.startDate" mask="YYYY-MM-DD HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="form.startDate" mask="YYYY-MM-DD HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="q-py-xs">
        <label>{{ $t('calendar.form.endDate') }}</label>
        <q-input
          outlined
          dense
          v-model="form.endDate"
          :rules="[
            (val: any) => validateRequired(val) || $t('validation.requiredField'),
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="form.endDate" mask="YYYY-MM-DD HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="form.endDate" mask="YYYY-MM-DD HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="q-py-xs">
        <label>{{ $t('calendar.form.location') }}</label>
        <q-input
          outlined
          dense
          v-model="form.location"
          :rules="[
            (val: any) => validateRequired(val) || $t('validation.requiredField'),
          ]"
        ></q-input>
      </div>
      <div class="q-py-xs">
        <label>{{ $t('calendar.form.description') }}</label>
        <q-input
          outlined
          dense
          type="textarea"
          v-model="form.description"
          :rules="[
            (val: any) => validateRequired(val) || $t('validation.requiredField'),
          ]"
        ></q-input>
      </div>
      <div class="q-py-md">
        <q-btn :loading="isLoadingSave" type="submit" color="primary" class="full-width text-capitalize">{{ props.isEdit ? $t('global.update') : $t('global.save') }}</q-btn>
      </div>
      <div v-if="props.isEdit" class="q-py-sm">
        <q-btn
          outline
          dense
          color="negative"
          icon="delete"
          :ripple="false"
          class="full-width no-box-shadow text-capitalize q-px-sm"
          @click="deleteQuote()"
        >{{ $t('calendar.deleteEvent') }}</q-btn>
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Ref } from 'vue';
// Interfaces
import type { CalendarDropdownInterface } from 'src/interfaces/calendar.interface';
// Composables
import useValidate  from 'src/composable/useValidate';
// Services
import CalendarService from 'src/services/calendar.service';

interface Props {
  isEdit: boolean | false;
}
const props = defineProps<Props>();
const emit = defineEmits(['closeEventDialog']);

const { validateRequired, validateRequiredSelect } = useValidate();

const isLoadingSave = ref(false);

const form = ref({
  title: '',
  category: {
    id: '',
    name: '',
  },
  startDate: '',
  endDate: '',
  location: '',
  description: '',
});
const formRef = ref();

const quoteCategoriesList: Ref<CalendarDropdownInterface[]> = ref([]);

/**
 *
 */
const getQuoteCategories = async () => {
  const { data } = await CalendarService.getQuoteCategories();
  quoteCategoriesList.value = data?.data;
};

/**
 *
 */
const validateForm = async () => {
  return await formRef.value.validate();
}

/**
 *
 */
const saveQuote = async () => {
  isLoadingSave.value = true;

  if (await validateForm()) {
    try {
      const payload = {
        title: form.value.title,
        start_date: form.value.startDate,
        end_date: form.value.endDate,
        location: form.value.location,
        observations: form.value.description,
        category_id: form.value.category.id,
      };

      await CalendarService.createQuote(payload);
      emit('closeEventDialog');

      console.log(payload);
    } catch (error) {
      console.error(error);
    }
  }

  isLoadingSave.value = false;
}

/**
 *
 */
const deleteQuote = async () => {
  // await CalendarService.deleteQuote(quoteId);
  emit('closeEventDialog');
}

onMounted( async () => {
  await getQuoteCategories();

  if (props.isEdit) {
    console.log('Formulation edit');
  }
});
</script>

<style scoped lang="scss">

</style>
