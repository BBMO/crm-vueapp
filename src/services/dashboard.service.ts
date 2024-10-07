import type { AxiosPromise } from 'axios'
import { api } from 'src/boot/axios'

class DashboardService {
  /**
   *
   */
  getTopAgentsGraphData(type: string, year: number, month: number): AxiosPromise {
    let extraParams = '';
    if (month !== -1) {
      extraParams = `&month=${month}`;
    }

    return api.get(`/dashboard/agents?year=${year}&type=${type}${extraParams}`);
  }

  /**
   *
   */
  getSalesRentalsData(year: number): AxiosPromise {
    return api.get(`/dashboard/sales-rentals?year=${year}`);
  }

  /**
   *
   */
  getTopCurrentPrevMonthGraphData(type: string, month: number): AxiosPromise {
    return api.get(`dashboard/monthly?month=${month}&type=${type}`);
  }

  /**
   *
   */
  getPropertyTypesGraphData(): AxiosPromise {
    return api.get('dashboard/property-types');
  }
}

export default new DashboardService();
