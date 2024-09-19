import { defineStore } from 'pinia';

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    categoriesFilter: [] as string[],
    agentFilter: null as string | null,
  }),
  actions: {
    setCategoriesFilter(categories: string[]) {
      this.categoriesFilter = categories;
    },
    setAgentFilter(id: string | null) {
      this.agentFilter = id;
    }
  },
  getters: {
    getCategoriesFilter(): string[] {
      return this.categoriesFilter;
    },
    getAgentFilter(): string | null {
      return this.agentFilter;
    }
  },
});
