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

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('admin_token'))
  const isAuthenticated = computed(() => !!token.value)
  const requiresVerification = ref(false)
  const pendingEmail = ref<string>('')

  const register = async (registerData: RegisterData): Promise<{success: boolean, requiresVerification?: boolean}> => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
      
      console.log('🔄 جاري إنشاء الحساب:', registerData)
      
      const response = await fetch(`${API_URL}/registerClint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(registerData)
      })

      console.log('📡 حالة الاستجابة:', response.status, response.statusText)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ استجابة التسجيل:', data)
        
        if (data.data.requires_verification) {
          requiresVerification.value = true
          pendingEmail.value = registerData.email
          return { success: true, requiresVerification: true }
        }
        
        // إذا لم يتطلب التحقق (مباشرة)
        saveAuthData({ user: data.data.user, token: data.data.token }, false)
        return { success: true }
      } else {
        const errorData = await response.json()
         // 🔥 NEW: إرجاع الأخطاء المفصلة
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
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
    
    console.log('🔄 جاري التحقق من الرمز:', { email, code })
    
    const response = await fetch(`${API_URL}/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        email: email,
        verification_code: code // تأكد من أن هذا الحقل مضبوط بشكل صحيح
      }),
    });

    console.log('📡 حالة استجابة التحقق:', response.status)
    
    // لأغراض التصحيح، اطبع الجسم المرسل
    console.log("Request Body:", {
      email,
      verification_code: code
    });

    if (response.ok) {
      const data = await response.json()
      console.log('✅ تم تفعيل الحساب:', data)
      
      saveAuthData({ user: data.data.user, token: data.data.token }, false)
      requiresVerification.value = false
      pendingEmail.value = ''
      return true
    } else {
      // اطبع الخطأ بالتفصيل
      const errorData = await response.json()
      console.error('❌ تفاصيل الخطأ من الخادم:', errorData)
      throw new Error(errorData.message || 'فشل في تفعيل الحساب')
    }

  } catch (error: any) {
    console.error('❌ فشل التحقق:', error)
    throw new Error(error.message || 'حدث خطأ في التحقق')
  }
}

  // 🔥 NEW: إعادة إرسال رمز التحقق
  const resendVerificationCode = async (email: string): Promise<boolean> => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
      
      const response = await fetch(`${API_URL}/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ تم إعادة إرسال الرمز:', data)
        return true
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'فشل في إعادة إرسال الرمز')
      }

    } catch (error: any) {
      console.error('❌ فشل إعادة الإرسال:', error)
      throw new Error(error.message || 'حدث خطأ في إعادة الإرسال')
    }
  }

  const login = async (loginData: LoginData): Promise<boolean> => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
      
      console.log('🔄 جاري الاتصال بالخادم:', `${API_URL}/login`)
      console.log('📧 بيانات الدخول:', { email: loginData.email })
      
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

      console.log('📡 حالة الاستجابة:', response.status, response.statusText)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ استجابة الـ API الكاملة:', data)
        
        // تحليل الاستجابة بطرق مختلفة
        let userData, authToken
        
        // الطريقة 1: إذا كانت البيانات في data.data
        if (data.data && data.data.user) {
          userData = data.data.user
          authToken = data.data.token || data.token
        }
        // الطريقة 2: إذا كانت البيانات مباشرة في data
        else if (data.user) {
          userData = data.user
          authToken = data.token
        }
        // الطريقة 3: إذا كانت البيانات في استجابة مختلفة
        else if (data.success && data.data) {
          userData = data.data.user
          authToken = data.data.token
        }
        // الطريقة 4: إذا كانت البيانات في جذر الاستجابة
        else {
          userData = data
          authToken = data.token
        }
        
        console.log('👤 بيانات المستخدم المستخرجة:', userData)
        console.log('🔑 التوكن المستخرج:', authToken)
        
        // التحقق من وجود بيانات المستخدم
        if (!userData) {
          throw new Error('بيانات المستخدم غير موجودة في الاستجابة')
        }
        
        // التحقق من وجود الدور
        if (!userData.role) {
          console.warn('⚠️ حقل role غير موجود في بيانات المستخدم، استخدام قيمة افتراضية')
          userData.role = 'Client' // أو أي قيمة افتراضية
        }
        
        // التحقق من أن المستخدم مدير (إذا كان مطلوباً)
        if (userData.role !== 'Admin') {
          console.log('👤 نوع المستخدم:', userData.role)
          // يمكنك إزالة هذا الشرط إذا كان مسموحاً لجميع المستخدمين
          // throw new Error('غير مصرح بالدخول إلى لوحة التحكم - يجب أن تكون مديراً')
        }
        
        saveAuthData({ user: userData, token: authToken }, loginData.remember)
        return true
      } else {
        // معالجة الأخطاء من الخادم
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
      
      // تحسين رسائل الخطأ
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
    
    if (remember) {
      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('admin_user', JSON.stringify(data.user))
    } else {
      sessionStorage.setItem('admin_token', data.token)
      sessionStorage.setItem('admin_user', JSON.stringify(data.user))
    }
    
    console.log('✅ تم حفظ بيانات المصادقة بنجاح')
  }

  const logout = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
      
      if (token.value) {
        await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token.value}`,
            'Accept': 'application/json'
          }
        })
      }
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
     requiresVerification, // 🔥 NEW
    pendingEmail, // 🔥 NEW
    register, // 🔥 UPDATED
    login,
    logout,
    initializeAuth,
    verifyEmail, // 🔥 NEW
    resendVerificationCode // 🔥 NEW
  }
})