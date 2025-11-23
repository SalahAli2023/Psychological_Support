// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface LoginData {
  email: string
  password: string
  remember: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  phone: string
  country_code: string
  role: string
}

interface User {
  id: number
  name: string
  email: string
  role: string
  phone?: string
  joined_at?: string
  email_verified_at?: string
}

interface RegisterResponse {
  success: boolean
  requiresVerification?: boolean
  errors?: any
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('frontend_token'))
  const isAuthenticated = computed(() => !!token.value)
  const requiresVerification = ref(false)
  const pendingEmail = ref<string>('')

  // 🔥 NEW: استخدام api بدلاً من fetch مباشرة مع تحسينات الأمان
  const api = {
    async post(url: string, data: any) {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
      
      // 🔥 NEW: إضافة header لمنع التحويل التلقائي
      const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }

      // 🔥 NEW: إضافة التوكن إذا كان موجوداً
      if (token.value) {
        headers['Authorization'] = `Bearer ${token.value}`
      }

      const response = await fetch(`${API_URL}${url}`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
        // 🔥 IMPORTANT: منع الـ redirect
        redirect: 'manual'
      })

      // 🔥 NEW: معالجة الـ redirect يدوياً بشكل أفضل
      if (response.status >= 300 && response.status < 400) {
        const redirectUrl = response.headers.get('Location')
        console.warn('⚠️ تم اكتشاف redirect:', redirectUrl)
        
        // إذا كان التحويل إلى admin/login، نرفضه
        if (redirectUrl && redirectUrl.includes('/admin/login')) {
          console.log('🚫 تم منع التحويل إلى admin/login')
          throw new Error('REDIRECT_TO_ADMIN_BLOCKED')
        }
        
        throw new Error('REDIRECT_DETECTED')
      }

      return response
    },

    async get(url: string) {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
      
      const headers: any = {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }

      if (token.value) {
        headers['Authorization'] = `Bearer ${token.value}`
      }

      const response = await fetch(`${API_URL}${url}`, {
        method: 'GET',
        headers: headers,
        redirect: 'manual'
      })

      if (response.status >= 300 && response.status < 400) {
        const redirectUrl = response.headers.get('Location')
        if (redirectUrl && redirectUrl.includes('/admin/login')) {
          console.log('🚫 تم منع التحويل إلى admin/login في GET')
          throw new Error('REDIRECT_TO_ADMIN_BLOCKED')
        }
        throw new Error('REDIRECT_DETECTED')
      }

      return response
    }
  }

  const register = async (registerData: RegisterData): Promise<RegisterResponse> => {
    try {
      console.log('🔄 جاري إنشاء الحساب:', registerData)
      
      const response = await api.post('/registerClint', registerData)

      console.log('📡 حالة الاستجابة:', response.status, response.statusText)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ استجابة التسجيل:', data)
        
        if (data.data?.requires_verification) {
          requiresVerification.value = true
          pendingEmail.value = registerData.email
          return { success: true, requiresVerification: true }
        }
        
        // إذا لم يتطلب التحقق (مباشرة)
        if (data.data?.user && data.data?.token) {
          saveAuthData({ user: data.data.user, token: data.data.token }, false)
          return { success: true }
        }
        
        throw new Error('بيانات الاستجابة غير مكتملة')
      } else {
        const errorData = await response.json().catch(() => ({}))
        
        if (errorData.errors) {
          return { 
            success: false, 
            errors: errorData.errors 
          }
        }
        throw new Error(errorData.message || 'فشل في إنشاء الحساب')
      }

    } catch (error: any) {
      console.error('❌ فشل التسجيل:', error)
      
      if (error.message === 'REDIRECT_TO_ADMIN_BLOCKED') {
        return { 
          success: false, 
          errors: { general: 'تم منع التحويل غير المصرح به. يرجى المحاولة مرة أخرى.' } 
        }
      }
      
      if (error.message === 'REDIRECT_DETECTED') {
        return { 
          success: false, 
          errors: { general: 'تم اكتشاف تحويل غير متوقع. يرجى المحاولة مرة أخرى.' } 
        }
      }
      
      if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
        return { 
          success: false, 
          errors: { network: 'تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.' } 
        }
      }
      
      return { 
        success: false, 
        errors: { general: error.message || 'حدث خطأ غير متوقع في التسجيل' } 
      }
    }
  }

  // 🔥 NEW: التحقق من البريد الإلكتروني
  const verifyEmail = async (email: string, code: string): Promise<boolean> => {
    try {
      console.log('🔄 جاري التحقق من الرمز:', { email, code })
      
      const response = await api.post('/verify-email', {
        email: email,
        verification_code: code
      })

      console.log('📡 حالة استجابة التحقق:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ تم تفعيل الحساب:', data)
        
        if (data.data?.user && data.data?.token) {
          saveAuthData({ user: data.data.user, token: data.data.token }, false)
          requiresVerification.value = false
          pendingEmail.value = ''
          return true
        }
        
        throw new Error('بيانات التفعيل غير مكتملة')
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ تفاصيل الخطأ من الخادم:', errorData)
        throw new Error(errorData.message || 'فشل في تفعيل الحساب')
      }

    } catch (error: any) {
      console.error('❌ فشل التحقق:', error)
      
      if (error.message === 'REDIRECT_TO_ADMIN_BLOCKED') {
        throw new Error('تم منع التحويل إلى صفحة المسؤول')
      }
      
      if (error.message === 'REDIRECT_DETECTED') {
        throw new Error('تم اكتشاف تحويل غير متوقع أثناء التحقق')
      }
      
      throw new Error(error.message || 'حدث خطأ في التحقق')
    }
  }

  // 🔥 NEW: إعادة إرسال رمز التحقق
  const resendVerificationCode = async (email: string): Promise<boolean> => {
    try {
      const response = await api.post('/resend-verification', { email })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ تم إعادة إرسال الرمز:', data)
        return true
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'فشل في إعادة إرسال الرمز')
      }

    } catch (error: any) {
      console.error('❌ فشل إعادة الإرسال:', error)
      
      if (error.message === 'REDIRECT_TO_ADMIN_BLOCKED') {
        throw new Error('تم منع التحويل إلى صفحة المسؤول')
      }
      
      if (error.message === 'REDIRECT_DETECTED') {
        throw new Error('تم اكتشاف تحويل غير متوقع أثناء إعادة الإرسال')
      }
      
      throw new Error(error.message || 'حدث خطأ في إعادة الإرسال')
    }
  }

  const login = async (loginData: LoginData): Promise<boolean> => {
    try {
      console.log('🔄 جاري تسجيل الدخول:', { email: loginData.email })
      
      const response = await api.post('/login', {
        email: loginData.email,
        password: loginData.password
      })

      console.log('📡 حالة الاستجابة:', response.status, response.statusText)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ استجابة الـ API الكاملة:', data)
        
        // تحليل الاستجابة بطرق مختلفة
        let userData, authToken
        
        if (data.data && data.data.user) {
          userData = data.data.user
          authToken = data.data.token || data.token
        } else if (data.user) {
          userData = data.user
          authToken = data.token
        } else if (data.success && data.data) {
          userData = data.data.user
          authToken = data.data.token
        } else {
          userData = data
          authToken = data.token
        }
        
        console.log('👤 بيانات المستخدم المستخرجة:', userData)
        console.log('🔑 التوكن المستخرج:', authToken)
        
        if (!userData) {
          throw new Error('بيانات المستخدم غير موجودة في الاستجابة')
        }
        
        if (!userData.role) {
          console.warn('⚠️ حقل role غير موجود في بيانات المستخدم، استخدام قيمة افتراضية')
          userData.role = 'Client'
        }
        
        saveAuthData({ user: userData, token: authToken }, loginData.remember)
        return true
      } else {
        let errorMessage = 'فشل تسجيل الدخول'
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
          console.log('❌ تفاصيل الخطأ من الخادم:', errorData)
        } catch (parseError) {
          errorMessage = `فشل تسجيل الدخول - حالة الخطأ: ${response.status}`
        }
        
        throw new Error(errorMessage)
      }

    } catch (error: any) {
      console.error('❌ فشل تسجيل الدخول:', error)
      
      if (error.message === 'REDIRECT_TO_ADMIN_BLOCKED') {
        throw new Error('تم منع التحويل إلى صفحة المسؤول. يرجى استخدام واجهة المستخدم الأمامية.')
      }
      
      if (error.message === 'REDIRECT_DETECTED') {
        throw new Error('تم اكتشاف تحويل غير متوقع. يرجى المحاولة مرة أخرى.')
      }
      
      if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
        throw new Error('تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت وتشغيل الخادم الخلفي.')
      }
      
      throw new Error(error.message || 'حدث خطأ غير متوقع في تسجيل الدخول')
    }
  }

  // دالة حفظ بيانات المصادقة
  const saveAuthData = (data: any, remember: boolean) => {
    console.log('💾 حفظ بيانات المصادقة:', data)
    
    if (!data.token) {
      console.error('❌ التوكن غير موجود في البيانات:', data)
      throw new Error('بيانات المصادقة غير مكتملة - التوكن مفقود')
    }
    
    if (!data.user) {
      console.error('❌ بيانات المستخدم غير موجودة في البيانات:', data)
      throw new Error('بيانات المصادقة غير مكتملة - بيانات المستخدم مفقودة')
    }
    
    token.value = data.token
    user.value = data.user
    
    // 🔥 NEW: استخدام مفتاح مختلف للفرونتند فقط
    const tokenKey = 'frontend_token'
    const userKey = 'frontend_user'
    
    if (remember) {
      localStorage.setItem(tokenKey, data.token)
      localStorage.setItem(userKey, JSON.stringify(data.user))
    } else {
      sessionStorage.setItem(tokenKey, data.token)
      sessionStorage.setItem(userKey, JSON.stringify(data.user))
    }
    
    console.log('✅ تم حفظ بيانات المصادقة بنجاح')
  }

  const logout = async () => {
    try {
      if (token.value) {
        await api.post('/logout', {})
      }
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      token.value = null
      user.value = null
      
      // 🔥 NEW: تنظيف مفاتيح الفرونتند فقط
      localStorage.removeItem('frontend_token')
      localStorage.removeItem('frontend_user')
      sessionStorage.removeItem('frontend_token')
      sessionStorage.removeItem('frontend_user')
      
      console.log('✅ تم تسجيل الخروج من الفرونتند')
    }
  }

  const initializeAuth = () => {
    // 🔥 NEW: منع التحويل التلقائي إلى admin
    const currentPath = window.location.pathname;
    if (currentPath.includes('/admin') && !token.value) {
      console.log('🚫 منع الوصول إلى المسؤول بدون مصادقة - إعادة التوجيه إلى الرئيسية');
      window.location.href = '/';
      return;
    }

    // استخدام مفاتيح الفرونتند فقط
    const tokenKey = 'frontend_token'
    const userKey = 'frontend_user'
    
    const savedToken = localStorage.getItem(tokenKey) || sessionStorage.getItem(tokenKey)
    const savedUser = localStorage.getItem(userKey) || sessionStorage.getItem(userKey)
    
    if (savedToken && savedUser) {
      try {
        token.value = savedToken
        user.value = JSON.parse(savedUser)
        console.log('✅ تم استعادة بيانات المصادقة من التخزين')
      } catch (error) {
        console.error('❌ خطأ في تحليل بيانات المستخدم:', error)
        logout()
      }
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    requiresVerification,
    pendingEmail,
    register,
    login,
    logout,
    initializeAuth,
    verifyEmail,
    resendVerificationCode
  }
})