<template>
  <q-card class="q-pa-lg stats-card-container">
    <div class="row">
      <div class="col-8 flex column">
        <p class="text-subtitle1 text-grey-14 q-ma-none">{{ props.stats.title }}</p>
        <h5 class="q-my-xs text-weight-medium">{{ props.stats.quantity }} <span v-if="props.stats.isAmount">$</span></h5>
      </div>
      <div class="col-4 flex items-start justify-end stats-icon">
        <span class="relative-position q-pa-sm">
          <span class="absolute full-width full-height background-icon" :class="`bg-${props.stats.color}`"></span>
          <q-icon :name="props.stats.icon" :color="props.stats.color" size="sm" />
        </span>
      </div>
    </div>
    <p class="text-caption text-grey q-ma-none">{{ props.stats.subtitle }}</p>
  </q-card>
</template>

<script setup lang="ts">
// Interfaces
import type { AppStatsInterface } from 'src/interfaces/app.interface';

interface Props {
  stats: AppStatsInterface
}

const props = defineProps<Props>()
</script>

<style scoped lang="scss">
.stats-card-container {
  p { line-height: 1rem; }

  span.background-icon {
    top: 0;
    left: 0;
    opacity: 0.2;
    border-radius: 5px;
  }
}

@media screen and (max-width: 599px) {
  .stats-card-container .stats-icon {
    // display: none;
  }
}
</style>
