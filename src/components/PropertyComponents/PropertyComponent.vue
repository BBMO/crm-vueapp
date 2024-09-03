<template>
  <q-card class="property-container">
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
      <q-btn color="primary" icon="mdi-plus" class="q-px-lg" :ripple="false" @click="propertyFormDialog = true">{{ $t('property.addProperty') }}</q-btn>
    </div>
    <q-table
      hide-bottom
      row-key="name"
      :rows="rows"
      :columns="columns"
    >
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <q-avatar size="40px" color="primary" text-color="white"><img :src="props.row.image" alt=""></q-avatar>
          {{ props.row.name }}
        </q-td>
      </template>
      <template v-slot:body-cell-role="props">
        <q-td :props="props">
          <span class="flex items-center gap-xs">
            <q-icon
              size="xs"
              :name="props.row.role.toLowerCase() === GLOBAL.CLIENT.toLowerCase() ? 'mdi-account-check-outline' : 'mdi-account-clock-outline'"
              :color="props.row.role.toLowerCase() === GLOBAL.CLIENT.toLowerCase() ? 'positive' : 'orange'"
            />
            {{ props.row.role }}
          </span>
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="actions">
          <q-btn dense round flat color="grey" icon="mdi-eye-outline"></q-btn>
          <q-btn dense round flat color="grey" icon="mdi-square-edit-outline"></q-btn>
          <q-btn dense round flat color="grey" icon="mdi-trash-can-outline"></q-btn>
        </q-td>
      </template>
    </q-table>
  </q-card>

  <q-dialog
    v-model="propertyFormDialog"
    full-height
    position="right"
    square
    maximized
  >
    <q-card class="dialog-card">
      <div class="q-pa-lg flex items-center dialog-title">
        <h6 class="text-h6 q-ma-none">{{ $t('property.addProperty') }}</h6>
        <q-space />
        <q-icon name="close" size="sm" class="cursor-pointer" @click="propertyFormDialog = false" />
      </div>
      <q-separator />
      <div class="q-pa-lg">
        Formulario de propiedad
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
// Constants
import { GLOBAL } from 'src/constants/global.constant';

const { t } = useI18n();

const propertyFormDialog = ref(false);

const roleFilter = ref('');
const textSearch = ref('');

const roleOptions = [
  { label: 'Lead', value: 'lead' },
  { label: 'Client', value: 'client' },
  { label: 'Select role', value: '' }
]

const columns = [
  { name: 'name', label: t('menu.user'), field: 'name', align: 'left' },
  { name: 'email', label: t('global.email'), field: 'email', align: 'left' },
  { name: 'role', label: t('global.role'), field: 'role', align: 'left' },
  { name: 'actions', label: t('global.actions'), field: '', align: 'right' },
]

const rows = [
  { image: 'https://demos.themeselection.com/sneat-vuetify-vuejs-admin-template/demo-1/assets/avatar-1-DL1ARROH.png', name: 'José Pérez', email: 'joseperez@mail.com', role: 'Lead' },
  { image: 'https://demos.themeselection.com/sneat-vuetify-vuejs-admin-template/demo-1/assets/avatar-2-D-0hhBDR.png', name: 'José Pérez', email: 'joseperez@mail.com', role: 'Lead' },
  { image: 'https://demos.themeselection.com/sneat-vuetify-vuejs-admin-template/demo-1/assets/avatar-1-DL1ARROH.png', name: 'José Pérez', email: 'joseperez@mail.com', role: 'Client' },
  { image: 'https://demos.themeselection.com/sneat-vuetify-vuejs-admin-template/demo-1/assets/avatar-2-D-0hhBDR.png', name: 'José Pérez', email: 'joseperez@mail.com', role: 'Client' },
]
</script>

<style scoped lang="scss">
.property-container {
  .filters-section .q-select {
    width: 30%;
  }
}
</style>
