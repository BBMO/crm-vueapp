<template>
  <div>
    <q-card class="row">
      <div class="col-12 col-md-4 col-lg-3 sidebar">
        <SidebarComponent @openEventDialog="openEventDialog" />
      </div>
      <div class="col-12 col-md-8 col-lg-9 full-calendar-section">
        <FullCalendar
          ref="calendar"
          :options="calendarOptions"
        />
      </div>
    </q-card>

    <q-dialog
      v-model="eventDialog"
      full-height
      position="right"
      square
      maximized
    >
      <q-card class="dialog-card">
        <div class="q-pa-lg flex items-center dialog-title">
          <h6 class="text-h6 q-ma-none">{{ eventModeEdit ? $t('calendar.editEvent') : $t('calendar.addEvent') }}</h6>
          <q-space />
          <q-icon name="close" size="sm" class="cursor-pointer" @click="eventDialog = false" />
        </div>
        <q-separator />
        <div class="q-pa-lg">
          <EventFormComponent
            :is-edit="eventModeEdit"
            :quote-id="currentQuoteId"
            @closeEventDialog="closeEventDialog"
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { Ref } from 'vue';
import { colors } from 'quasar';
// Libraries
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listGridPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
// Interfaces
import type { CalendarEventInterface } from 'src/interfaces/calendar.interface';
// Services
import CalendarService from 'src/services/calendar.service';
// Store
import { useCalendarStore } from 'src/stores/calendar.store';
// Components
import SidebarComponent from 'components/CalendarComponents/SidebarComponent.vue';
import EventFormComponent from './EventFormComponent.vue';

const { hexToRgb } = colors;
const calendarStore = useCalendarStore();

const eventDialog = ref(false);
const eventModeEdit = ref(false);

const calendar = ref(null);
const currentYear = ref();
const currentQuoteId = ref('');

const quotesScheduled: Ref<CalendarEventInterface[]> = ref([]);

const categoriesFilter = computed(() => calendarStore.getCategoriesFilter);
const agentFilter = computed(() => calendarStore.getAgentFilter);

const dateClick = (info: any) => {
  if (calendar.value) {
    //@ts-ignore
    calendar.value.getApi().changeView('timeGridDay', info.dateStr);
  }
};

const calendarOptions = {
  initialView: 'dayGridMonth',
  plugins: [dayGridPlugin, timeGridPlugin, listGridPlugin, interactionPlugin],
  headerToolbar: {
    left: 'prev,next title',
    center: '',
    right: 'dayGridMonth,timeGridDay,listMonth'
  },
  events: quotesScheduled.value,
  eventDisplay: 'block',
  dayMaxEventRows: 3,
  dateClick: dateClick,
  datesSet: (dateInfo: any) => {
    const year = new Date(dateInfo.view.currentStart).getFullYear();
    if (year !== currentYear.value) {
      currentYear.value = year;
      getQuote();
    }
  },
  eventClick: (info: any) => {
    eventModeEdit.value = true;
    detailsQuote(info.event.id);
  },
  eventContent: (args: any) => {
    return { html: `${args.event.title}` };
  },
  eventDidMount: (info: any) => {
    const dotEl = info.el.getElementsByClassName('fc-list-event-dot')[0];
    if (dotEl) {
      dotEl.style.backgroundColor = info.event.textColor;
    }
  },
};

/**
 *
 */
const getQuote = async () => {
  const { data } = await CalendarService.getQuotes(currentYear.value);

  quotesScheduled.value = data?.data.map((quote: any) => {
    const rgbColor = hexToRgb(quote.category.color);
    const bgColor = rgbColor ? `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.16)` : 'rgba(255, 62, 29, 0.1)';

    return {
      id: quote.id,
      title: quote.title,
      start: new Date(quote.start_date),
      end: new Date(quote.end_date),
      backgroundColor: bgColor,
      textColor: quote.category.color,
      categoryId: quote.category.id,
      agentId: quote.agent_id,
    };
  });

  //@ts-ignore
  calendar.value?.getApi().removeAllEvents();
  //@ts-ignore
  calendar.value?.getApi().addEventSource(quotesScheduled.value);
};

/**
 *
 */
const getQuoteFiltered = () => {
  //@ts-ignore
  calendar.value?.getApi().removeAllEvents();

  let quotesToAdd;
  if (agentFilter.value) {
    quotesToAdd = quotesScheduled.value.filter((quote: CalendarEventInterface) =>
      quote.agentId === agentFilter.value
    );
  } else {
    quotesToAdd = categoriesFilter.value.length === 0
      ? quotesScheduled.value
      : quotesScheduled.value.filter((quote: CalendarEventInterface) =>
        categoriesFilter.value.includes(quote.categoryId)
      );
  }

  if (agentFilter.value && categoriesFilter.value.length > 0) {
    quotesToAdd = quotesToAdd.filter((quote: CalendarEventInterface) =>
      categoriesFilter.value.includes(quote.categoryId)
    );
  }

  //@ts-ignore
  calendar.value?.getApi().addEventSource(quotesToAdd);
};

/**
 *
 */
const detailsQuote = async (quoteId: string) => {
  currentQuoteId.value = quoteId;
  eventDialog.value = true;
};

/**
 *
 */
const openEventDialog = async () => {
  eventModeEdit.value = false;
  eventDialog.value = true;
};

/**
 *
 */
const closeEventDialog = async () => {
  eventDialog.value = false;
  await getQuote();
};

watch(
  () => categoriesFilter.value,
  () => {
    getQuoteFiltered();
  }
);

watch(
  () => agentFilter.value,
  () => {
    getQuoteFiltered();
  }
);

</script>

<style lang="scss" scoped>
.sidebar {
  border-right: 1px solid var(--q-border-color) !important;
}

.full-calendar-section {
  :deep(.fc .fc-event) {
    padding: 0.25rem;
  }
}
</style>
