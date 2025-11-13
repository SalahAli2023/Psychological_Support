import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface LoginData {
  email: string
  password: string
  remember: boolean
}

interface User {
  id: number
  name: string
  email: string
  role: string
  phone?: string
  joined_at?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('admin_token'))
  const isAuthenticated = computed(() => !!token.value)

  const login = async (loginData: LoginData): Promise<boolean> => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
      
      console.log('جاري الاتصال بالخادم:', `${API_URL}/login`)
      
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        // تحقق من أن المستخدم مدير
        if (data.user.role !== 'Admin') {
          throw new Error('غير مصرح بالدخول إلى لوحة التحكم')
        }
        
        saveAuthData(data, loginData.remember)
        return true
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'فشل تسجيل الدخول')
      }

    } catch (error: any) {
      console.error('API Login failed:', error)
      throw new Error(error.message || 'حدث خطأ في الاتصال بالخادم')
    }
  }

  // دالة حفظ بيانات المصادقة
  const saveAuthData = (data: any, remember: boolean) => {
    token.value = data.token
    user.value = data.user
    
    if (remember) {
      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('admin_user', JSON.stringify(data.user))
    } else {
      sessionStorage.setItem('admin_token', data.token)
      sessionStorage.setItem('admin_user', JSON.stringify(data.user))
    }
  }

  const logout = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
      
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Accept': 'application/json'
        }
      })
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      sessionStorage.removeItem('admin_token')
      sessionStorage.removeItem('admin_user')
    }
  }

  const initializeAuth = () => {
    const savedToken = localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token')
    const savedUser = localStorage.getItem('admin_user') || sessionStorage.getItem('admin_user')
    
    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = JSON.parse(savedUser)
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
    initializeAuth
  }
})