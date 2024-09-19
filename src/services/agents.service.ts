import type { AxiosPromise } from 'axios'
import { api } from 'src/boot/axios'

class AgentsService {
  /**
   * Agents general
   */
  getAgents(): AxiosPromise {
    return api.get('/agents')
  }

  getAgent(id: string): AxiosPromise {
    return api.get(`/agent/${id}`)
  }

  createAgent(payload: any): AxiosPromise {
    return api.post('/agent', payload, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    })
  }

  deleteAgent(id: string): AxiosPromise {
    return api.delete(`/agent/${id}`)
  }
}

export default new AgentsService();
