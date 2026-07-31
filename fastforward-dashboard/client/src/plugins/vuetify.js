import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'fastforward',
    themes: {
      fastforward: {
        dark: false,
        colors: {
          primary: '#1B2A4A',
          secondary: '#F26522',
          success: '#4CAF50',
          warning: '#FF9800',
          error: '#F44336',
          background: '#F5F7FA',
          surface: '#FFFFFF',
        },
      },
    },
  },
});