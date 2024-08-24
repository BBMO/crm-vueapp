<template>
  <div class="q-pt-md">
    <q-form>
      <div class="row">
        <div class="col-12 q-py-md">
          <q-input
            outlined
            dense
            v-model="form.title"
            :label="$t('calendar.form.title')"
            :rules="[
              (val) => validateRequired(val) || $t('validation.requiredField'),
            ]"
          ></q-input>
        </div>

        <div class="col-12 q-py-md">
          <q-select
            outlined
            dense
            v-model="form.category"
            :label="$t('calendar.form.category')"
            :options="categories"
            :rules="[
              (val) => validateRequired(val) || $t('validation.requiredField'),
            ]"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                <q-item-section>
                  <q-item-label>
                    <div class="flex items-center">
                      <span
                        class="color-box rounded-borders"
                        :style="{
                          backgroundColor: scope.opt.color,
                          width: '8px',
                          height: '8px',
                        }">
                      </span>
                      <span class="q-ml-md">{{ scope.opt.label }}</span>
                    </div>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <div class="col-12 q-py-md">
          <q-input
            outlined
            dense
            v-model="form.startDate"
            :label="$t('calendar.form.startDate')"
            :rules="[
              (val) => validateRequired(val) || $t('validation.requiredField'),
            ]"
          >
          </q-input>
        </div>

        <div class="col-12 q-pt-md q-pb-sm">
          <q-input
            outlined
            dense
            v-model="form.endDate"
            :label="$t('calendar.form.endDate')"
            :rules="[
              (val) => validateRequired(val) || $t('validation.requiredField'),
            ]"
          >
          </q-input>
        </div>

        <div class="col-12 q-pb-lg">
          <q-toggle
            v-model="form.allDay"
            :label="$t('calendar.form.allDay')"
          ></q-toggle>
        </div>

        <div class="col-12 q-pt-lg q-pb-md">
          <q-input
            outlined
            dense
            v-model="form.location"
            :label="$t('calendar.form.location')"
            :rules="[
              (val) => validateRequired(val) || $t('validation.requiredField'),
            ]"
          ></q-input>
        </div>

        <div class="col-12 q-pt-lg q-pb-md">
          <q-input
            outlined
            dense
            type="textarea"
            v-model="form.description"
            :label="$t('calendar.form.description')"
            :rules="[
              (val) => validateRequired(val) || $t('validation.requiredField'),
            ]"
          ></q-input>
        </div>

        <div class="col-12 q-pt-lg q-pb-md">
          <q-btn
            type="submit"
            color="primary"
            class="full-width text-capitalize"
          >
            {{ $t('global.save') }}
          </q-btn>
        </div>
      </div>
    </q-form>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import useValidate  from 'src/composable/useValidate';

const { validateRequired } = useValidate();

const form = ref({
  title: '',
  category: '',
  startDate: '',
  endDate: '',
  allDay: false,
  location: '',
  description: '',
});

const categories = [
  { label: 'Meeting', value: 'meeting', color: '#71DD37' },
  { label: 'Call', value: 'call', color: '#FFAB00' },
  { label: 'Task', value: 'task', color: '#ff3e1d' },
];
</script>
