<template>
  <div>
    <div class="q-pb-lg flex row justify-between">
      <h5 class="q-ma-none">{{ $t('setting.property') }} {{ $t('setting.states') }}</h5>
      <q-btn color="primary" icon="mdi-plus-circle-outline" :ripple="false" @click="stateDialog = true">{{ $t('setting.addState') }}</q-btn>
    </div>

    <div>
      <q-table
        hide-bottom
        row-key="name"
        :rows="rows"
        :columns="columns"
      >
        <template v-slot:body-cell-color="props">
          <q-td :props="props">
            <div class="color-box" :style="{ backgroundColor: props.row.color }"></div>
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="actions">
            <q-btn dense round flat color="grey" icon="mdi-square-edit-outline"></q-btn>
            <q-btn dense round flat color="grey" icon="mdi-trash-can-outline"></q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog
      v-model="stateDialog"
      full-height
      position="right"
      square
      maximized
    >
      <q-card class="dialog-card">
        <div class="q-pa-lg flex items-center dialog-title">
          <h6 class="text-h6 q-ma-none">{{ $t('setting.addState') }}</h6>
          <q-space />
          <q-icon name="close" size="sm" class="cursor-pointer" @click="stateDialog = false" />
        </div>
        <q-separator />
        <div class="q-pa-lg">
          <state-form-component />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
// Components
import StateFormComponent from 'components/SettingComponents/Forms/StateFormComponent.vue';

const { t } = useI18n();

const stateDialog = ref(false);

const columns = [
  { name: 'name', label: t('global.name'), field: 'name', align: 'left' },
  { name: 'color', label: t('global.color'), field: 'color', align: 'center' },
  { name: 'actions', label: t('global.actions'), field: '', align: 'right' },
]

const rows = [
  { name: 'Active', color: '#71DD37' },
  { name: 'Process', color: '#FFAB00' },
  { name: 'Decline', color: '#ff3e1d' },
]
</script>

<style scoped lang="scss">
.color-box {
  width: 20px;
  height: 20px;
  border-radius: 50px;
  display: inline-block;
}
</style>
