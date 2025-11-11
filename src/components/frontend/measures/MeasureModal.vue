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
                <span>{{ measure.time }} {{ translate('measureModal.time') }}</span>
              </div>
            </div>
          </div>

          <div class="flex justify-end pt-4">
            <button
              @click="$emit('start-test')"
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
            :key="questionIndex"
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
                <span v-if="question.required" class="text-red-500 ml-2" :class="language === 'ar' ? 'ml-0 mr-2' : 'ml-2'">*</span>
              </div>
              
              <h3 class="text-lg font-normal text-gray-900">
                {{ getTranslatedQuestion(question) }}
                <span v-if="question.required" class="text-red-500">*</span>
              </h3>
              
              <p v-if="question.description" class="text-sm text-gray-600">
                {{ getTranslatedDescription(question) }}
              </p>
            </div>

            <!-- الخيارات حسب نوع السؤال -->
            <div class="space-y-3">
              <!-- Multiple Choice -->
              <div v-if="question.type === 'multiple_choice'" class="space-y-2">
                <label
                  v-for="(option, optionIndex) in question.options"
                  :key="optionIndex"
                  class="flex items-center p-3 bg-white rounded-md border border-gray-300 cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50"
                  :class="{ 
                    'border-blue-500 bg-blue-50': getAnswer(getGlobalQuestionIndex(questionIndex)) === optionIndex,
                  }"
                >
                  <input
                    type="radio"
                    :name="`question-${getGlobalQuestionIndex(questionIndex)}`"
                    :value="optionIndex"
                    v-model="answers[getGlobalQuestionIndex(questionIndex)]"
                    class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span class="text-gray-700 flex-1 text-sm" :class="language === 'ar' ? 'mr-3 text-right' : 'ml-3 text-left'">
                    {{ getTranslatedOption(option) }}
                  </span>
                </label>
              </div>

              <!-- Checkboxes (Multiple Answers) -->
              <div v-if="question.type === 'checkboxes'" class="space-y-2">
                <label
                  v-for="(option, optionIndex) in question.options"
                  :key="optionIndex"
                  class="flex items-center p-3 bg-white rounded-md border border-gray-300 cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50"
                  :class="{ 
                    'border-blue-500 bg-blue-50': (getAnswer(getGlobalQuestionIndex(questionIndex)) || []).includes(optionIndex),
                  }"
                >
                  <input
                    type="checkbox"
                    :name="`question-${getGlobalQuestionIndex(questionIndex)}`"
                    :value="optionIndex"
                    v-model="answers[getGlobalQuestionIndex(questionIndex)]"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span class="text-gray-700 flex-1 text-sm" :class="language === 'ar' ? 'mr-3 text-right' : 'ml-3 text-left'">
                    {{ getTranslatedOption(option) }}
                  </span>
                </label>
              </div>

              <!-- Yes/No -->
              <div v-if="question.type === 'yes_no'" class="flex space-x-3" :class="language === 'ar' ? 'space-x-reverse' : ''">
                <label
                  v-for="(option, optionIndex) in yesNoOptions"
                  :key="optionIndex"
                  class="flex-1 flex items-center justify-center p-3 bg-white rounded-md border border-gray-300 cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50"
                  :class="{ 
                    'border-blue-500 bg-blue-50': getAnswer(getGlobalQuestionIndex(questionIndex)) === option.value,
                  }"
                >
                  <input
                    type="radio"
                    :name="`question-${getGlobalQuestionIndex(questionIndex)}`"
                    :value="option.value"
                    v-model="answers[getGlobalQuestionIndex(questionIndex)]"
                    class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span class="text-gray-700 text-sm" :class="language === 'ar' ? 'mr-2' : 'ml-2'">
                    {{ option[language] }}
                  </span>
                </label>
              </div>

              <!-- Linear Scale -->
              <div v-if="question.type === 'linear_scale'" class="space-y-4">
                <div class="flex justify-between text-sm text-gray-600">
                  <span>{{ question.scaleLabels?.low[language] }}</span>
                  <span>{{ question.scaleLabels?.high[language] }}</span>
                </div>
                <div class="flex space-x-2 justify-center" :class="language === 'ar' ? 'space-x-reverse' : ''">
                  <label
                    v-for="n in (question.scaleTo - question.scaleFrom + 1)"
                    :key="n"
                    class="flex flex-col items-center p-3 bg-white rounded-md border border-gray-300 cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50"
                    :class="{ 
                      'border-blue-500 bg-blue-50': getAnswer(getGlobalQuestionIndex(questionIndex)) === (n + question.scaleFrom - 1),
                    }"
                  >
                    <input
                      type="radio"
                      :name="`question-${getGlobalQuestionIndex(questionIndex)}`"
                      :value="n + question.scaleFrom - 1"
                      v-model="answers[getGlobalQuestionIndex(questionIndex)]"
                      class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span class="text-gray-700 text-sm mt-1">
                      {{ n + question.scaleFrom - 1 }}
                    </span>
                  </label>
                </div>
              </div>

              <!-- Short Answer -->
              <div v-if="question.type === 'short_answer'" class="space-y-2">
                <input
                  type="text"
                  v-model="answers[getGlobalQuestionIndex(questionIndex)]"
                  :placeholder="translate('measureModal.shortAnswerPlaceholder')"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              <!-- Paragraph -->
              <div v-if="question.type === 'paragraph'" class="space-y-2">
                <textarea
                  v-model="answers[getGlobalQuestionIndex(questionIndex)]"
                  :placeholder="translate('measureModal.paragraphPlaceholder')"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-vertical"
                ></textarea>
              </div>

              <!-- Dropdown -->
              <div v-if="question.type === 'dropdown'" class="space-y-2">
                <select
                  v-model="answers[getGlobalQuestionIndex(questionIndex)]"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="" disabled>{{ translate('measureModal.selectOption') }}</option>
                  <option
                    v-for="(option, optionIndex) in question.options"
                    :key="optionIndex"
                    :value="optionIndex"
                  >
                    {{ getTranslatedOption(option) }}
                  </option>
                </select>
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
              @click="$emit('submit-test')"
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
            <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
              <i class="fas fa-chart-bar text-blue-600 text-xl"></i>
            </div>
            
            <h3 class="text-xl font-normal text-gray-900">
              {{ translate('measureModal.resultTitle') }}
            </h3>

            <div class="space-y-2">
              <div class="text-4xl font-normal text-blue-600">{{ testResult.score }}</div>
              <p class="text-gray-500 text-sm">
                {{ translate('measureModal.yourScore') }}
                {{ testResult.maxScore }}
                {{ translate('measureModal.points') }}
              </p>
            </div>

            <div class="border border-gray-300 rounded-lg p-6 mt-4 text-left">
              <h4 class="text-base font-medium text-gray-900 mb-2">
                {{ getTranslatedInterpretation(testResult.interpretation, 'level') }}
              </h4>
              <p class="text-gray-600 text-sm leading-relaxed">
                {{ getTranslatedInterpretation(testResult.interpretation, 'desc') }}
              </p>
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

              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-book text-blue-600 text-sm"></i>
                </div>
                <div class="flex-1">
                  <h4 class="font-medium text-gray-900 mb-1 text-sm">
                    {{ translate('measureModal.resources.title') }}
                  </h4>
                  <p class="text-gray-600 text-xs mb-2">
                    {{ translate('measureModal.resources.desc') }} {{ getTranslatedTitle(measure) }}
                  </p>
                  <button class="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all text-xs">
                    {{ translate('measureModal.resources.button') }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- أزرار الإجراءات -->
          <div class="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              @click="$emit('retake-test')"
              class="flex-1 px-4 py-2 bg-white text-gray-700 rounded-md border border-gray-300 hover:bg-gray-50 transition-all font-medium text-sm flex items-center justify-center"
            >
              <i class="fas fa-redo" :class="language === 'ar' ? 'ml-2' : 'mr-2'"></i>
              {{ translate('measureModal.retake') }}
            </button>
            <button
              @click="$emit('show-other-measures')"
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

export default {
  name: 'MeasureModal',
  props: {
    measure: { type: Object, required: true },
    testStep: { type: String, default: 'info' },
    currentQuestionIndex: { type: Number, default: 0 },
    answers: { type: Array, default: () => [] },
    testResult: { type: Object, default: null },
    language: { type: String, default: 'ar' }
  },
  emits: [
    'close',
    'start-test',
    'next-question',
    'previous-question',
    'submit-test',
    'retake-test',
    'show-other-measures'
  ],
  data() {
    return {
      questionsPerPage: 3, // عدد الأسئلة في كل صفحة
      currentPage: 0,
      yesNoOptions: [
        { value: 'yes', ar: 'نعم', en: 'Yes' },
        { value: 'no', ar: 'لا', en: 'No' }
      ]
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
      // التحقق من أن جميع الأسئلة الإلزامية في الصفحة الحالية تمت الإجابة عليها
      return this.currentPageQuestions.every((question, index) => {
        const globalIndex = this.getGlobalQuestionIndex(index)
        if (question.required) {
          return this.isAnswerValid(globalIndex)
        }
        return true
      })
    },
    
    isFormComplete() {
      // التحقق من أن جميع الأسئلة الإلزامية في النموذج تمت الإجابة عليها
      return this.measure.questions.every((question, index) => {
        if (question.required) {
          return this.isAnswerValid(index)
        }
        return true
      })
    }
  },
  methods: {
    translate(key) {
      return t(key, this.language)
    },
    
    getTranslatedTitle(measure) {
      return typeof measure.title === 'object' ? measure.title[this.language] : measure.title;
    },

    getTranslatedDescription(measure) {
      return typeof measure.description === 'object' ? measure.description[this.language] : measure.description;
    },

    getTranslatedQuestion(question) {
      return typeof question.text === 'object' ? question.text[this.language] : question.text || question;
    },

    getTranslatedOption(option) {
      return typeof option === 'object' ? option[this.language] : option;
    },

    getTranslatedInterpretation(interpretation, key) {
      if (!interpretation) return '';
      const value = interpretation[key];
      return typeof value === 'object' ? value[this.language] : value;
    },

    getQuestionTypeText(type) {
      const types = {
        multiple_choice: { ar: 'اختيار من متعدد', en: 'Multiple Choice' },
        checkboxes: { ar: 'اختيار متعدد', en: 'Checkboxes' },
        yes_no: { ar: 'نعم/لا', en: 'Yes/No' },
        linear_scale: { ar: 'مقياس خطي', en: 'Linear Scale' },
        short_answer: { ar: 'إجابة قصيرة', en: 'Short Answer' },
        paragraph: { ar: 'فقرة', en: 'Paragraph' },
        dropdown: { ar: 'قائمة منسدلة', en: 'Dropdown' }
      }
      return types[type]?.[this.language] || type;
    },

    getGlobalQuestionIndex(pageIndex) {
      return this.currentPage * this.questionsPerPage + pageIndex
    },
    
    getAnswer(questionIndex) {
      return this.answers[questionIndex]
    },

    isAnswerValid(questionIndex) {
      const answer = this.answers[questionIndex];
      const question = this.measure.questions[questionIndex];
      
      if (answer === undefined || answer === null || answer === '') {
        return false;
      }

      switch (question.type) {
        case 'checkboxes':
          return Array.isArray(answer) && answer.length > 0;
        
        case 'short_answer':
        case 'paragraph':
          return typeof answer === 'string' && answer.trim().length > 0;
        
        default:
          return true;
      }
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
</style>