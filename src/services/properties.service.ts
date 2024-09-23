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
   *
   */
  getProperties(): AxiosPromise {
    return api.get('/properties');
  }

  getProperty(id: string): AxiosPromise {
    return api.get(`/property/${id}`);
  }

  createProperty(payload: any): AxiosPromise {
    return api.post('property', payload, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    })
  }

  updateProperty(id: string, payload: any): AxiosPromise {
    return api.post(`/property/${id}?_method=PUT`, payload, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    })
  }

  deleteProperty(id: string): AxiosPromise {
    return api.delete(`/property/${id}`);
  }

  uploadPropertyImage(id: string, payload: any): AxiosPromise {
    return api.post(`/property/${id}/upload`, payload, {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    })
  }

  deletePropertyImage(id: string, image_id: string): AxiosPromise {
    return api.delete(`/property/${id}/upload/${image_id}`);
  }

  getPropertyRanges(): AxiosPromise {
    return api.get('/properties/ranges');
  }
}

export default new PropertiesService();
