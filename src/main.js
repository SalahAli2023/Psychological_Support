import { createApp } from 'vue';
import '@fortawesome/fontawesome-free/css/all.min.css';
import router from './routes/index.js';
import App from './App.vue';
import { createPinia } from 'pinia';
import { createI18n } from 'vue-i18n';


import en from './locales/en.json';
import ar from './locales/ar.json';
import './assets/css/article-health-styles.css';
import './assets/css/style.css';


const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages: { en, ar },
});
app.use(i18n);

app.use(router);

app.mount('#app');