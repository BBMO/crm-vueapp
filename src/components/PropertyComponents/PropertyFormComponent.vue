<template>
  <div class="q-pt-md property-form-container">
    <q-form v-if="!isLoading" ref="formRef">
      <div class="flex justify-between">
        <div>
          <h5 class="q-ma-none">{{ isEditProperty ? $t('property.editProperty') : $t('property.addProperty') }}</h5>
          <p class="text-subtitle2 text-weight-regular text-grey q-ma-none">{{ $t('property.messageProperty') }}</p>
        </div>
        <div>
          <q-btn color="primary" class="full-width text-capitalize" @click="saveProperty">{{ isEditProperty ? $t('global.update') : $t('global.save') }}</q-btn>
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
                    :options="availableFor"
                    :rules="[
                      (val: any) => validateRequiredSelect(val) || $t('validation.requiredField'),
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
                <p class="text-subtitle2 text-weight-medium text-primary q-ma-none cursor-pointer" @click="openFileExplorer">{{ $t('property.addBrowserImage') }}</p>
              </div>
            </div>
            <div class="q-py-xs">
              <div class="browser-images-section">
                <div v-if="selectedFiles.length <= 0" class="flex column justify-center items-center gap-sm q-my-lg">
                  <q-icon size="sm" color="grey" name="mdi-tray-arrow-up" class="bg-grey-12 q-pa-sm"></q-icon>
                  <h6 class="q-ma-none">{{ $t('property.noImagesAdded') }}</h6>
                  <div>
                    <input type="file" ref="fileInputRef" multiple @change="handleFileUpload" style="display: none" />
                    <q-btn class="text-capitalize btn-browser" @click="openFileExplorer">{{ $t('property.browserImages') }}</q-btn>
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
              <div class="col-4">
                <div class="q-py-xs">
                  <label>{{ $t('property.form.latitude') }}</label>
                  <q-input
                    outlined
                    dense
                    v-model="form.latitude"
                    type="number"
                    :min="0"
                    :rules="[
                      (val: any) => validateRequired(val) || $t('validation.requiredField'),
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
                    (val: any) => validateRequired(val) || $t('validation.requiredField'),
                  ]"
                  ><template v-slot:prepend><q-icon name="mdi-longitude" /></template></q-input>
                </div>
              </div>
              <div class="col-8">
                Mapa
              </div>
            </div>
          </q-card>
        </div>
        <div class="col-12 col-md-4 q-pl-sm card-section-two">
          <q-card class="q-mb-md q-pa-lg">
            <p class="text-subtitle1 text-weight-medium text-grey-14 q-ma-none q-mb-md">{{ $t('property.configuration') }}</p>
            <div class="q-py-xs">
              <label>{{ $t('property.form.state') }}</label>
              <q-select
                outlined
                dense
                v-model="form.state_id"
                option-label="name"
                option-value="id"
                :options="propertyStatesList"
                :rules="[
                  (val: any) => validateRequiredSelect(val) || $t('validation.requiredField'),
                ]"
              ></q-select>
            </div>
            <div class="q-py-xs">
              <label>{{ $t('property.form.agent') }}</label>
              <q-select
                outlined
                dense
                v-model="form.agent_id"
                option-label="name"
                option-value="id"
                :options="propertyAgentsList"
                :rules="[
                  (val: any) => validateRequiredSelect(val) || $t('validation.requiredField'),
                ]"
              ><template v-slot:prepend><q-icon name="mdi-account-outline" /></template></q-select>
            </div>
            <div class="q-py-xs">
              <label>{{ $t('property.form.type') }}</label>
              <q-select
                outlined
                dense
                v-model="form.type_id"
                option-label="name"
                option-value="id"
                :options="propertyTypesList"
                :rules="[
                  (val: any) => validateRequiredSelect(val) || $t('validation.requiredField'),
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
import { useRoute, useRouter } from 'vue-router'
// Interfaces
import type {
  PropertyDropdownInterface,
  PropertyFeatureDropdownInterface,
  PropertyImageInterface
} from 'src/interfaces/property.interface';
// Services
import PropertiesService from 'src/services/properties.service';
import AgentsService from 'src/services/agents.service';
// Composable
import useValidate  from 'src/composable/useValidate';
// Constants
import { GLOBAL } from 'src/constants/global.constant';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { validateRequired, validateRequiredSelect } = useValidate();

const availableFor = [
  { label: t('property.sale'), value: GLOBAL.SALE },
  { label: t('property.rental'), value: GLOBAL.RENTAL },
]

const isLoading = ref(false);
const isEditProperty = ref(false);
const propertyId = ref('');

const form = ref({
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
  latitude: '',
  longitude: '',
  agent_id: {
    id: '',
    name: ''
  },
  type_id: {
    id: '',
    name: ''
  },
  state_id: {
    id: '',
    name: ''
  },
});
const formRef = ref();

const propertyFeaturesList: Ref<PropertyFeatureDropdownInterface[]> = ref([]);
const propertyStatesList: Ref<PropertyDropdownInterface[]> = ref([]);
const propertyAgentsList: Ref<PropertyDropdownInterface[]> = ref([]);
const propertyTypesList: Ref<PropertyDropdownInterface[]> = ref([]);

const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedFiles = ref<PropertyImageInterface[]>([]);

// TODO: Implement map to get coordinates

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
    await PropertiesService.deletePropertyImage(propertyId.value, image.id);
  }
};

/**
 *
 */
const selectPropertyFeatures = async () => {
  const { data } = await PropertiesService.getPropertyFeatures();

  if (data) {
    propertyFeaturesList.value = data?.data.map((feature: any) => ({
      id: feature.id,
      name: feature.name,
      selected: false,
    }));
  }
}

const selectPropertyStates = async () => {
  const { data } = await PropertiesService.getPropertyStates();

  if (data) {
    propertyStatesList.value = data?.data.map((state: any) => ({
      id: state.id,
      name: state.name,
    }));
  }
}

const selectAgents = async () => {
  const { data } = await AgentsService.getAgents();

  if (data) {
    propertyAgentsList.value = data?.data?.items.map((agent: any) => ({
      id: agent.ID,
      name: agent.display_name,
    }));
  }
}

const selectPropertyTypes = async () => {
  const { data } = await PropertiesService.getPropertyTypes();

  if (data) {
    propertyTypesList.value = data?.data.map((type: any) => ({
      id: type.id,
      name: type.name,
    }));
  }
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
    state_id: data?.data.p_state,
    type_id: data?.data.type,
    available_for: {
      label: data?.data.available_for === GLOBAL.SALE ? t('property.sale') : t('property.rental'),
      value: data?.data.available_for,
    }
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
  if (await validateForm()) {
    try {
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
      payload.append('latitude', form.value.latitude);
      payload.append('longitude', form.value.longitude);
      payload.append('agent_id', form.value.agent_id.id);
      payload.append('type_id', form.value.type_id.id);
      payload.append('state_id', form.value.state_id.id);

      const features = propertyFeaturesList.value.filter(item => item.selected).map(item => item.id);
      if (features.length > 0) {
        features.forEach((feature) => {
          payload.append('features[]', feature);
        })
      }

      if (isEditProperty.value) {
        await PropertiesService.updateProperty(propertyId.value, payload);
      } else {
        if (selectedFiles.value.length > 0) {
          selectedFiles.value.forEach((image) => {
            payload.append('images[]', image.file);
          })
        }

        await PropertiesService.createProperty(payload);
      }

      await router.push({name: 'properties'});
    } catch (error) {
      console.log(error);
    }
  }
}

onMounted(async () => {
  isLoading.value = true;

  await selectPropertyFeatures();
  await selectPropertyStates();
  await selectAgents();
  await selectPropertyTypes();

  if (route.params.id) {
    isEditProperty.value = true;
    propertyId.value = `${route.params.id}`;

    await getPropertyData();
  }

  isLoading.value = false;
});

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

  .browser-images-section {
    border: 1px dashed rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    padding: 30px;

    .q-btn.btn-browser {
      background-color: var(--q-secondary);
      color: var(--q-primary);
    }

    .q-btn.btn-browser:hover {
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
}

@media screen and (max-width: 1023px) {
  .property-form-container {
    .card-section-one, .card-section-two {
      padding: 0;
    }
  }
}
</style>
