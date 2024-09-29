<template>
  <div class="flex global-stats-container">
    <div v-for="(item, index) in props.stats" :key="index" class="row q-px-lg stats-section" :class="`border-${index}`">
      <div class="col-8 flex column">
        <p class="text-subtitle1 text-grey-14 q-ma-none">{{ item.title }}</p>
        <h5 class="q-my-xs text-weight-medium">{{ item.quantity }} <span v-if="item.isAmount">$</span></h5>
      </div>
      <div class="col-4 flex items-start justify-end stats-icon">
        <span class="relative-position q-pa-sm">
          <span class="absolute full-width full-height background-icon" :class="`bg-${item.color}`"></span>
          <q-icon :name="item.icon" :color="item.color" size="sm" />
        </span>
      </div>
      <p class="text-caption text-grey q-ma-none">{{ item.subtitle }}</p>
      <q-separator :class="`separator-${index}`" class="full-width q-my-md" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Interfaces
import type { AppStatsInterface } from 'src/interfaces/app.interface';
interface Props {
  stats: AppStatsInterface[]
}

const props = defineProps<Props>()
</script>

<style scoped lang="scss">
.global-stats-container {
  .stats-section {
    width: 25%;

    &.border-0, &.border-1, &.border-2 {
      border-right: 1px solid rgba(0, 0, 0, 0.12);
    }

    .q-separator {
      display: none;
    }
  }

  p { line-height: 1rem; }

  span.background-icon {
    top: 0;
    left: 0;
    opacity: 0.2;
    border-radius: 5px;
  }
}

@media screen and (max-width: 959px) {
  .global-stats-container {
    .stats-section {
      width: 50% !important;

      &.border-1 {
        border-right: 0;
      }

      &.border-0, &.border-1 {
        .q-separator {
          display: block;
        }
      }
    }
  }
}

@media screen and (max-width: 599px) {
  .global-stats-container {
    .stats-section {
      width: 100% !important;

      &.border-0, &.border-2 {
        border-right: 0;
      }

      .q-separator {
        display: block;

        &.separator-3 {
          display: none;
        }
      }
    }
  }
}
</style>
