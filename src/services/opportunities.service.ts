import type { AxiosPromise } from 'axios'
import { api } from 'src/boot/axios'

class OpportunitiesService {
  /**
   * Opportunity states
   */
  getOpportunityStates(): AxiosPromise {
    return api.get('/opportunity-states');
  }

  createOpportunityState(payload: object): AxiosPromise {
    return api.post('/opportunity-state', payload);
  }

  updateOpportunityState(id: string, payload: object): AxiosPromise {
    return api.put(`/opportunity-state/${id}`, payload);
  }

  deleteOpportunityState(id: string): AxiosPromise {
    return api.delete(`/opportunity-state/${id}`);
  }
}

export default new OpportunitiesService();
