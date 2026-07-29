import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';

export default createVuetify({
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