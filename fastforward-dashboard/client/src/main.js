import { createApp } from 'vue';
import { Chart as ChartJS } from 'chart.js';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';

ChartJS.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

createApp(App).use(vuetify).use(router).mount('#app');