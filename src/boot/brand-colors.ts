import { setCssVar } from 'quasar'
import { boot } from 'quasar/wrappers'

export default boot(() => {
  // Light theme
  setCssVar('light-primary', '#696CFF');
  setCssVar('light-secondary', '#E7E7FF');
  setCssVar('light-accent', '#9C27B0');
  setCssVar('light-positive', '#71DD37');
  setCssVar('light-negative', '#FF3E1D');

  setCssVar('light-base-text-color', '#384451');
  setCssVar('light-base-color', '#F5F5F9FF');
});
