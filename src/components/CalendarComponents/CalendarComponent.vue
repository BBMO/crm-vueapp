<template>
  <div>
    <FullCalendar
      ref="calendar"
      :options="calendarOptions"
    />
  </div>
</template>

<style lang="scss">

</style>

<script setup>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction';
import { ref } from 'vue';

const calendar = ref(null);

const dateClick = (info) => {
  calendar.value.getApi().changeView('timeGridDay', info.dateStr);
};

const calendarOptions = {
  initialView: 'dayGridMonth',
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  headerToolbar: {
    left: 'prev,next title',
    center: '',
    right: 'dayGridMonth,timeGridDay'
  },
  events: [
    { title: 'event 1', start: '2024-08-01', backgroundColor: 'rgba(255, 62, 29, 0.16)', textColor: 'rgba(255, 62, 29, 1)', end: '2024-08-04' },
    { title: 'event 2', date: '2024-08-03' },
    { title: 'event 3', date: '2024-08-03' },
    { title: 'event 3', date: '2024-08-03' },
  ],
  dayMaxEventRows: 3,
  dateClick: dateClick,
};

</script>

<style lang="scss" scoped>

</style>
