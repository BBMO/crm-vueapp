<template>
  <q-card class="row q-pa-lg stats-card-container">
    <div class="col-8 flex column">
      <p class="text-subtitle1 text-grey-14 q-ma-none">{{ props.title }}</p>
      <h5 class="q-my-xs text-weight-medium">{{ props.quantity }}</h5>
      <p class="text-caption text-grey q-ma-none">{{ props.subtitle }}</p>
    </div>
    <div class="col-4 flex items-start justify-end">
      <span class="relative-position q-pa-xs">
        <span class="absolute full-width full-height background-icon" :class="`bg-${props.color}`"></span>
        <q-icon :name="props.icon" :color="props.color" size="sm" />
      </span>
    </div>
  </q-card>
</template>

<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
  quantity: string
  icon: string
  color: string
}
const props = defineProps<Props>()

</script>

<style scoped lang="scss">
.stats-card-container {
  p {
    line-height: 1rem;
  }

  span.background-icon {
    top: 0;
    left: 0;
    opacity: 0.2;
    border-radius: 5px;
  }
}
</style>
