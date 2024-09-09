import type { AxiosPromise } from 'axios'
import { api } from 'src/boot/axios'

class AuthenticationService {
  /**
   * Authenticate login
   */
  authLogin(): AxiosPromise {
    const payload = {
      username: 'admin',
      password: 'admin',
    }

    return api.post('/jwt-auth/v1/token', payload);
  }
}

export default new AuthenticationService();
