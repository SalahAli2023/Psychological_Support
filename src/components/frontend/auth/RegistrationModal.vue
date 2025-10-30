<template>
  <div v-if="showRegistration" class="registration-modal">
    <div class="modal-overlay" @click="closeRegistration">
      <div class="modal-content" @click.stop>
        <!-- Header -->
        <div class="modal-header">
          <div class="header-content">
            <h2>التسجيل</h2>
            <p class="notice-yellow">يجب عليك أولاً التسجيل في تطبيق نفساني لتتمكن من البدء بالمقاييس، ولنشاركك رحلة المعرفة حول الصحة النفسية</p>
          </div>
          <button @click="closeRegistration" class="close-button">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <!-- خطوات التسجيل -->
          <div class="wizard-nav">
            <div class="wizard-steps">
              <div class="wizard-step" :class="{ 'active': currentStep === 1, 'completed': currentStep > 1 }">
                <span class="step-point">
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M24.0847 3.9275C25.3051 5.16416 25.3051 7.16918 24.0847 8.40584L11.5847 21.0725C10.3643 22.3092 8.38568 22.3092 7.16529 21.0725L0.915291 14.7392C-0.305097 13.5025 -0.305097 11.4975 0.915291 10.2608C2.13568 9.02417 4.11432 9.02417 5.33471 10.2608L9.375 14.355L19.6653 3.9275C20.8857 2.69083 22.8643 2.69083 24.0847 3.9275Z" :fill="currentStep >= 1 ? 'white' : '#A1B0D5'"/>
                  </svg>
                </span>
                <span class="step-title">رقم الجوال</span>
              </div>
              
              <div class="wizard-step" :class="{ 'active': currentStep === 2, 'completed': currentStep > 2 }">
                <span class="step-point">
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M24.0847 3.9275C25.3051 5.16416 25.3051 7.16918 24.0847 8.40584L11.5847 21.0725C10.3643 22.3092 8.38568 22.3092 7.16529 21.0725L0.915291 14.7392C-0.305097 13.5025 -0.305097 11.4975 0.915291 10.2608C2.13568 9.02417 4.11432 9.02417 5.33471 10.2608L9.375 14.355L19.6653 3.9275C20.8857 2.69083 22.8643 2.69083 24.0847 3.9275Z" :fill="currentStep >= 2 ? 'white' : '#A1B0D5'"/>
                  </svg>
                </span>
                <span class="step-title">رمز التحقق</span>
              </div>
              
              <div class="wizard-step" :class="{ 'active': currentStep === 3, 'completed': currentStep > 3 }">
                <span class="step-point">
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M24.0847 3.9275C25.3051 5.16416 25.3051 7.16918 24.0847 8.40584L11.5847 21.0725C10.3643 22.3092 8.38568 22.3092 7.16529 21.0725L0.915291 14.7392C-0.305097 13.5025 -0.305097 11.4975 0.915291 10.2608C2.13568 9.02417 4.11432 9.02417 5.33471 10.2608L9.375 14.355L19.6653 3.9275C20.8857 2.69083 22.8643 2.69083 24.0847 3.9275Z" :fill="currentStep >= 3 ? 'white' : '#A1B0D5'"/>
                  </svg>
                </span>
                <span class="step-title">المعلومات الشخصية</span>
              </div>
            </div>
          </div>

          <!-- محتوى الخطوات -->
          <div class="wizard-content">
            <!-- الخطوة 1: رقم الجوال -->
            <div v-if="currentStep === 1" class="step-content">
              <h3>أدخل رقم الجوال</h3>

              <form @submit.prevent="handlePhoneSubmit" class="step-form">
                <!-- الدولة -->
                <div class="form-group">
                  <label>الدولة/المنطقة</label>
                  <div class="select-wrapper">
                    <select 
                      v-model="form.country"
                      class="form-select"
                      @change="updateDialCode"
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
                  </div>
                </div>

                <!-- رقم الجوال -->
                <div class="form-group">
                  <label>رقم الجوال</label>
                  <div class="phone-input">
                    <div class="dial-code">{{ form.dialCode }}</div>
                    <input 
                      v-model="form.phone"
                      type="tel"
                      placeholder="7xxxxxxxx"
                      class="form-input"
                      :class="{ 'error': errors.phone }"
                      @input="validatePhone"
                    >
                  </div>
                  <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
                </div>

                <!-- زر المتابعة -->
                <button 
                  type="submit"
                  :disabled="!isPhoneValid || isSubmitting"
                  class="submit-button bg-primary-green hover:bg-opacity-90"
                >
                  <span v-if="!isSubmitting">متابعة</span>
                  <span v-else class="loading">
                    <div class="loader"></div>
                    جاري الإرسال
                  </span>
                </button>
              </form>
            </div>

            <!-- الخطوة 2: رمز التحقق -->
            <div v-if="currentStep === 2" class="step-content">
              <h3>تحقق من رقم الجوال</h3>

              <form @submit.prevent="handleOtpSubmit" class="step-form">
                <div class="verification-info">
                  <p>أدخل رمز التحقق المرسل إلى الرقم</p>
                  <p class="phone-number text-primary-green">{{ form.dialCode }} {{ form.phone }}</p>
                </div>

                <!-- مدخلات رمز التحقق -->
                <div class="otp-inputs">
                  <input 
                    v-for="n in 4"
                    :key="n"
                    v-model="otp[n-1]"
                    type="number"
                    maxlength="1"
                    class="otp-input"
                    @input="handleOtpInput(n-1, $event)"
                    @keydown="handleOtpKeydown(n-1, $event)"
                  >
                </div>

                <!-- إعادة الإرسال -->
                <div class="otp-actions">
                  <div v-if="resendCounter > 0" class="resend-timer">
                    <span>إعادة الإرسال خلال</span>
                    <span class="timer">{{ formatTime(resendCounter) }}</span>
                  </div>
                  <button 
                    v-else
                    type="button"
                    @click="resendOtp"
                    class="resend-button text-primary-green hover:text-opacity-80"
                  >
                    إعادة إرسال رمز التحقق
                  </button>
                  
                  <button 
                    type="button"
                    @click="currentStep = 1"
                    class="edit-phone text-gray-600 hover:text-gray-800"
                  >
                    تعديل رقم الجوال
                  </button>
                </div>

                <!-- زر التأكيد -->
                <button 
                  type="submit"
                  :disabled="!isOtpComplete || isSubmitting"
                  class="submit-button bg-primary-green hover:bg-opacity-90"
                >
                  <span v-if="!isSubmitting">تأكيد</span>
                  <span v-else class="loading">
                    <div class="loader"></div>
                    جاري التحقق
                  </span>
                </button>
              </form>
            </div>

            <!-- الخطوة 3: المعلومات الشخصية -->
            <div v-if="currentStep === 3" class="step-content">
              <h3>المعلومات الشخصية</h3>

              <form @submit.prevent="handleInfoSubmit" class="step-form">
                <!-- الاسم -->
                <div class="form-group">
                  <label>الاسم الكامل</label>
                  <input 
                    v-model="form.name"
                    type="text"
                    placeholder="أدخل اسمك"
                    class="form-input"
                    :class="{ 'error': errors.name }"
                  >
                  <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
                </div>

                <!-- البريد الإلكتروني -->
                <div class="form-group">
                  <label>البريد الإلكتروني (اختياري)</label>
                  <input 
                    v-model="form.email"
                    type="email"
                    placeholder="أدخل بريدك الإلكتروني"
                    class="form-input"
                    :class="{ 'error': errors.email }"
                  >
                  <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
                </div>

                <!-- زر التأكيد -->
                <button 
                  type="submit"
                  :disabled="!form.name || isSubmitting"
                  class="submit-button bg-primary-green hover:bg-opacity-90"
                >
                  <span v-if="!isSubmitting">تأكيد</span>
                  <span v-else class="loading">
                    <div class="loader"></div>
                    جاري إنشاء الحساب
                  </span>
                </button>
              </form>
            </div>

            <!-- الخطوة 4: النجاح -->
            <div v-if="currentStep === 4" class="step-content success-step">
              <h3>شكراً لك</h3>
              <p class="success-message">
                لقد تم تسجيلك بنجاح في تطبيق نفساني. يمكنك الآن تحميل التطبيق والاستمتاع بخدمات الصحة النفسية التي يقدمها نفساني
              </p>

              <!-- أزرار التحميل -->
              <div class="download-buttons">
                <a href="https://apps.apple.com/app/id1244654624?mt=8" target="_blank" class="download-button apple">
                  <i class="fab fa-apple"></i>
                  <div class="button-text">
                    <div class="sub-text">Available on</div>
                    <div class="main-text">App Store</div>
                  </div>
                </a>
                
                <a href="https://play.google.com/store/apps/details?id=com.labayh" target="_blank" class="download-button google">
                  <i class="fab fa-google-play"></i>
                  <div class="button-text">
                    <div class="sub-text">Available on</div>
                    <div class="main-text">Google Play</div>
                  </div>
                </a>
              </div>

              <!-- زر البدء -->
              <button 
                @click="handleRegistrationSuccess"
                class="start-button bg-primary-green hover:bg-opacity-90"
              >
                ابدأ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useNotifications } from '../../../composables/useNotifications'
import { useProfile } from '../../../composables/useProfile'

const props = defineProps({
  showRegistration: {
    type: Boolean,
    default: false
  }
})

const { showSuccess, showError } = useNotifications()
const { login } = useProfile()

const emit = defineEmits(['close', 'switch-to-login', 'registration-success'])

const currentStep = ref(1)
const isSubmitting = ref(false)
const resendCounter = ref(0)
const otp = ref(['', '', '', ''])

const form = reactive({
  country: '+967',
  dialCode: '+967',
  phone: '',
  name: '',
  email: ''
})

const errors = reactive({})

const countries = [
  { code: '+967', name: 'اليمن', flag: '🇾🇪' },
  { code: '+966', name: 'السعودية', flag: '🇸🇦' },
  { code: '+971', name: 'الإمارات', flag: '🇦🇪' },
  { code: '+965', name: 'الكويت', flag: '🇰🇼' },
  { code: '+974', name: 'قطر', flag: '🇶🇦' },
  { code: '+973', name: 'البحرين', flag: '🇧🇭' },
  { code: '+968', name: 'عمان', flag: '🇴🇲' },
  { code: '+93', name: 'أفغانستان', flag: '🇦🇫' },
  { code: '+355', name: 'ألبانيا', flag: '🇦🇱' },
  { code: '+213', name: 'الجزائر', flag: '🇩🇿' },
  { code: '+376', name: 'أندورا', flag: '🇦🇩' },
  { code: '+244', name: 'أنغولا', flag: '🇦🇴' },
  { code: '+1264', name: 'أنغويلا', flag: '🇦🇮' },
  { code: '+1268', name: 'أنتيغوا وباربودا', flag: '🇦🇬' },
  { code: '+54', name: 'الأرجنتين', flag: '🇦🇷' },
  { code: '+374', name: 'أرمينيا', flag: '🇦🇲' },
  { code: '+297', name: 'أروبا', flag: '🇦🇼' },
  { code: '+61', name: 'أستراليا', flag: '🇦🇺' },
  { code: '+43', name: 'النمسا', flag: '🇦🇹' },
  { code: '+994', name: 'أذربيجان', flag: '🇦🇿' },
  { code: '+1242', name: 'البهاما', flag: '🇧🇸' },
  { code: '+973', name: 'البحرين', flag: '🇧🇭' },
  { code: '+880', name: 'بنغلاديش', flag: '🇧🇩' },
  { code: '+1246', name: 'باربادوس', flag: '🇧🇧' },
  { code: '+375', name: 'بيلاروسيا', flag: '🇧🇾' },
  { code: '+32', name: 'بلجيكا', flag: '🇧🇪' },
  { code: '+501', name: 'بليز', flag: '🇧🇿' },
  { code: '+229', name: 'بنين', flag: '🇧🇯' },
  { code: '+1441', name: 'برمودا', flag: '🇧🇲' },
  { code: '+975', name: 'بوتان', flag: '🇧🇹' },
  { code: '+591', name: 'بوليفيا', flag: '🇧🇴' },
  { code: '+387', name: 'البوسنة والهرسك', flag: '🇧🇦' },
  { code: '+267', name: 'بوتسوانا', flag: '🇧🇼' },
  { code: '+55', name: 'البرازيل', flag: '🇧🇷' },
  { code: '+673', name: 'بروناي', flag: '🇧🇳' },
  { code: '+359', name: 'بلغاريا', flag: '🇧🇬' },
  { code: '+226', name: 'بوركينا فاسو', flag: '🇧🇫' },
  { code: '+257', name: 'بوروندي', flag: '🇧🇮' },
  { code: '+855', name: 'كمبوديا', flag: '🇰🇭' },
  { code: '+237', name: 'الكاميرون', flag: '🇨🇲' },
  { code: '+1', name: 'كندا', flag: '🇨🇦' },
  { code: '+238', name: 'الرأس الأخضر', flag: '🇨🇻' },
  { code: '+1345', name: 'جزر كايمان', flag: '🇰🇾' },
  { code: '+236', name: 'جمهورية أفريقيا الوسطى', flag: '🇨🇫' },
  { code: '+235', name: 'تشاد', flag: '🇹🇩' },
  { code: '+56', name: 'تشيلي', flag: '🇨🇱' },
  { code: '+86', name: 'الصين', flag: '🇨🇳' },
  { code: '+57', name: 'كولومبيا', flag: '🇨🇴' },
  { code: '+269', name: 'جزر القمر', flag: '🇰🇲' },
  { code: '+242', name: 'الكونغو', flag: '🇨🇬' },
  { code: '+243', name: 'جمهورية الكونغو الديمقراطية', flag: '🇨🇩' },
  { code: '+682', name: 'جزر كوك', flag: '🇨🇰' },
  { code: '+506', name: 'كوستاريكا', flag: '🇨🇷' },
  { code: '+225', name: 'ساحل العاج', flag: '🇨🇮' },
  { code: '+385', name: 'كرواتيا', flag: '🇭🇷' },
  { code: '+53', name: 'كوبا', flag: '🇨🇺' },
  { code: '+357', name: 'قبرص', flag: '🇨🇾' },
  { code: '+420', name: 'التشيك', flag: '🇨🇿' },
  { code: '+45', name: 'الدنمارك', flag: '🇩🇰' },
  { code: '+253', name: 'جيبوتي', flag: '🇩🇯' },
  { code: '+1767', name: 'دومينيكا', flag: '🇩🇲' },
  { code: '+1849', name: 'جمهورية الدومينيكان', flag: '🇩🇴' },
  { code: '+593', name: 'الإكوادور', flag: '🇪🇨' },
  { code: '+20', name: 'مصر', flag: '🇪🇬' },
  { code: '+503', name: 'السلفادور', flag: '🇸🇻' },
  { code: '+240', name: 'غينيا الاستوائية', flag: '🇬🇶' },
  { code: '+291', name: 'إريتريا', flag: '🇪🇷' },
  { code: '+372', name: 'إستونيا', flag: '🇪🇪' },
  { code: '+251', name: 'إثيوبيا', flag: '🇪🇹' },
  { code: '+500', name: 'جزر فوكلاند', flag: '🇫🇰' },
  { code: '+298', name: 'جزر فارو', flag: '🇫🇴' },
  { code: '+679', name: 'فيجي', flag: '🇫🇯' },
  { code: '+358', name: 'فنلندا', flag: '🇫🇮' },
  { code: '+33', name: 'فرنسا', flag: '🇫🇷' },
  { code: '+594', name: 'غويانا الفرنسية', flag: '🇬🇫' },
  { code: '+689', name: 'بولينيزيا الفرنسية', flag: '🇵🇫' },
  { code: '+241', name: 'الغابون', flag: '🇬🇦' },
  { code: '+220', name: 'غامبيا', flag: '🇬🇲' },
  { code: '+995', name: 'جورجيا', flag: '🇬🇪' },
  { code: '+49', name: 'ألمانيا', flag: '🇩🇪' },
  { code: '+233', name: 'غانا', flag: '🇬🇭' },
  { code: '+350', name: 'جبل طارق', flag: '🇬🇮' },
  { code: '+30', name: 'اليونان', flag: '🇬🇷' },
  { code: '+299', name: 'جرينلاند', flag: '🇬🇱' },
  { code: '+1473', name: 'غرينادا', flag: '🇬🇩' },
  { code: '+590', name: 'غوادلوب', flag: '🇬🇵' },
  { code: '+1671', name: 'غوام', flag: '🇬🇺' },
  { code: '+502', name: 'غواتيمالا', flag: '🇬🇹' },
  { code: '+224', name: 'غينيا', flag: '🇬🇳' },
  { code: '+245', name: 'غينيا بيساو', flag: '🇬🇼' },
  { code: '+592', name: 'غيانا', flag: '🇬🇾' },
  { code: '+509', name: 'هايتي', flag: '🇭🇹' },
  { code: '+504', name: 'هندوراس', flag: '🇭🇳' },
  { code: '+852', name: 'هونغ كونغ', flag: '🇭🇰' },
  { code: '+36', name: 'المجر', flag: '🇭🇺' },
  { code: '+354', name: 'آيسلندا', flag: '🇮🇸' },
  { code: '+91', name: 'الهند', flag: '🇮🇳' },
  { code: '+62', name: 'إندونيسيا', flag: '🇮🇩' },
  { code: '+98', name: 'إيران', flag: '🇮🇷' },
  { code: '+964', name: 'العراق', flag: '🇮🇶' },
  { code: '+353', name: 'أيرلندا', flag: '🇮🇪' },
  { code: '+972', name: 'إسرائيل', flag: '🇮🇱' },
  { code: '+39', name: 'إيطاليا', flag: '🇮🇹' },
  { code: '+1876', name: 'جامايكا', flag: '🇯🇲' },
  { code: '+81', name: 'اليابان', flag: '🇯🇵' },
  { code: '+962', name: 'الأردن', flag: '🇯🇴' },
  { code: '+7', name: 'كازاخستان', flag: '🇰🇿' },
  { code: '+254', name: 'كينيا', flag: '🇰🇪' },
  { code: '+686', name: 'كيريباتي', flag: '🇰🇮' },
  { code: '+965', name: 'الكويت', flag: '🇰🇼' },
  { code: '+996', name: 'قيرغيزستان', flag: '🇰🇬' },
  { code: '+856', name: 'لاوس', flag: '🇱🇦' },
  { code: '+371', name: 'لاتفيا', flag: '🇱🇻' },
  { code: '+961', name: 'لبنان', flag: '🇱🇧' },
  { code: '+266', name: 'ليسوتو', flag: '🇱🇸' },
  { code: '+231', name: 'ليبيريا', flag: '🇱🇷' },
  { code: '+218', name: 'ليبيا', flag: '🇱🇾' },
  { code: '+423', name: 'ليختنشتاين', flag: '🇱🇮' },
  { code: '+370', name: 'ليتوانيا', flag: '🇱🇹' },
  { code: '+352', name: 'لوكسمبورغ', flag: '🇱🇺' },
  { code: '+853', name: 'ماكاو', flag: '🇲🇴' },
  { code: '+389', name: 'مقدونيا', flag: '🇲🇰' },
  { code: '+261', name: 'مدغشقر', flag: '🇲🇬' },
  { code: '+265', name: 'مالاوي', flag: '🇲🇼' },
  { code: '+60', name: 'ماليزيا', flag: '🇲🇾' },
  { code: '+960', name: 'جزر المالديف', flag: '🇲🇻' },
  { code: '+223', name: 'مالي', flag: '🇲🇱' },
  { code: '+356', name: 'مالطا', flag: '🇲🇹' },
  { code: '+692', name: 'جزر مارشال', flag: '🇲🇭' },
  { code: '+596', name: 'مارتينيك', flag: '🇲🇶' },
  { code: '+222', name: 'موريتانيا', flag: '🇲🇷' },
  { code: '+230', name: 'موريشيوس', flag: '🇲🇺' },
  { code: '+262', name: 'مايوت', flag: '🇾🇹' },
  { code: '+52', name: 'المكسيك', flag: '🇲🇽' },
  { code: '+691', name: 'ولايات ميكرونيسيا المتحدة', flag: '🇫🇲' },
  { code: '+373', name: 'مولدوفا', flag: '🇲🇩' },
  { code: '+377', name: 'موناكو', flag: '🇲🇨' },
  { code: '+976', name: 'منغوليا', flag: '🇲🇳' },
  { code: '+382', name: 'الجبل الأسود', flag: '🇲🇪' },
  { code: '+1664', name: 'مونتسرات', flag: '🇲🇸' },
  { code: '+212', name: 'المغرب', flag: '🇲🇦' },
  { code: '+258', name: 'موزمبيق', flag: '🇲🇿' },
  { code: '+95', name: 'ميانمار', flag: '🇲🇲' },
  { code: '+264', name: 'ناميبيا', flag: '🇳🇦' },
  { code: '+674', name: 'ناورو', flag: '🇳🇷' },
  { code: '+977', name: 'نيبال', flag: '🇳🇵' },
  { code: '+31', name: 'هولندا', flag: '🇳🇱' },
  { code: '+687', name: 'كاليدونيا الجديدة', flag: '🇳🇨' },
  { code: '+64', name: 'نيوزيلندا', flag: '🇳🇿' },
  { code: '+505', name: 'نيكاراغوا', flag: '🇳🇮' },
  { code: '+227', name: 'النيجر', flag: '🇳🇪' },
  { code: '+234', name: 'نيجيريا', flag: '🇳🇬' },
  { code: '+683', name: 'نيوي', flag: '🇳🇺' },
  { code: '+672', name: 'جزيرة نورفولك', flag: '🇳🇫' },
  { code: '+850', name: 'كوريا الشمالية', flag: '🇰🇵' },
  { code: '+1670', name: 'جزر ماريانا الشمالية', flag: '🇲🇵' },
  { code: '+47', name: 'النرويج', flag: '🇳🇴' },
  { code: '+968', name: 'عمان', flag: '🇴🇲' },
  { code: '+92', name: 'باكستان', flag: '🇵🇰' },
  { code: '+680', name: 'بالاو', flag: '🇵🇼' },
  { code: '+970', name: 'فلسطين', flag: '🇵🇸' },
  { code: '+507', name: 'بنما', flag: '🇵🇦' },
  { code: '+675', name: 'بابوا غينيا الجديدة', flag: '🇵🇬' },
  { code: '+595', name: 'باراغواي', flag: '🇵🇾' },
  { code: '+51', name: 'بيرو', flag: '🇵🇪' },
  { code: '+63', name: 'الفلبين', flag: '🇵🇭' },
  { code: '+48', name: 'بولندا', flag: '🇵🇱' },
  { code: '+351', name: 'البرتغال', flag: '🇵🇹' },
  { code: '+1787', name: 'بورتوريكو', flag: '🇵🇷' },
  { code: '+974', name: 'قطر', flag: '🇶🇦' },
  { code: '+40', name: 'رومانيا', flag: '🇷🇴' },
  { code: '+7', name: 'روسيا', flag: '🇷🇺' },
  { code: '+250', name: 'رواندا', flag: '🇷🇼' },
  { code: '+590', name: 'سانت بارتيليمي', flag: '🇧🇱' },
  { code: '+290', name: 'سانت هيلينا', flag: '🇸🇭' },
  { code: '+1869', name: 'سانت كيتس ونيفيس', flag: '🇰🇳' },
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
    await new Promise(resolve => setTimeout(resolve, 1500))
    currentStep.value = 2
    startResendCounter()
    showSuccess('تم إرسال رمز التحقق إلى جوالك')
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
    const nextInput = document.querySelector(`.otp-input:nth-child(${index + 2})`)
    if (nextInput) nextInput.focus()
  }
}

const handleOtpKeydown = (index, event) => {
  if (event.key === 'Backspace' && !otp.value[index] && index > 0) {
    const prevInput = document.querySelector(`.otp-input:nth-child(${index})`)
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
  closeRegistration()
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
    showSuccess('تم إعادة إرسال رمز التحقق')
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

const closeRegistration = () => {
  emit('close')
  currentStep.value = 1
  isSubmitting.value = false
  resendCounter.value = 0
  otp.value = ['', '', '', '']
  Object.assign(form, {
    country: '+967',
    dialCode: '+967',
    phone: '',
    name: '',
    email: ''
  })
  Object.keys(errors).forEach(key => delete errors[key])
}

onMounted(() => {
  updateDialCode()
})
</script>

<style scoped>
.registration-modal {
  position: fixed;
  inset: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  max-width: 28rem;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slide-up 0.3s ease-out;
}

.modal-header {
  position: sticky;
  top: 0;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1.5rem;
  display: flex;
  justify-content: between;
  align-items: flex-start;
  z-index: 10;
}

.header-content {
  flex: 1;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.notice-yellow {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
}

.close-button {
  border: 1px solid transparent;
  padding: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  font-family: inherit;
  background-color: transparent;
  cursor: pointer;
  transition: border-color 0.25s;
  color: #6b7280;
  border-radius: 8px;
}

.close-button:hover {
  border-color: #9EBF3B;
  color: #1f2937;
}

.modal-body {
  padding: 1.5rem;
}

.wizard-nav {
  margin-bottom: 2rem;
}

.wizard-steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wizard-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
}

.wizard-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 0.75rem;
  right: 50%;
  width: 100%;
  height: 0.125rem;
  background-color: #e5e7eb;
  z-index: 1;
}

.wizard-step.active .step-point,
.wizard-step.completed .step-point {
  background-color: #9EBF3B;
  border-color: #9EBF3B;
}

.step-point {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  background-color: white;
  z-index: 2;
  position: relative;
  transition: all 0.25s;
}

.step-title {
  font-size: 0.75rem;
  color: #6b7280;
  text-align: center;
  line-height: 1.2;
}

.wizard-step.active .step-title,
.wizard-step.completed .step-title {
  color: #9EBF3B;
  font-weight: 500;
}

.wizard-content {
  min-height: 300px;
}

.step-content {
  text-align: center;
}

.step-content h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.step-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  text-align: right;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.select-wrapper {
  position: relative;
}

.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  appearance: none;
  transition: border-color 0.25s;
}

.form-select:focus {
  outline: none;
  border-color: #9EBF3B;
}

.phone-input {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.dial-code {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background-color: #f9fafb;
  color: #374151;
  font-size: 1rem;
  min-width: 5rem;
  text-align: center;
}

.form-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.25s;
}

.form-input:focus {
  outline: none;
  border-color: #9EBF3B;
}

.form-input.error {
  border-color: #ef4444;
}

.error-message {
  display: block;
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  text-align: right;
}

.verification-info {
  margin-bottom: 1.5rem;
}

.verification-info p {
  margin: 0;
  color: #6b7280;
  line-height: 1.5;
}

.phone-number {
  font-weight: 600;
  margin-top: 0.25rem !important;
}

.otp-inputs {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.otp-input {
  width: 4rem;
  height: 4rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  transition: border-color 0.25s;
}

.otp-input:focus {
  outline: none;
  border-color: #9EBF3B;
}

.otp-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.resend-timer {
  color: #6b7280;
  font-size: 0.875rem;
}

.timer {
  font-weight: 600;
  color: #1f2937;
}

.resend-button,
.edit-phone {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  padding: 0;
  text-decoration: underline;
}

.resend-button:hover,
.edit-phone:hover {
  opacity: 0.8;
}

.submit-button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  font-family: inherit;
  color: white;
  cursor: pointer;
  transition: border-color 0.25s;
  width: 100%;
}

.submit-button:hover:not(:disabled) {
  border-color: #9EBF3B;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.loader {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.success-step {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.success-message {
  color: #6b7280;
  text-align: center;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.download-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  justify-content: center;
}

.download-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: #1a1a1a;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.25s;
  border: 1px solid transparent;
}

.download-button:hover {
  background-color: #2a2a2a;
  border-color: #9EBF3B;
}

.download-button i {
  font-size: 1.5rem;
}

.button-text {
  text-align: right;
}

.sub-text {
  font-size: 0.75rem;
  opacity: 0.8;
}

.main-text {
  font-size: 0.875rem;
  font-weight: 600;
}

.start-button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  font-family: inherit;
  color: white;
  cursor: pointer;
  transition: border-color 0.25s;
  width: 100%;
}

.start-button:hover {
  border-color: #9EBF3B;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

@media (prefers-color-scheme: light) {
  .modal-content {
    background-color: #ffffff;
    color: #213547;
  }
  
  .form-input,
  .form-select {
    background-color: #f9f9f9;
  }
}

@media (max-width: 640px) {
  .modal-content {
    max-width: 100%;
    margin: 1rem;
  }
  
  .download-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .download-button {
    width: 100%;
    max-width: 200px;
  }
  
  .otp-input {
    width: 3rem;
    height: 3rem;
    font-size: 1.25rem;
  }
}
</style>