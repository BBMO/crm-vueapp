import { defineStore } from 'pinia';
// Interface
import type { AppStatsInterface } from 'src/interfaces/app.interface';
// Services
import OpportunitiesService from 'src/services/opportunities.service';

export const useOpportunityStore = defineStore('opportunity', {
  state: () => ({
    opportunityStatistics: [] as AppStatsInterface[]
  }),
  actions: {
    async fetchOpportunityStats(t: (key: string) => string) {
      const { data } = await OpportunitiesService.getOpportunityStats();

      this.opportunityStatistics = [
        {
          title: t('stats.finished'),
          subtitle: t('stats.opportunityFinished'),
          icon: 'mdi-text-box-check-outline',
          color: 'primary',
          quantity: data?.data.finished_last_month | 0,
          isAmount: false,
        },
        {
          title: t('stats.progress'),
          subtitle: t('stats.opportunityProgress'),
          icon: 'mdi-file-clock-outline',
          color: 'orange',
          quantity: data?.data.in_progress | 0,
          isAmount: false,
        },
        {
          title: t('stats.amountSale'),
          subtitle: t('stats.amountTotalSale'),
          icon: 'mdi-currency-usd',
          color: 'green',
          quantity: data?.data.finished_last_month_amount | 0,
          isAmount: true,
        },
        {
          title: t('stats.amountRent'),
          subtitle: t('stats.amountTotalRent'),
          icon: 'mdi-file-key-outline',
          color: 'indigo',
          quantity: data?.data.finished_last_month_amount_rent | 0,
          isAmount: true,
        }
      ];
    }
  },
  getters: {
    getOpportunityStats(): AppStatsInterface[] {
      return this.opportunityStatistics;
    }
  },
});
