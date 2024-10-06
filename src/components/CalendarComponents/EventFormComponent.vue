<template>
  <div>
    <q-form v-if="!isLoading" ref="formRef" @submit="saveQuote">
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
          :options="quoteCategoriesSelect"
          :rules="[
            (val: any) => validateRequiredSelect(val.id) || $t('validation.requiredField'),
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
      <div v-if="getIsAdmin()" class="q-pt-xs q-pb-md">
        <label>{{ $t('calendar.form.agent') }}</label>
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
      <div class="q-py-md flex column gap-lg">
        <q-btn :loading="isLoadingSave" type="submit" color="primary" class="full-width text-capitalize">{{ props.isEdit ? $t('global.update') : $t('global.save') }}</q-btn>
        <q-btn
          v-if="props.isEdit"
          outline
          dense
          color="negative"
          icon="delete"
          :ripple="false"
          class="full-width no-box-shadow text-capitalize q-px-sm"
          @click="deleteDialog = true"
        >{{ $t('calendar.deleteEvent') }}</q-btn>
      </div>
    </q-form>
    <div v-if="isLoading" class="full-width full-height flex align-center justify-center">
      <q-spinner color="primary" size="3em" />
    </div>

    <q-dialog v-model="deleteDialog" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <div class="flex no-wrap items-center gap-sm">
            <q-icon size="md" name="mdi-delete-outline" color="negative" />
            <span>{{ $t('global.deleteMessage') }}</span>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn outline :label="$t('global.cancel')" color="primary" class="no-box-shadow" :ripple="false" @click="deleteDialog = false" />
          <q-btn :loading="isLoadingDelete" :label="$t('global.accept')" color="primary" class="no-box-shadow" :ripple="false" @click="deleteQuote" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
// Interfaces
import type { CommonSelectInterface } from 'src/interfaces/app.interface';
import type { CalendarDropdownInterface, CalendarEventFormInterface, CalendarEventDetailsInterface } from 'src/interfaces/calendar.interface';
// Composable
import useValidate  from 'src/composable/useValidate';
import useRole from 'src/composable/useRole';
// Services
import CalendarService from 'src/services/calendar.service';
import AgentsService from 'src/services/agents.service';

interface Props {
  isEdit: boolean | false;
  quoteId?: string;
}
const props = defineProps<Props>();
const emit = defineEmits(['closeEventDialog']);

const { t } = useI18n();
const $q = useQuasar();
const { validateRequired, validateRequiredSelect } = useValidate();
const { getIsAdmin, getWpUserId } = useRole();

const isLoading = ref(false);
const isLoadingSave = ref(false);
const isLoadingDelete = ref(false);
const deleteDialog = ref(false);

const form = ref<CalendarEventFormInterface>({
  title: '',
  category: {
    id: '',
    name: '',
  },
  startDate: '',
  endDate: '',
  location: '',
  description: '',
  agent: {
    id: '',
    name: '',
  }
});
const formRef = ref();

const quoteDetails = ref<CalendarEventDetailsInterface | null>(null);

const quoteCategoriesSelect: Ref<CalendarDropdownInterface[]> = ref([]);
const agentsSelect: Ref<CommonSelectInterface[]> = ref([]);

/**
 *
 */
const getSelectsData = async () => {
  const { data: quoteCategoriesData } = await CalendarService.getQuoteCategories();
  quoteCategoriesSelect.value = quoteCategoriesData?.data || [];

  const { data: agentsData } = await AgentsService.getAgents();
  agentsSelect.value = agentsData?.data?.items.map((agent: any) => ({
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
const validateForm = async () => {
  return await formRef.value.validate();
}

/**
 *
 */
const saveQuote = async () => {
  isLoadingSave.value = true;

  if (await validateForm()) {
    const payload = {
      title: form.value.title,
      start_date: form.value.startDate,
      end_date: form.value.endDate,
      location: form.value.location,
      observations: form.value.description,
      category_id: form.value.category.id,
      agent_id: form.value.agent?.id,
    };

    if (!payload.agent_id) delete payload.agent_id;

    if (props.isEdit) {
      if (props.quoteId) {
        try {
          await CalendarService.updateQuote(props.quoteId, payload);
          $q.notify({ message: t('global.successUpdateMessage'), color: 'green', position: 'bottom' });
        } catch (error) {
          $q.notify({ message: t('global.errorMessage'), color: 'red', position: 'bottom' });
        }
      }
    } else {
      try {
        await CalendarService.createQuote(payload);
        $q.notify({ message: t('global.successCreateMessage'), color: 'green', position: 'bottom' });
      } catch (error) {
        $q.notify({ message: t('global.errorMessage'), color: 'red', position: 'bottom' });
      }
    }

    emit('closeEventDialog');
  }

  isLoadingSave.value = false;
}

/**
 *
 */
const deleteQuote = async () => {
  isLoadingDelete.value = true;

  if (props.quoteId) {
    try {
      await CalendarService.deleteQuote(props.quoteId);
      $q.notify({ message: t('global.successDeleteMessage'), color: 'green', position: 'bottom' });
    } catch (error) {
      $q.notify({ message: t('global.errorMessage'), color: 'red', position: 'bottom' });
    }

    emit('closeEventDialog');
  }

  isLoadingDelete.value = false;
}

onMounted( async () => {
  isLoading.value = true;

  await getSelectsData();

  if (props.isEdit && props.quoteId) {
    const { data } = await CalendarService.getQuote(props.quoteId);
    quoteDetails.value = data?.data;

    if (quoteDetails.value) {
      form.value = {
        ...form.value,
        title: quoteDetails.value.title,
        category: {
          id: quoteDetails.value.category.id,
          name: quoteDetails.value.category.name,
        },
        startDate: quoteDetails.value.start_date,
        endDate: quoteDetails.value.end_date,
        location: quoteDetails.value.location,
        description: quoteDetails.value.observations,
        agent: {
          id: quoteDetails.value.agent.id,
          name: quoteDetails.value.agent.name,
        }
      }
    }
  }

  if (!getIsAdmin()) {
    form.value.agent = {
      id: getWpUserId(),
      name: agentsSelect.value.find((agent: CommonSelectInterface) => agent.id == getWpUserId())?.name || '',
    }
  }

  isLoading.value = false;
});
</script>

<style scoped lang="scss">

</style>
