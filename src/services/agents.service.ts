import type { AxiosPromise } from 'axios'
import { api } from 'src/boot/axios'

class AgentsService {
  /**
   * Agents general
   */
  getAgents(search: string = '', page = 1): AxiosPromise {
    return api.get(`/agents?search=${search}&page=${page}`)
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

  updateAgent(agent_id: string, payload: any): AxiosPromise {
    return api.post(`/agent/${agent_id}?_method=PUT`, payload, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    })
  }

  deleteAgent(id: string): AxiosPromise {
    return api.delete(`/agent/${id}`)
  }

  getAgentProperties(id: string): AxiosPromise {
    return api.get(`/properties?agent_id=${id}`)
  }

  getAgentOpportunities(id: string): AxiosPromise {
    return api.get(`/opportunities?agent_id=${id}`)
  }

  getAgentsExport(filters?: any): AxiosPromise {
    return api.get('/agents/export',{
      responseType: 'blob',
      params: filters
    })
  }
}

export default new AgentsService();
