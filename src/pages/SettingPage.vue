<template>
  <q-page class="q-page-general">
    <q-card class="q-pa-sm">
      <q-splitter v-model="splitterModel">
        <template v-slot:before>
          <q-tabs v-model="tab" vertical>
            <q-tab name="opportunityStates" class="flex items-center gap-sm q-py-md" :ripple="false">
              <q-icon size="sm" name="mdi-store-check-outline" />
              <div class="flex column items-start">
                <span class="text-capitalize text-weight-medium tab-title">{{ $t('setting.opportunity') }}</span>
                <span class="text-capitalize text-weight-regular text-grey-5 tab-subtitle">{{ $t('setting.states') }}</span>
              </div>
            </q-tab>
            <q-tab name="propertyState" class="flex items-center gap-sm q-py-md" :ripple="false">
              <q-icon size="sm" name="mdi-home-clock-outline" />
              <div class="flex column items-start">
                <span class="text-capitalize text-weight-medium tab-title">{{ $t('setting.property') }}</span>
                <span class="text-capitalize text-weight-regular text-grey-5 tab-subtitle">{{ $t('setting.states') }}</span>
              </div>
            </q-tab>
            <q-tab name="propertyTypes" class="flex items-center gap-sm q-py-md" :ripple="false">
              <q-icon size="sm" name="mdi-home-city-outline" />
              <div class="flex column items-start">
                <span class="text-capitalize text-weight-medium tab-title">{{ $t('setting.property') }}</span>
                <span class="text-capitalize text-weight-regular text-grey-5 tab-subtitle">{{ $t('setting.types') }}</span>
              </div>
            </q-tab>
            <q-tab name="propertyFeatures" class="flex items-center gap-sm q-py-md" :ripple="false">
              <q-icon size="sm" name="mdi-home-search-outline" />
              <div class="flex column items-start">
                <span class="text-capitalize text-weight-medium tab-title">{{ $t('setting.property') }}</span>
                <span class="text-capitalize text-weight-regular text-grey-5 tab-subtitle">{{ $t('setting.features') }}</span>
              </div>
            </q-tab>
            <q-tab name="calendarCategories" class="flex items-center gap-sm q-py-md" :ripple="false">
              <q-icon size="sm" name="mdi-calendar-filter-outline" />
              <div class="flex column items-start">
                <span class="text-capitalize text-weight-medium tab-title">{{ $t('setting.calendar') }}</span>
                <span class="text-capitalize text-weight-regular text-grey-5 tab-subtitle">{{ $t('setting.categories') }}</span>
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
              <property-types-component />
            </q-tab-panel>

            <q-tab-panel name="propertyFeatures">
              <property-features-component />
            </q-tab-panel>

            <q-tab-panel name="calendarCategories">
              <calendar-categories-component />
            </q-tab-panel>
          </q-tab-panels>
        </template>
      </q-splitter>
    </q-card>
  </q-page>
</template>


<script setup lang="ts">
import { ref } from 'vue';
// Components
import OpportunityStatesComponent from 'components/SettingComponents/OpportunityStatesComponent.vue';
import PropertyStatesComponent from 'components/SettingComponents/PropertyStatesComponent.vue';
import PropertyTypesComponent from 'components/SettingComponents/PropertyTypesComponent.vue';
import PropertyFeaturesComponent from 'components/SettingComponents/PropertyFeaturesComponent.vue';
import CalendarCategoriesComponent from 'components/SettingComponents/CalendarCategoriesComponent.vue';

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
    background: var(--q-base-color);
    border-radius: 5px;
    padding: 8px;
  }
}

:deep(.q-tab--active .q-icon) {
  background: var(--q-primary);
  box-shadow: 0 3px 8px rgba(34, 48, 32, 0.1), 0 0 transparent, 0 0 transparent;
  color: white;
}

:deep(.q-tab--active .tab-title) {
  color: var(--q-primary);
}

:deep(.q-tab--active .tab-subtitle) {
  color: var(--q-base-text-color) !important;
}

:deep(.q-panel) {
  overflow: hidden;
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
