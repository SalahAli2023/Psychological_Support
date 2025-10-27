import { createApp } from 'vue'
import '@fortawesome/fontawesome-free/css/all.min.css'
import router from './routes/front.js'

import './output.css'


import App from './App.vue'
// import './style.css'
import './assets/article-health-styles.css'

// أولاً ننشئ التطبيق
const app = createApp(App)

// ثم نربط الراوتر بالتطبيق
app.use(router)

// وأخيرًا نثبّت التطبيق في العنصر الرئيسي بالصفحة
app.mount('#app')
