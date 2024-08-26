<template>
  <q-page class="q-page-general">
    <div class="row">
      <div class="col-12 col-md-4 q-mb-lg q-pr-sm user-details-section">
        <user-details-component />
      </div>
      <div class="col-12 col-md-8 q-pl-sm user-information-section">
        <q-tabs
          v-model="tab"
          align="start"
          narrow-indicator
          class="q-mb-lg"
        >
          <q-tab name="general" class="flex items-center gap-sm" :ripple="false">
            <q-icon size="sm" name="mdi-folder-information-outline" />
            <p class="text-capitalize text-weight-medium q-ma-none q-py-xs">{{ $t('global.general') }}</p>
          </q-tab>
          <q-tab name="security" class="flex items-center gap-sm" :ripple="false">
            <q-icon size="sm" name="mdi-lock-outline" />
            <p class="text-capitalize text-weight-medium q-ma-none q-py-xs">{{ $t('global.security') }}</p>
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
              <user-details-contact-component />
              <user-details-property-component />
            </q-tab-panel>

            <q-tab-panel name="security" class="q-pa-none flex gap-lg">
              <user-details-security-component />
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// Components
import UserDetailsComponent from 'components/UserComponents/UserDetailsComponent.vue';
import UserDetailsContactComponent from 'components/UserComponents/UserDetailsContactComponent.vue';
import UserDetailsPropertyComponent from 'components/UserComponents/UserDetailsPropertyComponent.vue';
import UserDetailsSecurityComponent from 'components/UserComponents/UserDetailsSecurityComponent.vue';

const tab = ref('general');
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
