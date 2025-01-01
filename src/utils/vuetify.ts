import '@mdi/font/css/materialdesignicons.css';

import 'vuetify/styles';
import { createVuetify, type ThemeDefinition } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const lightTheme: ThemeDefinition = {
  colors: {
    primary: '#F44336',
    'primary-darken-1': '#D32F2F',
    error: '#FF1744',
  },
};

const darkTheme: ThemeDefinition = {
  colors: {
    primary: '#B71C1C',
    'primary-darken-1': '#8f1515',
    error: '#FF1744',
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
