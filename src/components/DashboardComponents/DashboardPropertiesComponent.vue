<template>
  <q-card class="top-agents-dashboard">
    <div class="q-pa-md flex items-center gap-xs">
      <q-icon size="sm" name="mdi-home-plus-outline" color="primary"/>
      <h6 class="q-ma-none">{{ props.title }}</h6>
    </div>
    <q-table
        row-key="name"
        :rows="props.propertiesData"
        :columns="columns"
        :rows-per-page-options="[0]"
        hide-pagination
    >
      <template v-slot:body-cell-title="props">
        <q-td :props="props">
          <div class="flex no-wrap items-center gap-sm">
            <q-avatar rounded size="40px" color="white" text-color="white">
              <img :src="props.row.images.length > 0 ? props.row.images[0].url : 'https://i.ibb.co/0Jmshvb/no-image.png'" alt="">
            </q-avatar>
            <div>
              <p class="q-ma-none text-capitalize">{{ props.row.title }}</p>
              <p class="text-caption text-grey q-ma-none">{{ $t('opportunity.form.agent')}}: {{ props.row.agent.name }}</p>
            </div>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-available_for="props">
        <q-td :props="props">
          <span class="flex items-center gap-xs text-capitalize">
            <span class="relative-position flex items-center justify-center" style="width: 30px; height: 30px;">
              <span
                class="absolute full-width full-height border-radius"
                style="top: 0; left: 0; opacity: 0.2;"
                :style="{ background: props.row.available_for === GLOBAL.SALE ? 'cyan' : 'indigo' }"
              ></span>
              <q-icon
                size="xs"
                :name="props.row.available_for === GLOBAL.SALE ? 'mdi-account-cash-outline' : 'mdi-account-key-outline'"
                :color="props.row.available_for === GLOBAL.SALE ? 'cyan' : 'indigo'"
              />
            </span>
            {{ props.row.available_for === GLOBAL.SALE ? t('property.sale') : t('property.rental') }}
          </span>
        </q-td>
      </template>
      <template v-slot:body-cell-price="props">
        <q-td :props="props">{{ props.row.price }}$</q-td>
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
// Constants
import { GLOBAL } from 'src/constants/global.constant';

interface Props {
  title: string
  propertiesData: any
}
const props = defineProps<Props>()

const { t } = useI18n();

const columns = [
  { name: 'title', label: t('property.title'), field: 'title', align: 'left' },
  { name: 'available_for', label: t('property.form.availableFor'), field: 'available_for', align: 'left' },
  { name: 'price', label: t('property.form.price'), field: 'price', align: 'left' },
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
