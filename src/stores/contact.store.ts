import { defineStore } from 'pinia';

export const useContactStore = defineStore('contact', {
  state: () => ({
    contactId: '' as string,
  }),
  actions: {
    setContactId(id: string) {
      this.contactId = id;
    },
  },
  getters: {
    getContactId(): string {
      return this.contactId;
    }
  },
});
