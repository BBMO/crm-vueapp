<template>
  <div>
    <div class="q-pb-lg flex row justify-between gap-sm">
      <h5 class="q-ma-none">{{ $t('setting.automation') }} - {{ $t('setting.emails') }}</h5>
    </div>
    <q-separator/>
    <div class="q-my-lg q-pa-sm bg-amber-1 text-amber-14 flex items-center no-wrap gap-sm warning-section">
      <q-icon size="sm" name="mdi-alert" />
      <p class="q-ma-none">{{ $t('setting.messageWarningEmails') }}</p>
    </div>
    <q-form ref="formRef">
      <div>
        <div class="q-py-sm flex items-center no-wrap gap-xs">
          <q-toggle v-model="form.is_active" color="primary" @update:modelValue="updateRecommendedProperties" />
          <p class="q-ma-none">{{ $t('setting.enableMailSending') }}</p>
        </div>
        <div class="q-py-xs input-commission">
          <label>{{ $t('setting.form.frequency') }}</label>
          <q-select
            outlined
            dense
            v-model="form.frequency"
            option-label="label"
            option-value="value"
            :options="frequencySelect"
            :disable="!isEditable"
            :rules="[
              (val: any) => validateRequiredSelect(val.value) || $t('validation.requiredField'),
            ]"
          ><template v-slot:prepend><q-icon name="mdi-calendar-clock-outline" /></template></q-select>
        </div>
        <div class="q-py-xs input-commission">
          <label>{{ $t('setting.form.time') }}</label>
          <q-input
            outlined
            dense
            v-model="form.time"
            :disable="!isEditable"
            :rules="[
              (val: any) => validateRequired(val) || $t('validation.requiredField'),
            ]"
          >
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-time v-model="form.time" mask="HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
      </div>
      <q-btn :loading="isLoadingSave" :disable="!isEditable" color="primary" class="text-capitalize q-px-xl q-mt-sm" :ripple="false" @click="saveAutomation">{{ $t('global.save') }}</q-btn>
    </q-form>
    <div class="q-mt-xl q-mb-md q-pa-sm bg-blue-1 text-blue note-section">
      <p class="q-mx-none q-mt-none q-mb-md">{{ $t('setting.cron.recommendation') }}</p>
      <p class="q-mx-none q-mt-none q-mb-md">
        {{ $t('setting.cron.stepOne') }}
        <span class="text-weight-bold block q-mt-sm">define('DISABLE_WP_CRON', true);</span>
      </p>
      <p class="q-mx-none q-mt-none q-mb-sm">
        {{ $t('setting.cron.stepTwo') }}
        <span class="text-weight-bold block q-mt-sm">*/15 * * * * wget -q -O - https://yourdomain.com/wp-cron.php?doing_wp_cron</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
// Interfaces
import type { AppConfigEmailInterface } from 'src/interfaces/app.interface';
// Constants
import { GLOBAL } from 'src/constants/global.constant';
// Composable
import useValidate from 'src/composable/useValidate';
// Services
import SettingsService from 'src/services/settings.service';

const { t } = useI18n();
const { validateRequired, validateRequiredSelect } = useValidate();
const $q = useQuasar();

const frequencySelect = [
  { label: t('global.weekly'), value: GLOBAL.WEEKLY },
  { label: t('global.two_weeks'), value: GLOBAL.TWO_WEEKS },
  { label: t('global.monthly'), value: GLOBAL.MONTHLY },
]

const isLoadingSave = ref(false);
const isEditable = ref(false);

const form = ref<AppConfigEmailInterface>({
  frequency: {
    label: '',
    value: ''
  },
  time: '',
  is_active: false
});
const formRef = ref();

/**
 *
 */
const updateRecommendedProperties = async (value: boolean) => {
  if (value) {
    isEditable.value = true;
  } else {
    try {
      await SettingsService.deactivateRecommendedProperties();
      $q.notify({ message: t('global.successSaveMessage'), color: 'green', position: 'bottom' });
    } catch (error) {
      $q.notify({ message: t('global.errorMessage'), color: 'red', position: 'bottom' });
    }

    isEditable.value = false;
  }
}

/**
 *
 */
const validateForm = async () => {
  return await formRef.value.validate();
}

/**
 *
 */
const saveAutomation = async () => {
  isLoadingSave.value = true;

  if (await validateForm()) {
    const payload = {
      frequency: form.value.frequency.value,
      time: form.value.time
    }

    console.log(payload)

    try {
      await SettingsService.saveRecommendedProperties(payload);
      $q.notify({ message: t('global.successSaveMessage'), color: 'green', position: 'bottom' });
    } catch (error) {
      $q.notify({ message: t('global.errorMessage'), color: 'red', position: 'bottom' });
    }
  }

  isLoadingSave.value = false;
}

onMounted(async () => {
  const { data } = await SettingsService.getRecommendedProperties();

  if (data?.data.frequency !== null && data?.data.time !== null) {
    form.value = {
      frequency: {
        label: frequencySelect.find((freq: any) => freq.value === data?.data.frequency)?.label || '',
        value: data?.data.frequency,
      },
      time: data?.data.time,
      is_active: data?.data.is_active,
    }

    isEditable.value = data?.data.is_active;
  }
})
</script>

<style scoped lang="scss">
.warning-section {
  border-radius: 5px;
  border: 1px solid $amber-14;
}

.note-section {
  border-radius: 5px;
  border: 1px solid $blue;
}

.input-commission {
  max-width: 300px;
}
</style>
