<template>
  <div>
    <q-card>
      <div v-if="!isLoading && agentDetails" class="flex column gap-lg q-pa-lg">
        <div class="flex column items-center">
          <q-avatar rounded size="100px" color="white" text-color="white"><img :src="agentDetails.avatar" alt=""></q-avatar>
          <p class="text-subtitle1 text-weight-medium q-mt-md q-mb-xs text-capitalize">{{ agentDetails.first_name }} {{ agentDetails.last_name }}</p>
          <q-chip square class="text-weight-medium" color="grey-2" text-color="grey" :ripple="false">{{ $t('agent.title') }}</q-chip>
        </div>
        <div class="flex column gap-md stats-details-section">
          <div class="flex items-center gap-sm">
            <q-icon size="sm" color="primary" name="mdi-home-group" class="bg-secondary q-pa-sm" />
            <div class="flex column items-start">
              <span class="text-weight-medium">{{ agentDetails.total_properties }}</span>
              <span class="text-weight-regular text-grey-5">{{ $t('agent.quantityProperties') }}</span>
            </div>
          </div>
          <div class="flex items-center gap-sm">
            <q-icon size="sm" color="primary" name="mdi-account-cash-outline" class="bg-secondary q-pa-sm" />
            <div class="flex column items-start">
              <span class="text-weight-medium">{{ agentDetails.total_sales_amount }} $</span>
              <span class="text-weight-regular text-grey-5">{{ $t('agent.fromSales') }}</span>
            </div>
          </div>
          <div class="flex items-center gap-sm">
            <q-icon size="sm" color="primary" name="mdi-account-key-outline" class="bg-secondary q-pa-sm" />
            <div class="flex column items-start">
              <span class="text-weight-medium">{{ agentDetails.total_rent_amount }} $</span>
              <span class="text-weight-regular text-grey-5">{{ $t('agent.rentalIncome') }}</span>
            </div>
          </div>
        </div>
        <div class="flex column gap-sm">
          <p class="text-subtitle1 text-weight-medium q-ma-none">{{ $t('global.details') }}</p>
          <q-separator />
          <div class="q-pt-xs">
            <p class="text-weight-medium q-ma-none q-py-xs">{{ $t('agent.form.firstName') }}: <span class="text-weight-regular text-grey-6">{{ agentDetails.first_name }}</span></p>
            <p class="text-weight-medium q-ma-none q-py-xs">{{ $t('agent.form.lastName') }}: <span class="text-weight-regular text-grey-6">{{ agentDetails.last_name }}</span></p>
            <p class="text-weight-medium q-ma-none q-py-xs">{{ $t('agent.form.email') }}: <span class="text-weight-regular text-grey-6">{{ agentDetails.email }}</span></p>
          </div>
        </div>
        <div class="flex justify-center gap-sm">
          <q-btn color="primary" class="q-px-lg" :ripple="false" @click="agentFormDialog = true">{{ $t('global.edit') }}</q-btn>
          <q-btn v-if="getIsAdmin()" color="red-2" class="q-px-lg shadow-0 text-red" :ripple="false" @click="deleteDialog = true">{{ $t('global.delete') }}</q-btn>
        </div>
      </div>
      <div v-if="isLoading" class="full-width full-height flex align-center justify-center q-py-xl">
        <q-spinner color="primary" size="3em" />
      </div>
    </q-card>

    <q-dialog
      v-model="agentFormDialog"
      full-height
      position="right"
      square
      maximized
    >
      <q-card class="dialog-card">
        <div class="q-px-lg q-py-md flex items-center dialog-title">
          <h6 class="text-h6 q-ma-none">{{ $t('agent.editAgent') }}</h6>
          <q-space />
          <q-icon name="close" size="sm" class="cursor-pointer" @click="agentFormDialog = false" />
        </div>
        <q-separator />
        <div class="q-pa-lg">
          <agent-form-component
            ref="formData"
            :is-edit="true"
          />
          <q-btn :loading="isLoadingSave" color="primary" class="full-width text-capitalize q-mt-md" @click="saveAgent">{{ $t('global.save') }}</q-btn>
        </div>
      </q-card>
    </q-dialog>

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
          <q-btn :loading="isLoadingDelete" :label="$t('global.accept')" color="primary" class="no-box-shadow" :ripple="false" @click="deleteAgent" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
// Interfaces
import type { AgentDetailsInterface } from 'src/interfaces/agent.interface';
// Composable
import useRole from 'src/composable/useRole';
// Store
import { useAgentStore } from 'src/stores/agent.store';
// Services
import AgentsService from 'src/services/agents.service';
// Components
import AgentFormComponent from 'components/AgentComponents/AgentFormComponent.vue';

const { t } = useI18n();
const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const { getIsAdmin, getWpUserId } = useRole();
const agentStore = useAgentStore();

const isLoading = ref(false);
const isLoadingSave = ref(false);
const isLoadingDelete = ref(false);

const agentFormDialog = ref(false);
const deleteDialog = ref(false);

const formData = ref<typeof AgentFormComponent | null>(null);
const agentDetails: Ref<AgentDetailsInterface | null> = ref(null);

const agentId = computed(() => agentStore.getAgentId);

/**
 *
 */
const getAgentDetails = async () => {
  const { data } = await AgentsService.getAgent(agentId.value);
  agentDetails.value = data?.data || undefined;
}

/**
 *
 */
const validateForm = async () => {
  return await formData.value?.validateForm();
}

/**
 *
 */
const saveAgent = async () => {
  isLoadingSave.value = true;

  if (await validateForm()) {
    const payload = new FormData();
    payload.append('email', formData.value?.formData.form.email);
    payload.append('first_name', formData.value?.formData.form.first_name);
    payload.append('last_name', formData.value?.formData.form.last_name);

    if (formData.value?.formData.form.image) {
      payload.append('image', formData.value?.formData.form.image);
    }

    try {
      await AgentsService.updateAgent(agentId.value, payload);
      $q.notify({ message: t('global.successUpdateMessage'), color: 'green', position: 'bottom' });
    } catch (error) {
      $q.notify({ message: t('global.errorMessage'), color: 'red', position: 'bottom' });
    }

    await getAgentDetails();
    agentFormDialog.value = false;
  }

  isLoadingSave.value = false;
}

/**
 *
 */
const deleteAgent = async () => {
  try {
    await AgentsService.deleteAgent(agentId.value);
    $q.notify({ message: t('global.successDeleteMessage'), color: 'green', position: 'bottom' });
    await router.push({name: 'agents'});
  } catch (error) {
    $q.notify({ message: t('global.errorMessage'), color: 'red', position: 'bottom' });
  }
}

onMounted(async () => {
  isLoading.value = true;

  if (!getIsAdmin() && (getWpUserId() !== route.params.id)) {
    await router.push({name: 'home'});
    return;
  }

  if (!agentId.value) {
    agentStore.setAgentId(`${route.params.id}`);
  }

  await getAgentDetails();
  isLoading.value = false;
})
</script>

<style scoped lang="scss">
.stats-details-section {
  .q-icon {
    border-radius: 5px;
  }
}
</style>
