<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 modal-overlay" @click="closeModal"></div>
    
    <div class="relative bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl animate-slide-up" @click.stop>
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start z-10">
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-800">{{ translate('loginModal.title') }}</h2>
          <p class="text-gray-600 mt-2 text-sm leading-relaxed">
            {{ translate('loginModal.description') }}
          </p>
        </div>
        <button @click="closeModal" class="flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <div class="p-6">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- البريد الإلكتروني -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 text-right">{{ translate('loginModal.emailLabel') }}</label>
            <input 
              v-model="form.email"
              type="email"
              :placeholder="translate('loginModal.emailPlaceholder')"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
              :class="errors.email ? 'border-red-500' : ''"
              required
            >
            <p v-if="errors.email" class="text-red-500 text-xs mt-1 text-right">{{ errors.email }}</p>
          </div>

          <!-- كلمة المرور -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2 text-right">{{ translate('loginModal.passwordLabel') }}</label>
            <input 
              v-model="form.password"
              type="password"
              :placeholder="translate('loginModal.passwordPlaceholder')"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
              :class="errors.password ? 'border-red-500' : ''"
              required
            >
            <p v-if="errors.password" class="text-red-500 text-xs mt-1 text-right">{{ errors.password }}</p>
          </div>

          <!-- تذكرني -->
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input 
                v-model="form.remember"
                type="checkbox"
                class="w-4 h-4 text-primary-green border-gray-300 rounded focus:ring-primary-green"
              >
              <span class="text-sm text-gray-700 mr-2">{{ translate('loginModal.rememberMe') }}</span>
            </label>
            
            <button type="button" class="text-sm text-primary-green hover:text-opacity-80 transition-colors">
              {{ translate('loginModal.forgotPassword') }}
            </button>
          </div>

          <!-- زر تسجيل الدخول -->
          <button 
            type="submit"
            :disabled="isSubmitting || !form.email || !form.password"
            class="w-full py-3 bg-primary-green text-white rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <span v-if="!isSubmitting">{{ translate('loginModal.loginButton') }}</span>
            <span v-else class="flex items-center justify-center gap-2">
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {{ translate('loginModal.loggingIn') }}
            </span>
          </button>

          <!-- رابط إنشاء حساب -->
          <div class="text-center pt-4 border-t border-gray-200">
            <p class="text-gray-600 text-sm">
              {{ translate('loginModal.noAccount') }}
              <button 
                type="button"
                @click="switchToRegister"
                class="text-primary-green hover:text-opacity-80 font-medium transition-colors"
              >
                {{ translate('loginModal.createAccount') }}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useNotifications } from '@/composables/useNotifications'
import { useProfile } from '@/composables/useProfile'
import { t } from '@/locales'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    default: 'ar'
  }
})

const emit = defineEmits(['close', 'switch-to-register', 'login-success'])

const { showSuccess, showError } = useNotifications()
const { login } = useProfile()

const isSubmitting = ref(false)
const form = reactive({
  email: '',
  password: '',
  remember: false
})

const errors = reactive({})

// دالة الترجمة
const translate = (key) => {
  return t(key, props.language)
}

const handleLogin = async () => {
  isSubmitting.value = true
  errors.email = ''
  errors.password = ''

  try {
    // الاتصال بالـ API الحقيقي لتسجيل الدخول
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
    
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password
      })
    })

    if (response.ok) {
      const data = await response.json()
      
      // حفظ بيانات المستخدم
      const userData = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        token: data.token,
        createdAt: new Date().toISOString()
      }
      
      // استخدام دالة login من useProfile
      login(userData)
      
      // حفظ التوكن في localStorage
      if (form.remember) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(userData))
      } else {
        sessionStorage.setItem('token', data.token)
        sessionStorage.setItem('user', JSON.stringify(userData))
      }
      
      showSuccess(translate('loginModal.successMessage'))
      emit('login-success')
      closeModal()
      
    } else {
      const errorData = await response.json()
      throw new Error(errorData.message || translate('loginModal.errorMessage'))
    }
    
  } catch (error) {
    console.error('❌ خطأ في تسجيل الدخول:', error)
    
    if (error.message.includes('Invalid credentials') || error.message.includes('بيانات الدخول غير صحيحة')) {
      errors.email = translate('loginModal.invalidCredentials')
      errors.password = translate('loginModal.invalidCredentials')
    } else {
      showError(error.message || translate('loginModal.errorMessage'))
    }
  } finally {
    isSubmitting.value = false
  }
}

const switchToRegister = () => {
  closeModal()
  emit('switch-to-register')
}

const closeModal = () => {
  emit('close')
  // إعادة تعيين النموذج
  Object.assign(form, {
    email: '',
    password: '',
    remember: false
  })
  Object.keys(errors).forEach(key => delete errors[key])
}
</script>

<style scoped>
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>