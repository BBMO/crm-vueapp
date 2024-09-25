<template>
  <q-card class="full-width">
    <div class="q-pa-md flex items-center justify-between">
      <h6 class="text-subtitle1 q-ma-none text-weight-medium">{{ $t('property.propertiesList') }}</h6>
      <q-btn color="primary" icon="mdi-plus" class="q-px-lg" :ripple="false">{{ $t('property.addProperty') }}</q-btn>
    </div>
    <q-table
      hide-bottom
      row-key="name"
      :rows="rows"
      :columns="columns"
    >
      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <q-avatar rounded size="40px" color="white" text-color="white"><img :src="props.row.image" alt=""></q-avatar>
          {{ props.row.name }}
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="actions">
          <q-btn dense round flat color="grey" icon="mdi-eye-outline"></q-btn>
          <q-btn dense round flat color="grey" icon="mdi-trash-can-outline"></q-btn>
        </q-td>
      </template>
    </q-table>
  </q-card>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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

</style>
