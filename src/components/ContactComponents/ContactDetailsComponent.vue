<template>
  <div>
    <q-card>
      <div v-if="!isLoading && contactDetails" class="flex column gap-lg q-pa-lg">
        <div class="flex column items-center">
          <q-avatar rounded size="100px" color="primary" text-color="white"><img src="https://quasar-prime-admin-template.netlify.app/assets/avatar-1-DMk2FF1-.png" alt=""></q-avatar>
          <p class="text-subtitle1 text-weight-medium q-my-sm">{{ contactDetails.first_name }} {{ contactDetails.last_name }}</p>
          <q-chip square class="text-weight-medium" color="grey-2" text-color="grey">{{ contactDetails.type }}</q-chip>
        </div>
        <div class="flex gap-md stats-details-section">
          <div class="flex items-center gap-sm">
            <q-icon size="sm" color="primary" name="mdi-cash-check" class="bg-secondary q-pa-sm" />
            <div class="flex column items-start">
              <span class="text-capitalize text-weight-medium">Pending</span>
              <span class="text-capitalize text-weight-regular text-grey-5">{{ $t('agent.amountNegotiations') }}</span>
            </div>
          </div>
          <div class="flex items-center gap-sm">
            <q-icon size="sm" color="primary" name="mdi-account-group" class="bg-secondary q-pa-sm" />
            <div class="flex column items-start">
              <span class="text-capitalize text-weight-medium">Pending</span>
              <span class="text-capitalize text-weight-regular text-grey-5">{{ $t('agent.numberAgent') }}</span>
            </div>
          </div>
        </div>
        <div class="flex column gap-sm">
          <p class="text-subtitle1 text-weight-medium q-ma-none">{{ $t('global.details') }}</p>
          <q-separator />
          <div class="q-pt-xs">
            <p class="text-capitalize text-weight-medium q-ma-none q-py-xs">{{ $t('agent.email') }}: <span class="text-capitalize text-weight-regular text-grey-6">{{ contactDetails.email }}</span></p>
            <p class="text-capitalize text-weight-medium q-ma-none q-py-xs">{{ $t('agent.phone') }}: <span class="text-capitalize text-weight-regular text-grey-6">{{ contactDetails.phone }}</span></p>
            <p class="text-capitalize text-weight-medium q-ma-none q-py-xs">{{ $t('agent.address') }}: <span class="text-capitalize text-weight-regular text-grey-6">{{ contactDetails.address }}</span></p>
          </div>
        </div>
        <div class="flex justify-center gap-sm">
          <q-btn color="primary" class="q-px-lg" :ripple="false" @click="contactFormDialog = true">{{ $t('global.edit') }}</q-btn>
          <q-btn color="red-2" class="q-px-lg shadow-0 text-red" :ripple="false">{{ $t('global.suspend') }}</q-btn>
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
        <div class="q-pa-lg flex items-center dialog-title">
          <h6 class="text-h6 q-ma-none">{{ $t('contact.editContact') }}</h6>
          <q-space />
          <q-icon name="close" size="sm" class="cursor-pointer" @click="contactFormDialog = false" />
        </div>
        <q-separator />
        <div v-if="contactDetails" class="q-pa-lg">
          <contact-form-component
            ref="formData"
            :is-edit="true"
            :form-details="contactDetails"
          />
          <q-btn :loading="isLoadingSave" color="primary" class="full-width text-capitalize" @click="saveContact">{{ $t('global.save') }}</q-btn>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import { useRoute } from 'vue-router'
// Interfaces
import type { ContactDetailsInterface } from 'src/interfaces/contact.interface';
// Store
import { useContactStore } from 'src/stores/contact.store';
// Services
import ContactsService from 'src/services/contacts.service';
// Components
import ContactFormComponent from 'components/ContactComponents/ContactFormComponent.vue';

const route = useRoute();
const contactStore = useContactStore();

const isLoading = ref(false);
const contactFormDialog = ref(false);
const isLoadingSave = ref(false);

const formData = ref<typeof ContactFormComponent | null>(null);
const contactDetails: Ref<ContactDetailsInterface | undefined> = ref();

const contactId = computed(() => contactStore.getContactId);

/**
 *
 */
const getContactDetails = async () => {
  const { data } = await ContactsService.getContact(contactId.value);
  contactDetails.value = data?.data;
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
    // TODO: Enviar en el formData la imagen del contacto

    const payload = new FormData();
    payload.append('first_name', formData.value?.formData.form.first_name);
    payload.append('last_name', formData.value?.formData.form.last_name);
    payload.append('email', formData.value?.formData.form.email);
    payload.append('phone', formData.value?.formData.form.phone);
    payload.append('address', formData.value?.formData.form.address);
    payload.append('interests', formData.value?.formData.form.interest);
    payload.append('type', formData.value?.formData.form.type);

    await ContactsService.updateContact(contactId.value, payload);

    await getContactDetails();
    contactFormDialog.value = false;
  }

  isLoadingSave.value = false;
};

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
</style>
