<template>
  <q-page class="q-page-general">
    <q-card class="row">
      <div class="col-12 col-md-4 col-lg-3 sidebar">
        <SidebarComponent />
      </div>
      <div class="col-12 col-md-8 col-lg-9">
        <CalendarComponent />
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import CalendarComponent from 'components/CalendarComponents/CalendarComponent.vue';
import SidebarComponent from 'components/CalendarComponents/SidebarComponent.vue';
</script>

<style lang="scss" scoped>
.sidebar {
  border-right: 1px solid var(--q-border-color) !important;
}
</style>
