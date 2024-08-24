<template>
  <div>
    <div class="sidebar-header">
      <q-btn
        class="add-event-btn"
        color="primary"
        icon="mdi-plus"
        :ripple="false"
        unelevated
        @click="addEvent"
      >{{ $t('calendar.addEvent') }}</q-btn>
    </div>

    <div class="sidebar-body">
      <div class="sidebar-select q-mt-md q-mb-lg">
        <q-select
          outlined
          dense
          v-model="agent"
          :label="$t('calendar.agents')"
          :options="agents"
        >
        </q-select>
      </div>

      <div class="sidebar-agent flex items-center q-mb-xl">
        <q-avatar
          size="40px"
          color="primary"
          text-color="white"
        >
          <img src="https://cdn.quasar.dev/img/boy-avatar.png" alt="">
        </q-avatar>
        <div class="q-ml-md">
          <div class="text-subtitle1 q-ma-none text-weight-medium">John Doe</div>
          <div class="text-caption text-grey">Agent</div>
        </div>
      </div>

      <div class="sidebar-filter">
        <div class="text-subtitle1 text-weight-medium q-mb-lg">{{ $t('calendar.filter') }}</div>

        <div
          v-for="item in categories"
          :key="item.value"
          class="sidebar-filter-item q-mb-md"
        >
          <q-checkbox
            keep-color
            dense
            v-model="item.checked"
            :label="item.label"
            :color="item.color"
            :value="item.value"
          />
        </div>
      </div>
    </div>

    <q-dialog
      v-model="eventDialog"
      full-height
      position="right"
      square
      maximized
    >
      <q-card class="dialog-card">
        <div class="q-pa-lg flex items-center dialog-title">
          <h6 class="text-h6 q-ma-none">{{ $t('calendar.addEvent') }}</h6>
          <q-space />
          <q-icon
            name="close"
            class="cursor-pointer"
            @click="eventDialog = false"
            size="sm"
          />
        </div>
        <q-separator />
        <div class="q-pa-lg">
          <EventFormComponent />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import EventFormComponent from './EventFormComponent.vue';

const eventDialog = ref(false);
const agent = ref(null);

const addEvent = () => {
  eventDialog.value = true;
};

const agents = [
  { label: 'John Doe', value: 'john_doe' },
  { label: 'Jane Doe', value: 'jane_doe' },
  { label: 'John Smith', value: 'john_smith' },
];

const categories = ref([
  { label: 'All', value: 'all', color: 'primary', checked: true },
  { label: 'Meeting', value: 'meeting', color: 'teal', checked: false },
  { label: 'Call', value: 'call', color: 'orange', checked: false },
  { label: 'Email', value: 'email', color: 'deep-orange', checked: false },
  { label: 'Task', value: 'task', color: 'blue', checked: false },
  { label: 'Event', value: 'event', color: 'purple', checked: false },
]);

</script>

<style lang="scss" scoped>
.sidebar-header {
  padding: 1.48rem;
  border-bottom: 1px solid var(--q-border-color);

  .add-event-btn {
    width: 100%;
    font-size: 0.9375rem;
    box-shadow: 0 2px 4px var(--q-secondary);
  }
}

.sidebar-body {
  padding: 1.48rem;

  .sidebar-agent {
    .text-subtitle1 {
      line-height: 1.3;
    }
  }
}

.dialog-card {
  width: 370px;

  .dialog-title {
    .text-h6 {
      font-size: 1.125rem;
    }
  }
}
</style>
