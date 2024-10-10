import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';

import { api } from 'src/boot/axios'

import messages from 'src/i18n';

// See https://vue-i18n.intlify.dev/guide/advanced/typescript.html#global-resource-schema-type-definition
/* eslint-disable @typescript-eslint/no-empty-interface */
declare module 'vue-i18n' {
  // define the datetime format schema
  export interface DefineDateTimeFormat {}

  // define the number format schema
  export interface DefineNumberFormat {}
}
/* eslint-enable @typescript-eslint/no-empty-interface */

export default boot(async ({ app }) => {
  let $locale = 'en-US';
  let $messages: any = messages;

  try {
    // Get translations from the server
    const { data } = await api.get('/settings/i18n');

    if (data.success) {
      $locale = data.data.locale;

      $messages = {};
      $messages[$locale] = data.data.messages;
    }
  } catch (error) {
    console.error('Error getting translations from the server... loading default translations');
  }

  const i18n = createI18n({
    locale: $locale,
    legacy: false,
    messages: $messages
  });

  // Set i18n instance on app
  app.use(i18n);
});
