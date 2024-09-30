<template>
  <q-card class="top-agents-dashboard">
    <div class="q-pa-md flex items-center gap-xs">
      <q-icon size="sm" name="mdi-card-account-details-star-outline" color="primary"/>
      <h6 class="q-ma-none">{{ props.title }}</h6>
    </div>
    <q-table
      row-key="name"
      :rows="props.agentTopData"
      :columns="columns"
      :rows-per-page-options="[0]"
      hide-pagination
    >
      <template v-slot:body-cell-display_name="props">
        <q-td :props="props">
          <div class="flex no-wrap items-center gap-sm">
            <q-avatar size="35px" color="white" text-color="white"><img :src="props.row.avatar" alt=""></q-avatar>
            {{ props.row.display_name }}
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-total_amount="props">
        <q-td :props="props">{{ props.row.total_amount }}$</q-td>
      </template>
      <template v-slot:no-data>
        <div class="full-width flex column items-center q-my-md">
          <q-icon size="md" name="mdi-alert" color="grey" />
          <p class="text-weight-medium q-ma-none q-py-xs text-grey">{{ $t('global.noDataAvailable') }}</p>
        </div>
      </template>
    </q-table>
  </q-card>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

interface Props {
  title: string
  agentTopData: any
}
const props = defineProps<Props>()

const { t } = useI18n();

const columns = [
  { name: 'display_name', label: t('agent.name'), field: 'name', align: 'left' },
  { name: 'total_opportunities', label: t('menu.opportunities'), field: 'total_opportunities', align: 'center' },
  { name: 'total_amount', label: t('stats.amount'), field: 'total_amount', align: 'center' },
]
</script>

<style scoped lang="scss">
.top-agents-dashboard {
  :deep(.q-table thead tr) {
    height: 40px;

    th {
      color: $grey-14;
      font-weight: 500;
      text-transform: capitalize;
    }
  }

  :deep(.q-table tbody tr td) {
    font-size: 14px;
  }
}
</style>
