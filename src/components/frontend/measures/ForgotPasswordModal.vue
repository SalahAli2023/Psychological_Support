<template>
  <div class="fixed inset-0 z-1000 flex items-center justify-center p-4" :dir="language === 'ar' ? 'rtl' : 'ltr'">
    <div class="modal-overlay fixed inset-0 bg-opacity-50" @click="$emit('close')"></div>

    <div class="relative bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ translate('forgotPasswordModal.title') }}
          </h2>
          <button
            @click="$emit('close')"
            class="flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>
      </div>

      <div class="p-6">
        <!-- الرسالة التوضيحية -->
        <div class="mb-6">
          <div class="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
            <i class="fas fa-key text-blue-600 text-xl"></i>
          </div>
          <p class="text-gray-600 text-center">
            {{ translate('forgotPasswordModal.description') }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- البريد الإلكتروني -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              {{ translate('forgotPasswordModal.email') }}
            </label>
            <input
              v-model="email"
              type="email"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all"
              placeholder="example@email.com"
              required
            />
          </div>

          <!-- زر الإرسال -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-primary-green text-white rounded-lg font-medium hover:bg-[#8cad35] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            <span>{{ translate('forgotPasswordModal.sendCode') }}</span>
          </button>

          <!-- خطأ -->
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center gap-2 text-red-700">
              <i class="fas fa-exclamation-circle"></i>
              <span class="text-sm">{{ error }}</span>
            </div>
          </div>

          <!-- رسالة النجاح -->
          <div v-if="success" class="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex items-center gap-2 text-green-700">
              <i class="fas fa-check-circle"></i>
              <span class="text-sm">{{ success }}</span>
            </div>
          </div>
        </form>

        <!-- العودة لتسجيل الدخول -->
        <div class="text-center mt-6">
          <button
            type="button"
            @click="$emit('show-login')"
            class="text-primary-green hover:text-primary-pink font-medium transition-colors text-sm"
          >
            {{ translate('forgotPasswordModal.backToLogin') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'ForgotPasswordModal',
  props: {
    language: { type: String, default: 'ar' }
  },
  emits: ['close', 'show-login', 'code-sent'],
  setup(props, { emit }) {
    const email = ref('')
    const loading = ref(false)
    const error = ref('')
    const success = ref('')

    const translate = (key) => {
      const translations = {
        'forgotPasswordModal.title': {
          ar: 'نسيت كلمة المرور',
          en: 'Forgot Password'
        },
        'forgotPasswordModal.description': {
          ar: 'أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق لإعادة تعيين كلمة المرور',
          en: 'Enter your email and we will send you a verification code to reset your password'
        },
        'forgotPasswordModal.email': {
          ar: 'البريد الإلكتروني',
          en: 'Email'
        },
        'forgotPasswordModal.sendCode': {
          ar: 'إرسال رمز التحقق',
          en: 'Send Verification Code'
        },
        'forgotPasswordModal.backToLogin': {
          ar: 'العودة لتسجيل الدخول',
          en: 'Back to Login'
        },
        'forgotPasswordModal.success': {
          ar: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني',
          en: 'Verification code has been sent to your email'
        },
        'forgotPasswordModal.error': {
          ar: 'حدث خطأ أثناء إرسال الرمز',
          en: 'An error occurred while sending the code'
        }
      }
      
      if (translations[key]) {
        return translations[key][props.language] || translations[key].ar
      }
      
      return key
    }

    const handleSubmit = async () => {
      try {
        loading.value = true
        error.value = ''
        success.value = ''

        // محاكاة إرسال الرمز
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        console.log('إرسال رمز التحقق إلى:', email.value)
        success.value = translate('forgotPasswordModal.success')
        
        // إرسال الحدث مع البريد الإلكتروني
        emit('code-sent', email.value)

      } catch (err) {
        error.value = err.message || translate('forgotPasswordModal.error')
      } finally {
        loading.value = false
      }
    }

    return {
      email,
      loading,
      error,
      success,
      handleSubmit,
      translate
    }
  }
}
</script>

<style scoped>
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

.modal-overlay {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>