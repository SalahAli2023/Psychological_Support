<template>
  <div v-if="showRegistration" class="fixed inset-0 z-900 flex items-center justify-center p-4">
    <div class="fixed inset-0 modal-overlay" @click="closeRegistration"></div>
    
    <!-- إضافة dir و text-direction -->
    <div 
      class="relative bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl animate-slide-up" 
      @click.stop
      :dir="language === 'ar' ? 'rtl' : 'ltr'"
      :class="language === 'ar' ? 'text-right' : 'text-left'"
    >
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start z-10">
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-800">{{ translate('registrationModal.title') }}</h2>
          <p class="text-gray-600 mt-2 text-sm leading-relaxed">
            {{ translate('registrationModal.description') }}
          </p>
        </div>
        <button @click="closeRegistration" class="flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

    <!-- Messages Container -->
      <div v-if="message.text" 
          :class="['mx-6 mt-4 p-4 rounded-lg border text-sm font-medium', 
                    message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 
                    'bg-red-50 border-red-200 text-red-700']">
        {{ message.text }}
      </div>

      <!-- 🔥 NEW: عرض الأخطاء المفصلة من الباك إند -->
      <div v-if="Object.keys(errors).length > 0 && message.type === 'error'" 
          class="mx-6 mt-4 p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
        <ul class="list-disc list-inside space-y-1" :class="language === 'ar' ? 'text-right' : 'text-left'">
          <li v-for="(error, field) in errors" :key="field">
            {{ error }}
          </li>
        </ul>
      </div>

      <div class="p-6">
        <!-- Registration Steps -->
        <div class="flex justify-between items-center mb-8">
          <div 
            v-for="step in steps" 
            :key="step.number"
            class="flex flex-col items-center relative flex-1"
            :class="{ 'active': currentStep === step.number, 'completed': currentStep > step.number }"
          >
            <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2 transition-colors z-10"
                  :class="currentStep >= step.number ? 'bg-primary-green border-primary-green' : 'bg-white border-gray-300'">
              <svg width="16" height="16" viewBox="0 0 25 25" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M24.0847 3.9275C25.3051 5.16416 25.3051 7.16918 24.0847 8.40584L11.5847 21.0725C10.3643 22.3092 8.38568 22.3092 7.16529 21.0725L0.915291 14.7392C-0.305097 13.5025 -0.305097 11.4975 0.915291 10.2608C2.13568 9.02417 4.11432 9.02417 5.33471 10.2608L9.375 14.355L19.6653 3.9275C20.8857 2.69083 22.8643 2.69083 24.0847 3.9275Z" 
                      :fill="currentStep >= step.number ? 'white' : '#A1B0D5'"/>
              </svg>
            </div>
            <span class="text-xs text-center" 
                  :class="currentStep >= step.number ? 'text-primary-green font-medium' : 'text-gray-500'">
              {{ step.title }}
            </span>
            <div v-if="step.number < 3" 
                 class="absolute top-4 h-0.5 bg-gray-300 -z-10"
                 :class="language === 'ar' ? 'left-1/2 w-full' : 'right-1/2 w-full'"></div>
          </div>
        </div>

        <!-- Steps Content -->
        <div class="min-h-64">
          <!-- Step 1: Account Information -->
          <div v-if="currentStep === 1" class="space-y-6">
            <h3 class="text-lg font-semibold text-center text-gray-800">{{ translate('registrationModal.accountStep.title') }}</h3>
            
            <form @submit.prevent="handleAccountSubmit" class="space-y-4">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2" 
                       :class="language === 'ar' ? 'text-right' : 'text-left'">
                  {{ translate('registrationModal.accountStep.nameLabel') }}
                </label>
                <input 
                  v-model="form.name"
                  type="text"
                  :placeholder="translate('registrationModal.accountStep.namePlaceholder')"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  :class="errors.name ? 'border-red-500' : ''"
                  :dir="language === 'ar' ? 'rtl' : 'ltr'"
                >
                <p v-if="errors.name" class="text-red-500 text-xs mt-1" 
                   :class="language === 'ar' ? 'text-right' : 'text-left'">
                  {{ translate('registrationModal.accountStep.nameRequired') }}
                </p>
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                       :class="language === 'ar' ? 'text-right' : 'text-left'">
                  {{ translate('registrationModal.accountStep.emailLabel') }}
                </label>
                <input 
                  v-model="form.email"
                  type="email"
                  :placeholder="translate('registrationModal.accountStep.emailPlaceholder')"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  :class="errors.email ? 'border-red-500' : ''"
                  :dir="language === 'ar' ? 'rtl' : 'ltr'"
                >
                <p v-if="errors.email" class="text-red-500 text-xs mt-1"
                   :class="language === 'ar' ? 'text-right' : 'text-left'">
                  {{ errors.email }}
                </p>
              </div>

              <!-- Password -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                       :class="language === 'ar' ? 'text-right' : 'text-left'">
                  {{ translate('registrationModal.accountStep.passwordLabel') }}
                </label>
                <input 
                  v-model="form.password"
                  type="password"
                  :placeholder="translate('registrationModal.accountStep.passwordPlaceholder')"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  :class="errors.password ? 'border-red-500' : ''"
                  :dir="language === 'ar' ? 'rtl' : 'ltr'"
                >
                <p v-if="errors.password" class="text-red-500 text-xs mt-1"
                   :class="language === 'ar' ? 'text-right' : 'text-left'">
                  {{ errors.password }}
                </p>
              </div>

              <!-- Password Confirmation -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                       :class="language === 'ar' ? 'text-right' : 'text-left'">
                  {{ translate('registrationModal.accountStep.passwordConfirmationLabel') }}
                </label>
                <input 
                  v-model="form.password_confirmation"
                  type="password"
                  :placeholder="translate('registrationModal.accountStep.passwordConfirmationPlaceholder')"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  :class="errors.password_confirmation ? 'border-red-500' : ''"
                  :dir="language === 'ar' ? 'rtl' : 'ltr'"
                >
                <p v-if="errors.password_confirmation" class="text-red-500 text-xs mt-1"
                   :class="language === 'ar' ? 'text-right' : 'text-left'">
                  {{ errors.password_confirmation }}
                </p>
              </div>
              
              <button 
                type="submit"
                :disabled="!isAccountValid || isSubmitting"
                class="w-full py-3 bg-primary-green text-white rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <span v-if="!isSubmitting">{{ translate('registrationModal.accountStep.continue') }}</span>
                <span v-else class="flex items-center justify-center gap-2">
                  <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {{ translate('registrationModal.accountStep.processing') }}
                </span>
              </button>
            </form>
          </div>

          <!-- Step 2: Personal Information -->
          <div v-if="currentStep === 2" class="space-y-6">
            <h3 class="text-lg font-semibold text-center text-gray-800">{{ translate('registrationModal.personalStep.title') }}</h3>
            
            <form @submit.prevent="handlePersonalSubmit" class="space-y-4">
              <!-- Country -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                       :class="language === 'ar' ? 'text-right' : 'text-left'">
                  {{ translate('registrationModal.personalStep.countryLabel') }}
                </label>
                <div class="relative">
                  <select 
                    v-model="form.country"
                    @change="updateDialCode"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent appearance-none bg-white"
                    :class="language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'"
                  >
                    <option value="">{{ translate('registrationModal.personalStep.selectCountry') }}</option>
                    <option 
                      v-for="country in countries" 
                      :key="country.code"
                      :value="country.code"
                    >
                      {{ country.name }} {{ country.flag }}
                    </option>
                  </select>
                  <!-- تعديل موقع السهم حسب اللغة -->
                  <div class="absolute top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                       :class="language === 'ar' ? 'left-3' : 'right-3'">
                    <i class="fas fa-chevron-down"></i>
                  </div>
                </div>
              </div>

              <!-- Phone Number -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                       :class="language === 'ar' ? 'text-right' : 'text-left'">
                  {{ translate('registrationModal.personalStep.phoneLabel') }}
                </label>
                <div class="flex gap-2" :class="language === 'ar' ? 'flex-row-reverse' : ''">
                  <div class="flex-shrink-0 w-24 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-center text-gray-700">
                    {{ form.dialCode }}
                  </div>
                  <input 
                    v-model="form.phone"
                    type="tel"
                    :placeholder="translate('registrationModal.personalStep.phonePlaceholder')"
                    @input="validatePhone"
                    class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent"
                    :class="errors.phone ? 'border-red-500' : ''"
                    :dir="language === 'ar' ? 'rtl' : 'ltr'"
                  >
                </div>
                <p v-if="errors.phone" class="text-red-500 text-xs mt-1"
                   :class="language === 'ar' ? 'text-right' : 'text-left'">
                  {{ translate('registrationModal.personalStep.phoneError') }}
                </p>
              </div>
              
              <button 
                type="submit"
                :disabled="!isPersonalValid || isSubmitting"
                class="w-full py-3 bg-primary-green text-white rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <span v-if="!isSubmitting">{{ translate('registrationModal.personalStep.sendVerification') }}</span>
                <span v-else class="flex items-center justify-center gap-2">
                  <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {{ translate('registrationModal.personalStep.sending') }}
                </span>
              </button>
            </form>
          </div>

          <!-- Step 3: Email Verification -->
          <div v-if="currentStep === 3" class="space-y-6">
            <h3 class="text-lg font-semibold text-center text-gray-800">{{ translate('registrationModal.verificationStep.title') }}</h3>
            
            <form @submit.prevent="handleVerificationSubmit" class="space-y-4">
              <div class="text-center space-y-2">
                <p class="text-gray-600">{{ translate('registrationModal.verificationStep.sentTo') }}</p>
                <p class="font-semibold text-primary-green">{{ form.email }}</p>
                <p class="text-sm text-gray-500">{{ translate('registrationModal.verificationStep.checkSpam') }}</p>
              </div>

              <!-- Verification Code Inputs -->
              <div class="flex justify-center gap-3 direction-ltr"> 
                <input 
                  v-for="n in 6"
                  :key="n"
                  v-model="verificationCode[n-1]"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  maxlength="1"
                  @input="handleCodeInput(n-1, $event)"
                  @keydown="handleCodeKeydown(n-1, $event)"
                  @paste="handlePaste"
                  class="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent direction-ltr verification-input"
                >
              </div>

              <!-- Verification Actions -->
              <div class="text-center space-y-3">
                <div v-if="resendCounter > 0" class="text-gray-600">
                  <span>{{ translate('registrationModal.verificationStep.resendIn') }}</span>
                  <span class="font-semibold mx-1">{{ formatTime(resendCounter) }}</span>
                </div>
                
                <div class="flex justify-center gap-4">
                  <button 
                    v-if="resendCounter <= 0"
                    type="button"
                    @click="resendVerification"
                    class="text-primary-green hover:text-opacity-80 font-medium transition-colors flex items-center gap-2"
                  >
                    <i class="fas fa-redo-alt text-sm"></i>
                    {{ translate('registrationModal.verificationStep.resend') }}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                :disabled="!isVerificationComplete || isSubmitting"
                class="w-full py-3 bg-primary-green text-white rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <span v-if="!isSubmitting">{{ translate('registrationModal.verificationStep.confirm') }}</span>
                <span v-else class="flex items-center justify-center gap-2">
                  <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {{ translate('registrationModal.verificationStep.verifying') }}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import { useProfile } from '@/composables/useProfile'
import { countries } from '@/data/countries'
import { t } from '@/locales'
import { useAuthStore } from '@/stores/auth'
import { useFrontendScalesStore } from '@/stores/frontendScales.store'

const authStore = useAuthStore()
const frontendScalesStore = useFrontendScalesStore()

const props = defineProps({
  showRegistration: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    default: 'ar'
  }
})

const router = useRouter()
const { showSuccess, showError } = useNotifications()
const { login } = useProfile()

const emit = defineEmits(['close', 'switch-to-login', 'registration-success'])
const currentLanguage = ref(props.language)
const currentStep = ref(1)
const isSubmitting = ref(false)
const resendCounter = ref(0)
const verificationCode = ref(['', '', '', '', '', ''])

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  country: '+967',
  dialCode: '+967',
  phone: '',
  region: ''
})

const errors = reactive({})
const message = reactive({
  text: '',
  type: '' // 'success' or 'error'
})

// دالة الترجمة
const translate = (key) => {
  return t(key, props.language)
}

const steps = computed(() => [
  { number: 1, title: translate('registrationModal.steps.account') },
  { number: 2, title: translate('registrationModal.steps.personal') },
  { number: 3, title: translate('registrationModal.steps.verification') }
])

const isAccountValid = computed(() => {
  return form.name.trim() && 
         form.email.trim() && 
         form.password.length >= 6 && 
         form.password === form.password_confirmation
})

const isPersonalValid = computed(() => {
  return form.phone.length >= 9 && /^7\d{8}$/.test(form.phone)
})

const isVerificationComplete = computed(() => {
  return verificationCode.value.every(digit => digit !== '')
})

const showMessage = (text, type = 'success') => {
  message.text = text
  message.type = type
  setTimeout(() => {
    message.text = ''
    message.type = ''
  }, 5000)
}

const validateAccount = () => {
  // Reset errors
  Object.keys(errors).forEach(key => delete errors[key])

  if (!form.name.trim()) {
    errors.name = translate('registrationModal.accountStep.nameRequired')
  }

  if (!form.email.trim()) {
    errors.email = translate('registrationModal.accountStep.emailRequired')
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = translate('registrationModal.accountStep.emailInvalid')
  }

  if (form.password.length < 6) {
    errors.password = translate('registrationModal.accountStep.passwordMinLength')
  }

  if (form.password !== form.password_confirmation) {
    errors.password_confirmation = translate('registrationModal.accountStep.passwordMismatch')
  }

  return Object.keys(errors).length === 0
}

const validatePhone = () => {
  if (form.phone && !/^7\d{8}$/.test(form.phone)) {
    errors.phone = translate('registrationModal.personalStep.phoneError')
  } else {
    delete errors.phone
  }
}

const updateDialCode = () => {
  const country = countries.find(c => c.code === form.country)
  if (country) {
    form.dialCode = country.code
  }
}

const handleAccountSubmit = async () => {
  if (!validateAccount()) return
  
  isSubmitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    currentStep.value = 2
    showMessage(translate('registrationModal.success.accountInfoSaved'), 'success')
  } catch (error) {
    showMessage(translate('registrationModal.errors.accountSetup'), 'error')
  } finally {
    isSubmitting.value = false
  }
}

// 🔥 NEW: دالة محسنة لحفظ النتيجة بعد التسجيل
const saveAssessmentResult = async () => {
  try {
    // إذا كان هناك session key (من الاختبار السابق)
    const savedSessionKey = localStorage.getItem('pending_assessment_session')
    const scaleId = localStorage.getItem('pending_assessment_scale_id')
    
    if (savedSessionKey && scaleId) {
      console.log('💾 محاولة حفظ النتيجة بعد التسجيل:', { scaleId, savedSessionKey })
      
      const result = await frontendScalesStore.saveAssessmentResult(scaleId, savedSessionKey)
      console.log('✅ تم حفظ النتيجة بنجاح:', result)
      
      // تنظيف البيانات المؤقتة
      localStorage.removeItem('pending_assessment_session')
      localStorage.removeItem('pending_assessment_scale_id')
      
      return result
    } else {
      console.log('ℹ️ لا توجد نتيجة معلقة للحفظ')
    }
  } catch (error) {
    console.error('❌ خطأ في حفظ النتيجة بعد التسجيل:', error)
  }
  return null
}

// 🔥 NEW: دالة محسنة لتسجيل الدخول التلقائي بعد التسجيل
const autoLoginAfterRegistration = async () => {
  try {
    console.log('🔐 محاولة تسجيل الدخول التلقائي...')
    const loginResult = await authStore.login({
      email: form.email,
      password: form.password,
      remember: true
    })
    
    if (loginResult) {
      console.log('✅ تسجيل الدخول التلقائي ناجح')
      return true
    } else {
      console.error('❌ فشل تسجيل الدخول التلقائي')
      return false
    }
  } catch (error) {
    console.error('❌ خطأ في تسجيل الدخول التلقائي:', error)
    return false
  }
}

// 🔥 NEW: دالة handlePersonalSubmit المحسنة
const handlePersonalSubmit = async () => {
  if (!isPersonalValid.value) return
  
  isSubmitting.value = true
  try {
    const registerData = {
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation,
      phone: form.phone,
      country_code: form.dialCode,
      role: 'Client'
    }

    console.log('📤 بيانات التسجيل المرسلة:', registerData)
    
    const result = await authStore.register(registerData)
    
    if (result.success && result.requiresVerification) {
      console.log('📧 يتطلب التحقق من البريد الإلكتروني')
      currentStep.value = 3
      startResendCounter()
      showMessage(translate('registrationModal.success.verificationSent'), 'success')
    } else if (result.success) {
      console.log('✅ تم إنشاء الحساب بنجاح')
      showMessage(translate('registrationModal.success.accountCreated'), 'success')
      
      // 🔥 NEW: تسجيل الدخول التلقائي أولاً
      const loginSuccess = await autoLoginAfterRegistration()
      
      if (loginSuccess) {
        // 🔥 NEW: حفظ النتيجة بعد التسجيل
        console.log('💾 محاولة حفظ نتيجة الاختبار بعد التسجيل...')
        const savedResult = await saveAssessmentResult()
        
        // 🔥 NEW: إرسال النتيجة المحفوظة مع الحدث
        emit('registration-success', savedResult)
      } else {
        // إذا فشل تسجيل الدخول التلقائي، أرسل رسالة فقط
        emit('registration-success', null)
      }
    } else {
      // 🔥 NEW: معالجة الأخطاء من الباك إند
      console.error('❌ فشل في التسجيل:', result)
      if (result.errors) {
        handleBackendErrors(result.errors)
        showErrorMessage(translate('registrationModal.errors.validationErrors'))
      } else {
        showErrorMessage(translate('registrationModal.errors.registrationFailed'))
      }
    }
  } catch (error) {
    console.error('❌ خطأ في التسجيل:', error)
    showMessage(error.message || translate('registrationModal.errors.sendVerification'), 'error')
  } finally {
    isSubmitting.value = false
  }
}

const handleCodeInput = (index, event) => {
  const value = event.target.value
  if (value.length > 1) {
    verificationCode.value[index] = value.slice(-1)
  }
  
  if (value && index < 5) {
    const nextInput = event.target.nextElementSibling
    if (nextInput) nextInput.focus()
  }
}

const handleCodeKeydown = (index, event) => {
  if (event.key === 'Backspace' && !verificationCode.value[index] && index > 0) {
    const prevInput = event.target.previousElementSibling
    if (prevInput) prevInput.focus()
  }
}

// دالة لمعالجة الأخطاء من الباك إند
const handleBackendErrors = (backendErrors) => {
  // مسح الأخطاء القديمة
  Object.keys(errors).forEach(key => delete errors[key])
  
  // تعيين الأخطاء الجديدة
  if (backendErrors) {
    Object.keys(backendErrors).forEach(key => {
      errors[key] = Array.isArray(backendErrors[key]) ? backendErrors[key][0] : backendErrors[key]
    })
  }
}

// دالة لعرض رسالة خطأ عامة
const showErrorMessage = (errorText) => {
  showMessage(errorText, 'error')
}

// 🔥 NEW: دالة التحقق من البريد الإلكتروني المحسنة
const handleVerificationSubmit = async () => {
  if (!isVerificationComplete.value) return
  
  isSubmitting.value = true
  try {
    const code = verificationCode.value.join('')
    console.log('🔐 التحقق من الرمز:', { email: form.email, code })
    
    const success = await authStore.verifyEmail(form.email, code)
    
    if (success) {
      console.log('✅ تم التحقق من البريد الإلكتروني بنجاح')
      showMessage(translate('registrationModal.success.accountCreated'), 'success')
      
      // 🔥 NEW: تسجيل الدخول التلقائي بعد التحقق
      const loginSuccess = await autoLoginAfterRegistration()
      
      if (loginSuccess) {
        // 🔥 NEW: حفظ النتيجة بعد التحقق
        console.log('💾 محاولة حفظ نتيجة الاختبار بعد التحقق...')
        const savedResult = await saveAssessmentResult()
        
        // 🔥 NEW: إرسال النتيجة المحفوظة مع الحدث
        emit('registration-success', savedResult)
      } else {
        // إذا فشل تسجيل الدخول التلقائي، أرسل رسالة فقط
        emit('registration-success', null)
      }
    } else {
      throw new Error(translate('registrationModal.errors.verificationFailed'))
    }
    
  } catch (error) {
    console.error('❌ خطأ في التحقق:', error)
    showMessage(error.message || translate('registrationModal.errors.verifyCode'), 'error')
  } finally {
    isSubmitting.value = false
  }
}

const resendVerification = async () => {
  isSubmitting.value = true
  try {
    await authStore.resendVerificationCode(form.email)
    startResendCounter()
    showMessage(translate('registrationModal.success.codeResent'), 'success')
  } catch (error) {
    console.error('❌ خطأ في إعادة الإرسال:', error)
    showMessage(error.message || translate('registrationModal.errors.resendCode'), 'error')
  } finally {
    isSubmitting.value = false
  }
}

const startResendCounter = () => {
  resendCounter.value = 120
  const timer = setInterval(() => {
    resendCounter.value--
    if (resendCounter.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

const closeRegistrationModal = () => {
  emit('close')
  currentStep.value = 1
  isSubmitting.value = false
  resendCounter.value = 0
  verificationCode.value = ['', '', '', '', '', '']
  message.text = ''
  message.type = ''
  Object.assign(form, {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    country: '+967',
    dialCode: '+967',
    phone: '',
    region: ''
  })
  Object.keys(errors).forEach(key => delete errors[key])
}

onMounted(() => {
  updateDialCode()
})
</script>


<style scoped>
/* الأساسيات */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

.direction-ltr {
  direction: ltr !important;
}

.verification-input {
  direction: ltr;
  text-align: center;
}

/* تحسينات للغة العربية */
[dir="rtl"] .text-right {
  text-align: right;
}

[dir="rtl"] .text-left {
  text-align: left;
}

/* تحسينات للغة الإنجليزية */
[dir="ltr"] .text-right {
  text-align: right;
}

[dir="ltr"] .text-left {
  text-align: left;
}

/* تحسين المظهر العام للحقول */
input, select {
  transition: all 0.2s ease-in-out;
}

input:focus, select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

/* تحسين الخطوط للغة العربية */
[dir="rtl"] {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* تحسين الخطوط للغة الإنجليزية */
[dir="ltr"] {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* تحسين عرض الخطوات */
.step-connector {
  position: absolute;
  top: 1rem;
  height: 0.125rem;
  background-color: #e5e7eb;
  z-index: -1;
}

[dir="rtl"] .step-connector {
  left: 50%;
  width: 100%;
}

[dir="ltr"] .step-connector {
  right: 50%;
  width: 100%;
}

/* تحسين زر الإغلاق */
.close-btn {
  transition: all 0.2s ease-in-out;
}

.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* تحسين الرسائل */
.message-success {
  background-color: #f0fdf4;
  border-color: #bbf7d0;
  color: #166534;
}

.message-error {
  background-color: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}
</style>