<template>
  <div>
    <q-card v-if="!isLoading" class="property-container">
      <div class="q-px-md q-py-lg filters-section">
        <q-expansion-item default-opened>
          <template v-slot:header>
            <div class="flex items-center gap-xs">
              <q-icon size="sm" name="mdi-filter-multiple" />
              <h6 class="q-ma-none text-weight-medium">{{ $t('global.filters') }}</h6>
            </div>
          </template>
          <q-card>
            <q-card-section class="q-px-none q-py-sm">
              <div class="row">
                <div class="col-sm-4 col-12 q-pa-sm">
                  <label>{{ $t('property.form.price') }}</label>
                  <q-range
                    label-always
                    switch-label-side
                    v-model="filters.price"
                    color="primary"
                    class="q-px-sm"
                    :min="0"
                    :max="50"
                    :left-label-value="filters.price.min + '$'"
                    :right-label-value="filters.price.max + '$'"
                  />
                </div>
                <div class="col-sm-4 col-12 q-pa-sm">
                  <label>{{ $t('property.form.status') }}</label>
                  <q-select
                    outlined
                    dense
                    v-model="filters.status"
                    option-label="label"
                    option-value="value"
                    :options="statusSelect"
                  ></q-select>
                </div>
                <div class="col-sm-4 col-12 q-pa-sm">
                  <label>{{ $t('property.form.address') }}</label>
                  <q-input
                    outlined
                    dense
                    v-model="filters.address"
                    :placeholder="$t('global.search')"
                  ></q-input>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-4 col-12 q-pa-sm">
                  <label>{{ $t('property.form.type') }}</label>
                  <q-select
                    outlined
                    dense
                    v-model="filters.type"
                    option-label="name"
                    option-value="id"
                    :options="propertyTypesSelect"
                  ><template v-slot:prepend><q-icon name="mdi-home-city-outline" /></template></q-select>
                </div>
                <div class="col-sm-4 col-12 q-pa-sm">
                  <label>{{ $t('property.form.availableFor') }}</label>
                  <q-select
                    outlined
                    dense
                    v-model="filters.available_for"
                    option-label="label"
                    option-value="value"
                    :options="availableForSelect"
                  ><template v-slot:prepend><q-icon name="mdi-finance" /></template></q-select>
                </div>
                <div class="col-sm-4 col-12 q-pa-sm">
                  <label>{{ $t('property.form.agent') }}</label>
                  <q-select
                    outlined
                    dense
                    v-model="filters.agent"
                    option-label="name"
                    option-value="id"
                    :options="propertyAgentsSelect"
                  ><template v-slot:prepend><q-icon name="mdi-account-outline" /></template></q-select>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-3 col-12 q-pa-sm">
                  <label>{{ $t('property.form.bedrooms') }}</label>
                  <q-input
                    outlined
                    dense
                    v-model="filters.bedrooms"
                    type="number"
                    :min="0"
                  ><template v-slot:prepend><q-icon name="mdi-bed-outline" /></template></q-input>
                </div>
                <div class="col-sm-3 col-12 q-pa-sm">
                  <label>{{ $t('property.form.bathrooms') }}</label>
                  <q-input
                    outlined
                    dense
                    v-model="filters.bathrooms"
                    type="number"
                    :min="0"
                  ><template v-slot:prepend><q-icon name="mdi-toilet" /></template></q-input>
                </div>
                <div class="col-sm-3 col-12 q-pa-sm">
                  <label>{{ $t('property.form.garages') }}</label>
                  <q-input
                    outlined
                    dense
                    v-model="filters.garages"
                    type="number"
                    :min="0"
                  ><template v-slot:prepend><q-icon name="mdi-garage" /></template></q-input>
                </div>
                <div class="col-sm-3 col-12 q-pa-sm">
                  <label>{{ $t('property.form.size') }} m<sup>2</sup></label>
                  <q-range
                    label-always
                    switch-label-side
                    v-model="filters.size"
                    color="primary"
                    class="q-px-sm"
                    :min="0"
                    :max="50"
                    :left-label-value="filters.size.min"
                    :right-label-value="filters.size.max"
                  />
                </div>
              </div>
              <div class="row">
                <div class="col-12 q-pa-sm">
                  <label>{{ $t('property.form.features') }}</label>
                  <div>
                    <q-chip
                      v-for="(feature, index) in propertyFeaturesSelect"
                      :key="index"
                      v-model:selected="feature.selected"
                      color="secondary"
                      text-color="primary"
                      class="no-box-shadow"
                    >
                      {{ feature.name }}
                    </q-chip>
                  </div>
                </div>
                <div class="col-12 q-px-sm flex items-center gap-sm">
                    <label>{{ $t('property.form.enabled') }}</label>
                    <q-toggle v-model="filters.enabled" color="primary" />
                </div>
              </div>
              <div class="flex justify-end q-pa-sm">
                <q-btn outline color="primary" icon="mdi-magnify" :ripple="false" @click="applyFilters">{{ $t('global.searchFilters') }}</q-btn>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>
      <q-separator />
      <div class="q-px-md q-py-lg flex justify-end gap-md">
        <q-btn color="grey-12" icon="mdi-database-export-outline" class="q-px-lg shadow-0 text-grey" :ripple="false">{{ $t('global.export') }}</q-btn>
        <q-btn color="primary" icon="mdi-plus" class="q-px-lg" :ripple="false" @click="createProperty">{{ $t('property.addProperty') }}</q-btn>
      </div>
      <q-table
        hide-bottom
        row-key="name"
        :rows="propertyList"
        :columns="columns"
        :hide-pagination="true"
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-title="props">
          <q-td :props="props">
            <div class="flex items-center gap-sm">
              <q-avatar rounded size="40px" color="primary" text-color="white">
                <img :src="props.row.images.length > 0 ? props.row.images[0].url : 'https://i.ibb.co/0Jmshvb/no-image.png'" alt="">
              </q-avatar>
              {{ props.row.title }}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-type="props">
          <q-td :props="props">{{ props.row.type.name }}</q-td>
        </template>
        <template v-slot:body-cell-available_for="props">
          <q-td :props="props">
            <span class="flex items-center gap-xs text-capitalize">
              <span class="relative-position flex items-center justify-center" style="width: 30px; height: 30px;">
                <span
                  class="absolute full-width full-height border-radius"
                  style="top: 0; left: 0; opacity: 0.2;"
                  :style="{ background: props.row.available_for === GLOBAL.SALE ? 'cyan' : 'indigo' }"
                ></span>
                <q-icon
                  size="xs"
                  :name="props.row.available_for === GLOBAL.SALE ? 'mdi-account-cash-outline' : 'mdi-account-key-outline'"
                  :color="props.row.available_for === GLOBAL.SALE ? 'cyan' : 'indigo'"
                />
              </span>
              {{ props.row.available_for === GLOBAL.SALE ? t('property.sale') : t('property.rental') }}
            </span>
          </q-td>
        </template>
        <template v-slot:body-cell-price="props">
          <q-td :props="props">${{ props.row.price }}</q-td>
        </template>
        <template v-slot:body-cell-enabled="props">
          <q-td :props="props">
            <q-icon size="sm" :name="props.row.enabled === '1' ? 'mdi-eye-outline' : 'mdi-eye-off-outline'" :color="props.row.enabled === '1' ? 'green' : 'red'" />
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="actions">
            <q-btn dense round flat color="grey" icon="mdi-square-edit-outline" @click="editProperty(props.row.id)"></q-btn>
            <q-btn dense round flat color="grey" icon="mdi-trash-can-outline" @click="deleteProperty(props.row.id)"></q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <div v-if="isLoading" class="full-width full-height flex align-center justify-center">
      <q-spinner color="primary" size="3em" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router'
// Interfaces
import type { CommonSelectInterface } from 'src/interfaces/app.interface';
import type { PropertyFiltersInterface } from 'src/interfaces/property.interface';
// Constants
import { GLOBAL } from 'src/constants/global.constant';
// Services
import PropertiesService from 'src/services/properties.service';
import AgentsService from 'src/services/agents.service';

const { t } = useI18n();
const router = useRouter();

const columns = [
  { name: 'title', label: t('property.title'), field: 'title', align: 'left' },
  { name: 'type', label: t('property.form.type'), field: 'type', align: 'left' },
  { name: 'available_for', label: t('property.form.availableFor'), field: 'available_for', align: 'left' },
  { name: 'city', label: t('property.form.city'), field: 'city', align: 'left' },
  { name: 'price', label: t('property.form.price'), field: 'price', align: 'left' },
  { name: 'enabled', label: t('property.form.enabled'), field: 'enabled', align: 'center' },
  { name: 'actions', label: t('global.actions'), field: '', align: 'right' },
]

const availableForSelect = [
  { label: t('property.sale'), value: GLOBAL.SALE },
  { label: t('property.rental'), value: GLOBAL.RENTAL },
]

const statusSelect = [
  { label: t('property.available'), value: GLOBAL.AVAILABLE },
  { label: t('property.rented'), value: GLOBAL.RENTED },
  { label: t('property.sold'), value: GLOBAL.SOLD },
]

const isLoading = ref(false);

const filters = ref<PropertyFiltersInterface>({
  available_for: {
    label: '',
    value: ''
  },
  status: {
    label: '',
    value: ''
  },
  agent: {
    id: '',
    name: ''
  },
  type: {
    id: '',
    name: ''
  },
  bedrooms: '',
  bathrooms: '',
  garages: '',
  size: {
    min: 0,
    max: 0
  },
  address: '',
  price: {
    min: 0,
    max: 0
  },
  enabled: false,
  features: []
});

const propertyFeaturesSelect: Ref<CommonSelectInterface[]> = ref([]);
const propertyAgentsSelect: Ref<CommonSelectInterface[]> = ref([]);
const propertyTypesSelect: Ref<CommonSelectInterface[]> = ref([]);

const propertyList = ref([]);

const getFilterOptions = async () => {
  let response;

  response = await PropertiesService.getPropertyFeatures();
  propertyFeaturesSelect.value = response?.data?.data.map((feature: any) => ({
    id: feature.id,
    name: feature.name,
    selected: false,
  }));

  response = await AgentsService.getAgents();
  propertyAgentsSelect.value = response?.data?.data?.items.map((agent: any) => ({
    id: agent.ID,
    name: agent.display_name,
  }));

  response = await PropertiesService.getPropertyTypes();
  propertyTypesSelect.value = response?.data?.data.map((type: any) => ({
    id: type.id,
    name: type.name,
  }));
}

/**
 *
 */
const getProperties = async () => {
  const { data } = await PropertiesService.getProperties();
  propertyList.value = data?.data?.items;
}

/**
 *
 */
const applyFilters = () => {
  filters.value.features = [];

  const features = propertyFeaturesSelect.value.filter(item => item.selected).map(item => item.id);
  if (features.length > 0) {
    features.forEach((feature: string) => {
      filters.value.features.push(feature);
    })
  }

  // TODO: Call API to get filtered properties
}

/**
 *
 */
const createProperty = () => {
  router.push({ name: 'propertyCreate' });
}

/**
 *
 */
const editProperty = (id: string) => {
  router.push({ name: 'propertyEdit', params: { id: id } });
}

/**
 *
 */
const deleteProperty = async (id: string) => {
  await PropertiesService.deleteProperty(id);
  await getProperties();
}

onMounted(async () => {
  isLoading.value = true;

  await getFilterOptions();
  await getProperties();

  isLoading.value = false;
})
</script>

<style scoped lang="scss">
.property-container {
  .filters-section {
    :deep(.q-item) {
      display: flex;
      justify-content: space-between;
      padding: 0;
    }

    :deep(.q-item .q-focus-helper) {
      display: none;
    }

    :deep(.q-item .q-item__section) {
      padding: 0;
    }

    :deep(.q-chip--selected) {
      background-color: var(--q-primary) !important;
    }

    :deep(.q-chip--selected .q-chip__icon),
    :deep(.q-chip--selected .q-chip__content) {
      color: white !important;
    }
  }
}
</style>
