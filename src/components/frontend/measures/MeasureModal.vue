<template>
  <div class="fixed inset-0 z-900 flex items-center justify-center p-4">
    <div class="modal-overlay fixed inset-0" @click="$emit('close')"></div>
    
    <div class="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl animate-slide-up">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start z-10">
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-800">مرحبا بك في {{ measure.title }}</h2>
        </div>
        <button @click="$emit('close')" class="flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <div class="p-6">
        <!-- معلومات الاختبار -->
        <div v-if="testStep === 'info'" class="space-y-6">
          <div class="bg-blue-50 border-r-4 border-blue-500 p-4 rounded-lg">
            <div class="flex items-start">
              <i class="fas fa-info-circle text-blue-500 mt-1 ml-3"></i>
              <div class="flex-1">
                <h3 class="text-sm font-medium text-blue-800 mb-2">معلومات مهمة</h3>
                <ul class="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>النتائج لأغراض التوعية وليست تشخيصاً نهائياً</li>
                  <li>جميع إجاباتك سرية وآمنة</li>
                  <li>يمكنك إيقاف الاختبار في أي وقت</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 p-6 rounded-lg space-y-4">
            <h3 class="text-lg font-semibold text-gray-800">عن هذا الاختبار</h3>
            <p class="text-gray-600 leading-relaxed">{{ measure.description }}</p>
            
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="flex items-center text-gray-700">
                <i class="fas fa-question-circle text-primary-green ml-2"></i>
                <span>{{ measure.questions.length }} أسئلة</span>
              </div>
              <div class="flex items-center text-gray-700">
                <i class="fas fa-clock text-primary-green ml-2"></i>
                <span>{{ measure.time }} دقائق</span>
              </div>
            </div>
          </div>

          <button @click="$emit('start-test')" 
                  class="w-full py-3 bg-primary-green text-white rounded-lg hover:bg-opacity-90 transition-all font-medium">
            ابدأ الاختبار
          </button>
        </div>
        
        <!-- أسئلة الاختبار -->
        <div v-else-if="testStep === 'questions'" class="space-y-6">
          <!-- شريط التقدم -->
          <div class="space-y-2">
            <div class="flex justify-between text-sm text-gray-600">
              <span>التقدم: {{ currentQuestionIndex + 1 }} / {{ measure.questions.length }}</span>
              <span>{{ Math.round((currentQuestionIndex + 1) / measure.questions.length * 100) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="h-2 rounded-full bg-primary-green transition-all duration-500" 
                   :style="`width: ${(currentQuestionIndex + 1) / measure.questions.length * 100}%`"></div>
            </div>
          </div>
          
          <!-- السؤال الحالي -->
          <div class="bg-gray-50 p-6 rounded-lg space-y-4">
            <h3 class="text-lg font-medium text-gray-800">
              السؤال {{ currentQuestionIndex + 1 }} من {{ measure.questions.length }}
            </h3>
            <p class="text-gray-700 text-lg leading-relaxed">{{ measure.questions[currentQuestionIndex] }}</p>
            
            <!-- الخيارات -->
            <div class="space-y-3">
              <label v-for="(option, index) in measure.options" :key="index" 
                      class="flex items-center p-4 bg-white rounded-lg border-2 border-gray-200 cursor-pointer transition-all hover:border-primary-green hover:bg-gray-50"
                      :class="{ 'border-primary-green bg-blue-50': answers[currentQuestionIndex] === index }"
                >
                <input 
                  type="radio" 
                  :name="`question-${currentQuestionIndex}`" 
                  :value="index" 
                  v-model="answers[currentQuestionIndex]"
                  class="w-5 h-5 text-primary-green border-gray-800 focus:ring-primary-green"
                >
                <span class="mr-3 text-gray-700 text-right flex-1">{{ option }}</span>
              </label>
            </div>
          </div>
          
          <!-- أزرار التنقل -->
          <div class="flex justify-between gap-3">
            <button 
              @click="$emit('previous-question')" 
              :disabled="currentQuestionIndex === 0"
              class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <i class="fas fa-arrow-right ml-2"></i>
              السابق
            </button>
            
            <button 
              v-if="currentQuestionIndex < measure.questions.length - 1"
              @click="$emit('next-question')" 
              :disabled="answers[currentQuestionIndex] === undefined"
              class="px-6 py-3 bg-primary-green text-white rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              التالي
              <i class="fas fa-arrow-left ml-2"></i>
            </button>
            
            <button 
              v-else
              @click="$emit('submit-test')" 
              :disabled="answers.some(a => a === undefined)"
              class="px-6 py-3 bg-primary-green text-white rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
            >
              <span>إرسال الاختبار</span>
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
        
        <!-- شاشة التحميل -->
        <div v-else-if="testStep === 'loading'" class="flex flex-col items-center justify-center py-16 space-y-4">
          <div class="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin"></div>
          <p class="text-gray-600 text-lg">جاري حساب النتائج...</p>
        </div>
        
        <!-- نتائج الاختبار -->
        <div v-else-if="testStep === 'results'" class="space-y-6">
          <div class="text-center space-y-4">
            <h3 class="text-2xl font-bold text-gray-800">نتيجة التقييم</h3>
            
            <div class="space-y-2">
              <div class="text-5xl font-bold text-primary-green">{{ testResult.score }}</div>
              <p class="text-gray-600">بناءً على إجاباتك، حصلت على {{ testResult.maxScore }} نقطة</p>
            </div>
            
            <div class="bg-white p-6 rounded-lg border border-gray-200 text-right">
              <h4 class="text-lg font-semibold text-gray-800 mb-2">{{ testResult.interpretation.level }}</h4>
              <p class="text-gray-600 leading-relaxed">{{ testResult.interpretation.desc }}</p>
            </div>
          </div>
          
          <!-- التوصيات -->
          <div class="bg-gray-50 p-6 rounded-lg space-y-6">
            <h3 class="text-lg font-semibold text-gray-800 text-right">التوصيات المخصصة لك</h3>
            
            <div class="space-y-4">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-full bg-primary-green/20 flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-user-md text-primary-green text-lg"></i>
                </div>
                <div class="flex-1 text-right">
                  <h4 class="font-semibold text-gray-800 mb-1">جلسة استشارة نفسية</h4>
                  <p class="text-gray-600 text-sm mb-3">جلسة مع أخصائي نفسي لمناقشة نتائجك واستراتيجيات التعامل</p>
                  <button class="px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-opacity-90 transition-all text-sm">
                    حجز جلسة
                  </button>
                </div>
              </div>
              
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-full bg-primary-green/20 flex items-center justify-center flex-shrink-0">
                  <i class="fas fa-book text-primary-green text-lg"></i>
                </div>
                <div class="flex-1 text-right">
                  <h4 class="font-semibold text-gray-800 mb-1">موارد مساعدة</h4>
                  <p class="text-gray-600 text-sm mb-3">مجموعة من المقالات والتمارين للتعامل مع {{ measure.title }}</p>
                  <button class="px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-opacity-90 transition-all text-sm">
                    عرض الموارد
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- أزرار الإجراءات -->
          <div class="flex flex-col sm:flex-row gap-3">
            <button @click="$emit('retake-test')" 
                    class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium">
              <i class="fas fa-redo ml-2"></i>
              إعادة الاختبار
            </button>
            <button @click="$emit('show-other-measures')" 
                    class="flex-1 px-6 py-3 bg-primary-green text-white rounded-lg hover:bg-opacity-90 transition-all font-medium">
              <i class="fas fa-list ml-2"></i>
              مقاييس أخرى
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MeasureModal',
  props: {
    measure: {
      type: Object,
      required: true
    },
    testStep: {
      type: String,
      default: 'info'
    },
    currentQuestionIndex: {
      type: Number,
      default: 0
    },
    answers: {
      type: Array,
      default: () => []
    },
    testResult: {
      type: Object,
      default: null
    }
  },
  emits: [
    'close',
    'start-test',
    'next-question',
    'previous-question',
    'submit-test',
    'retake-test',
    'show-other-measures'
  ]
}
</script>

<style scoped>
</style>