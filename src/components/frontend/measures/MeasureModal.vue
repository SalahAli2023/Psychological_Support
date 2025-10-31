<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
      <!-- رأس المودال -->
      <div class="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-800">مرحبا بك في {{ measure.title }}</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>
      
      <!-- محتوى المودال -->
      <div class="p-6">
        <!-- معلومات الاختبار -->
        <div v-if="testStep === 'info'" class="space-y-4">
          <div class="bg-blue-50 border-r-4 border-blue-500 p-4 rounded">
            <div class="flex">
              <div class="flex-shrink-0">
                <i class="fas fa-info-circle text-blue-500"></i>
              </div>
              <div class="mr-3">
                <h3 class="text-sm font-medium text-blue-800">معلومات مهمة</h3>
                <div class="mt-2 text-sm text-blue-700">
                  <ul class="list-disc list-inside space-y-1">
                    <li>النتائج لأغراض التوعية وليست تشخيصاً نهائياً</li>
                    <li>جميع إجاباتك سرية وآمنة</li>
                    <li>يمكنك إيقاف الاختبار في أي وقت</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-semibold mb-2 text-gray-800">عن هذا الاختبار</h3>
            <p class="text-gray-600 mb-3">{{ measure.description }}</p>
            
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="flex items-center">
                <i class="fas fa-question-circle ml-2 text-primary-green"></i>
                <span>{{ measure.questions.length }} أسئلة</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-clock ml-2 text-primary-green"></i>
                <span>{{ measure.time }} دقائق</span>
              </div>
            </div>
          </div>
          
          <div class="flex justify-end">
            <button @click="$emit('start-test')" class="px-6 py-2 bg-primary-green text-white rounded-lg hover:bg-secondary-green transition-colors">
              ابدأ الاختبار
            </button>
          </div>
        </div>
        
        <!-- أسئلة الاختبار -->
        <div v-else-if="testStep === 'questions'" class="space-y-6">
          <!-- شريط التقدم -->
          <div class="mb-4">
            <div class="flex justify-between text-sm text-gray-600 mb-1">
              <span>التقدم: {{ currentQuestionIndex + 1 }} / {{ measure.questions.length }}</span>
              <span>{{ Math.round((currentQuestionIndex + 1) / measure.questions.length * 100) }}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="progress-bar bg-primary-green h-2 rounded-full" :style="`width: ${(currentQuestionIndex + 1) / measure.questions.length * 100}%`"></div>
            </div>
          </div>
          
          <!-- السؤال الحالي -->
          <div class="bg-gray-50 p-6 rounded-lg">
            <h3 class="text-lg font-medium mb-4 text-gray-800">
              السؤال {{ currentQuestionIndex + 1 }} من {{ measure.questions.length }}
            </h3>
            <p class="text-gray-700 mb-6">{{ measure.questions[currentQuestionIndex] }}</p>
            
            <!-- الخيارات -->
            <div class="space-y-3">
              <label v-for="(option, index) in measure.options" :key="index" class="flex items-center p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <input 
                  type="radio" 
                  :name="`question-${currentQuestionIndex}`" 
                  :value="index" 
                  v-model="answers[currentQuestionIndex]"
                  class="custom-radio ml-3"
                >
                <span class="text-gray-700">{{ option }}</span>
              </label>
            </div>
          </div>
          
          <!-- أزرار التنقل -->
          <div class="flex justify-between">
            <button 
              @click="$emit('previous-question')" 
              :disabled="currentQuestionIndex === 0"
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-arrow-right ml-2"></i>
              السابق
            </button>
            
            <button 
              v-if="currentQuestionIndex < measure.questions.length - 1"
              @click="$emit('next-question')" 
              :disabled="answers[currentQuestionIndex] === undefined"
              class="px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-secondary-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              التالي
              <i class="fas fa-arrow-left ml-2"></i>
            </button>
            
            <button 
              v-else
              @click="$emit('submit-test')" 
              :disabled="answers.some(a => a === undefined)"
              class="submit-btn px-6 py-3 text-white rounded-xl transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>إرسال الاختبار</span>
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
        
        <!-- شاشة التحميل -->
        <div v-else-if="testStep === 'loading'" class="flex flex-col items-center justify-center py-12">
          <div class="loader mb-4"></div>
          <p class="text-gray-600">جاري حساب النتائج...</p>
        </div>
        
        <!-- نتائج الاختبار -->
        <div v-else-if="testStep === 'results'" class="space-y-6">
          <div class="result-card p-6 rounded-lg text-center">
            <h3 class="text-2xl font-bold mb-4 text-gray-800">نتيجة التقييم</h3>
            
            <div class="mb-6">
              <div class="text-5xl font-bold text-primary-green mb-2">{{ testResult.score }}</div>
              <p class="text-gray-600">بناءً على إجاباتك، حصلت على {{ testResult.maxScore }} نقطة</p>
            </div>
            
            <div class="bg-white p-4 rounded-lg text-right">
              <h4 class="text-lg font-semibold mb-2 text-gray-800">{{ testResult.interpretation.level }}</h4>
              <p class="text-gray-600">{{ testResult.interpretation.desc }}</p>
            </div>
          </div>
          
          <!-- التوصيات -->
          <div class="bg-gray-50 p-6 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">التوصيات المخصصة لك</h3>
            
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="w-10 h-10 rounded-full bg-primary-green/20 flex items-center justify-center ml-3 flex-shrink-0">
                  <i class="fas fa-user-md text-primary-green"></i>
                </div>
                <div>
                  <h4 class="font-medium text-gray-800">جلسة استشارة نفسية</h4>
                  <p class="text-gray-600 text-sm mt-1">جلسة مع أخصائي نفسي لمناقشة نتائجك واستراتيجيات التعامل</p>
                  <button class="mt-2 px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-secondary-green transition-colors text-sm">
                    حجز جلسة
                  </button>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="w-10 h-10 rounded-full bg-primary-green/20 flex items-center justify-center ml-3 flex-shrink-0">
                  <i class="fas fa-book text-primary-green"></i>
                </div>
                <div>
                  <h4 class="font-medium text-gray-800">موارد مساعدة</h4>
                  <p class="text-gray-600 text-sm mt-1">مجموعة من المقالات والتمارين للتعامل مع {{ measure.title }}</p>
                  <button class="mt-2 px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-secondary-green transition-colors text-sm">
                    عرض الموارد
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- أزرار الإجراءات -->
          <div class="flex flex-col sm:flex-row gap-3">
            <button @click="$emit('retake-test')" class="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
              <i class="fas fa-redo ml-2"></i>
              إعادة الاختبار
            </button>
            <button @click="$emit('show-other-measures')" class="flex-1 px-4 py-2 bg-primary-green text-white rounded-lg hover:bg-secondary-green transition-colors">
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
.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.progress-bar {
  transition: width 0.5s ease;
}

.custom-radio {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #9EBF3B;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
}

.custom-radio:checked::after {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #9EBF3B;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.loader {
  border: 3px solid rgba(158, 191, 59, 0.2);
  border-radius: 50%;
  border-top: 3px solid #9EBF3B;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.result-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* تنسيق نجوم التقييم */
.stars-container {
  display: flex;
  gap: 2px;
}

.star {
  background: linear-gradient(135deg, #9EBF3B, #D6A29A);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.star.empty {
  background: #E5E7EB;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* تنسيق زر إرسال الاختبار */
.submit-btn {
  background: linear-gradient(135deg, #9EBF3B, #D6A29A);
  color: white;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(158, 191, 59, 0.3);
}

.submit-btn:disabled {
  background: #9CA3AF;
  transform: none;
  box-shadow: none;
}
</style>