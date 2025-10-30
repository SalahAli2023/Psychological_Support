<template>
  <div>
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-3">أنشئ حسابك</h1>
      <p class="text-gray-600 text-lg">
        انضم إلى مجتمع نفساني وابدأ رحلتك في فهم الصحة النفسية
      </p>
    </div>

    <!-- خطوات التسجيل -->
    <div class="flex justify-between items-center mb-8">
      <div 
        v-for="step in steps" 
        :key="step.number"
        class="flex flex-col items-center relative flex-1"
        :class="{ 'active': currentStep === step.number, 'completed': currentStep > step.number }"
      >
        <div class="w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 transition-colors z-10"
             :class="currentStep >= step.number ? 'bg-primary-green border-primary-green' : 'bg-white border-gray-300'">
          <span v-if="currentStep > step.number" class="text-white font-bold">
            <i class="fas fa-check"></i>
          </span>
          <span v-else class="font-bold" :class="currentStep >= step.number ? 'text-white' : 'text-gray-500'">
            {{ step.number }}
          </span>
        </div>
        <span class="text-sm text-center font-medium" 
              :class="currentStep >= step.number ? 'text-primary-green' : 'text-gray-500'">
          {{ step.title }}
        </span>
        <div v-if="step.number < 3" class="absolute top-5 right-1/2 w-full h-0.5 bg-gray-300 -z-10"
             :class="currentStep > step.number ? 'bg-primary-green' : ''"></div>
      </div>
    </div>

    <!-- محتوى الخطوات -->
    <div class="min-h-96">
      <!-- الخطوة 1: رقم الجوال -->
      <div v-if="currentStep === 1" class="space-y-6">
        <h3 class="text-xl font-semibold text-center text-gray-800 mb-6">أدخل رقم الجوال</h3>
        
        <form @submit.prevent="handlePhoneSubmit" class="space-y-6">
          <!-- الدولة -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3 text-right">الدولة/المنطقة</label>
            <div class="relative">
              <select 
                v-model="form.country"
                @change="updateDialCode"
                class="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-green focus:border-transparent appearance-none bg-white pr-4 text-lg"
              >
                <option value="">اختر الدولة</option>
                <option 
                  v-for="country in countries" 
                  :key="country.code"
                  :value="country.code"
                >
                  {{ country.name }} {{ country.flag }}
                </option>
              </select>
              <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                <i class="fas fa-chevron-down"></i>
              </div>
            </div>
          </div>

          <!-- رقم الجوال -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3 text-right">رقم الجوال</label>
            <div class="flex gap-3">
              <div class="flex-shrink-0 w-28 px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-center text-gray-700 text-lg font-medium">
                {{ form.dialCode }}
              </div>
              <input 
                v-model="form.phone"
                type="tel"
                placeholder="7xxxxxxxx"
                @input="validatePhone"
                class="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-green focus:border-transparent text-lg"
                :class="errors.phone ? 'border-red-500' : ''"
              >
            </div>
            <p v-if="errors.phone" class="text-red-500 text-sm mt-2 text-right">{{ errors.phone }}</p>
          </div>

          <button 
            type="submit"
            :disabled="!isPhoneValid || isSubmitting"
            class="w-full py-4 bg-primary-green text-white rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
          >
            <span v-if="!isSubmitting">متابعة</span>
            <span v-else class="flex items-center justify-center gap-3">
              <div class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              جاري الإرسال
            </span>
          </button>
        </form>

        <div v-if="isPage" class="text-center pt-6 border-t border-gray-200">
          <p class="text-gray-600">
            لديك حساب بالفعل؟
            <a href="/login" class="text-primary-green hover:text-opacity-80 font-bold mr-1">سجل الدخول</a>
          </p>
        </div>
      </div>

      <!-- الخطوة 2: رمز التحقق -->
      <div v-if="currentStep === 2" class="space-y-6">
        <h3 class="text-xl font-semibold text-center text-gray-800 mb-6">تحقق من رقم الجوال</h3>
        
        <form @submit.prevent="handleOtpSubmit" class="space-y-6">
          <div class="text-center space-y-3">
            <p class="text-gray-600 text-lg">أدخل رمز التحقق المرسل إلى الرقم</p>
            <p class="font-semibold text-primary-green text-xl">{{ form.dialCode }} {{ form.phone }}</p>
            <p class="text-gray-500">عبر {{ selectedMethod === 'sms' ? 'الرسالة النصية' : 'الواتس آب' }}</p>
          </div>

          <!-- OTP Inputs -->
          <div class="flex justify-center gap-4">
            <input 
              v-for="n in 4"
              :key="n"
              v-model="otp[n-1]"
              type="number"
              maxlength="1"
              @input="handleOtpInput(n-1, $event)"
              @keydown="handleOtpKeydown(n-1, $event)"
              class="w-20 h-20 text-center text-3xl font-bold border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-green focus:border-transparent"
            >
          </div>

          <!-- OTP Actions -->
          <div class="text-center space-y-4">
            <div v-if="resendCounter > 0" class="text-gray-600 text-lg">
              <span>إعادة الإرسال خلال</span>
              <span class="font-semibold mx-2">{{ formatTime(resendCounter) }}</span>
            </div>
            <button 
              v-else
              type="button"
              @click="resendOtp"
              class="text-primary-green hover:text-opacity-80 font-bold text-lg transition-colors"
            >
              إعادة إرسال رمز التحقق
            </button>
            
            <div class="space-y-2">
              <button 
                type="button"
                @click="showMethodModal = true"
                class="text-gray-600 hover:text-gray-800 block mx-auto transition-colors text-lg"
              >
                تغيير طريقة الإرسال
              </button>
              
              <button 
                type="button"
                @click="currentStep = 1"
                class="text-gray-600 hover:text-gray-800 block mx-auto transition-colors text-lg"
              >
                تعديل رقم الجوال
              </button>
            </div>
          </div>

          <button 
            type="submit"
            :disabled="!isOtpComplete || isSubmitting"
            class="w-full py-4 bg-primary-green text-white rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
          >
            <span v-if="!isSubmitting">تأكيد</span>
            <span v-else class="flex items-center justify-center gap-3">
              <div class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              جاري التحقق
            </span>
          </button>
        </form>
      </div>

      <!-- الخطوة 3: المعلومات الشخصية -->
      <div v-if="currentStep === 3" class="space-y-6">
        <h3 class="text-xl font-semibold text-center text-gray-800 mb-6">المعلومات الشخصية</h3>
        
        <form @submit.prevent="handleInfoSubmit" class="space-y-6">
          <!-- الاسم -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3 text-right">الاسم الكامل</label>
            <input 
              v-model="form.name"
              type="text"
              placeholder="أدخل اسمك الكامل"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-green focus:border-transparent text-lg"
              :class="errors.name ? 'border-red-500' : ''"
            >
            <p v-if="errors.name" class="text-red-500 text-sm mt-2 text-right">{{ errors.name }}</p>
          </div>

          <!-- البريد الإلكتروني -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3 text-right">البريد الإلكتروني (اختياري)</label>
            <input 
              v-model="form.email"
              type="email"
              placeholder="أدخل بريدك الإلكتروني"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-green focus:border-transparent text-lg"
              :class="errors.email ? 'border-red-500' : ''"
            >
            <p v-if="errors.email" class="text-red-500 text-sm mt-2 text-right">{{ errors.email }}</p>
          </div>

          <button 
            type="submit"
            :disabled="!form.name || isSubmitting"
            class="w-full py-4 bg-primary-green text-white rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
          >
            <span v-if="!isSubmitting">إنشاء الحساب</span>
            <span v-else class="flex items-center justify-center gap-3">
              <div class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              جاري إنشاء الحساب
            </span>
          </button>
        </form>
      </div>

      <!-- الخطوة 4: النجاح -->
      <div v-if="currentStep === 4" class="text-center space-y-8 py-8">
        <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="fas fa-check text-4xl text-primary-green"></i>
        </div>
        
        <h3 class="text-2xl font-bold text-gray-800">تم إنشاء حسابك بنجاح! 🎉</h3>
        <p class="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
          مرحباً بك في مجتمع نفساني. يمكنك الآن تحميل التطبيق والاستمتاع بخدمات الصحة النفسية التي نقدمها
        </p>

        <!-- Download Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <a href="https://apps.apple.com/app/id1244654624?mt=8" target="_blank" 
             class="flex items-center justify-center gap-4 px-6 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors min-w-[200px]">
            <i class="fab fa-apple text-2xl"></i>
            <div class="text-right">
              <div class="text-xs opacity-80">Download on the</div>
              <div class="font-bold text-lg">App Store</div>
            </div>
          </a>
          
          <a href="https://play.google.com/store/apps/details?id=com.labayh" target="_blank" 
             class="flex items-center justify-center gap-4 px-6 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors min-w-[200px]">
            <i class="fab fa-google-play text-2xl"></i>
            <div class="text-right">
              <div class="text-xs opacity-80">Get it on</div>
              <div class="font-bold text-lg">Google Play</div>
            </div>
          </a>
        </div>

        <div class="pt-6">
          <button 
            @click="handleRegistrationSuccess"
            class="px-12 py-4 bg-primary-green text-white rounded-xl hover:bg-opacity-90 transition-all font-bold text-lg"
          >
            ابدأ رحلتك
          </button>
        </div>
      </div>
    </div>

    <!-- Modal اختيار طريقة الإرسال -->
    <VerificationMethodModal
      :show="showMethodModal"
      :initial-method="selectedMethod"
      @close="showMethodModal = false"
      @confirm="handleMethodConfirm"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useNotifications } from '@/composables/useNotifications'
import { useProfile } from '@/composables/useProfile'
import { countries } from '@/data/countries'
import VerificationMethodModal from '@/components/frontend/auth/VerificationMethodModal.vue'

const props = defineProps({
  isPage: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['registration-success'])

const { showSuccess, showError } = useNotifications()
const { login } = useProfile()

const currentStep = ref(1)
const isSubmitting = ref(false)
const resendCounter = ref(0)
const otp = ref(['', '', '', ''])
const showMethodModal = ref(false)
const selectedMethod = ref('sms')

const form = reactive({
  country: '+967',
  dialCode: '+967',
  phone: '',
  name: '',
  email: ''
})

const errors = reactive({})

const steps = [
  { number: 1, title: 'رقم الجوال' },
  { number: 2, title: 'رمز التحقق' },
  { number: 3, title: 'المعلومات الشخصية' }
]

const isPhoneValid = computed(() => {
  return form.phone.length >= 9 && /^7\d{8}$/.test(form.phone)
})

const isOtpComplete = computed(() => {
  return otp.value.every(digit => digit !== '')
})

const validatePhone = () => {
  if (form.phone && !/^7\d{8}$/.test(form.phone)) {
    errors.phone = 'يجب أن يبدأ رقم الجوال بـ 7 ويحتوي على 9 أرقام'
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

const handlePhoneSubmit = async () => {
  if (!isPhoneValid.value) return
  
  isSubmitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    showMethodModal.value = true
  } catch (error) {
    showError('حدث خطأ أثناء التحقق من الرقم')
  } finally {
    isSubmitting.value = false
  }
}

const handleMethodConfirm = async (method) => {
  selectedMethod.value = method
  isSubmitting.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    currentStep.value = 2
    startResendCounter()
    showSuccess(`تم إرسال رمز التحقق ${method === 'sms' ? 'عبر الرسالة النصية' : 'عبر الواتس آب'}`)
  } catch (error) {
    showError('حدث خطأ أثناء إرسال رمز التحقق')
  } finally {
    isSubmitting.value = false
  }
}

const handleOtpInput = (index, event) => {
  const value = event.target.value
  if (value.length > 1) {
    otp.value[index] = value.slice(-1)
  }
  
  if (value && index < 3) {
    const nextInput = event.target.nextElementSibling
    if (nextInput) nextInput.focus()
  }
}

const handleOtpKeydown = (index, event) => {
  if (event.key === 'Backspace' && !otp.value[index] && index > 0) {
    const prevInput = event.target.previousElementSibling
    if (prevInput) prevInput.focus()
  }
}

const handleOtpSubmit = async () => {
  if (!isOtpComplete.value) return
  
  isSubmitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    currentStep.value = 3
    showSuccess('تم التحقق من رقم الجوال بنجاح')
  } catch (error) {
    showError('رمز التحقق غير صحيح')
  } finally {
    isSubmitting.value = false
  }
}

const handleInfoSubmit = async () => {
  if (!form.name.trim()) {
    errors.name = 'الاسم مطلوب'
    return
  }
  
  isSubmitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const userData = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      phone: form.dialCode + form.phone,
      createdAt: new Date().toISOString()
    }
    
    login(userData)
    currentStep.value = 4
    showSuccess('تم إنشاء الحساب بنجاح!')
    
  } catch (error) {
    showError('حدث خطأ أثناء إنشاء الحساب')
  } finally {
    isSubmitting.value = false
  }
}

const handleRegistrationSuccess = () => {
  emit('registration-success')
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

const resendOtp = async () => {
  isSubmitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    startResendCounter()
    showSuccess(`تم إعادة إرسال رمز التحقق ${selectedMethod.value === 'sms' ? 'عبر الرسالة النصية' : 'عبر الواتس آب'}`)
  } catch (error) {
    showError('حدث خطأ أثناء إعادة الإرسال')
  } finally {
    isSubmitting.value = false
  }
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

onMounted(() => {
  updateDialCode()
})
</script>

<style scoped>
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>