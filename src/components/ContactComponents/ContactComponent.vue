<template>
  <div>
    <q-card class="contact-container">
      <div class="q-px-md q-py-md filters-section">
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
                  <label>{{ $t('global.search') }}</label>
                  <q-input
                    outlined
                    dense
                    v-model="filters.search"
                  ><template v-slot:prepend><q-icon name="mdi-magnify" /></template></q-input>
                </div>
                <div class="col-sm-4 col-12 q-pa-sm">
                  <label>{{ $t('contact.form.address') }}</label>
                  <q-input
                    outlined
                    dense
                    v-model="filters.address"
                  ><template v-slot:prepend><q-icon name="mdi-home-map-marker" /></template></q-input>
                </div>
                <div class="col-sm-4 col-12 q-pa-sm">
                  <label>{{ $t('contact.form.type') }}</label>
                  <q-select
                    outlined
                    dense
                    v-model="filters.type"
                    option-label="label"
                    option-value="value"
                    :options="typeContact"
                  ></q-select>
                </div>
              </div>
              <div class="flex justify-end gap-sm q-px-sm q-mt-md">
                <q-btn outline color="negative" class="no-box-shadow" :ripple="false" @click="cleanFilters">{{ $t('global.cleanFilters') }}</q-btn>
                <q-btn outline color="primary" icon="mdi-magnify" class="no-box-shadow" :ripple="false" @click="applyFilters">{{ $t('global.searchFilters') }}</q-btn>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>
      <q-separator />
      <div class="q-px-md q-py-lg flex justify-end gap-md">
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
            <div class="flex no-wrap items-center gap-sm">
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
                  :style="{ background: props.row.type.toLowerCase() === GLOBAL.CLIENT ? 'green' : 'orange' }"
                ></span>
                <q-icon
                  size="xs"
                  :name="props.row.type.toLowerCase() === GLOBAL.CLIENT ? 'mdi-account-check-outline' : 'mdi-account-clock-outline'"
                  :color="props.row.type.toLowerCase() === GLOBAL.CLIENT ? 'green' : 'orange'"
                />
              </span>
              {{ props.row.type }}
            </span>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="actions">
            <q-btn dense round flat color="grey" icon="mdi-eye-outline" @click="openContactDetails(props.row.id)"></q-btn>
            <q-btn dense round flat color="grey" icon="mdi-square-edit-outline" @click="openDialogSave(true, props.row.id)"></q-btn>
            <q-btn dense round flat color="grey" icon="mdi-trash-can-outline" @click="openDialogDelete(props.row.id)"></q-btn>
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
          />
          <q-btn :loading="isLoadingSave" color="primary" class="full-width text-capitalize q-mt-lg" @click="saveContact">{{ $t('global.save') }}</q-btn>
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
import { computed, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
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

const typeContact = [
  { label: t('contact.client'), value: GLOBAL.CLIENT },
  { label: t('contact.lead'), value: GLOBAL.LEAD },
];

const filters = ref({
  type: {
    label: '',
    value: ''
  },
  address: '',
  search: '',
});

const contactFormDialog = ref(false);
const deleteDialog = ref(false);

const isLoadingSave = ref(false);
const isLoadingDelete = ref(false);

const formModeEdit = ref(false);
const formData = ref<typeof ContactFormComponent | null>(null);

const contactList = ref([]);

const contactId = computed(() => contactStore.getContactId);

/**
 *
 */
const getContacts = async () => {
  const { data } = await ContactsService.getContacts();
  contactList.value = data?.data?.items || [];
}

/**
 *
 */
const cleanFilters = () => {
  filters.value = {
    type: {
      label: '',
      value: ''
    },
    address: '',
    search: '',
  };

  getContacts();
}

/**
 *
 */
const applyFilters = async () => {
  const { data } = await ContactsService.getContacts({
    type: filters.value.type.value,
    address: filters.value.address,
    search: filters.value.search,
  });

  contactList.value = data?.data?.items || [];
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
    payload.append('type', formData.value?.formData.form.type.value);

    if (formData.value?.formData.form.image) {
      payload.append('image', formData.value?.formData.form.image);
    }

    if (formModeEdit.value) {
      await ContactsService.updateContact(contactId.value, payload);
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
const deleteContact = async () => {
  await ContactsService.deleteContact(contactId.value);
  deleteDialog.value = false;
  await getContacts();
}

/**
 *
 */
const openDialogSave = (modeEdit: boolean, contactId?: string) => {
  formModeEdit.value = modeEdit;

  if (contactId)
    contactStore.setContactId(contactId);

  contactFormDialog.value = true;
}

/**
 *
 */
const openDialogDelete = (contactId: string) => {
  if (contactId)
    contactStore.setContactId(contactId);

  deleteDialog.value = true;
}

onMounted(async () => {
  await getContacts();
})
</script>

<style scoped lang="scss">
.contact-container {
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
  }
}
</style>
