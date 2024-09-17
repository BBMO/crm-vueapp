import type { AxiosPromise } from 'axios'
import { api } from 'src/boot/axios'

class AgentsService {
  /**
   * Agents general
   */
  getAgents(): AxiosPromise {
    return api.get('/agents')
  }
}

export default new AgentsService();
