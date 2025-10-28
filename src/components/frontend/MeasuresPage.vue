<template>
  <div class="min-h-screen bg-gray-50 font-almarai transition-colors duration-300">
    <Header /> 
    <!-- قسم الهيرو المبسط -->
      <HeroSection />
    <main class=" max-w-7xl mx-auto px-6">
      <!-- المقاييس الأكثر استخداماً -->
      <PopularMeasures 
        :measures="popularMeasures"
        @measure-click="openMeasureModal"
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
        @measure-click="openMeasureModal"
      />

      <!-- الإرشادات -->
      <GuidelinesSection />
      
      <!-- الموارد -->
      <!-- <ResourcesSection :resources="resources" /> -->
    </main>
    
    <Footer />

    <!-- المودالات -->
    <MeasureModal
      v-if="showModal"
      :measure="currentMeasure"
      :testStep="testStep"
      :currentQuestionIndex="currentQuestionIndex"
      :answers="answers"
      :testResult="testResult"
      @close="closeModal"
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
  },
  setup() {
    // الحالة
    const searchQuery = ref('')
    const activeFilter = ref('allMeasures')
    const showModal = ref(false)
    const showProfile = ref(false)
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
    const openMeasureModal = (measure) => {
      currentMeasure.value = measure
      showModal.value = true
      testStep.value = 'info'
      currentQuestionIndex.value = 0
      answers.value = new Array(measure.questions.length).fill(undefined)
      testResult.value = null
    }
    
    const closeModal = () => {
      showModal.value = false
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
      closeModal()
    }

    return {
      searchQuery,
      activeFilter,
      showModal,
      showProfile,
      currentMeasure,
      testStep,
      currentQuestionIndex,
      answers,
      testResult,
      measures,
      resources,
      filteredMeasures,
      popularMeasures,
      openMeasureModal,
      closeModal,
      startTest,
      nextQuestion,
      previousQuestion,
      submitTest,
      retakeTest,
      showOtherMeasures
    }
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, rgba(158, 191, 59, 0.05) 0%, rgba(214, 162, 154, 0.05) 100%);
}
</style>