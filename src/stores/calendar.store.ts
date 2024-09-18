import { defineStore } from 'pinia';

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    categoriesFilter: [] as string[],
    agentFilter: '' as string
  }),
  actions: {
    setCategoriesFilter(categories: string[]) {
      this.categoriesFilter = categories;
    },
    setAgentFilter(id: string) {
      this.agentFilter = id;
    }
  },
  getters: {
    getCategoriesFilter(): string[] {
      return this.categoriesFilter;
    },
    getAgentFilter(): string {
      return this.agentFilter;
    }
  },
});
