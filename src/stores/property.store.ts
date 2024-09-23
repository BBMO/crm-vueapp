import { defineStore } from 'pinia';
// Interface
import type { AppStatsInterface } from 'src/interfaces/app.interface';
// Services
import PropertiesService from 'src/services/properties.service';

export const usePropertyStore = defineStore('property', {
  state: () => ({
    propertyStatistics: [] as AppStatsInterface[]
  }),
  actions: {
    async fetchPropertyStats(t: (key: string) => string) {
      const { data } = await PropertiesService.getPropertyStats();

      this.propertyStatistics = [
        {
          title: t('stats.properties'),
          subtitle: t('stats.totalProperties'),
          icon: 'mdi-home-city-outline',
          color: 'primary',
          quantity: data?.data.total_properties | 0,
        },
        {
          title: t('stats.available'),
          subtitle: t('stats.totalAvailable'),
          icon: 'mdi-home-plus-outline',
          color: 'green',
          quantity: data?.data.total_available | 0,
        },
        {
          title: t('stats.sale'),
          subtitle: t('stats.totalSale'),
          icon: 'mdi-account-cash-outline',
          color: 'cyan',
          quantity: data?.data.total_available_for_sale | 0,
        },
        {
          title: t('stats.rent'),
          subtitle: t('stats.totalRent'),
          icon: 'mdi-account-key-outline',
          color: 'indigo',
          quantity: data?.data.total_available_for_rent | 0,
        }
      ];
    }
  },
  getters: {
    getPropertyStats(): AppStatsInterface[] {
      return this.propertyStatistics;
    }
  },
});
