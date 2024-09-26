<template>
  <div>
    <div class="sidebar-header">
      <q-btn unelevated class="add-event-btn" color="primary" icon="mdi-plus" :ripple="false" @click="addEvent">{{ $t('calendar.addEvent') }}</q-btn>
    </div>

    <div class="sidebar-body">
      <div class="sidebar-select q-py-md">
        <div class="text-subtitle1 text-weight-medium q-mb-sm">{{ $t('calendar.agents') }}</div>
        <q-select
          outlined
          dense
          v-model="agent"
          use-input
          hide-selected
          fill-input
          input-debounce="1000"
          option-label="name"
          option-value="id"
          :options="agentsSelect"
          @filter="filterAgentSelect"
          @update:modelValue="agentSelect"
        >
          <template v-slot:prepend><q-icon name="mdi-account-outline" /></template>
          <template v-slot:append v-if="agent"><q-icon name="mdi-delete-outline" color="negative" class="cursor-pointer" @click="cleanAgentSelect" /></template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">{{ $t('global.noResults') }}</q-item-section>
            </q-item>
        </template>
        </q-select>
      </div>

      <div class="sidebar-filter q-py-md">
        <div class="text-subtitle1 text-weight-medium q-mb-md">{{ $t('calendar.filter') }}</div>
        <div v-for="item in quoteCategoriesList" :key="item.id" class="sidebar-filter-item q-mb-md">
          <q-checkbox
            dense
            v-model="item.selected"
            color="grey"
            :value="item.id"
            @update:modelValue="categoriesSelect"
          >
            <div class="flex items-center gap-xs">
              <label>{{ item.name }}</label>
              <q-icon size="sm" name="mdi-tag" :style="{ color: item.color }"/>
            </div>
          </q-checkbox>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Ref } from 'vue';
// Interfaces
import type { CalendarDropdownInterface } from 'src/interfaces/calendar.interface';
// Services
import CalendarService from 'src/services/calendar.service';
import AgentsService from 'src/services/agents.service';
// Store
import { useCalendarStore } from 'src/stores/calendar.store';

const emit = defineEmits(['openEventDialog']);

const calendarStore = useCalendarStore();

const agent = ref(null);

const quoteCategoriesList: Ref<CalendarDropdownInterface[]> = ref([]);
const agentsSelect: Ref<CalendarDropdownInterface[]> = ref([]);

/**
 *
 */
const getSelectsData = async () => {
  let response;

  response = await CalendarService.getQuoteCategories();
  quoteCategoriesList.value = response?.data?.data.map((item: CalendarDropdownInterface) => ({
    id: item.id,
    name: item.name,
    color: item.color,
    selected: false,
  })) || [];

  response = await AgentsService.getAgents();
  agentsSelect.value = response?.data?.data?.items.map((agent: any) => ({
    id: agent.id,
    name: agent.display_name,
  })) || [];
};

/**
 *
 */
const categoriesSelect = () => {
  const selectedIds = quoteCategoriesList.value.filter(item => item.selected).map(item => item.id);
  calendarStore.setCategoriesFilter(selectedIds);
};

/**
 *
 */
const agentSelect = (agent: { name: string, id: string }) => {
  calendarStore.setAgentFilter(`${agent.id}`);
}

/**
 *
 */
const filterAgentSelect = (value: string, update: any) => {
  update( async () => {
    const { data } = await AgentsService.getAgents(value);
    agentsSelect.value = data?.data?.items.map((agent: any) => ({
      id: agent.id,
      name: agent.display_name,
    })) || [];
  })
}

/**
 *
 */
const cleanAgentSelect = () => {
  agent.value = null;
  calendarStore.setAgentFilter(null);
}

/**
 *
 */
const addEvent = () => {
  emit('openEventDialog');
};

onMounted(() => {
  getSelectsData();
});
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

  .sidebar-select {
    .text-subtitle1 {
      line-height: 1.3;
    }

    .clean-agent {
      font-size: 12px;
      color: var(--q-negative);
      line-height: 1;
    }
  }
}
</style>
