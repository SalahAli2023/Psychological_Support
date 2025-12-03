<template>
  <div v-if="show" class="fixed inset-0 z-[10000] flex items-center justify-center p-4" :dir="language === 'ar' ? 'rtl' : 'ltr'">
    <div class="modal-overlay fixed inset-0 bg-black bg-opacity-50" @click="handleClose"></div>

    <div class="relative bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ getModalTitle() }}
          </h2>
          <button
            @click="handleClose"
            class="flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100"
          >
            <i class="fas fa-times text-lg"></i>
          </button>
        </div>
      </div>

      <div class="flex flex-col md:flex-row h-full">
        <!-- الصورة الجانبية - ثابتة الطول -->
        <div class="hidden md:block md:w-2/5 bg-brand-500 rounded-l-2xl overflow-hidden md:h-[calc(90vh-80px)]">
          <div class="h-full flex items-center justify-center p-8 sticky top-0">
            <div class="text-white text-center">
              <i :class="getSidebarIcon()" class="text-7xl mb-4 opacity-80"></i>
              <h3 class="text-2xl font-bold mb-4">
                {{ getSidebarTitle() }}
              </h3>
              <p class="text-lg opacity-90">
                {{ getSidebarMessage() }}
              </p>
            </div>
          </div>
        </div>

        <!-- المحتوى الرئيسي - قابل للتمرير -->
        <div class="w-full md:w-3/5 md:h-[calc(90vh-80px)] md:overflow-y-auto">
          <div class="p-6">
            <!-- تسجيل الدخول / تسجيل -->
            <div v-if="currentModal === 'auth'">
              <!-- Tabs -->
              <div class="flex border-b border-gray-200 mb-6">
                <button
                  @click="isLogin = true"
                  class="flex-1 py-3 text-sm font-medium transition-all"
                  :class="isLogin 
                    ? 'text-brand-500 border-b-2 border-brand-500' 
                    : 'text-gray-500 hover:text-gray-700'"
                >
                  {{ translate('authModal.login') }}
                </button>
                <button
                  @click="isLogin = false"
                  class="flex-1 py-3 text-sm font-medium transition-all"
                  :class="!isLogin 
                    ? 'text-accent-500 border-b-2 border-accent-500' 
                    : 'text-gray-500 hover:text-gray-700'"
                >
                  {{ translate('authModal.register') }}
                </button>
              </div>

              <form @submit.prevent="handleAuthSubmit" class="space-y-4">
                <!-- الاسم (للتسجيل فقط) -->
                <div v-if="!isLogin" class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    {{ translate('authModal.fullName') }}
                  </label>
                  <input
                    v-model="authForm.name"
                    type="text"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    :placeholder="translate('authModal.namePlaceholder')"
                    required
                  />
                </div>

                <!-- البريد الإلكتروني -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    {{ translate('authModal.email') }}
                  </label>
                  <input
                    v-model="authForm.email"
                    type="email"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <!-- كلمة المرور -->
                <div class="space-y-2 relative">
                  <label class="block text-sm font-medium text-gray-700">
                    {{ translate('authModal.password') }}
                  </label>
                  <input
                    v-model="authForm.password"
                    :type="showPassword ? 'text' : 'password'"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all pr-10"
                    :placeholder="translate('authModal.passwordPlaceholder')"
                    required
                    :minlength="isLogin ? 6 : 8"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute top-9 right-3 text-gray-500 hover:text-gray-700"
                  >
                    <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>

                <!-- تأكيد كلمة المرور (للتسجيل فقط) -->
                <div v-if="!isLogin" class="space-y-2 relative">
                  <label class="block text-sm font-medium text-gray-700">
                    {{ translate('authModal.confirmPassword') }}
                  </label>
                  <input
                    v-model="authForm.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all pr-10"
                    :placeholder="translate('authModal.confirmPasswordPlaceholder')"
                    required
                    minlength="8"
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute top-9 right-3 text-gray-500 hover:text-gray-700"
                  >
                    <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                </div>

                <!-- نسيان كلمة المرور -->
                <div v-if="isLogin" class="flex justify-end">
                  <button 
                    type="button" 
                    @click="showForgotPassword"
                    class="text-sm text-brand-500 hover:text-accent-500 transition-colors"
                  >
                    {{ translate('authModal.forgotPassword') }}
                  </button>
                </div>

                <!-- زر الإرسال -->
                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full py-3 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <i v-if="loading" class="fas fa-spinner fa-spin"></i>
                  <span>{{ isLogin ? translate('authModal.loginButton') : translate('authModal.registerButton') }}</span>
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

              <!-- فواصل -->
              <div class="flex items-center my-6">
                <div class="flex-1 border-t border-gray-200"></div>
                <span class="px-3 text-sm text-gray-500">{{ translate('authModal.or') }}</span>
                <div class="flex-1 border-t border-gray-200"></div>
              </div>

              <!-- تسجيل الدخول بالوسائط الاجتماعية -->
              <div class="space-y-3">
                <button
                  @click="loginWithGoogle"
                  class="w-full py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
                >
                  <i class="fab fa-google text-red-500"></i>
                  <span>{{ translate('authModal.continueWithGoogle') }}</span>
                </button>

                <button
                  @click="loginWithFacebook"
                  class="w-full py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
                >
                  <i class="fab fa-facebook text-blue-600"></i>
                  <span>{{ translate('authModal.continueWithFacebook') }}</span>
                </button>
              </div>

              <!-- رابط التحويل -->
              <div class="text-center mt-6">
                <p class="text-sm text-gray-600">
                  {{ isLogin ? translate('authModal.noAccount') : translate('authModal.haveAccount') }}
                  <button
                    type="button"
                    @click="isLogin = !isLogin"
                    class="text-brand-500 hover:text-accent-500 font-medium transition-colors"
                  >
                    {{ isLogin ? translate('authModal.registerHere') : translate('authModal.loginHere') }}
                  </button>
                </p>
              </div>
            </div>

            <!-- نسيان كلمة المرور -->
            <div v-else-if="currentModal === 'forgot'">
              <form @submit.prevent="handleForgotPassword" class="space-y-6">
                <!-- الرسالة التوضيحية -->
                <div class="text-center mb-6">
                  <div class="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                    <i class="fas fa-key text-blue-600 text-xl"></i>
                  </div>
                  <p class="text-gray-600">
                    {{ translate('forgotModal.description') }}
                  </p>
                </div>

                <!-- البريد الإلكتروني -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    {{ translate('forgotModal.email') }}
                  </label>
                  <input
                    v-model="forgotForm.email"
                    type="email"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                    placeholder="example@email.com"
                    required
                  />
                </div>

                <!-- زر الإرسال -->
                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full py-3 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <i v-if="loading" class="fas fa-spinner fa-spin"></i>
                  <span>{{ translate('forgotModal.sendCode') }}</span>
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

                <!-- العودة لتسجيل الدخول -->
                <div class="text-center">
                  <button
                    type="button"
                    @click="showAuth"
                    class="text-brand-500 hover:text-accent-500 font-medium transition-colors text-sm"
                  >
                    {{ translate('forgotModal.backToLogin') }}
                  </button>
                </div>
              </form>
            </div>

            <!-- التحقق من الرمز -->
            <div v-else-if="currentModal === 'verification'">
              <form @submit.prevent="handleVerification" class="space-y-6">
                <!-- الرسالة التوضيحية -->
                <div class="text-center mb-6">
                  <div class="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                    <i class="fas fa-envelope text-blue-600 text-xl"></i>
                  </div>
                  <p class="text-gray-600 mb-2">
                    {{ translate('verificationModal.description') }}
                  </p>
                  <p class="text-sm text-brand-500 font-medium">
                    {{ verificationEmail }}
                  </p>
                </div>

                <!-- حقل الرمز -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    {{ translate('verificationModal.code') }}
                  </label>
                  <div class="flex gap-3 justify-center">
                    <input
                      v-for="n in 6"
                      :key="n"
                      v-model="verificationCode[n-1]"
                      type="text"
                      maxlength="1"
                      class="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                      @input="handleCodeInput(n-1, $event)"
                      @keydown="handleCodeKeydown(n-1, $event)"
                      @paste="handlePaste"
                      ref="codeInputs"
                    />
                  </div>
                </div>

                <!-- العد التنازلي -->
                <div class="text-center">
                  <p class="text-sm text-gray-600">
                    {{ translate('verificationModal.resendIn') }}
                    <span class="font-mono text-brand-500">{{ countdown }} {{ translate('verificationModal.seconds') }}</span>
                  </p>
                  <button
                    v-if="canResend"
                    type="button"
                    @click="resendCode"
                    class="text-sm text-brand-500 hover:text-accent-500 transition-colors mt-2"
                  >
                    {{ translate('verificationModal.resendCode') }}
                  </button>
                </div>

                <!-- زر التحقق -->
                <button
                  type="submit"
                  :disabled="loading || !isCodeComplete"
                  class="w-full py-3 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <i v-if="loading" class="fas fa-spinner fa-spin"></i>
                  <span>{{ translate('verificationModal.verify') }}</span>
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

                <!-- تغيير البريد الإلكتروني -->
                <div class="text-center">
                  <button
                    type="button"
                    @click="showAuth"
                    class="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {{ translate('verificationModal.wrongEmail') }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

export default {
  name: 'AuthModal',
  props: {
    show: { type: Boolean, default: false },
    measure: { type: Object, default: null },
    language: { type: String, default: 'ar' }
  },
  emits: ['close', 'login-success', 'register-success', 'password-reset', 'show-results'],
  setup(props, { emit }) {
    const currentModal = ref('auth')
    const isLogin = ref(true)
    const loading = ref(false)
    const error = ref('')
    const success = ref('')
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const countdown = ref(60)
    const canResend = ref(false)
    const verificationEmail = ref('')
    const codeInputs = ref([])
    
    let countdownInterval = null

    const authForm = reactive({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    })

    const forgotForm = reactive({
      email: ''
    })

    const verificationCode = reactive(Array(6).fill(''))

    const translate = (key) => {
      const translations = {
        'authModal.loginTitle': { ar: 'تسجيل الدخول', en: 'Login' },
        'authModal.registerTitle': { ar: 'إنشاء حساب', en: 'Create Account' },
        'authModal.login': { ar: 'تسجيل الدخول', en: 'Login' },
        'authModal.register': { ar: 'إنشاء حساب', en: 'Register' },
        'authModal.fullName': { ar: 'الاسم الكامل', en: 'Full Name' },
        'authModal.namePlaceholder': { ar: 'أدخل اسمك الكامل', en: 'Enter your full name' },
        'authModal.email': { ar: 'البريد الإلكتروني', en: 'Email' },
        'authModal.password': { ar: 'كلمة المرور', en: 'Password' },
        'authModal.passwordPlaceholder': { ar: 'أدخل كلمة المرور', en: 'Enter your password' },
        'authModal.confirmPassword': { ar: 'تأكيد كلمة المرور', en: 'Confirm Password' },
        'authModal.confirmPasswordPlaceholder': { ar: 'أعد إدخال كلمة المرور', en: 'Re-enter your password' },
        'authModal.forgotPassword': { ar: 'نسيت كلمة المرور؟', en: 'Forgot Password?' },
        'authModal.loginButton': { ar: 'تسجيل الدخول', en: 'Login' },
        'authModal.registerButton': { ar: 'إنشاء حساب', en: 'Create Account' },
        'authModal.or': { ar: 'أو', en: 'Or' },
        'authModal.continueWithGoogle': { ar: 'المتابعة بجوجل', en: 'Continue with Google' },
        'authModal.continueWithFacebook': { ar: 'المتابعة بفيسبوك', en: 'Continue with Facebook' },
        'authModal.noAccount': { ar: 'ليس لديك حساب؟', en: "Don't have an account?" },
        'authModal.haveAccount': { ar: 'لديك حساب بالفعل؟', en: 'Already have an account?' },
        'authModal.registerHere': { ar: 'سجل هنا', en: 'Register here' },
        'authModal.loginHere': { ar: 'سجل الدخول هنا', en: 'Login here' },
        'authModal.passwordMismatch': { ar: 'كلمتا المرور غير متطابقتين', en: 'Passwords do not match' },
        'authModal.passwordTooShort': { ar: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل', en: 'Password must be at least 8 characters' },
        'authModal.loginSuccess': { ar: 'تم تسجيل الدخول بنجاح', en: 'Login successful' },
        'authModal.registerSuccess': { ar: 'تم إنشاء الحساب بنجاح', en: 'Account created successfully' },
        'authModal.generalError': { ar: 'حدث خطأ، يرجى المحاولة مرة أخرى', en: 'An error occurred, please try again' },
        'authModal.welcomeBack': { ar: 'مرحباً بعودتك!', en: 'Welcome Back!' },
        'authModal.joinUs': { ar: 'انضم إلينا!', en: 'Join Us!' },
        'authModal.welcomeMessage': { ar: 'نحن سعداء برؤيتك مرة أخرى!', en: 'We are happy to see you again!' },
        'authModal.joinMessage': { ar: 'انضم إلى مجتمعنا واستمتع بجميع المزايا', en: 'Join our community and enjoy all benefits' },

        'forgotModal.title': { ar: 'نسيت كلمة المرور', en: 'Forgot Password' },
        'forgotModal.description': { ar: 'أدخل بريدك الإلكتروني وسنرسل لك رمز التحقق لإعادة تعيين كلمة المرور', en: 'Enter your email and we will send you a verification code to reset your password' },
        'forgotModal.email': { ar: 'البريد الإلكتروني', en: 'Email' },
        'forgotModal.sendCode': { ar: 'إرسال رمز التحقق', en: 'Send Verification Code' },
        'forgotModal.backToLogin': { ar: 'العودة لتسجيل الدخول', en: 'Back to Login' },
        'forgotModal.success': { ar: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني', en: 'Verification code has been sent to your email' },

        'verificationModal.title': { ar: 'التحقق من البريد الإلكتروني', en: 'Email Verification' },
        'verificationModal.description': { ar: 'أدخل الرمز المكون من 6 أرقام الذي أرسلناه إلى', en: 'Enter the 6-digit code we sent to' },
        'verificationModal.code': { ar: 'رمز التحقق', en: 'Verification Code' },
        'verificationModal.verify': { ar: 'تحقق', en: 'Verify' },
        'verificationModal.resendIn': { ar: 'إعادة الإرسال خلال', en: 'Resend in' },
        'verificationModal.seconds': { ar: 'ثانية', en: 'seconds' },
        'verificationModal.resendCode': { ar: 'إعادة إرسال الرمز', en: 'Resend Code' },
        'verificationModal.wrongEmail': { ar: 'البريد الإلكتروني خاطئ؟', en: 'Wrong email?' },
        'verificationModal.success': { ar: 'تم التحقق بنجاح', en: 'Verification successful' },
        'verificationModal.error': { ar: 'رمز التحقق غير صحيح', en: 'Invalid verification code' }
      }
      
      if (translations[key]) {
        return translations[key][props.language] || translations[key].ar
      }
      
      return key
    }

    const getModalTitle = () => {
      switch (currentModal.value) {
        case 'forgot': return translate('forgotModal.title')
        case 'verification': return translate('verificationModal.title')
        default: return isLogin.value ? translate('authModal.loginTitle') : translate('authModal.registerTitle')
      }
    }

    const getSidebarIcon = () => {
      switch (currentModal.value) {
        case 'forgot': return 'fas fa-key'
        case 'verification': return 'fas fa-envelope'
        default: return 'fas fa-user-circle'
      }
    }

    const getSidebarTitle = () => {
      switch (currentModal.value) {
        case 'forgot': return translate('forgotModal.title')
        case 'verification': return translate('verificationModal.title')
        default: return isLogin.value ? translate('authModal.welcomeBack') : translate('authModal.joinUs')
      }
    }

    const getSidebarMessage = () => {
      switch (currentModal.value) {
        case 'forgot': return translate('forgotModal.description')
        case 'verification': return translate('verificationModal.description')
        default: return isLogin.value ? translate('authModal.welcomeMessage') : translate('authModal.joinMessage')
      }
    }

    const showForgotPassword = () => {
      currentModal.value = 'forgot'
      forgotForm.email = authForm.email
    }

    const showAuth = () => {
      currentModal.value = 'auth'
      resetForms()
    }

    const showVerification = (email) => {
      currentModal.value = 'verification'
      verificationEmail.value = email
      startCountdown()
      setTimeout(() => {
        codeInputs.value[0]?.focus()
      }, 100)
    }

    const resetForms = () => {
      error.value = ''
      success.value = ''
      loading.value = false
    }

    const handleClose = () => {
      currentModal.value = 'auth'
      resetForms()
      emit('close')
    }

    const handleAuthSubmit = async () => {
      try {
        loading.value = true
        error.value = ''
        success.value = ''

        if (!isLogin.value && authForm.password !== authForm.confirmPassword) {
          error.value = translate('authModal.passwordMismatch')
          return
        }

        if (!isLogin.value && authForm.password.length < 8) {
          error.value = translate('authModal.passwordTooShort')
          return
        }

        await new Promise(resolve => setTimeout(resolve, 1500))
        
        if (isLogin.value) {
          success.value = translate('authModal.loginSuccess')
          
          const userData = {
            email: authForm.email,
            name: authForm.name || 'مستخدم',
            id: Date.now().toString()
          }
          
          // حفظ بيانات المستخدم في localStorage
          localStorage.setItem('userData', JSON.stringify(userData))
          localStorage.setItem('authToken', 'mock-jwt-token-' + Date.now())
          localStorage.setItem('isLoggedIn', 'true')
          
          setTimeout(() => {
            emit('close')
            setTimeout(() => {
              emit('login-success', userData)
              // إرسال حدث لعرض النتائج
              emit('show-results')
            }, 300)
          }, 1000)
        } else {
          success.value = 'سيتم إرسال رمز التحقق إلى بريدك الإلكتروني'
          setTimeout(() => showVerification(authForm.email), 1500)
        }

      } catch (err) {
        error.value = err.message || translate('authModal.generalError')
      } finally {
        loading.value = false
      }
    }

    const handleForgotPassword = async () => {
      try {
        loading.value = true
        error.value = ''
        success.value = ''

        await new Promise(resolve => setTimeout(resolve, 1500))
        
        success.value = translate('forgotModal.success')
        setTimeout(() => showVerification(forgotForm.email), 1500)

      } catch (err) {
        error.value = err.message || 'حدث خطأ أثناء إرسال الرمز'
      } finally {
        loading.value = false
      }
    }

    const isCodeComplete = () => {
      return verificationCode.every(digit => digit !== '')
    }

    const handleCodeInput = (index, event) => {
      const value = event.target.value
      
      if (!/^\d?$/.test(value)) {
        verificationCode[index] = ''
        return
      }
      
      verificationCode[index] = value
      
      if (value && index < 5) {
        codeInputs.value[index + 1]?.focus()
      }
      
      if (!value && index > 0) {
        codeInputs.value[index - 1]?.focus()
      }
    }

    const handleCodeKeydown = (index, event) => {
      if (event.key === 'Backspace' && !verificationCode[index] && index > 0) {
        codeInputs.value[index - 1]?.focus()
      }
    }

    const handlePaste = (event) => {
      event.preventDefault()
      const pastedData = event.clipboardData.getData('text')
      const digits = pastedData.replace(/\D/g, '').split('').slice(0, 6)
      
      digits.forEach((digit, index) => {
        if (index < 6) {
          verificationCode[index] = digit
        }
      })
      
      const lastFilledIndex = digits.length - 1
      if (lastFilledIndex < 5) {
        codeInputs.value[lastFilledIndex + 1]?.focus()
      } else {
        codeInputs.value[5]?.focus()
      }
    }

    const startCountdown = () => {
      countdown.value = 60
      canResend.value = false
      
      countdownInterval = setInterval(() => {
        countdown.value--
        
        if (countdown.value <= 0) {
          clearInterval(countdownInterval)
          canResend.value = true
        }
      }, 1000)
    }

    const resendCode = async () => {
      try {
        loading.value = true
        error.value = ''
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('إعادة إرسال الرمز إلى:', verificationEmail.value)
        startCountdown()
        
      } catch (err) {
        error.value = 'فشل في إعادة إرسال الرمز'
      } finally {
        loading.value = false
      }
    }

    const handleVerification = async () => {
      try {
        if (!isCodeComplete()) {
          error.value = 'يرجى إدخال رمز التحقق بالكامل'
          return
        }

        loading.value = true
        error.value = ''
        success.value = ''

        const code = verificationCode.join('')
        
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        if (code === '123456') {
          success.value = translate('verificationModal.success')
          
          const userData = {
            email: verificationEmail.value,
            name: authForm.name || 'مستخدم جديد',
            id: Date.now().toString()
          }
          
          // حفظ بيانات المستخدم في localStorage
          localStorage.setItem('userData', JSON.stringify(userData))
          localStorage.setItem('authToken', 'mock-jwt-token-' + Date.now())
          localStorage.setItem('isLoggedIn', 'true')
          
          setTimeout(() => {
            currentModal.value = 'auth'
            resetForms()
            
            emit('close')
            setTimeout(() => {
              if (verificationEmail.value === forgotForm.email) {
                emit('password-reset', userData)
              } else {
                emit('register-success', userData)
              }
              // إرسال حدث لعرض النتائج
              emit('show-results')
            }, 300)
          }, 1000)
        } else {
          error.value = translate('verificationModal.error')
        }

      } catch (err) {
        error.value = err.message || translate('verificationModal.error')
      } finally {
        loading.value = false
      }
    }

    const loginWithGoogle = () => {
      console.log('تسجيل الدخول بجوجل')
    }

    const loginWithFacebook = () => {
      console.log('تسجيل الدخول بفيسبوك')
    }

    onMounted(() => {
      if (countdownInterval) {
        clearInterval(countdownInterval)
      }
    })

    onUnmounted(() => {
      if (countdownInterval) {
        clearInterval(countdownInterval)
      }
    })

    return {
      currentModal,
      isLogin,
      loading,
      error,
      success,
      showPassword,
      showConfirmPassword,
      countdown,
      canResend,
      verificationEmail,
      codeInputs,
      authForm,
      forgotForm,
      verificationCode,
      handleAuthSubmit,
      handleForgotPassword,
      handleVerification,
      handleClose,
      showForgotPassword,
      showAuth,
      showVerification,
      getModalTitle,
      getSidebarIcon,
      getSidebarTitle,
      getSidebarMessage,
      handleCodeInput,
      handleCodeKeydown,
      handlePaste,
      resendCode,
      isCodeComplete,
      loginWithGoogle,
      loginWithFacebook,
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

/* تعريف الألوان المخصصة */
:root {
  --brand-500: #9EBF3B;
  --brand-600: #8cad35;
  --accent-500: #D6A29A;
  --accent-600: #c98f86;
}

.bg-brand-500 {
  background-color: var(--brand-500);
}

.hover\:bg-brand-600:hover {
  background-color: var(--brand-600);
}

.text-brand-500 {
  color: var(--brand-500);
}

.border-brand-500 {
  border-color: var(--brand-500);
}

.text-accent-500 {
  color: var(--accent-500);
}

.border-accent-500 {
  border-color: var(--accent-500);
}

.hover\:text-accent-500:hover {
  color: var(--accent-500);
}

.focus\:ring-brand-500:focus {
  --tw-ring-color: var(--brand-500);
}

/* تنسيقات التمرير */
.md\:h-\[calc\(90vh-80px\)\] {
  height: calc(90vh - 80px);
}

.md\:overflow-y-auto {
  overflow-y: auto;
}

/* تخصيص شريط التمرير */
.md\:overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.md\:overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.md\:overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.md\:overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>