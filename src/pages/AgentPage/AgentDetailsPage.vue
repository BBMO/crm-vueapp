<template>
  <q-page class="q-page-general">
    <div class="flex items-center gap-xs q-mb-lg">
      <q-icon size="xs" color="primary" name="mdi-arrow-left"/>
      <p class="text-subtitle2 text-weight-medium text-primary q-ma-none cursor-pointer" @click="backToList">{{ $t('global.back') }}</p>
    </div>
    <div class="row">
      <div class="col-12 col-md-4 q-mb-lg q-pr-sm user-details-section">
        <agent-details-component />
      </div>
      <div class="col-12 col-md-8 q-pl-sm user-information-section">
        <q-tabs
          v-model="tab"
          align="start"
          narrow-indicator
          class="q-mb-lg"
        >
          <q-tab name="general" class="flex items-center gap-sm" :ripple="false">
            <q-icon size="sm" name="mdi-home-silo-outline" />
            <p class="text-capitalize text-weight-medium q-ma-none q-py-xs">{{ $t('agent.properties') }}</p>
          </q-tab>
          <q-tab name="security" class="flex items-center gap-sm" :ripple="false">
            <q-icon size="sm" name="mdi-file-sign" />
            <p class="text-capitalize text-weight-medium q-ma-none q-py-xs">{{ $t('agent.opportunities') }}</p>
          </q-tab>
        </q-tabs>

        <div>
          <q-tab-panels
            v-model="tab"
            animated
            transition-prev="scale"
            transition-next="scale"
            class="bg-transparent"
          >
            <q-tab-panel name="general" class="q-pa-none flex gap-lg">
              <agent-details-properties-component />
            </q-tab-panel>

            <q-tab-panel name="security" class="q-pa-none flex gap-lg">
              <agent-details-opportunities-component />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Components
import AgentDetailsComponent from 'components/AgentComponents/AgentDetailsComponent.vue';
import AgentDetailsOpportunitiesComponent from 'components/AgentComponents/AgentDetailsOpportunitiesComponent.vue';
import AgentDetailsPropertiesComponent from 'components/AgentComponents/AgentDetailsPropertiesComponent.vue';

const router = useRouter();

const tab = ref('general');

const backToList = () => {
  router.push({ name: 'agents' });
};
</script>

<style scoped lang="scss">
.q-tab {
  border-radius: 5px;
  margin-right: 10px;
  min-height: 40px !important;

  :deep(.q-tab__content) {
    display: flex;
    flex-direction: row;
    gap: 5px;
  }

  :deep(.q-focus-helper),
  :deep(.q-tab__indicator){
    display: none !important;
  }
}

.q-tab:hover {
  background: var(--q-secondary);
  color: var(--q-primary);
}

:deep(.q-tab--active) {
  background: var(--q-primary);
  box-shadow: 0 3px 8px rgba(34, 48, 32, 0.1), 0 0 transparent, 0 0 transparent;
  color: white;
  pointer-events: none;
}

@media screen and (max-width: 1023px) {
  .user-details-section,
  .user-information-section {
    padding: 0;
  }
}
</style>
