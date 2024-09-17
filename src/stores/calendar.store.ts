import { defineStore } from 'pinia';

export const useCalendarStore = defineStore('calendar', {
  state: () => ({
    categoriesFilter: [] as string[],
  }),
  actions: {
    setCategoriesFilter(categories: string[]) {
      this.categoriesFilter = categories;
    },
  },
  getters: {
    getCategoriesFilter(): string[] {
      return this.categoriesFilter;
    }
  },
});
