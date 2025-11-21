import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// --- Backend Pages ---
const AppLayout = () => import('../components/dashboard/component/layout/AppLayout.vue');
const Dashboard = () => import('../components/dashboard/Dashboard/Index.vue');
const Appointments = () => import('../components/dashboard/Appointments/Index.vue');
const Users = () => import('../components/dashboard/Users/Index.vue');
const therapists = () => import('../components/dashboard/Users/therapists/TherapistsManagement.vue');
const clients = () => import('../components/dashboard/Users/clients/PatientsManagement.vue');
const Articles = () => import('../components/dashboard/Articles/Index.vue');
const ArticleCategories = () => import('../components/dashboard/Articles/ArticleCategories.vue');
// const AddArticles = () => import('../components/dashboard/Articles/ArticleForm.vue');
const Programs = () => import('../components/dashboard/Programs/Index.vue');
const Library = () => import('../components/dashboard/Library/Index.vue');
const Assessments = () => import('../components/dashboard/Measures/Measures/Index.vue');

const LegalResources = () => import('../components/dashboard/LegalResources/Index.vue')




const Settings = () => import('../components/dashboard/Settings/Index.vue');
const Events = () => import('../components/dashboard/Events/Index.vue'); 

// --- Frontend Pages ---
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
import LibraryCategoryForm from '../components/dashboard/Library/LibraryCategoryForm.vue'
// --- Auth Pages ---
const Login = () => import('../components/dashboard/auth/Login.vue');

// --- دمج جميع المسارات ---
const routes = [
  // Frontend routes (عامة)
  { path: '/', name: 'Home', component: HomePage },
  { path: '/events', name: 'Events', component: EventsPage },
  { path: '/about', name: 'About', component: AboutPage },
  { path: '/measures', name: 'Measures', component: MeasuresPage },
  { path: '/article', name: 'ArticleMain', component: ArticleMain },
  { path: '/article/:id', name: 'ArticleDetail', component: ArticleDetail, props: true },
  { path: '/Specialists', name: 'Specialists', component: Specialists, props: true },
  { path: '/therapist/:id', name: 'therapisteDetail', component: therapisteDetail, props: true },
  { path: '/library', name: 'library', component: LibraryMain, props: true },
  { path: '/contact', name: 'contact', component: contact, props: true },
  { path: '/register', name: 'register', component: register, props: true },
  { path: '/legal', name: 'legal', component: LegalSocialResources, props: true },

  // Auth routes
  { 
    path: '/admin/login', 
    name: 'login', 
    component: Login,
    meta: { requiresGuest: true }
  },

  // Backend routes (محمية - تتطلب تسجيل دخول)
  {
    path: '/admin',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: { name: 'Dashboard' } },
      { path: 'dashboard', name: 'Dashboard', component: Dashboard },
      { path: 'appointments', name: 'appointments', component: Appointments },
      { path: 'users', name: 'users', component: Users },
      { path: 'therapists', name: 'therapists', component: therapists },
      { path: 'clients', name: 'clients', component: clients },
      { path: 'articles', name: 'articles', component: Articles },
      { path: 'categories', name: 'categories', component: ArticleCategories },
      // { path: 'new-article', name: 'new-article', component: AddArticles },
      { path: 'programs', name: 'programs', component: Programs },
      { path: 'libraries', name: 'libraries', component: Library },
      { path: 'categories-Library', name: 'categories-Library', component: LibraryCategoryForm },
      { path: 'events', name: 'events', component: Events },

      { path: 'assessments', name: 'assessments', component: Assessments },
      { path: 'legal-resources', name: 'legal-resources', component: LegalResources },
      
      { path: 'settings', name: 'settings', component: Settings },
    ]
  },

  // Redirect for unknown routes
  { 
    path: '/:pathMatch(.*)*', 
    redirect: '/' 
  }
];

// --- إنشاء الراوتر ---
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// --- حارس التنقل للحماية والمصادقة ---
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // تغيير اتجاه اللغة
  const savedLanguage = localStorage.getItem('preferredLanguage') || 'ar';
  document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = savedLanguage;

  // التحقق من المصادقة
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // إذا كانت الصفحة تتطلب تسجيل دخول ولم يكن المستخدم مسجل
    next('/admin/login');
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // إذا كان المستخدم مسجل بالفعل وحاول الدخول لصفحة التسجيل
    next('/admin/dashboard');
  } else {
    // المسار مسموح
    next();
  }
});

export default router;