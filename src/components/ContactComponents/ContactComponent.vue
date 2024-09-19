<template>
  <div>
    <q-card class="contact-container">
      <div class="q-px-md q-py-lg filters-section">
        <h6 class="q-ma-none q-mb-md text-weight-medium">{{ $t('global.filters') }}</h6>
        <q-select
          outlined
          dense
          v-model="roleFilter"
          option-label="label"
          option-value="value"
          :options="roleOptions"
        />
      </div>
      <q-separator />
      <div class="q-px-md q-py-lg flex justify-end gap-md">
        <q-input
          outlined
          dense
          v-model="textSearch"
          :placeholder="$t('global.search')"
        ></q-input>
        <q-btn color="grey-12" icon="mdi-database-export-outline" class="q-px-lg shadow-0 text-grey" :ripple="false">{{ $t('global.export') }}</q-btn>
        <q-btn color="primary" icon="mdi-plus" class="q-px-lg" :ripple="false" @click="openDialogSave(false)">{{ $t('contact.addContact') }}</q-btn>
      </div>
      <q-table
        hide-bottom
        row-key="name"
        :rows="contactList"
        :columns="columns"
        :hide-pagination="true"
        :rows-per-page-options="[0]"
      >
        <template v-slot:body-cell-first_name="props">
          <q-td :props="props">
            <div class="flex items-center gap-sm">
              <q-avatar size="40px" color="primary" text-color="white"><img :src="props.row.attachment_url" alt=""></q-avatar>
              {{ props.row.first_name }} {{ props.row.last_name }}
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-type="props">
          <q-td :props="props">
            <span class="flex items-center gap-xs text-capitalize">
              <span class="relative-position flex items-center justify-center" style="width: 30px; height: 30px;">
                <span
                  class="absolute full-width full-height border-radius"
                  style="top: 0; left: 0; opacity: 0.2;"
                  :style="{ background: props.row.type.toLowerCase() === GLOBAL.CLIENT ? 'positive' : 'orange' }"
                ></span>
                <q-icon
                  size="xs"
                  :name="props.row.type.toLowerCase() === GLOBAL.CLIENT ? 'mdi-account-check-outline' : 'mdi-account-clock-outline'"
                  :color="props.row.type.toLowerCase() === GLOBAL.CLIENT ? 'positive' : 'orange'"
                />
              </span>
              {{ props.row.type }}
            </span>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="actions">
            <q-btn dense round flat color="grey" icon="mdi-eye-outline" @click="openContactDetails(props.row.id)"></q-btn>
            <q-btn dense round flat color="grey" icon="mdi-square-edit-outline" @click="openDialogSave(true, props.row)"></q-btn>
            <q-btn dense round flat color="grey" icon="mdi-trash-can-outline" @click="deleteContact(props.row.id)"></q-btn>
          </q-td>
        </template>
      </q-table>
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
          <h6 class="text-h6 q-ma-none">{{ formModeEdit ? $t('contact.editContact') : $t('contact.addContact') }}</h6>
          <q-space />
          <q-icon name="close" size="sm" class="cursor-pointer" @click="contactFormDialog = false" />
        </div>
        <q-separator />
        <div class="q-pa-lg">
          <contact-form-component
            ref="formData"
            :is-edit="formModeEdit"
            :form-details="contactDetails"
          />
          <q-btn :loading="isLoadingSave" color="primary" class="full-width text-capitalize" @click="saveContact">{{ $t('global.save') }}</q-btn>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
// Interfaces
import type { ContactFormInterface } from 'src/interfaces/contact.interface';
// Constants
import { GLOBAL } from 'src/constants/global.constant';
// Services
import ContactsService from 'src/services/contacts.service';
// Store
import { useContactStore } from 'src/stores/contact.store';
// Components
import ContactFormComponent from 'components/ContactComponents/ContactFormComponent.vue';

const { t } = useI18n();
const router = useRouter();
const contactStore = useContactStore();

const columns = [
  { name: 'first_name', label: t('contact.name'), field: 'first_name', align: 'left' },
  { name: 'email', label: t('global.email'), field: 'email', align: 'left' },
  { name: 'type', label: t('global.role'), field: 'type', align: 'left' },
  { name: 'actions', label: t('global.actions'), field: '', align: 'right' },
]

const roleOptions = [
  { label: 'Lead', value: 'lead' },
  { label: 'Client', value: 'client' },
  { label: 'Select role', value: '' }
]

const roleFilter = ref('');
const textSearch = ref('');

const contactFormDialog = ref(false);
const isLoadingSave = ref(false);
const formModeEdit = ref(false);

const contactDetails = ref<ContactFormInterface>({
  id: '',
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  interest: '',
  type: '',
});

const formData = ref<typeof ContactFormComponent | null>(null);
const contactList = ref([]);

/**
 *
 */
const validateForm = async () => {
  return await formData.value?.validateForm();
}

/**
 *
 */
const getContacts = async () => {
  const { data } = await ContactsService.getContacts();

  if (data) {
    contactList.value = data?.data?.items;
  }
}

/**
 *
 */
const openContactDetails = (contactId: string) => {
  contactStore.setContactId(contactId);
  router.push({ name: 'contactDetails', params: { id: contactId } });
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

    if (formModeEdit.value) {
      await ContactsService.updateContact(contactDetails.value.id, payload);
    } else {
      await ContactsService.createContact(payload);
    }

    await getContacts();
    contactFormDialog.value = false;
  }

  isLoadingSave.value = false;
};

/**
 *
 */
const deleteContact = async (contactId: string) => {
  await ContactsService.deleteContact(contactId);
  await getContacts();
}

/**
 *
 */
const openDialogSave = (modeEdit: boolean, details?: ContactFormInterface) => {
  formModeEdit.value = modeEdit;

  if (details) {
    contactDetails.value = details;
  }

  contactFormDialog.value = true;
}

onMounted(async () => {
  await getContacts();
})
</script>

<style scoped lang="scss">
.contact-container {
  .filters-section .q-select {
    width: 30%;
  }
}
</style>
