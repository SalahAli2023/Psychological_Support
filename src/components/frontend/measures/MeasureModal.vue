<template>
  <div class="registration-modal">
    <div class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <!-- رأس المودال -->
        <div class="modal-header">
          <div class="header-content">
            <h2>مرحبا بك في {{ measure.title }}</h2>
          </div>
          <button @click="$emit('close')" class="close-button">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- محتوى المودال -->
        <div class="modal-body">
          <!-- معلومات الاختبار -->
          <div v-if="testStep === 'info'" class="step-content">
            <div class="info-section">
              <div class="notice-card">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <i class="fas fa-info-circle text-primary-green"></i>
                  </div>
                  <div class="mr-3">
                    <h3 class="text-sm font-medium text-primary-green">معلومات مهمة</h3>
                    <div class="mt-2 text-sm text-gray-700">
                      <ul class="list-disc list-inside space-y-1">
                        <li>النتائج لأغراض التوعية وليست تشخيصاً نهائياً</li>
                        <li>جميع إجاباتك سرية وآمنة</li>
                        <li>يمكنك إيقاف الاختبار في أي وقت</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="measure-info">
                <h3 class="info-title">عن هذا الاختبار</h3>
                <p class="info-description">{{ measure.description }}</p>
                
                <div class="info-grid">
                  <div class="info-item">
                    <i class="fas fa-question-circle text-primary-green"></i>
                    <span>{{ measure.questions.length }} أسئلة</span>
                  </div>
                  <div class="info-item">
                    <i class="fas fa-clock text-primary-green"></i>
                    <span>{{ measure.time }} دقائق</span>
                  </div>
                </div>
              </div>

              <button @click="$emit('start-test')" class="submit-button bg-primary-green hover:bg-opacity-90">
                ابدأ الاختبار
              </button>
            </div>
          </div>
          
          <!-- أسئلة الاختبار -->
          <div v-else-if="testStep === 'questions'" class="step-content">
            <!-- شريط التقدم -->
            <div class="progress-section">
              <div class="progress-info">
                <span>التقدم: {{ currentQuestionIndex + 1 }} / {{ measure.questions.length }}</span>
                <span>{{ Math.round((currentQuestionIndex + 1) / measure.questions.length * 100) }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill bg-primary-green" :style="`width: ${(currentQuestionIndex + 1) / measure.questions.length * 100}%`"></div>
              </div>
            </div>
            
            <!-- السؤال الحالي -->
            <div class="question-card">
              <h3 class="question-title">
                السؤال {{ currentQuestionIndex + 1 }} من {{ measure.questions.length }}
              </h3>
              <p class="question-text">{{ measure.questions[currentQuestionIndex] }}</p>
              
              <!-- الخيارات -->
              <div class="options-grid">
                <label v-for="(option, index) in measure.options" :key="index" 
                       class="option-item" :class="{ 'selected': answers[currentQuestionIndex] === index }">
                  <input 
                    type="radio" 
                    :name="`question-${currentQuestionIndex}`" 
                    :value="index" 
                    v-model="answers[currentQuestionIndex]"
                    class="option-radio"
                  >
                  <span class="option-text">{{ option }}</span>
                </label>
              </div>
            </div>
            
            <!-- أزرار التنقل -->
            <div class="navigation-buttons">
              <button 
                @click="$emit('previous-question')" 
                :disabled="currentQuestionIndex === 0"
                class="nav-button prev-button"
              >
                <i class="fas fa-arrow-right ml-2"></i>
                السابق
              </button>
              
              <button 
                v-if="currentQuestionIndex < measure.questions.length - 1"
                @click="$emit('next-question')" 
                :disabled="answers[currentQuestionIndex] === undefined"
                class="nav-button next-button bg-primary-green hover:bg-opacity-90"
              >
                التالي
                <i class="fas fa-arrow-left ml-2"></i>
              </button>
              
              <button 
                v-else
                @click="$emit('submit-test')" 
                :disabled="answers.some(a => a === undefined)"
                class="submit-btn bg-primary-green hover:bg-opacity-90"
              >
                <span>إرسال الاختبار</span>
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
          
          <!-- شاشة التحميل -->
          <div v-else-if="testStep === 'loading'" class="step-content loading-section">
            <div class="loader"></div>
            <p class="loading-text">جاري حساب النتائج...</p>
          </div>
          
          <!-- نتائج الاختبار -->
          <div v-else-if="testStep === 'results'" class="step-content">
            <div class="result-section">
              <h3 class="result-title">نتيجة التقييم</h3>
              
              <div class="score-display">
                <div class="score-number">{{ testResult.score }}</div>
                <p class="score-info">بناءً على إجاباتك، حصلت على {{ testResult.maxScore }} نقطة</p>
              </div>
              
              <div class="interpretation-card">
                <h4 class="interpretation-level">{{ testResult.interpretation.level }}</h4>
                <p class="interpretation-desc">{{ testResult.interpretation.desc }}</p>
              </div>
            </div>
            
            <!-- التوصيات -->
            <div class="recommendations-section">
              <h3 class="recommendations-title">التوصيات المخصصة لك</h3>
              
              <div class="recommendations-grid">
                <div class="recommendation-item">
                  <div class="recommendation-icon">
                    <i class="fas fa-user-md text-primary-green"></i>
                  </div>
                  <div class="recommendation-content">
                    <h4 class="recommendation-title">جلسة استشارة نفسية</h4>
                    <p class="recommendation-desc">جلسة مع أخصائي نفسي لمناقشة نتائجك واستراتيجيات التعامل</p>
                    <button class="recommendation-button bg-primary-green hover:bg-opacity-90">
                      حجز جلسة
                    </button>
                  </div>
                </div>
                
                <div class="recommendation-item">
                  <div class="recommendation-icon">
                    <i class="fas fa-book text-primary-green"></i>
                  </div>
                  <div class="recommendation-content">
                    <h4 class="recommendation-title">موارد مساعدة</h4>
                    <p class="recommendation-desc">مجموعة من المقالات والتمارين للتعامل مع {{ measure.title }}</p>
                    <button class="recommendation-button bg-primary-green hover:bg-opacity-90">
                      عرض الموارد
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- أزرار الإجراءات -->
            <div class="action-buttons">
              <button @click="$emit('retake-test')" class="action-button secondary">
                <i class="fas fa-redo ml-2"></i>
                إعادة الاختبار
              </button>
              <button @click="$emit('show-other-measures')" class="action-button primary bg-primary-green hover:bg-opacity-90">
                <i class="fas fa-list ml-2"></i>
                مقاييس أخرى
              </button>
            </div>
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
  max-width: 32rem;
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
  margin: 0;
  line-height: 1.2;
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

.step-content {
  min-height: 400px;
}

/* معلومات الاختبار */
.info-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.notice-card {
  background-color: #f0f9ff;
  border-right: 4px solid #9EBF3B;
  padding: 1rem;
  border-radius: 8px;
}

.measure-info {
  background-color: #f9fafb;
  padding: 1.5rem;
  border-radius: 8px;
}

.info-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.info-description {
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #374151;
  font-size: 0.875rem;
}

/* شريط التقدم */
.progress-section {
  margin-bottom: 1.5rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.progress-bar {
  width: 100%;
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 0.25rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 0.25rem;
  transition: width 0.5s ease;
}

/* السؤال والخيارات */
.question-card {
  background-color: #f9fafb;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.question-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.question-text {
  color: #374151;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.options-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-item:hover {
  border-color: #9EBF3B;
  background-color: #f9fafb;
}

.option-item.selected {
  border-color: #9EBF3B;
  background-color: #f0f9ff;
}

.option-radio {
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  margin-left: 0.75rem;
  position: relative;
  cursor: pointer;
}

.option-radio:checked {
  border-color: #9EBF3B;
}

.option-radio:checked::after {
  content: '';
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  background-color: #9EBF3B;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.option-text {
  color: #374151;
  font-size: 0.875rem;
}

/* أزرار التنقل */
.navigation-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-button {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.prev-button {
  background-color: #f3f4f6;
  color: #374151;
}

.prev-button:hover:not(:disabled) {
  background-color: #e5e7eb;
}

.next-button {
  color: white;
}

.submit-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* شاشة التحميل */
.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.loader {
  border: 3px solid rgba(158, 191, 59, 0.2);
  border-radius: 50%;
  border-top: 3px solid #9EBF3B;
  width: 3rem;
  height: 3rem;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: #6b7280;
  font-size: 1rem;
}

/* النتائج */
.result-section {
  text-align: center;
  margin-bottom: 2rem;
}

.result-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.score-display {
  margin-bottom: 1.5rem;
}

.score-number {
  font-size: 3rem;
  font-weight: 700;
  color: #9EBF3B;
  margin-bottom: 0.5rem;
}

.score-info {
  color: #6b7280;
  font-size: 1rem;
}

.interpretation-card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  text-align: right;
}

.interpretation-level {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.interpretation-desc {
  color: #6b7280;
  line-height: 1.6;
}

/* التوصيات */
.recommendations-section {
  margin-bottom: 2rem;
}

.recommendations-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  text-align: right;
}

.recommendations-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 8px;
}

.recommendation-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: rgba(158, 191, 59, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.recommendation-content {
  flex: 1;
  text-align: right;
}

.recommendation-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.recommendation-desc {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.recommendation-button {
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 6px;
  font-size: 0.75rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

/* أزرار الإجراءات */
.action-buttons {
  display: flex;
  gap: 0.75rem;
}

.action-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button.secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.action-button.secondary:hover {
  background-color: #e5e7eb;
}

.action-button.primary {
  color: white;
}

/* زر الإرسال الرئيسي */
.submit-button {
  width: 100%;
  padding: 0.75rem 1.5rem;
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .modal-content {
    max-width: 100%;
    margin: 1rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .navigation-buttons {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .nav-button,
  .submit-btn {
    width: 100%;
    justify-content: center;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .recommendation-item {
    flex-direction: column;
    text-align: center;
  }
  
  .recommendation-content {
    text-align: center;
  }
}
</style>