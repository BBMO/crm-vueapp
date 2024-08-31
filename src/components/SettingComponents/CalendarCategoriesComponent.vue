<template>
  <div>
    <div class="q-pb-lg flex row justify-between">
      <h5 class="q-ma-none">{{ $t('setting.calendar') }} {{ $t('setting.categories') }}</h5>
      <q-btn color="primary" icon="mdi-plus-circle-outline" :ripple="false" @click="categoryDialog = true">{{ $t('setting.addCategory') }}</q-btn>
    </div>

    <div>
      <q-table
        hide-bottom
        row-key="name"
        :rows="rows"
        :columns="columns"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="actions">
            <q-btn dense round flat color="grey" icon="mdi-square-edit-outline"></q-btn>
            <q-btn dense round flat color="grey" icon="mdi-trash-can-outline"></q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog
      v-model="categoryDialog"
      full-height
      position="right"
      square
      maximized
    >
      <q-card class="dialog-card">
        <div class="q-pa-lg flex items-center dialog-title">
          <h6 class="text-h6 q-ma-none">{{ $t('setting.addCategory') }}</h6>
          <q-space />
          <q-icon name="close" size="sm" class="cursor-pointer" @click="categoryDialog = false" />
        </div>
        <q-separator />
        <div class="q-pa-lg">
          <basic-form-component />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
// Components
import BasicFormComponent from 'components/SettingComponents/Forms/BasicFormComponent.vue';

const { t } = useI18n();

const categoryDialog = ref(false);

const columns = [
  { name: 'name', label: t('global.name'), field: 'name', align: 'left' },
  { name: 'actions', label: t('global.actions'), field: '', align: 'right' },
]

const rows = [
  { name: 'Meeting' },
  { name: 'Call' },
  { name: 'Email' },
  { name: 'Task' },
  { name: 'Event' },
]
</script>

<style scoped lang="scss">

</style>
