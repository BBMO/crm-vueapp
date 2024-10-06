import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// API URL
let apiURL = import.meta.env.VITE_APP_API_URL;
let headers = {}
//@ts-expect-error: crm_object is defined in the global scope
if (typeof crm_object !== 'undefined') {
  //@ts-expect-error: crm_object is defined in the global scope
  apiURL = crm_object && crm_object.site_url + '/wp-json';
  //@ts-expect-error: crm_object is defined in the global scope
  headers = { 'X-WP-Nonce': crm_object.nonce };
}

import.meta.env.VITE_APP_API_URL = apiURL;

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL ? `${import.meta.env.VITE_APP_API_URL}/crm/v1` : '/crm/v1',
  headers
});

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
