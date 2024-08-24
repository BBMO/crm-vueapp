import { setCssVar } from 'quasar'
import { boot } from 'quasar/wrappers'

export default boot(() => {
  // Light theme
  setCssVar('light-primary', '#696CFF');
  setCssVar('light-secondary', '#E7E7FF');
  setCssVar('light-accent', '#9C27B0');

  setCssVar('light-base-text-color', '#384451');
});
