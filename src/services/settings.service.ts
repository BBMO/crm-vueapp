import type { AxiosPromise } from 'axios'
import { api } from 'src/boot/axios'

class SettingsService {
  /**
   * Email Automation: Recommended Properties
   */
  getRecommendedProperties(): AxiosPromise {
    return api.get('/settings/recommended-properties');
  }

  saveRecommendedProperties(payload: object): AxiosPromise {
    return api.put('/settings/recommended-properties', payload);
  }

  deactivateRecommendedProperties(): AxiosPromise {
    return api.delete('/settings/recommended-properties');
  }
}

export default new SettingsService();
