<template>
  <div class="fixed inset-0 z-900 flex items-center justify-center p-4" :dir="language === 'ar' ? 'rtl' : 'ltr'">
    <div class="modal-overlay fixed inset-0 bg-opacity-50" @click="$emit('close')"></div>

    <div class="relative bg-white rounded-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl animate-slide-up">
      <!-- Header - Google Forms Style -->
      <div class="sticky top-0 bg-white border-b border-gray-300 p-6 z-10">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h1 class="text-2xl font-normal text-gray-900 mb-2">
              {{ getTranslatedTitle(measure) }}
            </h1>
            <p class="text-sm text-gray-600">
              {{ getTranslatedDescription(measure) }}
            </p>
          </div>
          <button
            @click="$emit('close')"
            class="flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-gray-100 ml-4"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <!-- شريط التقدم -->
        <div class="mt-4 space-y-2">
          <div class="flex justify-between text-xs text-gray-600">
            <span>
              {{ translate('measureModal.progress') }}:
              {{ currentPage * questionsPerPage + 1 }} - 
              {{ Math.min((currentPage + 1) * questionsPerPage, measure.questions.length) }} 
              {{ translate('measureModal.of') }} 
              {{ measure.questions.length }}
            </span>
            <span>
              {{ Math.round((currentPage + 1) / totalPages * 100) }}%
            </span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-1.5">
            <div
              class="h-1.5 rounded-full bg-blue-600 transition-all duration-500"
              :style="`width: ${((currentPage + 1) / totalPages) * 100}%`"
            ></div>
          </div>
        </div>
      </div>

      <div class="p-6">
        <!-- معلومات الاختبار -->
        <div v-if="testStep === 'info'" class="space-y-6">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0 mt-0.5">
                <i class="fas fa-info-circle text-blue-500 text-lg"></i>
              </div>
              <div class="flex-1 mr-3">
                <h3 class="text-sm font-medium text-blue-800 mb-1">
                  {{ translate('measureModal.importantInfo') }}
                </h3>
                <ul class="text-xs text-blue-700 space-y-1 list-disc list-inside">
                  <li>{{ translate('measureModal.infoList.awareness') }}</li>
                  <li>{{ translate('measureModal.infoList.confidentiality') }}</li>
                  <li>{{ translate('measureModal.infoList.stopAnytime') }}</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="border border-gray-300 rounded-lg p-6 space-y-4">
            <h3 class="text-lg font-normal text-gray-900">
              {{ translate('measureModal.aboutTest') }}
            </h3>
            
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="flex items-center text-gray-700">
                <i class="fas fa-question-circle text-blue-500 ml-2"></i>
                <span>{{ measure.questions.length }} {{ translate('measureModal.questionsCount') }}</span>
              </div>
              <div class="flex items-center text-gray-700">
                <i class="fas fa-clock text-blue-500 ml-2"></i>
                <span>{{ getEstimatedTime(measure) }} {{ translate('measureModal.time') }}</span>
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-4">
            <button
              @click="startTest"
              class="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all font-medium text-sm"
            >
              {{ translate('measureModal.startTest') }}
            </button>
          </div>
        </div>

        <!-- أسئلة الاختبار -->
        <div v-else-if="testStep === 'questions'" class="space-y-8">
          <!-- الأسئلة في الصفحة الحالية -->
          <div 
            v-for="(question, questionIndex) in currentPageQuestions" 
            :key="question.id || questionIndex"
            class="border border-gray-300 rounded-lg p-6 space-y-4"
          >
            <!-- عنوان السؤال -->
            <div class="space-y-2">
              <div class="flex items-center text-sm text-gray-600">
                <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {{ getGlobalQuestionIndex(questionIndex) + 1 }}
                </span>
                <span class="mx-2">•</span>
                <span>{{ getQuestionTypeText(question.type) }}</span>
              </div>
              
              <h3 class="text-lg font-normal text-gray-900">
                {{ getTranslatedQuestion(question) }}
              </h3>
              
              <p v-if="getTranslatedDescription(question)" class="text-sm text-gray-600">
                {{ getTranslatedDescription(question) }}
              </p>
            </div>

            <!-- الخيارات -->
            <div class="space-y-3">
              <div class="space-y-2">
                <label
                  v-for="(option, optionIndex) in question.options"
                  :key="option.id || optionIndex"
                  class="flex items-center p-3 bg-white rounded-md border border-gray-300 cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50"
                  :class="{ 
                    'border-blue-500 bg-blue-50': getAnswer(getGlobalQuestionIndex(questionIndex)) === option.id,
                  }"
                >
                  <input
                    type="radio"
                    :name="`question-${getGlobalQuestionIndex(questionIndex)}`"
                    :value="option.id"
                    v-model="answers[getGlobalQuestionIndex(questionIndex)]"
                    class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span class="text-gray-700 flex-1 text-sm" :class="language === 'ar' ? 'mr-3 text-right' : 'ml-3 text-left'">
                    {{ getTranslatedOption(option) }}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <!-- أزرار التنقل بين الصفحات -->
          <div class="flex justify-between gap-3 pt-4 border-t border-gray-200">
            <button
              @click="previousPage"
              :disabled="currentPage === 0"
              class="px-6 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center"
            >
              <template v-if="language === 'ar'">
                <i class="fas fa-arrow-right ml-2"></i>
                {{ translate('measureModal.previous') }}
              </template>
              <template v-else>
                <i class="fas fa-arrow-left mr-2"></i>
                {{ translate('measureModal.previous') }}
              </template>
            </button>

            <!-- زر التالي -->
            <button
              v-if="currentPage < totalPages - 1"
              @click="nextPage"
              :disabled="!isCurrentPageValid"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center"
            >
              <template v-if="language === 'ar'">
                {{ translate('measureModal.next') }}
                <i class="fas fa-arrow-left mr-2"></i>
              </template>
              <template v-else>
                {{ translate('measureModal.next') }}
                <i class="fas fa-arrow-right ml-2"></i>
              </template>
            </button>

            <!-- زر التقديم -->
            <button
              v-else
              @click="submitTest"
              :disabled="!isFormComplete"
              class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center gap-2"
            >
              <span>{{ translate('measureModal.submit') }}</span>
              <i class="fas fa-paper-plane text-xs"></i>
            </button>
          </div>
        </div>

        <!-- شاشة التحميل -->
        <div v-else-if="testStep === 'loading'" class="flex flex-col items-center justify-center py-16 space-y-4">
          <div class="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p class="text-gray-600 text-sm">{{ translate('measureModal.calculating') }}</p>
        </div>

        <!-- نتائج الاختبار -->
        <div v-else-if="testStep === 'results'" class="space-y-6">
          <div class="text-center space-y-4">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
              <i class="fas fa-check-circle text-green-600 text-xl"></i>
            </div>
            
            <h3 class="text-xl font-normal text-gray-900">
              {{ translate('measureModal.registrationSuccess') }}
            </h3>

            <!-- عرض النتيجة -->
            <div class="space-y-2">
              <div class="text-4xl font-normal text-blue-600">{{ testResult.data?.score || testResult.score }}</div>
              <p class="text-gray-500 text-sm">
                {{ translate('measureModal.yourScore') }}
                {{ testResult.data?.max_score || testResult.maxScore }}
                {{ translate('measureModal.points') }}
              </p>
            </div>

            <!-- إذا كانت النتيجة متاحة -->
            <div class="border border-gray-300 rounded-lg p-6 mt-4 text-left">
              <h4 class="text-base font-medium text-gray-900 mb-2">
                {{ getTranslatedInterpretation(testResult.data?.interpretation, 'interpretation_label') }}
              </h4>
              <p class="text-gray-600 text-sm leading-relaxed">
                {{ getTranslatedInterpretation(testResult.data?.interpretation, 'description') }}
              </p>
              
              <!-- رسالة نجاح الحفظ -->
              <div v-if="testResult.success" class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center gap-2 text-green-700">
                  <i class="fas fa-check-circle"></i>
                  <span class="text-sm font-medium">{{ translate('measureModal.resultSaved') }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- التوصيات -->
          <div class="border border-gray-300 rounded-lg p-6 space-y-4">
            <h3 class="text-base font-medium text-gray-900">
              {{ translate('measureModal.recommendations') }}
            </h3>

            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-user-md text-blue-600 text-sm"></i>
                </div>
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900 mb-1 text-sm">
                    {{ translate('measureModal.consult.title') }}
                  </h4>
                  <p class="text-gray-600 text-xs mb-2">
                    {{ translate('measureModal.consult.desc') }}
                  </p>
                  <button class="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all text-xs">
                    {{ translate('measureModal.consult.button') }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- أزرار الإجراءات -->
          <div class="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              @click="retakeTest"
              class="flex-1 px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 transition-all font-medium text-sm flex items-center justify-center"
            >
              <i class="fas fa-redo" :class="language === 'ar' ? 'ml-2' : 'mr-2'"></i>
              {{ translate('measureModal.retake') }}
            </button>
            <button
              @click="showOtherMeasures"
              class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all font-medium text-sm flex items-center justify-center"
            >
              <i class="fas fa-list" :class="language === 'ar' ? 'ml-2' : 'mr-2'"></i>
              {{ translate('measureModal.otherMeasures') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { t } from '@/locales'
import { useFrontendScalesStore } from '@/stores/frontendScales.store'

export default {
  name: 'MeasureModal',
  props: {
    measure: { type: Object, required: true },
    testStep: { type: String, default: 'info' },
    answers: { type: Array, default: () => [] },
    testResult: { type: Object, default: null },
    language: { type: String, default: 'ar' }
  },
  emits: [
    'close',
    'start-test',
    'submit-test',
    'retake-test',
    'show-other-measures',
    'open-registration',
    'update:testStep'
  ],
  data() {
    return {
      questionsPerPage: 3,
      currentPage: 0,
      localLoading: false
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.measure.questions.length / this.questionsPerPage)
    },
    
    currentPageQuestions() {
      const startIndex = this.currentPage * this.questionsPerPage
      const endIndex = startIndex + this.questionsPerPage
      return this.measure.questions.slice(startIndex, endIndex)
    },
    
    isCurrentPageValid() {
      return this.currentPageQuestions.every((question, index) => {
        const globalIndex = this.getGlobalQuestionIndex(index)
        return this.isAnswerValid(globalIndex)
      })
    },
    
    isFormComplete() {
      return this.measure.questions.every((question, index) => {
        return this.isAnswerValid(index)
      })
    }
  },
  methods: {
    translate(key) {
      const translations = {
        'measureModal.registrationSuccess': {
          ar: 'تم التسجيل بنجاح!',
          en: 'Registration Successful!'
        },
        'measureModal.resultSaved': {
          ar: 'تم حفظ نتيجتك في حسابك',
          en: 'Your result has been saved to your account'
        },
        'measureModal.progress': {
          ar: 'التقدم',
          en: 'Progress'
        },
        'measureModal.of': {
          ar: 'من',
          en: 'of'
        },
        'measureModal.importantInfo': {
          ar: 'معلومات هامة',
          en: 'Important Information'
        },
        'measureModal.infoList.awareness': {
          ar: 'هذا الاختبار لأغراض التوعية فقط وليس تشخيصاً طبياً',
          en: 'This test is for awareness purposes only and not a medical diagnosis'
        },
        'measureModal.infoList.confidentiality': {
          ar: 'جميع إجاباتك سرية وآمنة',
          en: 'All your answers are confidential and secure'
        },
        'measureModal.infoList.stopAnytime': {
          ar: 'يمكنك إيقاف الاختبار في أي وقت',
          en: 'You can stop the test at any time'
        },
        'measureModal.aboutTest': {
          ar: 'عن الاختبار',
          en: 'About the Test'
        },
        'measureModal.questionsCount': {
          ar: 'أسئلة',
          en: 'questions'
        },
        'measureModal.time': {
          ar: 'دقيقة',
          en: 'minutes'
        },
        'measureModal.startTest': {
          ar: 'بدء الاختبار',
          en: 'Start Test'
        },
        'measureModal.previous': {
          ar: 'السابق',
          en: 'Previous'
        },
        'measureModal.next': {
          ar: 'التالي',
          en: 'Next'
        },
        'measureModal.submit': {
          ar: 'تقديم الإجابات',
          en: 'Submit Answers'
        },
        'measureModal.calculating': {
          ar: 'جاري حساب النتيجة...',
          en: 'Calculating your result...'
        },
        'measureModal.resultTitle': {
          ar: 'نتيجة الاختبار',
          en: 'Test Results'
        },
        'measureModal.yourScore': {
          ar: 'درجتك',
          en: 'Your score'
        },
        'measureModal.points': {
          ar: 'نقطة',
          en: 'points'
        },
        'measureModal.recommendations': {
          ar: 'التوصيات',
          en: 'Recommendations'
        },
        'measureModal.consult.title': {
          ar: 'استشارة متخصص',
          en: 'Professional Consultation'
        },
        'measureModal.consult.desc': {
          ar: 'للاستفسار عن نتيجتك أو للحصول على استشارة متخصصة',
          en: 'To inquire about your result or get professional consultation'
        },
        'measureModal.consult.button': {
          ar: 'احجز استشارة',
          en: 'Book Consultation'
        },
        'measureModal.retake': {
          ar: 'إعادة الاختبار',
          en: 'Retake Test'
        },
        'measureModal.otherMeasures': {
          ar: 'مقاييس أخرى',
          en: 'Other Measures'
        },
        'measureModal.completeAllQuestions': {
          ar: 'يرجى الإجابة على جميع الأسئلة قبل الإرسال',
          en: 'Please answer all questions before submitting'
        },
        'measureModal.submitError': {
          ar: 'حدث خطأ أثناء إرسال الاختبار',
          en: 'An error occurred while submitting the test'
        }
      }
      
      if (translations[key]) {
        return translations[key][this.language] || translations[key].ar
      }
      
      return t(key, this.language)
    },
    
    updateTestStep(newStep) {
      this.$emit('update:testStep', newStep)
    },
    
    getTranslatedTitle(measure) {
      if (this.language === 'ar') {
        return measure.name_ar || measure.name_en || 'بدون عنوان';
      }
      return measure.name_en || measure.name_ar || 'No Title';
    },

    getTranslatedDescription(measure) {
      if (this.language === 'ar') {
        return measure.description_ar || measure.description_en || 'لا يوجد وصف';
      }
      return measure.description_en || measure.description_ar || 'No description';
    },

    getTranslatedQuestion(question) {
      if (this.language === 'ar') {
        return question.question_text_ar || question.question_text_en || question.text || 'بدون نص';
      }
      return question.question_text_en || question.question_text_ar || question.text || 'No text';
    },

    getTranslatedOption(option) {
      if (this.language === 'ar') {
        return option.option_text_ar || option.option_text_en || option.text || option;
      }
      return option.option_text_en || option.option_text_ar || option.text || option;
    },

    getTranslatedInterpretation(interpretation, key) {
      if (!interpretation) return '';
      if (typeof interpretation === 'object') {
        const value = interpretation[key];
        return typeof value === 'object' ? value[this.language] : value;
      }
      return interpretation;
    },

    getQuestionTypeText(type) {
      const types = {
        multiple_choice: { ar: 'اختيار من متعدد', en: 'Multiple Choice' },
        linear_scale: { ar: 'مقياس خطي', en: 'Linear Scale' },
      }
      return types[type]?.[this.language] || type || { ar: 'اختيار من متعدد', en: 'Multiple Choice' }[this.language];
    },

    getGlobalQuestionIndex(pageIndex) {
      return this.currentPage * this.questionsPerPage + pageIndex
    },
    
    getAnswer(questionIndex) {
      return this.answers[questionIndex]
    },

    isAnswerValid(questionIndex) {
      const answer = this.answers[questionIndex];
      return answer !== undefined && answer !== null && answer !== '';
    },

    getEstimatedTime(measure) {
      const questionsCount = measure.questions_count || measure.questions?.length || 0;
      return Math.max(5, Math.min(20, Math.ceil(questionsCount * 0.8)));
    },
    
    nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage++
      }
    },
    
    previousPage() {
      if (this.currentPage > 0) {
        this.currentPage--
      }
    },

    startTest() {
      this.$emit('start-test')
    },

    async submitTest() {
      console.log('📤 إرسال الاختبار من المودال')
      
      try {
        // التحقق من اكتمال جميع الإجابات
        if (!this.isFormComplete) {
          const message = this.translate('measureModal.completeAllQuestions')
          alert(message)
          return
        }

        console.log('✅ جميع الإجابات مكتملة، جاري الإرسال...')
        
        this.updateTestStep('loading')
        this.localLoading = true
        
        // إرسال الإجابات إلى المكون الأب
        this.$emit('submit-test', this.answers)
        
      } catch (error) {
        console.error('❌ خطأ في إرسال الاختبار:', error)
        
        this.updateTestStep('questions')
        this.localLoading = false
        
        const errorMessage = error.message || this.translate('measureModal.submitError')
        alert(errorMessage)
      }
    },

    retakeTest() {
      this.$emit('retake-test')
    },

    showOtherMeasures() {
      this.$emit('show-other-measures')
    },

    openRegistration() {
      console.log('🔐 فتح التسجيل من المودال')
      this.$emit('open-registration')
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