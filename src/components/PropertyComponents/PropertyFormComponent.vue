<template>
  <div class="q-pt-md property-form-container">
    <q-form v-if="!isLoading" ref="formRef">
      <div class="flex justify-between">
        <div>
          <h5 class="q-ma-none">{{ isEditProperty ? $t('property.editProperty') : $t('property.addProperty') }}</h5>
          <p class="text-subtitle2 text-weight-regular text-grey q-ma-none">{{ $t('property.messageProperty') }}</p>
        </div>
        <div>
          <q-btn :loading="isLoadingSave" color="primary" class="full-width text-capitalize" @click="saveProperty">{{ isEditProperty ? $t('global.update') : $t('global.save') }}</q-btn>
        </div>
      </div>
      <div class="row q-mt-md">
        <div class="col-12 col-md-8 q-pr-sm card-section-one">
          <q-card class="q-mb-md q-pa-lg">
            <p class="text-subtitle1 text-weight-medium text-grey-14 q-ma-none q-mb-md">{{ $t('property.informationProperty') }}</p>
            <div class="q-py-xs">
              <label>{{ $t('property.form.name') }}</label>
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
              <div class="row">
                <div class="col-6 q-pr-sm">
                  <label>{{ $t('property.form.price') }}</label>
                  <q-input
                    outlined
                    dense
                    v-model="form.price"
                    type="number"
                    :min="0"
                    :rules="[
                      (val: any) => validateRequired(val) || $t('validation.requiredField'),
                    ]"
                  ><template v-slot:prepend><q-icon name="mdi-currency-usd" /></template></q-input>
                </div>
                <div class="col-6 q-pl-sm">
                  <label>{{ $t('property.form.availableFor') }}</label>
                  <q-select
                    outlined
                    dense
                    v-model="form.available_for"
                    option-label="label"
                    option-value="value"
                    :options="availableForSelect"
                    :rules="[
                      (val: any) => validateRequiredSelect(val.value) || $t('validation.requiredField'),
                    ]"
                  ><template v-slot:prepend><q-icon name="mdi-finance" /></template></q-select>
                </div>
              </div>
            </div>
            <div class="q-py-xs">
              <label>{{ $t('property.form.description') }}</label>
              <q-editor
                v-model="form.description"
                min-height="10rem"
                class="q-mt-xs"
              />
            </div>
          </q-card>
          <q-card class="q-mb-md q-pa-lg property-files">
            <div class="flex justify-between q-mb-md">
              <div><p class="text-subtitle1 text-weight-medium text-grey-14 q-ma-none">{{ $t('property.imagesProperty') }}</p></div>
              <div>
                <input type="file" ref="fileInputRef" multiple @change="handleFileUpload" style="display: none" />
                <p class="text-subtitle2 text-weight-medium text-primary q-ma-none cursor-pointer" @click="openFileExplorer">{{ $t('property.addBrowseImage') }}</p>
              </div>
            </div>
            <div class="q-py-xs">
              <div class="browse-images-section">
                <div v-if="selectedFiles.length <= 0" class="flex column justify-center items-center gap-sm q-my-lg">
                  <q-icon size="sm" color="grey" name="mdi-tray-arrow-up" class="bg-grey-12 q-pa-sm"></q-icon>
                  <h6 class="q-ma-none">{{ $t('property.noImagesAdded') }}</h6>
                  <div>
                    <input type="file" ref="fileInputRef" multiple @change="handleFileUpload" style="display: none" />
                    <q-btn class="text-capitalize btn-browse" @click="openFileExplorer">{{ $t('property.browseImages') }}</q-btn>
                  </div>
                </div>

                <div class="files-selected-section row">
                  <div v-for="(image, index) in selectedFiles" :key="index" class="q-pa-sm col-sm-4 col-12">
                    <q-card class="flex column justify-between q-pa-md full-height">
                      <q-img
                        :src="image.src"
                        alt="image.name"
                        class="no-border-radius"
                        height="150px"
                      />
                      <p class="text-subtitle2 text-weight-regular text-grey q-ma-none">{{ image.name }}</p>
                      <q-btn class="text-capitalize text-primary no-box-shadow" :ripple="false" @click="removeFile(index, image)">{{ $t('property.removeFile') }}</q-btn>
                    </q-card>
                  </div>
                </div>
              </div>
            </div>
          </q-card>
          <q-card class="q-mb-md q-pa-lg">
            <p class="text-subtitle1 text-weight-medium text-grey-14 q-ma-none q-mb-md">{{ $t('property.coordinates') }}</p>
            <div class="q-py-xs row">
              <div class="col-12 col-md-4">
                <div class="q-py-xs">
                  <label>{{ $t('property.form.latitude') }}</label>
                  <q-input
                    outlined
                    dense
                    v-model="form.latitude"
                    type="number"
                    :min="0"
                    :rules="[
                      (val: any) => validateNumber(val) || $t('validation.requiredField'),
                    ]"
                  ><template v-slot:prepend><q-icon name="mdi-latitude" /></template></q-input>
                </div>
                <div class="q-py-xs">
                  <label>{{ $t('property.form.longitude') }}</label>
                  <q-input
                    outlined
                    dense
                    v-model="form.longitude"
                    type="number"
                    :min="0"
                    :rules="[
                    (val: any) => validateNumber(val) || $t('validation.requiredField'),
                  ]"
                  ><template v-slot:prepend><q-icon name="mdi-longitude" /></template></q-input>
                </div>
              </div>
              <div class="col-12 col-md-8 q-px-md">
                <div id="map"></div>
              </div>
            </div>
          </q-card>
        </div>
        <div class="col-12 col-md-4 q-pl-sm card-section-two">
          <q-card class="q-mb-md q-pa-lg">
            <p class="text-subtitle1 text-weight-medium text-grey-14 q-ma-none q-mb-sm">{{ $t('property.configuration') }}</p>
            <div class="q-py-xs flex items-center justify-between">
              <label>{{ $t('property.form.enabled') }}</label>
              <q-toggle v-model="form.enabled" color="primary" />
            </div>
            <div class="q-py-xs">
              <label>{{ $t('property.form.status') }}</label>
              <q-select
                outlined
                dense
                v-model="form.status"
                option-label="label"
                option-value="value"
                :options="statusSelect"
                :rules="[
                  (val: any) => validateRequiredSelect(val.value) || $t('validation.requiredField'),
                ]"
              ><template v-slot:prepend><q-icon name="mdi-list-status" /></template></q-select>
            </div>
            <div class="q-py-xs">
              <label>{{ $t('property.form.agent') }}</label>
              <q-select
                outlined
                dense
                v-model="form.agent_id"
                use-input
                hide-selected
                fill-input
                input-debounce="1000"
                option-label="name"
                option-value="id"
                :options="propertyAgentsSelect"
                :disable="!getIsAdmin()"
                :rules="[
                  (val: any) => validateRequiredSelect(val.id) || $t('validation.requiredField'),
                ]"
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
            <div class="q-py-xs">
              <label>{{ $t('property.form.type') }}</label>
              <q-select
                outlined
                dense
                v-model="form.type_id"
                option-label="name"
                option-value="id"
                :options="propertyTypesSelect"
                :rules="[
                  (val: any) => validateRequiredSelect(val.id) || $t('validation.requiredField'),
                ]"
              ><template v-slot:prepend><q-icon name="mdi-home-city-outline" /></template></q-select>
            </div>
          </q-card>
          <q-card class="q-mb-md q-pa-lg">
            <p class="text-subtitle1 text-weight-medium text-grey-14 q-ma-none q-mb-md">{{ $t('property.attributes') }}</p>
            <div class="q-py-xs">
              <label>{{ $t('property.form.bedrooms') }}</label>
              <q-input
                outlined
                dense
                v-model="form.bedrooms"
                type="number"
                :min="0"
                :rules="[
                  (val: any) => validateRequired(val) || $t('validation.requiredField'),
                ]"
              ><template v-slot:prepend><q-icon name="mdi-bed-outline" /></template></q-input>
            </div>
            <div class="q-py-xs">
              <label>{{ $t('property.form.bathrooms') }}</label>
              <q-input
                outlined
                dense
                v-model="form.bathrooms"
                type="number"
                :min="0"
                :rules="[
                  (val: any) => validateRequired(val) || $t('validation.requiredField'),
                ]"
              ><template v-slot:prepend><q-icon name="mdi-toilet" /></template></q-input>
            </div>
            <div class="q-py-xs">
              <label>{{ $t('property.form.garages') }}</label>
              <q-input
                outlined
                dense
                v-model="form.garages"
                type="number"
                :min="0"
                :rules="[
                  (val: any) => validateRequired(val) || $t('validation.requiredField'),
                ]"
              ><template v-slot:prepend><q-icon name="mdi-garage" /></template></q-input>
            </div>
            <div class="q-py-xs">
              <label>{{ $t('property.form.size') }}</label>
              <q-input
                outlined
                dense
                v-model="form.size"
                type="number"
                :min="0"
                :rules="[
                  (val: any) => validateRequired(val) || $t('validation.requiredField'),
                ]"
              >
                <template v-slot:prepend><q-icon name="mdi-tape-measure" /></template>
                <template v-slot:append><label class="mts-label">m<sup>2</sup></label></template>
              </q-input>
            </div>
            <div class="q-py-xs">
              <label>{{ $t('property.form.features') }}</label>
              <div class="q-py-sm">
                <q-chip
                  v-for="(feature, index) in propertyFeaturesList"
                  :key="index"
                  v-model:selected="feature.selected"
                  color="secondary"
                  text-color="primary"
                  class="no-box-shadow"
                >
                  {{ feature.name }}
                </q-chip>
                <div v-if="featureRequired" class="feature-required">{{ $t('property.featureRequired') }}</div>
              </div>
            </div>
          </q-card>
          <q-card class="q-mb-md q-pa-lg">
            <p class="text-subtitle1 text-weight-medium text-grey-14 q-ma-none q-mb-md">{{ $t('property.address') }}</p>
            <div class="q-py-xs">
              <label>{{ $t('property.form.state') }}</label>
              <q-input
                outlined
                dense
                v-model="form.state"
                :rules="[
                  (val: any) => validateRequired(val) || $t('validation.requiredField'),
                ]"
              ></q-input>
            </div>
            <div class="q-py-xs">
              <label>{{ $t('property.form.city') }}</label>
              <q-input
                outlined
                dense
                v-model="form.city"
                :rules="[
                  (val: any) => validateRequired(val) || $t('validation.requiredField'),
                ]"
              ></q-input>
            </div>
            <div class="q-py-xs">
              <label>{{ $t('property.form.zip') }}</label>
              <q-input
                outlined
                dense
                v-model="form.zip"
                :rules="[
                  (val: any) => validateRequired(val) || $t('validation.requiredField'),
                ]"
              ></q-input>
            </div>
            <div class="q-py-xs">
              <label>{{ $t('property.form.address') }}</label>
              <q-input
                outlined
                dense
                v-model="form.address"
                :rules="[
                  (val: any) => validateRequired(val) || $t('validation.requiredField'),
                ]"
              ></q-input>
            </div>
          </q-card>
        </div>
      </div>
    </q-form>
    <div v-if="isLoading" class="full-width full-height flex align-center justify-center">
      <q-spinner color="primary" size="3em" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { map, latLng, tileLayer, marker, MapOptions, Marker, Icon } from 'leaflet';

// Interfaces
import type { PropertyImageInterface, PropertyFormInterface } from 'src/interfaces/property.interface';
import type { CommonSelectInterface } from 'src/interfaces/app.interface';
// Services
import PropertiesService from 'src/services/properties.service';
import AgentsService from 'src/services/agents.service';
// Composable
import useValidate  from 'src/composable/useValidate';
import useRole from 'src/composable/useRole';
// Constants
import { GLOBAL } from 'src/constants/global.constant';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const { getIsAdmin, getWpUserId, getPluginUrl } = useRole();
const { validateRequired, validateRequiredSelect, validateNumber } = useValidate();

const availableForSelect = [
  { label: t('property.sale'), value: GLOBAL.SALE },
  { label: t('property.rental'), value: GLOBAL.RENTAL },
]

const statusSelect = [
  { label: t('property.available'), value: GLOBAL.AVAILABLE },
  { label: t('property.rented'), value: GLOBAL.RENTED },
  { label: t('property.sold'), value: GLOBAL.SOLD },
]

const options: MapOptions = {
  center: latLng(8.0049, -72.0250),
  zoom: 9
}

const isLoading = ref(false);
const isLoadingSave = ref(false);

const isEditProperty = ref(false);
const featureRequired = ref(false);

const form = ref<PropertyFormInterface>({
  title: '',
  description: '',
  price: '',
  available_for: {
    label: '',
    value: ''
  },
  bedrooms: '',
  bathrooms: '',
  garages: '',
  size: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  latitude: 0,
  longitude: 0,
  status: {
    label: '',
    value: ''
  },
  agent_id: {
    id: '',
    name: ''
  },
  type_id: {
    id: '',
    name: ''
  },
  enabled: false,
});
const formRef = ref();

const propertyId = ref('');
const propertyFeaturesList: Ref<CommonSelectInterface[]> = ref([]);
const propertyAgentsSelect: Ref<CommonSelectInterface[]> = ref([]);
const propertyTypesSelect: Ref<CommonSelectInterface[]> = ref([]);

const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedFiles = ref<PropertyImageInterface[]>([]);

/**
 *
 * @param event
 */
const handleFileUpload = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files;

  if (files) {
    const images = Array.from(files);
    images.forEach((image) => {
      selectedFiles.value.push({
        name: image.name,
        src: URL.createObjectURL(image),
        file: image,
      });
    });

    if (isEditProperty.value) {
      const payload = new FormData();
      for (const image of images) {
        payload.append('image', image);
        await PropertiesService.uploadPropertyImage(propertyId.value, payload);
      }
    }
  }
};

const openFileExplorer = () => {
  fileInputRef.value?.click();
};

const removeFile = async (index: number, image: PropertyImageInterface) => {
  selectedFiles.value.splice(index, 1);

  if (isEditProperty.value && image.id) {
    try {
      await PropertiesService.deletePropertyImage(propertyId.value, image.id);
      $q.notify({ message: t('global.successDeleteMessage'), color: 'green', position: 'bottom' });
    } catch (error) {
      $q.notify({ message: t('global.errorMessage'), color: 'red', position: 'bottom' });
    }
  }
};

/**
 *
 */
const getDropdownConfiguration = async () => {
  const { data: propertyFeaturesData } = await PropertiesService.getPropertyFeatures();
  propertyFeaturesList.value = propertyFeaturesData?.data.map((feature: any) => ({
    id: feature.id,
    name: feature.name,
    selected: false,
  }));

  const { data: agentsData } = await AgentsService.getAgents();
  propertyAgentsSelect.value = agentsData?.data?.items.map((agent: any) => ({
    id: agent.id,
    name: agent.display_name,
  }));

  const { data: propertyTypesData } = await PropertiesService.getPropertyTypes();
  propertyTypesSelect.value = propertyTypesData?.data.map((type: any) => ({
    id: type.id,
    name: type.name,
  }));
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
}

/**
 *
 */
const getPropertyData = async () => {
  const { data } = await PropertiesService.getProperty(propertyId.value);

  form.value = {
    ...form.value,
    ...data?.data,
    agent_id: data?.data.agent,
    type_id: data?.data.type,
    available_for: {
      label: data?.data.available_for === GLOBAL.SALE ? t('property.sale') : t('property.rental'),
      value: data?.data.available_for,
    },
    status: {
      label: statusSelect.find((status: any) => status.value === data?.data.status)?.label || '',
      value: data?.data.status,
    },
    enabled: data?.data.enabled === '1',
  }

  data?.data.images.forEach((image: any) => {
    selectedFiles.value.push({
      id: image.id,
      src: image.url,
    });
  })

  if (data?.data.features) {
    const featureIds = new Set(data?.data.features.map((feature: any) => feature.id));
    propertyFeaturesList.value.forEach(feature => {
      if (featureIds.has(feature.id)) {
        feature.selected = true;
      }
    });
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
const saveProperty = async () => {
  isLoadingSave.value = true;

  const features = propertyFeaturesList.value.filter(item => item.selected).map(item => item.id);
  if (await validateForm() && features.length > 0) {
    featureRequired.value = false;

    const payload = new FormData();

    payload.append('title', form.value.title);
    payload.append('description', form.value.description);
    payload.append('price', form.value.price);
    payload.append('available_for', form.value.available_for.value);
    payload.append('bedrooms', form.value.bedrooms);
    payload.append('bathrooms', form.value.bathrooms);
    payload.append('garages', form.value.garages);
    payload.append('size', form.value.size);
    payload.append('address', form.value.address);
    payload.append('city', form.value.city);
    payload.append('state', form.value.state);
    payload.append('zip', form.value.zip);
    payload.append('latitude', form.value.latitude.toString());
    payload.append('longitude', form.value.longitude.toString());
    payload.append('agent_id', form.value.agent_id.id);
    payload.append('type_id', form.value.type_id.id);
    payload.append('status', form.value.status.value);
    payload.append('enabled', form.value.enabled ? '1' : '0');

    if (features.length > 0) {
      features.forEach((feature) => {
        payload.append('features[]', feature);
      })
    }

    if (isEditProperty.value) {
      try {
        await PropertiesService.updateProperty(propertyId.value, payload);
        $q.notify({ message: t('global.successUpdateMessage'), color: 'green', position: 'bottom' });
      } catch (error) {
        $q.notify({ message: t('global.errorMessage'), color: 'red', position: 'bottom' });
      }
    } else {
      if (selectedFiles.value.length > 0) {
        selectedFiles.value.forEach((image) => {
          payload.append('images[]', image.file);
        })
      }

      try {
        await PropertiesService.createProperty(payload);
        $q.notify({ message: t('global.successCreateMessage'), color: 'green', position: 'bottom' });
      } catch (error) {
        $q.notify({ message: t('global.errorMessage'), color: 'red', position: 'bottom' });
      }
    }

    await router.push({name: 'properties'});
  } else {
    featureRequired.value = true;
  }

  isLoadingSave.value = false;
  setTimeout(() => {
    featureRequired.value = false;
  }, 3000)
}

onMounted(async () => {
  isLoading.value = true;

  await getDropdownConfiguration();

  if (route.params.id) {
    isEditProperty.value = true;
    propertyId.value = `${route.params.id}`;

    await getPropertyData();
  } else {
    if (!getIsAdmin()) {
      form.value.agent_id = {
        id: getWpUserId(),
        name: propertyAgentsSelect.value.find((agent: CommonSelectInterface) => agent.id == getWpUserId())?.name || '',
      }
    }
  }

  const pluginUrl = getPluginUrl()
  if (pluginUrl) {
    Icon.Default.mergeOptions({
      iconRetinaUrl: pluginUrl + '/public/css/lib/leaflet/images/marker-icon-2x.png',
      iconUrl: pluginUrl + '/public/css/lib/leaflet/images/marker-icon.png',
      shadowUrl: pluginUrl + '/public/css/lib/leaflet/images/marker-shadow.png',
    });
  }

  isLoading.value = false;

  // Await to render the map
  await new Promise(resolve => setTimeout(resolve, 0));

  const locationMap = map('map', options);

  tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{ //style URL
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(locationMap);

  // If there are coordinates, add a marker
  if (form.value.latitude && form.value.longitude) {
    marker([form.value.latitude, form.value.longitude]).addTo(locationMap);

    // Set the view to the coordinates
    locationMap.setView([form.value.latitude, form.value.longitude], 10);
  }

  locationMap.on('click', (e) => {
    const { lat, lng } = e.latlng;
    form.value.latitude = lat;
    form.value.longitude = lng;

    if (locationMap) {
      // Remove the previous marker
      locationMap.eachLayer((layer) => {
        if (layer instanceof Marker) {
          locationMap.removeLayer(layer);
        }
      });

      // Add a new marker
      marker([lat, lng]).addTo(locationMap);

      locationMap.setView([lat, lng]);
    }
  });
})

onUnmounted(() => {
  isEditProperty.value = false;
  propertyId.value = '';
})
</script>

<style scoped lang="scss">
.property-form-container {
  .text-subtitle1 {
    font-size: 1.1rem;
  }

  label { color: rgba(0, 0, 0, 0.6); }
  .mts-label { font-size: 13px; }

  .browse-images-section {
    border: 1px dashed rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    padding: 30px;

    .q-btn.btn-browse {
      background-color: var(--q-secondary);
      color: var(--q-primary);
    }

    .q-btn.btn-browse:hover {
      background-color: var(--q-primary);
      color: white;
    }

    .q-icon {
      border-radius: 5px;
    }

    .files-selected-section {
      :deep(.q-img__image) {
        object-fit: contain !important;
      }

      p {
        max-width: 150px;
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        text-overflow: ellipsis;
        margin: 10px 0;
      }
    }
  }

  :deep(.q-chip--selected) {
    background-color: var(--q-primary) !important;
  }

  :deep(.q-chip--selected .q-chip__icon),
  :deep(.q-chip--selected .q-chip__content) {
    color: white !important;
  }

  .feature-required {
    font-size: 12px;
    color: var(--q-negative);
    margin-top: 5px;
    line-height: 1;
  }

  #map {
    height: 350px;
  }
}

@media screen and (max-width: 1023px) {
  .property-form-container {
    .card-section-one, .card-section-two {
      padding: 0;
    }
  }
}
</style>
