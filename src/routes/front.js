import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/frontend/home.vue'
import AboutPage  from '../components/frontend/AboutPage.vue' 

import EventsPage from '../components/frontend/EventsPage.vue'
import MeasuresPage from '../components/frontend/MeasuresPage.vue'

import ArticleMain from '../components/frontend/article/ArticleMain.vue'
import ArticleDetail from '../components/frontend/article/ArticleDetail.vue'
import Specialists from '../components/frontend/Specialists/TherapistList.vue'
import therapisteDetail from '../components/frontend/Specialists/TherapistProfile.vue'
import LibraryMain from '../components/frontend/libraray/LibraryMain.vue'
import contact from '../components/frontend/contact.vue'
import register from '../components/frontend/RegistrationPage.vue'
import LegalSocialResources from '../components/frontend/LegalSocialResources.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/events',
    name: 'Events',
    component: EventsPage
  },
  { 
    path: '/about', 
    name: 'About', 
    component: AboutPage 
  },
  {
    path: '/measures',
    name: 'Measures',
    component: MeasuresPage
  },
  {
    path: '/article',
    name: 'Article',
    component: ArticleMain
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: ArticleDetail,
    props: true
  },
  {
    path: '/Specialists',
    name: 'Specialists',
    component: Specialists,
    props: true
  },
  {
    path: '/therapist/:id',
    name: 'therapisteDetail',
    component: therapisteDetail,
    props: true
  },
  {
    path: '/library',
    name: 'library',
    component: LibraryMain,
    props: true
  },
  {
    path: '/contact',
    name: 'contact',
    component: contact,
    props: true
  },
  {
    path: '/register',
    name: 'register',
    component: register,
    props: true
  },
  {
    path: '/legal',
    name: 'legal',
    component: LegalSocialResources,
    props: true
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// إضافة حارس تنقل للتعامل مع اتجاه اللغة
router.beforeEach((to, from, next) => {
  // الحصول على اللغة المحفوظة أو استخدام العربية كلغة افتراضية
  const savedLanguage = localStorage.getItem('preferredLanguage') || 'ar'
  
  // تحديث اتجاه الصفحة بناءً على اللغة
  document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = savedLanguage
  
  next()
})

export default router