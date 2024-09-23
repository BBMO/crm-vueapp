<template>
  <q-card class="q-pa-lg stats-card-container">
    <div class="row">
      <div class="col-sm-8 col-12 flex column">
        <p class="text-subtitle1 text-grey-14 q-ma-none">{{ props.title }}</p>
        <h5 class="q-my-xs text-weight-medium">{{ props.quantity }} <span v-if="props.isAmount">$</span></h5>
      </div>
      <div class="col-sm-4 col-12 flex items-start justify-end stats-icon">
        <span class="relative-position q-pa-xs">
          <span class="absolute full-width full-height background-icon" :class="`bg-${props.color}`"></span>
          <q-icon :name="props.icon" :color="props.color" size="sm" />
        </span>
      </div>
    </div>
    <p class="text-caption text-grey q-ma-none">{{ props.subtitle }}</p>
  </q-card>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
  icon: string
  color: string
  quantity: number
  isAmount?: boolean
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
    display: none;
  }
}
</style>
