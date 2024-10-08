<template>
  <div>
    <q-card class="property-container">
      <div v-if="!isLoadingFilters" class="q-px-md q-py-md filters-section">
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
                    v-if="propertyRange"
                    label-always
                    switch-label-side
                    v-model="filters.price"
                    color="primary"
                    class="q-px-sm"
                    :min="propertyRange.price_min"
                    :max="propertyRange.price_max"
                    :left-label-value="filters.price.min + '$'"
                    :right-label-value="filters.price.max + '$'"
                  />
                </div>
                <div class="col-sm-4 col-12 q-pa-sm">
                  <label>{{ $t('property.form.agent') }}</label>
                  <q-select
                    outlined
                    dense
                    v-model="filters.agent"
                    use-input
                    hide-selected
                    fill-input
                    input-debounce="1000"
                    option-label="name"
                    option-value="id"
                    :options="propertyAgentsSelect"
                    @filter="filterAgentSelect"
                  >
                    <template v-slot:prepend><q-icon name="mdi-account-outline" /></template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">{{ $t('global.noResults') }}</q-item-section>
                      </q-item>
                    </template>
                  </q-select>
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
                <div class="col-sm-3 col-12 q-pa-sm">
                  <label>{{ $t('property.form.status') }}</label>
                  <q-select
                    outlined
                    dense
                    v-model="filters.status"
                    option-label="label"
                    option-value="value"
                    :options="statusSelect"
                  ><template v-slot:prepend><q-icon name="mdi-list-status" /></template></q-select>
                </div>
                <div class="col-sm-3 col-12 q-pa-sm">
                  <label>{{ $t('property.form.enabled') }}</label>
                  <q-select
                    outlined
                    dense
                    v-model="filters.enabled"
                    option-label="label"
                    option-value="value"
                    :options="enabledSelect"
                  ><template v-slot:prepend><q-icon name="mdi-eye-outline" /></template></q-select>
                </div>
                <div class="col-sm-3 col-12 q-pa-sm">
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
                <div class="col-sm-3 col-12 q-pa-sm">
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
                    v-if="propertyRange"
                    label-always
                    switch-label-side
                    v-model="filters.size"
                    color="primary"
                    class="q-px-sm"
                    :min="propertyRange.size_min"
                    :max="propertyRange.size_max"
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
              </div>
              <div class="flex justify-end gap-sm q-pa-sm">
                <q-btn outline color="negative" class="no-box-shadow" :ripple="false" @click="clearFilters">{{ $t('global.cleanFilters') }}</q-btn>
                <q-btn outline color="primary" icon="mdi-magnify" class="no-box-shadow" :ripple="false" @click="applyFilters">{{ $t('global.searchFilters') }}</q-btn>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>
      <div v-if="isLoadingFilters" class="full-width full-height flex align-center justify-center q-py-xl">
        <q-spinner color="primary" size="3em" />
      </div>
      <q-separator />
      <div class="q-px-md q-py-lg flex justify-end gap-md">
        <q-btn :loading="isLoadingExport" color="grey-12" icon="mdi-database-export-outline" class="q-px-lg shadow-0 text-grey" :ripple="false" @click="exportProperties">{{ $t('global.export') }}</q-btn>
        <q-btn color="primary" icon="mdi-plus" class="q-px-lg" :ripple="false" @click="createProperty">{{ $t('property.addProperty') }}</q-btn>
      </div>
      <q-table
        row-key="name"
        :rows="propertyList"
        :columns="columns"
        :loading="loadingTable"
        :rows-per-page-options="[0]"
        v-model:pagination="paginationRef"
        @request="onRequestPagination"
      >
        <template v-slot:body-cell-title="props">
          <q-td :props="props">
            <div class="flex no-wrap items-center gap-sm">
              <q-avatar rounded size="40px" color="white" text-color="white">
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
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <span class="relative-position q-pa-xs">
              <span
                class="absolute full-width full-height"
                style="top: 0; left: 0; opacity: 0.1; border-radius: 6px;"
                :style="{ background: props.row.status === GLOBAL.AVAILABLE ? 'green' : 'orange' }"
              ></span>
              <span class="q-pa-sm text-weight-medium" :style="{ color: props.row.status === GLOBAL.AVAILABLE ? 'green' : 'orange' }">
                {{ statusSelect.find(item => item.value === props.row.status)?.label }}
              </span>
            </span>
          </q-td>
        </template>
        <template v-slot:body-cell-price="props">
          <q-td :props="props">{{ props.row.price }}$</q-td>
        </template>
        <template v-slot:body-cell-enabled="props">
          <q-td :props="props">
            <q-icon size="sm" :name="props.row.enabled === '1' ? 'mdi-eye-outline' : 'mdi-eye-off-outline'" :color="props.row.enabled === '1' ? 'green' : 'red'" />
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="actions">
            <q-btn dense round flat color="grey" icon="mdi-open-in-new" @click="viewProperty(props.row.url)"></q-btn>
            <q-btn v-if="getIsAdmin() || (getWpUserId() === props.row.agent.id)" dense round flat color="grey" icon="mdi-square-edit-outline" @click="editProperty(props.row.id)"></q-btn>
            <q-btn v-if="getIsAdmin() || (getWpUserId() === props.row.agent.id)" dense round flat color="grey" icon="mdi-trash-can-outline" @click="openDialogDelete(props.row.id)"></q-btn>
          </q-td>
        </template>
        <template v-slot:loading>
          <q-inner-loading showing color="primary" />
        </template>
        <template v-slot:no-data>
          <div class="full-width flex column items-center q-my-md">
            <q-icon size="md" name="mdi-alert" color="grey" />
            <p class="text-weight-medium q-ma-none q-py-xs text-grey">{{ $t('global.noDataAvailable') }}</p>
          </div>
        </template>
      </q-table>
    </q-card>

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
          <q-btn :loading="isLoadingDelete" :label="$t('global.accept')" color="primary" class="no-box-shadow" :ripple="false" @click="deleteProperty" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import type { AxiosResponse } from 'axios';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
// Interfaces
import type { CommonSelectInterface } from 'src/interfaces/app.interface';
import type { PropertyFiltersInterface, PropertyRangeInterface } from 'src/interfaces/property.interface';
// Composable
import useRole from 'src/composable/useRole';
// Constants
import { GLOBAL, ROWS_PER_PAGE } from 'src/constants/global.constant';
// Store
import { usePropertyStore } from 'src/stores/property.store';
// Services
import PropertiesService from 'src/services/properties.service';
import AgentsService from 'src/services/agents.service';

const { t } = useI18n();
const router = useRouter();
const $q = useQuasar();
const { getIsAdmin, getWpUserId } = useRole();
const propertyStore = usePropertyStore();

const columns = [
  { name: 'title', label: t('property.title'), field: 'title', align: 'left' },
  { name: 'type', label: t('property.form.type'), field: 'type', align: 'left' },
  { name: 'available_for', label: t('property.form.availableFor'), field: 'available_for', align: 'left' },
  { name: 'status', label: t('property.form.status'), field: 'city', align: 'left' },
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

const enabledSelect = [
  { label: t('property.visible'), value: '1' },
  { label: t('property.notVisible'), value: '0' },
  { label: t('property.all'), value: '' },
]

const paginationRef = ref({
  page: 1,
  rowsPerPage: ROWS_PER_PAGE,
  rowsNumber: 0,
});

const deleteDialog = ref(false);

const loadingTable = ref(false);
const isLoadingFilters = ref(false);
const isLoadingDelete = ref(false);
const isLoadingExport = ref(false);

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
  enabled: {
    label: '',
    value: ''
  },
  features: [],
  page: 1
});
const payloadFilters = ref<any>({});


const propertyFeaturesSelect: Ref<CommonSelectInterface[]> = ref([]);
const propertyAgentsSelect: Ref<CommonSelectInterface[]> = ref([]);
const propertyTypesSelect: Ref<CommonSelectInterface[]> = ref([]);
const propertyRange: Ref<PropertyRangeInterface | null> = ref(null);

const propertyId = ref('');
const propertyList = ref([]);

const getFilterOptions = async () => {
  const { data: propertyFeaturesData } = await PropertiesService.getPropertyFeatures();
  propertyFeaturesSelect.value = propertyFeaturesData?.data.map((feature: any) => ({
    id: feature.id,
    name: feature.name,
    selected: false,
  })) || [];

  const { data: agentsData } = await AgentsService.getAgents();
  propertyAgentsSelect.value = agentsData?.data?.items.map((agent: any) => ({
    id: agent.id,
    name: agent.display_name,
  })) || [];

  const { data: propertyTypesData } = await PropertiesService.getPropertyTypes();
  propertyTypesSelect.value = propertyTypesData?.data.map((type: any) => ({
    id: type.id,
    name: type.name,
  })) || [];


  const { data: propertyRangesData } = await PropertiesService.getPropertyRanges();
  propertyRange.value = propertyRangesData?.data;

  if (propertyRange.value) {
    filters.value = {
      ...filters.value,
      price: {
        min: propertyRange.value?.price_min,
        max: propertyRange.value?.price_max,
      },
      size: {
        min: propertyRange.value?.size_min,
        max: propertyRange.value?.size_max,
      },
    }
  }
}

/**
 *
 */
const filterAgentSelect = (value: string, update: any) => {
  update( async () => {
    const { data } = await AgentsService.getAgents(value);
    propertyAgentsSelect.value = data?.data?.items.map((agent: any) => ({
      id: agent.id,
      name: agent.display_name,
    })) || [];
  })
};

/**
 *
 */
const getProperties = async (isPagination = false) => {
  loadingTable.value = true;

  if (!isPagination) {
    filters.value.page = 1;
    paginationRef.value.page = 1;
  }

  filters.value.features = [];

  const filterFeatures: Array<string> = []

  const features = propertyFeaturesSelect.value.filter(item => item.selected).map(item => item.id);
  if (features.length > 0) {
    features.forEach((feature: string) => {
      filters.value.features.push(feature);
      filterFeatures.push(feature)
    })
  }

  payloadFilters.value = {
    price_min: filters.value.price.min,
    price_max: filters.value.price.max,
    agent_id: filters.value.agent.id,
    address: filters.value.address,
    status: filters.value.status.value,
    type_id: filters.value.type.id,
    available_for: filters.value.available_for.value,
    bedrooms: filters.value.bedrooms,
    bathrooms: filters.value.bathrooms,
    garages: filters.value.garages,
    size_min: filters.value.size.min,
    size_max: filters.value.size.max,
    features: filterFeatures,
    page: filters.value.page,
  };

  if (filters.value.enabled.value) {
    payloadFilters.value.enabled = filters.value.enabled.value
  }

  const { data } = await PropertiesService.getProperties(payloadFilters.value);
  propertyList.value = data?.data?.items || [];
  paginationRef.value.rowsNumber = data?.data?.total || 0;

  loadingTable.value = false;
}

/**
 *
 */
const applyFilters = async () => {
  await getProperties();
}

/**
 *
 */
const onRequestPagination = async ({ pagination }: any) => {
  paginationRef.value.page = pagination.page  || 1;
  filters.value.page = pagination.page;

  await getProperties(true);
}

/**
 *
 */
const clearFilters = () => {
  if (propertyRange.value) {
    filters.value = {
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
      address: '',
      price: {
        min: propertyRange.value?.price_min,
        max: propertyRange.value?.price_max,
      },
      size: {
        min: propertyRange.value?.size_min,
        max: propertyRange.value?.size_max,
      },
      enabled: {
        label: '',
        value: ''
      },
      features: [],
      page: 1
    }
  }

  propertyFeaturesSelect.value = propertyFeaturesSelect.value.map(item => {
    item.selected = false;
    return item;
  });

  payloadFilters.value = {};
  paginationRef.value.page = 1;
  getProperties();
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
const viewProperty = (url: string) => {
  window.open(url, '_blank');
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
const deleteProperty = async () => {
  try {
    await PropertiesService.deleteProperty(propertyId.value);
    $q.notify({ message: t('global.successDeleteMessage'), color: 'green', position: 'bottom' });
  } catch (error) {
    $q.notify({ message: t('global.errorMessage'), color: 'red', position: 'bottom' });
  }

  await propertyStore.fetchPropertyStats(t);
  deleteDialog.value = false;

  await getProperties();
}

/**
 *
 */
const exportProperties = async () => {
  isLoadingExport.value = true;

  const response: AxiosResponse<Blob> = await PropertiesService.getPropertiesExport(payloadFilters.value);

  const fileBlob = response.data;
  const fileUrl = URL.createObjectURL(fileBlob);
  const downloadLink = document.createElement('a');
  downloadLink.href = fileUrl;
  downloadLink.download = 'properties';
  downloadLink.click();

  URL.revokeObjectURL(fileUrl);

  isLoadingExport.value = false;
}

/**
 *
 */
const openDialogDelete = (id: string) => {
  propertyId.value = id;
  deleteDialog.value = true;
}

onMounted(async () => {
  isLoadingFilters.value = true;

  await getFilterOptions();
  await getProperties();

  isLoadingFilters.value = false;
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
