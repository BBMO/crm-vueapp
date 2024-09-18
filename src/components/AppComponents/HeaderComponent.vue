<template>
  <q-header class="q-px-lg q-mt-md bg-transparent">
    <q-toolbar class="flex justify-between q-py-sm bg-white shadow-custom">
      <div class="drawer-btn-section">
        <q-btn flat round dense icon="menu" color="primary" @click="drawer = !drawer" />
      </div>
      <div>
        <q-avatar size="lg"><q-img src="https://cdn.quasar.dev/img/boy-avatar.png" /></q-avatar>
      </div>
    </q-toolbar>
  </q-header>

  <q-drawer
    v-model="drawer"
    show-if-above
    :width="260"
    :breakpoint="1024"
  >
    <q-scroll-area class="scroll-area-section">
      <q-list class="q-mx-md flex column gap-md">
        <q-item
          clickable
          v-for="item in menuItems"
          :key="item.path"
          :active="activePath === item.path"
          class="flex items-center"
          @click="navigateTo(item.path)"
        >
          <q-icon class="q-pa-none nav-item-icon" :name="item.icon" />
          <span class="nav-item-title">{{ $t(`menu.${item.label}`) }}</span>
        </q-item>
      </q-list>
    </q-scroll-area>

    <div class="absolute-top q-mx-md flex items-center gap-sm q-px-md q-py-lg nav-item-logo">
      <q-icon size="lg" color="primary" name="maps_home_work"></q-icon>
      <h1>CRM</h1>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

const router = useRouter();
const route = useRoute();

const drawer = ref(false);
const activePath = ref(route.meta?.module);

const menuItems = [
  { path: 'home', icon: 'mdi-view-dashboard-outline', label: 'dashboard' },
  { path: 'agents', icon: 'mdi-badge-account-outline', label: 'agent' },
  { path: 'contacts', icon: 'mdi-account-outline', label: 'contact' },
  { path: 'calendar', icon: 'mdi-calendar-month-outline', label: 'calendar' },
  { path: 'properties', icon: 'mdi-home-silo-outline', label: 'properties' },
  { path: 'opportunities', icon: 'mdi-file-sign', label: 'opportunities'},
  { path: 'settings', icon: 'mdi-cog-outline', label: 'settings' },
]

const navigateTo = (path: string) => {
  activePath.value = path;

  if (path) {
    router.push({ name: path });
  }
}
</script>

<style scoped lang="scss">
.q-header {
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;

  .shadow-custom {
    box-shadow: 0 2px 6px #4359711f;
    border-radius: 6px;
  }

  .drawer-btn-section .q-btn {
    display: none;
  }
}

.q-item {
  border-radius: 8px;
}

.q-item.q-router-link--active,
.q-item--active {
  background: var(--q-secondary);
}

.q-item.q-router-link--active::after,
.q-item--active::after {
  position: absolute;
  background-color: var(--q-primary);
  block-size: 2.625rem;
  border-end-start-radius: .375rem;
  border-start-start-radius: .375rem;
  content: "";
  inline-size: .25rem;
  inset-inline-end: -1rem;
}

.nav-item-logo {
  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: .15px;
    line-height: 1.75rem;
    text-transform: lowercase;
    margin: 0;
  }
}

.scroll-area-section {
  height: calc(100% - 100px);
  margin-top: 100px;

  .nav-item-icon {
    flex-shrink: 0;
    font-size: 1.375rem;
    margin-inline-end: .5rem;
  }

  .nav-item-title {
    font-size: 15px;
    letter-spacing: normal;
    line-height: 1.375rem;
    overflow: hidden;
    margin-inline-end: auto;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

@media screen and (max-width: 1024px) {
  .drawer-btn-section .q-btn {
    display: block !important;
  }
}
</style>
