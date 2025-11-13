import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

// إنشاء instance من axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
})

// Request interceptor لإضافة التوكن
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token || localStorage.getItem('admin_token')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor لمعالجة الأخطاء
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - مسح البيانات وإعادة التوجيه
      const authStore = useAuthStore()
      authStore.logout()
      window.location.href = '/admin/login'
    }
    
    if (error.response?.status === 419) {
      // CSRF token mismatch - إعادة تحميل الصفحة
      window.location.reload()
    }
    
    return Promise.reject(error)
  }
)

export default api