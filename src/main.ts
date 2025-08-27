import { createApp } from 'vue';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import weekday from 'dayjs/plugin/weekday';
import ruLocale from 'dayjs/locale/ru';
import './style.css';
import App from './App.vue';

dayjs.extend(localeData);
dayjs.extend(localizedFormat);
dayjs.extend(weekday);
dayjs.locale(ruLocale);

createApp(App).mount('#app');
