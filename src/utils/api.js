import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 60000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token || localStorage.getItem('admin_token')
    
    console.log('API Request:', config.url)
    console.log('Token exists:', !!token)
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Response Success:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.log('API Response Error:', error.response?.status, error.config?.url)
    console.log('Error details:', error.response?.data)
    
    if (error.response?.status === 401) {
      // Unauthorized - مسح البيانات وإعادة التوجيه
      console.log('Unauthorized access, redirecting to login...')
      const authStore = useAuthStore()
      authStore.logout()
      window.location.href = '/admin/login'
    }
    
    if (error.response?.status === 419) {
      window.location.reload()
    }
    
    return Promise.reject(error)
  }
)

export default api
