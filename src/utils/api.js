import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 60000,
})

// 🔥 NEW: دالة للتحقق مما إذا كان الطلب من الفرونتند
const isFrontendRequest = (url) => {
  return url && (
    url.includes('/frontend/') ||
    url.includes('/psychological-scales') ||
    url.includes('/categories') ||
    url.includes('/scales') ||
    url.includes('/measures') ||
    !url.includes('/admin')
  )
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    
    // 🔥 NEW: استخدام التوكن الصحيح بناءً على نوع الطلب
    let token = null
    const isFrontend = isFrontendRequest(config.url)
    
    if (isFrontend) {
      // للطلبات الأمامية، استخدم frontend_token
      token = authStore.token || localStorage.getItem('frontend_token') || sessionStorage.getItem('frontend_token')
      console.log('🔄 Frontend API Request:', config.url)
    } else {
      // للطلبات الإدارية، استخدم admin_token
      token = authStore.token || localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token')
      console.log('🔄 Admin API Request:', config.url)
    }
    
    console.log('Token exists:', !!token)
    console.log('Is frontend request:', isFrontend)
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // 🔥 NEW: إضافة header لمنع التحويل التلقائي
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response Success:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.log('❌ API Response Error:', error.response?.status, error.config?.url)
    console.log('Error details:', error.response?.data)
    
    const isFrontend = isFrontendRequest(error.config?.url)
    
    // 🔥 NEW: معالجة مختلفة للفرونتند والإدارة
    if (error.response?.status === 401) {
      console.log('🔒 Unauthorized access detected')
      
      if (isFrontend) {
        // للفرونتند: لا تقم بإعادة التوجيه، فقط ارفض الوعد
        console.log('🚫 Frontend 401 - Blocking redirect to admin, returning requires login')
        const authStore = useAuthStore()
        
        // مسح بيانات الفرونتند فقط
        authStore.logout()
        
        // إرجاع خطأ مع علامة requires_login
        return Promise.reject({ 
          ...error, 
          requiresLogin: true,
          isFrontend: true,
          message: 'يجب تسجيل الدخول للمتابعة'
        })
      } else {
        // للإدارة: التصرف الطبيعي
        console.log('🔄 Admin 401 - Redirecting to admin login')
        const authStore = useAuthStore()
        authStore.logout()
        window.location.href = '/admin/login'
      }
    }
    
    // 🔥 NEW: منع التحويل في حالات أخرى للفرونتند
    if (error.response?.status >= 300 && error.response?.status < 400 && isFrontend) {
      console.log('🚫 Blocking frontend redirect')
      return Promise.reject({ 
        ...error, 
        blockedRedirect: true,
        isFrontend: true,
        message: 'تم منع تحويل غير مصرح به'
      })
    }
    
    if (error.response?.status === 419) {
      window.location.reload()
    }
    
    return Promise.reject(error)
  }
)

export default api