<template>
  <q-page class="q-page-general">
    <q-card class="my-card">
      <q-card-section>
        <q-splitter v-model="splitterModel">
          <template v-slot:before>
            <q-tabs v-model="tab" vertical>
              <q-tab name="opportunityStates" class="flex items-center gap-sm q-py-md" :ripple="false">
                <q-icon size="sm" name="mdi-store-check-outline" />
                <div class="flex column items-start">
                  <span class="text-capitalize text-weight-medium tab-title">{{ $t('modules.opportunity') }}</span>
                  <span class="text-capitalize text-weight-regular text-grey-5 tab-subtitle">{{ $t('modules.states') }}</span>
                </div>
              </q-tab>
              <q-tab name="propertyState" class="flex items-center gap-sm q-py-md" :ripple="false">
                <q-icon size="sm" name="mdi-home-clock-outline" />
                <div class="flex column items-start">
                  <span class="text-capitalize text-weight-medium tab-title">{{ $t('modules.property') }}</span>
                  <span class="text-capitalize text-weight-regular text-grey-5 tab-subtitle">{{ $t('modules.states') }}</span>
                </div>
              </q-tab>
              <q-tab name="propertyTypes" class="flex items-center gap-sm q-py-md" :ripple="false">
                <q-icon size="sm" name="mdi-home-city-outline" />
                <div class="flex column items-start">
                  <span class="text-capitalize text-weight-medium tab-title">{{ $t('modules.property') }}</span>
                  <span class="text-capitalize text-weight-regular text-grey-5 tab-subtitle">{{ $t('modules.types') }}</span>
                </div>
              </q-tab>
              <q-tab name="propertyFeatures" class="flex items-center gap-sm q-py-md" :ripple="false">
                <q-icon size="sm" name="mdi-home-search-outline" />
                <div class="flex column items-start">
                  <span class="text-capitalize text-weight-medium tab-title">{{ $t('modules.property') }}</span>
                  <span class="text-capitalize text-weight-regular text-grey-5 tab-subtitle">{{ $t('modules.features') }}</span>
                </div>
              </q-tab>
            </q-tabs>
          </template>

          <template v-slot:after>
            <q-tab-panels
              v-model="tab"
              animated
              swipeable
              vertical
              transition-prev="jump-up"
              transition-next="jump-up"
            >
              <q-tab-panel name="opportunityStates">
                <opportunity-states-component />
              </q-tab-panel>

              <q-tab-panel name="propertyState">
                <property-states-component />
              </q-tab-panel>

              <q-tab-panel name="propertyTypes">
                <property-types />
              </q-tab-panel>

              <q-tab-panel name="propertyFeatures">
                <property-features />
              </q-tab-panel>
            </q-tab-panels>
          </template>

        </q-splitter>
      </q-card-section>
    </q-card>
  </q-page>
</template>


<script setup lang="ts">
import { ref } from 'vue';
// Components
import OpportunityStatesComponent from 'components/SettingComponents/OpportunityStatesComponent.vue';
import PropertyStatesComponent from 'components/SettingComponents/PropertyStatesComponent.vue';
import PropertyTypes from 'components/SettingComponents/PropertyTypes.vue';
import PropertyFeatures from 'components/SettingComponents/PropertyFeatures.vue';

const tab = ref('opportunityStates');
const splitterModel = ref(20);

</script>

<style scoped lang="scss">
.q-tab {
  justify-content: flex-start !important;
  padding: 15px 10px !important;

  :deep(.q-tab__content) {
    display: flex;
    flex-direction: row;
    gap: 12px;
  }

  :deep(.q-focus-helper),
  :deep(.q-tab__indicator){
    display: none !important;
  }

  :deep(.q-icon) {
    background: $grey-base;
    border-radius: 5px;
    padding: 8px;
  }
}

:deep(.q-tab--active .q-icon) {
  background: var(--q-primary);
  box-shadow: 0 2px 4px rgba(105, 108, 255, 0.5);
  color: white;
}

:deep(.q-tab--active .tab-title) {
  color: var(--q-primary);
}

:deep(.q-tab--active .tab-subtitle) {
  color: var(--q-base-text-color) !important;
}

@media screen and (max-width: 1260px) {
  .q-splitter {
    :deep(.q-splitter__before) {
      width: 25% !important;
    }
  }
}

@media screen and (max-width: 768px) {
  .q-splitter {
    flex-wrap: wrap;
    flex-direction: column;

    :deep(.q-splitter__before) {
      width: 100% !important;
    }

    :deep(.q-splitter__separator) {
      width: 100%;
      height: 1px;
      margin: 12px 0;
    }
  }
}
</style>
