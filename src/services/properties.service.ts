import type { AxiosPromise } from 'axios'
import { api } from 'src/boot/axios'

class PropertiesService {
  /**
   * Property types
   */
  getPropertyTypes(): AxiosPromise {
    return api.get('/property-types');
  }

  createPropertyType(payload: object): AxiosPromise {
    return api.post('/property-type', payload);
  }

  updatePropertyType(id: string, payload: object): AxiosPromise {
    return api.put(`/property-type/${id}`, payload);
  }

  deletePropertyType(id: string): AxiosPromise {
    return api.delete(`/property-type/${id}`);
  }

  /**
   * Property features
   */
  getPropertyFeatures(): AxiosPromise {
    return api.get('/property-features');
  }

  createPropertyFeature(payload: object): AxiosPromise {
    return api.post('/property-feature', payload);
  }

  updatePropertyFeature(id: string, payload: object): AxiosPromise {
    return api.put(`/property-feature/${id}`, payload);
  }

  deletePropertyFeature(id: string): AxiosPromise {
    return api.delete(`/property-feature/${id}`);
  }

  /**
   * Property states
   */
  getPropertyStates(): AxiosPromise {
    return api.get('/property-states');
  }

  createPropertyState(payload: object): AxiosPromise {
    return api.post('/property-state', payload);
  }

  updatePropertyState(id: string, payload: object): AxiosPromise {
    return api.put(`/property-state/${id}`, payload);
  }

  deletePropertyState(id: string): AxiosPromise {
    return api.delete(`/property-state/${id}`);
  }
}

export default new PropertiesService();
