<template>
  <div class="min-h-screen bg-gray-50 font-almarai transition-colors duration-300">
    <Header /> 
    <!-- قسم الهيرو  -->
    <HeroSection />

    <main class=" max-w-7xl mx-auto px-6">
      <!-- المقاييس الأكثر استخداماً -->
      <PopularMeasures 
        :measures="popularMeasures"
        @measure-click="openRegistrationModal"
      />
      
      <!-- قسم التصنيفات المدمج مع البحث والفلتر -->
      <CategorySection 
        :activeCategory="activeFilter"
        :searchQuery="searchQuery"
        :measures="measures"
        :filteredMeasuresCount="filteredMeasures.length"
        @filter-change="activeFilter = $event"
        @update:searchQuery="searchQuery = $event"
      />

      <!-- جميع المقاييس -->
      <AllMeasures 
        :measures="filteredMeasures"
        :activeFilter="activeFilter"
        @measure-click="openRegistrationModal"
      />

      <!-- الإرشادات -->
      <GuidelinesSection />
      
      <!-- الموارد -->
      <ResourcesSection :resources="resources" />
    </main>
    
    <Footer />

    <!-- مودال التسجيل -->
    <RegistrationModal
      :show-registration="showRegistrationModal"
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
import { ref, computed } from 'vue'
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
    // الحالة
    const searchQuery = ref('')
    const activeFilter = ref('allMeasures')
    const showRegistrationModal = ref(false)
    const showMeasureModal = ref(false)
    const currentMeasure = ref(null)
    const testStep = ref('info')
    const currentQuestionIndex = ref(0)
    const answers = ref([])
    const testResult = ref(null)

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
      
      setTimeout(() => {
        calculateResults()
      }, 2000)
    }
    
    const calculateResults = () => {
      let score = 0
      const measure = currentMeasure.value
      
      answers.value.forEach((answer, index) => {
        if (answer !== undefined) {
          if (typeof measure.scores === 'function') {
            score += measure.scores(index)[answer]
          } else {
            score += measure.scores[answer]
          }
        }
      })
      
      let maxScore = 0
      if (typeof measure.scores === 'function') {
        measure.questions.forEach((_, index) => {
          maxScore += Math.max(...measure.scores(index))
        })
      } else {
        maxScore = measure.questions.length * Math.max(...measure.scores)
      }
      
      const interpretation = measure.interpretation(score)
      
      testResult.value = {
        score,
        maxScore,
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
      // هنا يمكنك فتح مودال تسجيل الدخول إذا كان لديك
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