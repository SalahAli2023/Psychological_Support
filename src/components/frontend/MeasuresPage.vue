<template> 
  <div class="min-h-screen bg-gray-50 font-almarai transition-colors duration-300">
    <Header /> 

    <!-- قسم الهيرو  -->
    <Hero 
      :title="translate('measuresHero.title')"
      :highlight="translate('measuresHero.titleKey')"
      :subtitle="translate('measuresHero.description')"
      :subtitleKey="translate('measuresHero.subtitle')"
      :buttons="[
        { text: translate('measureModal.startTest'), icon: 'fas fa-play-circle', primary: true },
        { text: translate('buttons.learnMore'), icon: 'fas fa-info-circle', primary: false }
      ]"
    />

    <main class="max-w-7xl mx-auto px-6">
      <!-- حالة التحميل -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green"></div>
        <span class="mr-3 text-gray-600">{{ translate('loading') }}</span>
      </div>

      <!-- حالة الخطأ -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-center my-8">
        <div class="flex items-center justify-center gap-2 text-red-700 mb-2">
          <i class="fas fa-exclamation-triangle"></i>
          <span class="font-medium">{{ error }}</span>
        </div>
        <button 
          @click="fetchMeasuresData"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          {{ translate('retry') }}
        </button>
      </div>

      <!-- المحتوى الرئيسي -->
      <div v-else>
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
          :measures="scales"
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
        <ResourcesSection 
          :resources="resources"
          :language="currentLanguage" 
        />
      </div>
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
import Hero from '@/components/frontend/layouts/hero.vue'
import PopularMeasures from '@/components/frontend/measures/PopularMeasures.vue'
import CategorySection from '@/components/frontend/measures/CategorySection.vue'
import AllMeasures from '@/components/frontend/measures/AllMeasures.vue'
import GuidelinesSection from '@/components/frontend/measures/GuidelinesSection.vue'
import ResourcesSection from '@/components/frontend/measures/ResourcesSection.vue'
import MeasureModal from '@/components/frontend/measures/MeasureModal.vue'
import RegistrationModal from '@/components/frontend/auth/RegistrationModal.vue'
import Footer from '@/components/frontend/layouts/footer.vue'
import { useScalesStore } from '@/stores/scales'
import { resourcesData } from '@/data/measures'
import { useTranslations } from '@/composables/useTranslations'

export default {
  name: 'MeasuresPage',
  components: {
    Header,
    Footer,
    Hero,
    CategorySection,
    PopularMeasures,
    AllMeasures,
    GuidelinesSection,
    ResourcesSection,
    MeasureModal,
    RegistrationModal
  },
  setup() {
    // استخدام الـ store
    const scalesStore = useScalesStore()
    
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
      fetchMeasuresData()
    })

    onUnmounted(() => {
      window.removeEventListener('languageChanged', handleLanguageChange)
    })

    // البيانات
    const resources = ref(resourcesData)

    // الحسابات
    const scales = computed(() => scalesStore.scales)
    const loading = computed(() => scalesStore.loading)
    const error = computed(() => scalesStore.error)

    const filteredMeasures = computed(() => {
      let filtered = scales.value
      
      if (activeFilter.value !== 'allMeasures') {
        const categoryMap = {
          'forWomen': 'women',
          'forChildren': 'children',
          'forSpecialists': 'specialists'
        }
        
        filtered = filtered.filter(measure => {
          // البحث في اسم التصنيف أو وصفه
          const categoryName = measure.category?.name_ar?.toLowerCase() || ''
          const categoryNameEn = measure.category?.name_en?.toLowerCase() || ''
          const targetCategory = categoryMap[activeFilter.value]?.toLowerCase()
          
          return categoryName.includes(targetCategory) || 
                 categoryNameEn.includes(targetCategory) ||
                 measure.category_id?.toString().includes(targetCategory)
        })
      }
      
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(measure => {
          const titleAr = measure.name_ar?.toLowerCase() || ''
          const titleEn = measure.name_en?.toLowerCase() || ''
          const descAr = measure.description_ar?.toLowerCase() || ''
          const descEn = measure.description_en?.toLowerCase() || ''
          
          return titleAr.includes(query) || 
                 titleEn.includes(query) ||
                 descAr.includes(query) ||
                 descEn.includes(query)
        })
      }
      
      return filtered
    })
    
    const popularMeasures = computed(() => {
      // يمكنك تعديل هذا المنطق بناءً على كيفية تحديد الشعبية في الباك إند
      return scales.value
        .filter(scale => scale.is_active) // المقاييس النشطة فقط
        .slice(0, 4) // أول 4 مقاييس
    })

    // دوال جلب البيانات
    const fetchMeasuresData = async () => {
      try {
        await scalesStore.fetchScales()
        await scalesStore.fetchCategories()
      } catch (err) {
        console.error('❌ فشل في تحميل بيانات المقاييس:', err)
      }
    }

    // تحويل بيانات الـ API لتتوافق مع المكونات
    const transformScaleForFrontend = (scale) => {
      return {
        id: scale.id,
        title: {
          ar: scale.name_ar,
          en: scale.name_en
        },
        description: {
          ar: scale.description_ar,
          en: scale.description_en
        },
        image: scale.image_url || getDefaultImage(scale.category?.name_ar),
        category: scale.category?.name_ar || 'عام',
        time: '5-10', // يمكنك إضافة هذا الحقل في الباك إند
        questions: scale.questions || [],
        rating: 4.5, // يمكنك إضافة التقييم في الباك إند
        reviews: Math.floor(Math.random() * 100) + 1, // بيانات تجريبية
        icon: getCategoryIcon(scale.category?.name_ar),
        is_active: scale.is_active
      }
    }

    const getDefaultImage = (category) => {
      const images = {
        'نساء': "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
        'أطفال': "https://images.unsplash.com/photo-1536623975707-c4b3b2af565d?auto=format&fit=crop&w=800&q=80",
      }
      return images[category] || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=800&q=80"
    }

    const getCategoryIcon = (category) => {
      const icons = {
        'نساء': 'fas fa-female',
        'أطفال': 'fas fa-child',
        'متخصصين': 'fas fa-user-md'
      }
      return icons[category] || 'fas fa-chart-bar'
    }

    // الدوال
    const { translate } = useTranslations()

    const openRegistrationModal = (measure) => {
      // تحويل البيانات من الـ API لتتوافق مع المكون
      currentMeasure.value = transformScaleForFrontend(measure)
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
        if (answer !== undefined && measure.questions[index]?.options) {
          const option = measure.questions[index].options[answer]
          score += option?.score_value || 0
        }
      })
          
      // حساب أقصى درجة ممكنة
      const maxScore = measure.questions?.reduce((total, question) => {
        const maxOptionScore = Math.max(...question.options.map(opt => opt.score_value || 0))
        return total + maxOptionScore
      }, 0) || 0
      
      // الحصول على التفسير المناسب
      const interpretation = getInterpretation(score, maxScore, currentLanguage.value)
      
      testResult.value = { 
        score: Math.round(score), 
        maxScore: Math.round(maxScore), 
        interpretation 
      }
      
      testStep.value = 'results'
    }

    const getInterpretation = (score, maxScore, language) => {
      const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0
      
      if (percentage >= 80) {
        return {
          level: language === 'ar' ? 'مرتفع' : 'High',
          desc: language === 'ar' 
            ? 'نتيجتك تشير إلى مستوى مرتفع. ننصح بمراجعة مختص للدعم المناسب.'
            : 'Your results indicate a high level. We recommend consulting a specialist for appropriate support.'
        }
      } else if (percentage >= 50) {
        return {
          level: language === 'ar' ? 'متوسط' : 'Medium',
          desc: language === 'ar'
            ? 'نتيجتك تشير إلى مستوى متوسط. ننصح بممارسة تقنيات الاسترخاء.'
            : 'Your results indicate a medium level. We recommend practicing relaxation techniques.'
        }
      } else {
        return {
          level: language === 'ar' ? 'منخفض' : 'Low',
          desc: language === 'ar'
            ? 'نتيجتك تشير إلى مستوى منخفض. حافظ على ممارسة العادات الصحية.'
            : 'Your results indicate a low level. Maintain healthy habits.'
        }
      }
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
      scales,
      resources,
      filteredMeasures,
      popularMeasures,
      currentLanguage,
      loading,
      error,
      translate,
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
      switchToLogin,
      fetchMeasuresData
    }
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, rgba(158, 191, 59, 0.05) 0%, rgba(214, 162, 154, 0.05) 100%);
}
</style>