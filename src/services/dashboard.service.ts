import type { AxiosPromise } from 'axios'
import { api } from 'src/boot/axios'

class DashboardService {
  /**
   *
   */
  getDashboardGraphRentals(): AxiosPromise {
    return api.get('/dashboard/graph/rentals');
  }

  getDashboardGraphSales(): AxiosPromise {
    return api.get('/dashboard/graph/sales');
  }

  getTopAgentsSales(): AxiosPromise {
    return api.get('/dashboard/agents/sales');
  }

  getTopAgentsRentals(): AxiosPromise {
    return api.get('/dashboard/agents/rentals');
  }
}

export default new DashboardService();
