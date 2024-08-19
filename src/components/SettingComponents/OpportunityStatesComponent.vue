<template>
  <div>
    <div class="flex row justify-between">
      <h5 class="q-ma-none">{{ $t('modules.opportunity') }} {{ $t('modules.states') }}</h5>
      <q-btn dense color="primary" icon="mdi-plus-circle-outline" :ripple="false">{{ $t('modules.addState') }}</q-btn>
    </div>

    <div>
      <q-table
        dense
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
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const columns = [
  {
    name: 'name',
    label: t('global.name'),
    field: 'name',
    align: 'left'
  },
  {
    name: 'color',
    label: t('global.color'),
    field: 'calories',
    align: 'center'
  },
  {
    name: 'actions',
    label: t('global.actions'),
    field: '',
    align: 'right'
  },
]

const rows = [
  {
    name: 'Active',
    color: '#71DD37',
  },
  {
    name: 'Process',
    color: '#FFAB00',
  },
  {
    name: 'Decline',
    color: '#ff3e1d',
  },
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
