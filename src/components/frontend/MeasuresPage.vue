<template> 
  <div class="min-h-screen bg-gray-50 font-almarai transition-colors duration-300">
    <Header /> 

    <!-- قسم الهيرو  -->
    <HeroSection
    :language="currentLanguage"
    />

    <main class="max-w-7xl mx-auto px-6">
      <!-- المقاييس الأكثر استخداماً -->
      <PopularMeasures 
        :measures="popularMeasures"
        :language="currentLanguage"
        @measure-click="openRegistrationModal"
      />
      
      <!-- قسم التصنيفات المدمج مع البحث والفلتر -->
      <CategorySection 
        :activeCategory="activeFilter"
        :searchQuery="searchQuery"
        :measures="measures"
        :filteredMeasuresCount="filteredMeasures.length"
        :language="currentLanguage"
        @filter-change="activeFilter = $event"
        @update:searchQuery="searchQuery = $event"
      />

      <!-- جميع المقاييس -->
      <AllMeasures 
        :measures="filteredMeasures"
        :activeFilter="activeFilter"
        :language="currentLanguage"
        @measure-click="openRegistrationModal"
      />

      <!-- الإرشادات -->
      <GuidelinesSection 
        :language="currentLanguage"
      />
      
      <!-- الموارد -->
      <ResourcesSection :resources="resources" />
    </main>
    
    <Footer />

    <!-- مودال التسجيل -->
    <RegistrationModal
      :show-registration="showRegistrationModal"
      :language="currentLanguage"
      @close="closeRegistrationModal"
      @switch-to-login="switchToLogin"
      @registration-success="handleRegistrationSuccess"
      
    />

    <!-- مودال الاختبار (يظهر بعد التسجيل) -->
    <MeasureModal
      v-if="showMeasureModal"
      :measure="currentMeasure"
      :testStep="testStep"
      :currentQuestionIndex="currentQuestionIndex"
      :answers="answers"
      :testResult="testResult"
      :language="currentLanguage"
      @close="closeMeasureModal"
      @start-test="startTest"
      @next-question="nextQuestion"
      @previous-question="previousQuestion"
      @submit-test="submitTest"
      @retake-test="retakeTest"
      @show-other-measures="showOtherMeasures"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Header from '@/components/frontend/layouts/header.vue'
import HeroSection from '@/components/frontend/measures/HeroSection.vue'
import PopularMeasures from '@/components/frontend/measures/PopularMeasures.vue'
import CategorySection from '@/components/frontend/measures/CategorySection.vue'
import AllMeasures from '@/components/frontend/measures/AllMeasures.vue'
import GuidelinesSection from '@/components/frontend/measures/GuidelinesSection.vue'
import ResourcesSection from '@/components/frontend/measures/ResourcesSection.vue'
import MeasureModal from '@/components/frontend/measures/MeasureModal.vue'
import RegistrationModal from '@/components/frontend/auth/RegistrationModal.vue'
import Footer from '@/components/frontend/layouts/footer.vue'
import { measuresData, resourcesData } from '@/data/measures'

export default {
  name: 'MeasuresPage',
  components: {
    Header,
    Footer,
    HeroSection,
    CategorySection,
    PopularMeasures,
    AllMeasures,
    GuidelinesSection,
    ResourcesSection,
    MeasureModal,
    RegistrationModal
  },
  setup() {
    // الحالة العامة
    const searchQuery = ref('')
    const activeFilter = ref('allMeasures')
    const showRegistrationModal = ref(false)
    const showMeasureModal = ref(false)
    const currentMeasure = ref(null)
    const testStep = ref('info')
    const currentQuestionIndex = ref(0)
    const answers = ref([])
    const testResult = ref(null)
    const currentLanguage = ref(localStorage.getItem('preferredLanguage') || 'ar')

    // تحديث اللغة تلقائيًا عند تغييرها من الهيدر
    const handleLanguageChange = (event) => {
      currentLanguage.value = event.detail.language
    }

    onMounted(() => {
      window.addEventListener('languageChanged', handleLanguageChange)
    })

    onUnmounted(() => {
      window.removeEventListener('languageChanged', handleLanguageChange)
    })

    // البيانات
    const measures = ref(measuresData)
    const resources = ref(resourcesData)

    // الحسابات
    const filteredMeasures = computed(() => {
      let filtered = measures.value
      
      if (activeFilter.value !== 'allMeasures') {
        const categoryMap = {
          'forWomen': 'women',
          'forChildren': 'children',
          'forSpecialists': 'specialists'
        }
        
        filtered = filtered.filter(measure => 
          measure.category === categoryMap[activeFilter.value]
        )
      }
      
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(measure => {
          const title = measure.title
          return title.toLowerCase().includes(query) || 
                  measure.description.toLowerCase().includes(query)
        })
      }
      
      return filtered
    })
    
    const popularMeasures = computed(() => {
      return measures.value
        .filter(measure => measure.rating >= 4)
        .slice(0, 4)
    })

    // الدوال
    const openRegistrationModal = (measure) => {
      currentMeasure.value = measure
      showRegistrationModal.value = true
    }

    const closeRegistrationModal = () => {
      showRegistrationModal.value = false
    }

    const handleRegistrationSuccess = () => {
      closeRegistrationModal()
      openMeasureModal()
    }

    const openMeasureModal = () => {
      showMeasureModal.value = true
      testStep.value = 'info'
      currentQuestionIndex.value = 0
      answers.value = new Array(currentMeasure.value.questions.length).fill(undefined)
      testResult.value = null
    }
    
    const closeMeasureModal = () => {
      showMeasureModal.value = false
      currentMeasure.value = null
    }
    
    const startTest = () => {
      testStep.value = 'questions'
    }
    
    const nextQuestion = () => {
      if (currentQuestionIndex.value < currentMeasure.value.questions.length - 1) {
        currentQuestionIndex.value++
      }
    }
    
    const previousQuestion = () => {
      if (currentQuestionIndex.value > 0) {
        currentQuestionIndex.value--
      }
    }
    
    const submitTest = () => {
      testStep.value = 'loading'
      setTimeout(() => calculateResults(), 2000)
    }
    
    const calculateResults = () => {
      let score = 0
      const measure = currentMeasure.value
    // حساب النتيجة بناء على الإجابات
    answers.value.forEach((answer, index) => {
      if (answer !== undefined && measure.scores) {
        score += measure.scores[answer] || 0
      }
    })
        
    // الحصول على التفسير بناء على اللغة الحالية
    let interpretation
    if (typeof measure.interpretation === 'function') {
      interpretation = measure.interpretation(score, currentLanguage.value)
    } else {
      // تفسير افتراضي إذا لم يكن هناك دالة تفسير
      const maxPossibleScore = measure.scores ? Math.max(...measure.scores) * measure.questions.length : 0
      const percentage = maxPossibleScore > 0 ? (score / maxPossibleScore) * 100 : 0
      
      // if (percentage >= 80) {
      //   interpretation = {
      //     level: currentLanguage.value === 'ar' ? 'مرتفع' : 'High',
      //     desc: currentLanguage.value === 'ar' 
      //       ? 'نتيجتك تشير إلى مستوى مرتفع. ننصح بمراجعة مختص للدعم المناسب.'
      //       : 'Your results indicate a high level. We recommend consulting a specialist for appropriate support.'
      //   }
      // } else if (percentage >= 50) {
      //   interpretation = {
      //     level: currentLanguage.value === 'ar' ? 'متوسط' : 'Medium',
      //     desc: currentLanguage.value === 'ar'
      //       ? 'نتيجتك تشير إلى مستوى متوسط. ننصح بممارسة تقنيات الاسترخاء.'
      //       : 'Your results indicate a medium level. We recommend practicing relaxation techniques.'
      //   }
      // } else {
      //   interpretation = {
      //     level: currentLanguage.value === 'ar' ? 'منخفض' : 'Low',
      //     desc: currentLanguage.value === 'ar'
      //       ? 'نتيجتك تشير إلى مستوى منخفض. حافظ على ممارسة العادات الصحية.'
      //       : 'Your results indicate a low level. Maintain healthy habits.'
      //   }
      // }
    }
    
    // حساب أقصى درجة ممكنة
    const maxScore = measure.scores ? Math.max(...measure.scores) * measure.questions.length : measure.questions.length * 3
    
    testResult.value = { 
      score: Math.round(score), 
      maxScore: Math.round(maxScore), 
      interpretation 
    }
    
    testStep.value = 'results'
  }
    const retakeTest = () => {
      testStep.value = 'info'
      currentQuestionIndex.value = 0
      answers.value = new Array(currentMeasure.value.questions.length).fill(undefined)
      testResult.value = null
    }
    
    const showOtherMeasures = () => {
      closeMeasureModal()
    }

    const switchToLogin = () => {
      console.log('Switch to login')
    }

    return {
      searchQuery,
      activeFilter,
      showRegistrationModal,
      showMeasureModal,
      currentMeasure,
      testStep,
      currentQuestionIndex,
      answers,
      testResult,
      measures,
      resources,
      filteredMeasures,
      popularMeasures,
      currentLanguage,
      openRegistrationModal,
      closeRegistrationModal,
      handleRegistrationSuccess,
      openMeasureModal,
      closeMeasureModal,
      startTest,
      nextQuestion,
      previousQuestion,
      submitTest,
      retakeTest,
      showOtherMeasures,
      switchToLogin
    }
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, rgba(158, 191, 59, 0.05) 0%, rgba(214, 162, 154, 0.05) 100%);
}
</style>