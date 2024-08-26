<template>
  <q-card>
    <div class="q-px-md q-py-lg flex justify-end gap-md">
      <q-input
        outlined
        dense
        v-model="textSearch"
        :placeholder="$t('global.search')"
      ></q-input>
      <q-btn color="grey-12" icon="mdi-database-export-outline" class="q-px-lg shadow-0 text-grey" :ripple="false">{{ $t('global.export') }}</q-btn>
      <q-btn color="primary" icon="mdi-plus" class="q-px-lg" :ripple="false">{{ $t('user.addUser') }}</q-btn>
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
      <template v-slot:body-cell-state="props">
        <q-td :props="props">
          <q-chip
            square
            class="text-weight-medium"
            :color="props.row.state.toLowerCase() === GLOBAL.ACTIVE.toLowerCase() ? 'light-green-1' : 'grey-2'"
            :text-color="props.row.state.toLowerCase() === GLOBAL.ACTIVE.toLowerCase() ? 'positive' : 'grey'"
          >
            {{ props.row.state }}
          </q-chip>
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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
// Constants
import { GLOBAL } from 'src/constants/global.constant';

const { t } = useI18n();

const textSearch = ref('');

const columns = [
  { name: 'name', label: t('menu.user'), field: 'name', align: 'left' },
  { name: 'email', label: t('global.email'), field: 'email', align: 'left' },
  { name: 'state', label: t('global.state'), field: 'state', align: 'left' },
  { name: 'actions', label: t('global.actions'), field: '', align: 'right' },
]

const rows = [
  { image: 'https://demos.themeselection.com/sneat-vuetify-vuejs-admin-template/demo-1/assets/avatar-1-DL1ARROH.png', name: 'José Pérez', email: 'joseperez@mail.com', state: 'Active' },
  { image: 'https://demos.themeselection.com/sneat-vuetify-vuejs-admin-template/demo-1/assets/avatar-2-D-0hhBDR.png', name: 'José Pérez', email: 'joseperez@mail.com', state: 'Inactive' },
  { image: 'https://demos.themeselection.com/sneat-vuetify-vuejs-admin-template/demo-1/assets/avatar-1-DL1ARROH.png', name: 'José Pérez', email: 'joseperez@mail.com', state: 'Active' },
  { image: 'https://demos.themeselection.com/sneat-vuetify-vuejs-admin-template/demo-1/assets/avatar-2-D-0hhBDR.png', name: 'José Pérez', email: 'joseperez@mail.com', state: 'Active' },
]
</script>

<style scoped lang="scss">

</style>
