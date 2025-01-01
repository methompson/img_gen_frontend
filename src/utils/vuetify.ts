import '@mdi/font/css/materialdesignicons.css';

import 'vuetify/styles';
import { createVuetify, type ThemeDefinition } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const lightTheme: ThemeDefinition = {
  colors: {
    primary: '#F44336',
  },
};

const darkTheme: ThemeDefinition = {
  colors: {
    primary: '#B71C1C',
  },
};

export function getVuetify() {
  const vuetify = createVuetify({
    theme: {
      themes: {
        light: lightTheme,
        dark: darkTheme,
      },
    },
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
    },
  });

  return vuetify;
}
