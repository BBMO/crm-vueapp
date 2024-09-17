<template>
  <div>
    <div class="sidebar-header">
      <q-btn unelevated class="add-event-btn" color="primary" icon="mdi-plus" :ripple="false" @click="addEvent">{{ $t('calendar.addEvent') }}</q-btn>
    </div>

    <div class="sidebar-body">
      <div class="sidebar-select q-mt-md q-mb-lg">
        <q-select
          outlined
          dense
          v-model="agent"
          :label="$t('calendar.agents')"
          :options="agents"
        ></q-select>
      </div>

      <div class="sidebar-agent flex items-center q-mb-xl">
        <q-avatar size="40px" color="primary" text-color="white"><img src="https://cdn.quasar.dev/img/boy-avatar.png" alt=""></q-avatar>
        <div class="q-ml-md">
          <div class="text-subtitle1 q-ma-none text-weight-medium">John Doe</div>
          <div class="text-caption text-grey">Agent</div>
        </div>
      </div>

      <div class="sidebar-filter">
        <div class="text-subtitle1 text-weight-medium q-mb-lg">{{ $t('calendar.filter') }}</div>
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
// Store
import { useCalendarStore } from 'src/stores/calendar.store';

const emit = defineEmits(['openEventDialog']);

const calendarStore = useCalendarStore();

const agent = ref(null);

const agents = [
  { label: 'John Doe', value: 'john_doe' },
  { label: 'Jane Doe', value: 'jane_doe' },
  { label: 'John Smith', value: 'john_smith' },
];

const quoteCategoriesList: Ref<CalendarDropdownInterface[]> = ref([]);

/**
 *
 */
const getQuoteCategories = async () => {
  const { data } = await CalendarService.getQuoteCategories();
  quoteCategoriesList.value = data?.data.map((item: CalendarDropdownInterface) => ({
    id: item.id,
    name: item.name,
    color: item.color,
    selected: false,
  }));
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
const addEvent = () => {
  emit('openEventDialog');
};

onMounted(() => {
  getQuoteCategories();
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

  .sidebar-agent {
    .text-subtitle1 {
      line-height: 1.3;
    }
  }
}
</style>
