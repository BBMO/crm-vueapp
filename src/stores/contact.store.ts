import { defineStore } from 'pinia';
// Interface
import type { AppStatsInterface } from 'src/interfaces/app.interface';
// Services
import ContactsService from 'src/services/contacts.service';

export const useContactStore = defineStore('contact', {
  state: () => ({
    contactId: '' as string,
    contactStatistics: [] as AppStatsInterface[]
  }),
  actions: {
    setContactId(id: string) {
      this.contactId = id;
    },
    async fetchContactStats(t: (key: string) => string) {
      const { data } = await ContactsService.getContactStats();

      this.contactStatistics = [
        {
          title: t('stats.contacts'),
          subtitle: t('stats.totalContact'),
          icon: 'mdi-account',
          color: 'primary',
          quantity: data?.data.total_contacts | 0,
        },
        {
          title: t('stats.clients'),
          subtitle: t('stats.totalClients'),
          icon: 'mdi-account-check-outline',
          color: 'green',
          quantity: data?.data.total_clients | 0,
        },
        {
          title: t('stats.leads'),
          subtitle: t('stats.totalLeads'),
          icon: 'mdi-account-clock-outline',
          color: 'orange',
          quantity: data?.data.total_leads | 0,
        },
        {
          title: t('stats.registers'),
          subtitle: t('stats.totalRegisters'),
          icon: 'mdi-account-group-outline',
          color: 'blue',
          quantity: data?.data.total_last_week | 0,
        }
      ];
    }
  },
  getters: {
    getContactId(): string {
      return this.contactId;
    },
    getContactStats(): AppStatsInterface[] {
      return this.contactStatistics;
    }
  },
});
