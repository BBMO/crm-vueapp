<template>
  <div>
    <q-card>
      <div v-if="!isLoading && contactDetails" class="flex column gap-lg q-pa-lg">
        <div class="flex column items-center">
          <q-avatar rounded size="100px" color="white" text-color="white"><img :src="contactDetails.attachment_url" alt=""></q-avatar>
          <p class="text-subtitle1 text-weight-medium q-mt-md q-mb-xs text-capitalize">{{ contactDetails.first_name }} {{ contactDetails.last_name }}</p>
          <q-chip
            square
            class="text-weight-medium"
            :ripple="false"
            :color="contactDetails.type === GLOBAL.CLIENT ? 'green-2' : 'orange-2'"
            :text-color="contactDetails.type === GLOBAL.CLIENT ? 'green' : 'orange'"
          >{{ contactDetails.type === GLOBAL.CLIENT ? t('contact.client') : t('contact.lead') }}</q-chip>
        </div>
        <div class="flex column gap-sm">
          <p class="text-subtitle1 text-weight-medium q-ma-none">{{ $t('global.details') }}</p>
          <q-separator />
          <div class="q-pt-xs">
            <p class="text-weight-medium q-ma-none q-py-xs">{{ $t('contact.form.firstName') }}: <span class="text-weight-regular text-grey-6">{{ contactDetails.first_name }}</span></p>
            <p class="text-weight-medium q-ma-none q-py-xs">{{ $t('contact.form.lastName') }}: <span class="text-weight-regular text-grey-6">{{ contactDetails.last_name }}</span></p>
            <p class="text-weight-medium q-ma-none q-py-xs">{{ $t('contact.form.email') }}: <span class="text-weight-regular text-grey-6">{{ contactDetails.email }}</span></p>
            <p class="text-weight-medium q-ma-none q-py-xs">{{ $t('contact.form.phone') }}: <span class="text-weight-regular text-grey-6">{{ contactDetails.phone }}</span></p>
            <p class="text-weight-medium q-ma-none q-py-xs">{{ $t('contact.form.address') }}: <span class="text-weight-regular text-grey-6">{{ contactDetails.address }}</span></p>
          </div>
        </div>
        <div v-if="contactDetails.features?.length !== 0" class="flex column gap-sm">
          <p class="text-subtitle1 text-weight-medium q-ma-none">{{ $t('contact.form.features') }}</p>
          <q-separator />
          <div class="q-pt-xs">
            <q-chip
              v-for="(feature, index) in contactDetails.features"
              :key="index"
              color="secondary"
              text-color="primary"
              class="no-box-shadow no-pointer-events"
              :ripple="false"
            >
              {{ feature.name }}
            </q-chip>
          </div>
        </div>
        <div class="flex justify-center gap-sm">
          <q-btn color="primary" class="q-px-lg" :ripple="false" @click="contactFormDialog = true">{{ $t('global.edit') }}</q-btn>
          <q-btn v-if="getIsAdmin()" color="red-2" class="q-px-lg shadow-0 text-red" :ripple="false" @click="deleteDialog = true">{{ $t('global.delete') }}</q-btn>
        </div>
      </div>
      <div v-if="isLoading" class="full-width full-height flex align-center justify-center q-py-xl">
        <q-spinner color="primary" size="3em" />
      </div>
    </q-card>

    <q-dialog
      v-model="contactFormDialog"
      full-height
      position="right"
      square
      maximized
    >
      <q-card class="dialog-card">
        <div class="q-px-lg q-py-md flex items-center dialog-title">
          <h6 class="text-h6 q-ma-none">{{ $t('contact.editContact') }}</h6>
          <q-space />
          <q-icon name="close" size="sm" class="cursor-pointer" @click="contactFormDialog = false" />
        </div>
        <q-separator />
        <div v-if="contactDetails" class="q-pa-lg">
          <contact-form-component
            ref="formData"
            :is-edit="true"
          />
          <q-btn :loading="isLoadingSave" color="primary" class="full-width text-capitalize" @click="saveContact">{{ $t('global.save') }}</q-btn>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog
      v-model="deleteDialog"
      persistent
    >
      <q-card>
        <q-card-section class="row items-center">
          <div class="flex no-wrap items-center gap-sm">
            <q-icon size="md" name="mdi-delete-outline" color="negative" />
            <span>{{ $t('global.deleteMessage') }}</span>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn outline :label="$t('global.cancel')" color="primary" class="no-box-shadow" :ripple="false" @click="deleteDialog = false" />
          <q-btn :loading="isLoadingDelete" :label="$t('global.accept')" color="primary" class="no-box-shadow" :ripple="false" @click="deleteContact" />
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
import type { ContactDetailsInterface } from 'src/interfaces/contact.interface';
// Constants
import { GLOBAL } from 'src/constants/global.constant';
// Composable
import useRole from 'src/composable/useRole';
// Store
import { useContactStore } from 'src/stores/contact.store';
// Services
import ContactsService from 'src/services/contacts.service';
// Components
import ContactFormComponent from 'components/ContactComponents/ContactFormComponent.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const { getIsAdmin } = useRole();
const contactStore = useContactStore();

const isLoading = ref(false);
const isLoadingSave = ref(false);
const isLoadingDelete = ref(false);

const contactFormDialog = ref(false);
const deleteDialog = ref(false);

const formData = ref<typeof ContactFormComponent | null>(null);
const contactDetails: Ref<ContactDetailsInterface | undefined> = ref();

const contactId = computed(() => contactStore.getContactId);

/**
 *
 */
const getContactDetails = async () => {
  const { data } = await ContactsService.getContact(contactId.value);
  contactDetails.value = data?.data || undefined;
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
const saveContact = async () => {
  isLoadingSave.value = true;

  if (await validateForm()) {
    const payload = new FormData();
    payload.append('first_name', formData.value?.formData.form.first_name);
    payload.append('last_name', formData.value?.formData.form.last_name);
    payload.append('email', formData.value?.formData.form.email);
    payload.append('phone', formData.value?.formData.form.phone);
    payload.append('address', formData.value?.formData.form.address);
    payload.append('type', formData.value?.formData.form.type);

    if (formData.value?.formData.form.image) {
      payload.append('image', formData.value?.formData.form.image);
    }

    try {
      await ContactsService.updateContact(contactId.value, payload);
      $q.notify({ message: t('global.successUpdateMessage'), color: 'green', position: 'top-right' });
    } catch (error) {
      $q.notify({ message: t('global.errorMessage'), color: 'red', position: 'top-right' });
    }

    await getContactDetails();
    contactFormDialog.value = false;
  }

  isLoadingSave.value = false;
};

const deleteContact = async () => {
  try {
    await ContactsService.deleteContact(contactId.value);
    $q.notify({ message: t('global.successDeleteMessage'), color: 'green', position: 'top-right' });
    await contactStore.fetchContactStats(t);
    await router.push({name: 'contacts'});
  } catch (error) {
    $q.notify({ message: t('global.errorMessage'), color: 'red', position: 'top-right' });
  }
}

onMounted(async () => {
  isLoading.value = true;
  if (!contactId.value) {
    contactStore.setContactId(`${route.params.id}`);
  }

  await getContactDetails();
  isLoading.value = false;
})

</script>

<style scoped lang="scss">
.stats-details-section {
  .q-icon {
    border-radius: 5px;
  }
}

:deep(.q-avatar img) {
  object-fit: cover;
}
</style>
