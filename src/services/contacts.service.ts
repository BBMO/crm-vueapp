import type { AxiosPromise } from 'axios'
import { api } from 'src/boot/axios'

class ContactsService {
  /**
   * Contacts general
   */
  getContacts(filters?: any): AxiosPromise {
    if (filters) {
      return api.get('/contacts', {
        params: filters
      })
    }

    return api.get('/contacts')
  }

  getContact(id: string): AxiosPromise {
    return api.get(`/contact/${id}`)
  }

  createContact(payload: any): AxiosPromise {
    return api.post('/contact', payload, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    })
  }

  updateContact(id: string, payload: any): AxiosPromise {
    return api.post(`/contact/${id}?_method=PUT`, payload, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    })
  }

  deleteContact(id: string): AxiosPromise {
    return api.delete(`/contact/${id}`)
  }
}

export default new ContactsService();
