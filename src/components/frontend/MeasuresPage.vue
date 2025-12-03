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
      <div v-if="loading && !dataLoaded" class="flex justify-center items-center py-20">
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
          @measure-click="handleMeasureClick"
        />
        
        <!-- قسم التصنيفات المدمج مع البحث والفلتر -->
        <CategorySection 
          :activeCategory="activeFilter"
          :searchQuery="searchQuery"
          :measures="scales"
          :filteredMeasuresCount="filteredMeasures.length"
          :language="currentLanguage"
          @filter-change="handleFilterChange"
          @update:searchQuery="handleSearchChange"
        />

        <!-- جميع المقاييس -->
        <AllMeasures 
          :measures="filteredMeasures"
          :activeFilter="activeFilter"
          :language="currentLanguage"
          @measure-click="handleMeasureClick"
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
    <AuthModal
      :show="showAuthModal"
      :show-for-results="showAuthForResults"
      :language="currentLanguage"
      @close="closeAuthModal"
      @login-success="handleLoginSuccess"
      @register-success="handleRegistrationSuccess"
      @password-reset="handlePasswordReset"
      @show-results="handleShowResultsAfterAuth"
    />

    <!-- مودال الاختبار -->
    <MeasureModal
      v-if="showMeasureModal"
      :measure="currentMeasure"
      :test-step="testStep"
      :answers="testAnswers"
      :test-result="testResult"
      :language="currentLanguage"
      @close="closeMeasureModal"
      @start-test="startTest"
      @submit-test="handleTestSubmit"
      @retake-test="retakeTest"
      @show-other-measures="showOtherMeasures"
      @open-registration="handleOpenRegistration"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import Header from '@/components/frontend/layouts/header.vue'
import Hero from '@/components/frontend/layouts/hero.vue'
import PopularMeasures from '@/components/frontend/measures/PopularMeasures.vue'
import CategorySection from '@/components/frontend/measures/CategorySection.vue'
import AllMeasures from '@/components/frontend/measures/AllMeasures.vue'
import GuidelinesSection from '@/components/frontend/measures/GuidelinesSection.vue'
import ResourcesSection from '@/components/frontend/measures/ResourcesSection.vue'
import MeasureModal from '@/components/frontend/measures/MeasureModal.vue'
import AuthModal from '@/components/frontend/auth/AuthModal.vue'
import Footer from '@/components/frontend/layouts/footer.vue'
import { useFrontendScalesStore } from '@/stores/frontendScales.store'
import { useAuthStore } from '@/stores/auth'
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
    AuthModal
  },
  setup() {
    // استخدام الـ stores
    const frontendScalesStore = useFrontendScalesStore()
    const authStore = useAuthStore()
    
    // الحالة العامة
    const searchQuery = ref('')
    const activeFilter = ref('allMeasures')
    const showAuthModal = ref(false)
    const showAuthForResults = ref(false)
    const showMeasureModal = ref(false)
    const currentMeasure = ref(null)
    const currentLanguage = ref(localStorage.getItem('preferredLanguage') || 'ar')
    
    // حالة الاختبار
    const testStep = ref('info')
    const testAnswers = ref([])
    const testResult = ref(null)
    const sessionKey = ref(null)
    const pendingTestData = ref(null)

    // تحديث اللغة تلقائيًا عند تغييرها من الهيدر
    const handleLanguageChange = (event) => {
      console.log('🔄 تغيير اللغة إلى:', event.detail.language)
      currentLanguage.value = event.detail.language
    }

    onMounted(() => {
      console.log('🚀 تحميل صفحة المقاييس...')
      window.addEventListener('languageChanged', handleLanguageChange)
      fetchMeasuresData()
    })

    onUnmounted(() => {
      console.log('🧹 تنظيف صفحة المقاييس...')
      window.removeEventListener('languageChanged', handleLanguageChange)
    })

    // البيانات
    const resources = ref(resourcesData)

    // الحسابات من الـ Store
    const scales = computed(() => frontendScalesStore.scales)
    const loading = computed(() => frontendScalesStore.loading)
    const error = computed(() => frontendScalesStore.error)
    const dataLoaded = computed(() => frontendScalesStore.dataLoaded)
    const popularMeasures = computed(() => frontendScalesStore.popularMeasures)
    const isAuthenticated = computed(() => authStore.isAuthenticated)

    const filteredMeasures = computed(() => {
      let filtered = scales.value
      
      if (activeFilter.value !== 'allMeasures') {
        const categoryMap = {
          'forWomen': 'women',
          'forChildren': 'children',
          'forSpecialists': 'specialists'
        }
        
        filtered = filtered.filter(measure => {
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

    // دوال جلب البيانات
    const fetchMeasuresData = async () => {
      console.log('🔄 بدء جلب بيانات المقاييس...')
      try {
        await Promise.all([
          frontendScalesStore.fetchFrontendScales(),
          frontendScalesStore.fetchFrontendCategories(),
          frontendScalesStore.fetchPopularScales()
        ])
        console.log('✅ تم تحميل جميع بيانات المقاييس بنجاح')
      } catch (err) {
        console.error('❌ فشل في تحميل بيانات المقاييس:', err)
      }
    }

    // معالجة تغييرات البحث والفلتر
    const handleFilterChange = async (filter) => {
      activeFilter.value = filter
      
      if (filter !== 'allMeasures') {
        try {
          const categoryMap = {
            'forWomen': 'women',
            'forChildren': 'children',
            'forSpecialists': 'specialists'
          }
          const categoryId = categoryMap[filter]
          await frontendScalesStore.filterByCategory(categoryId)
        } catch (error) {
          console.error('❌ خطأ في التصفية:', error)
        }
      }
    }

    const handleSearchChange = async (query) => {
      searchQuery.value = query
      
      if (query.trim()) {
        try {
          await frontendScalesStore.searchScales(query)
        } catch (error) {
          console.error('❌ خطأ في البحث:', error)
        }
      }
    }

    // الدوال
    const { translate } = useTranslations()

    // معالجة الضغط على المقياس
    const handleMeasureClick = async (measure) => {
      console.log('🎯 الضغط على المقياس:', measure.id)
      
      try {
        const fullScale = await frontendScalesStore.fetchFrontendFullScale(measure.id)
        currentMeasure.value = fullScale
        openMeasureModal()
      } catch (error) {
        console.error('❌ خطأ في جلب بيانات المقياس:', error)
        currentMeasure.value = measure
        openMeasureModal()
      }
    }

    const openMeasureModal = () => {
      if (currentMeasure.value) {
        console.log('🎯 فتح مودال الاختبار')
        showMeasureModal.value = true
        testStep.value = 'info'
        testAnswers.value = []
        testResult.value = null
        sessionKey.value = null
        pendingTestData.value = null
      }
    }

    const closeMeasureModal = () => {
      console.log('❌ إغلاق مودال الاختبار')
      showMeasureModal.value = false
      currentMeasure.value = null
      testStep.value = 'info'
      testAnswers.value = []
      testResult.value = null
      sessionKey.value = null
      pendingTestData.value = null
    }

    const startTest = () => {
      testStep.value = 'questions'
      testAnswers.value = new Array(currentMeasure.value.questions.length).fill(null)
    }

    // 🔥 NEW: دالة handleTestSubmit المحسنة
    const handleTestSubmit = async (answers) => {
      console.log('📤 معالجة إرسال الاختبار')
      
      try {
        // تحويل الإجابات للصيغة المطلوبة
        const formattedAnswers = currentMeasure.value.questions.map((question, index) => ({
          question_id: question.id,
          option_id: answers[index]
        })).filter(answer => answer.option_id)

        console.log('📤 إرسال الإجابات:', formattedAnswers)

        // 🔥 NEW: محاولة إرسال الاختبار أولاً بغض النظر عن حالة المصادقة
        const result = await frontendScalesStore.submitTestWithAuthCheck(
          currentMeasure.value.id, 
          formattedAnswers
        )
        
        console.log('📋 نتيجة الإرسال:', result)

        // 🔥 NEW: التحقق من النتيجة ومعالجتها
        if (result && result.success) {
          // إذا تم الإرسال بنجاح
          if (result.requires_login === true) {
            // إذا كان مطلوب تسجيل دخول لحفظ النتيجة
            console.log('🔐 مطلوب تسجيل دخول لحفظ النتيجة')
            
            // حفظ البيانات المؤقتة
            pendingTestData.value = {
              measure: currentMeasure.value,
              answers: formattedAnswers,
              result: result,
              sessionKey: result.data?.session_key
            }

            // حفظ في localStorage للاستخدام لاحقاً
            if (result.data?.session_key) {
              localStorage.setItem('pending_assessment_session', result.data.session_key)
              localStorage.setItem('pending_assessment_scale_id', currentMeasure.value.id)
            }

            // إغلاق مودال الاختبار وفتح مودال التسجيل
            closeMeasureModal()
            setTimeout(() => {
              showAuthForResults.value = true
              showAuthModal.value = true
            }, 300)
          } else {
            // إذا تم حفظ النتيجة بنجاح (المستخدم مسجل)
            console.log('✅ تم حفظ النتيجة بنجاح للمستخدم المسجل')
            testResult.value = result
            testStep.value = 'results'
          }
        } else {
          // إذا فشل الإرسال
          console.error('❌ فشل في إرسال الاختبار:', result)
          throw new Error('فشل في إرسال الاختبار')
        }
        
      } catch (error) {
        console.error('❌ خطأ في إرسال الاختبار:', error)
        
        // في حالة الخطأ، فتح مودال التسجيل مع حفظ البيانات
        pendingTestData.value = {
          measure: currentMeasure.value,
          answers: answers.map((answer, index) => ({
            question_id: currentMeasure.value.questions[index].id,
            option_id: answer
          })).filter(answer => answer.option_id),
          result: null,
          sessionKey: null
        }

        closeMeasureModal()
        setTimeout(() => {
          showAuthForResults.value = true
          showAuthModal.value = true
        }, 300)
      }
    }

    // 🔥 NEW: دالة محسنة لتسجيل الدخول الناجح
    const handleLoginSuccess = async (userData) => {
      console.log('✅ تسجيل دخول ناجح:', userData)
      
      // محاولة حفظ الاختبار المعلق بعد تسجيل الدخول
      await handlePendingTestAfterAuth()
    }

    // 🔥 NEW: دالة محسنة للتسجيل الناجح
    const handleRegistrationSuccess = async (userData) => {
      console.log('✅ تسجيل ناجح:', userData)
      
      // محاولة حفظ الاختبار المعلق بعد التسجيل
      await handlePendingTestAfterAuth()
    }

    // 🔥 NEW: دالة محسنة لحفظ الاختبار المعلق بعد المصادقة
    const handlePendingTestAfterAuth = async () => {
      console.log('🔄 معالجة الاختبار المعلق بعد المصادقة')
      
      if (!pendingTestData.value) {
        console.log('ℹ️ لا توجد بيانات اختبار معلقة')
        closeAuthModal()
        return
      }

      try {
        // 🔥 NEW: محاولة حفظ النتيجة بعد المصادقة
        const savedResult = await saveAssessmentResultAfterAuth()
        
        if (savedResult) {
          console.log('💾 تم حفظ النتيجة بعد المصادقة:', savedResult)
          
          // إغلاق مودال التسجيل وفتح مودال النتائج
          closeAuthModal()
          setTimeout(() => {
            currentMeasure.value = pendingTestData.value.measure
            testResult.value = savedResult
            testStep.value = 'results'
            showMeasureModal.value = true
            
            // تنظيف البيانات المؤقتة
            pendingTestData.value = null
            localStorage.removeItem('pending_assessment_session')
            localStorage.removeItem('pending_assessment_scale_id')
          }, 300)
        } else {
          // إذا لم يتم حفظ النتيجة، عرض النتيجة الأصلية
          console.log('🔄 عرض النتيجة الأصلية')
          closeAuthModal()
          setTimeout(() => {
            currentMeasure.value = pendingTestData.value.measure
            testResult.value = pendingTestData.value.result
            testStep.value = 'results'
            showMeasureModal.value = true
            pendingTestData.value = null
          }, 300)
        }
        
      } catch (error) {
        console.error('❌ خطأ في حفظ النتيجة بعد المصادقة:', error)
        
        // في حالة الخطأ، عرض النتيجة الأصلية
        closeAuthModal()
        setTimeout(() => {
          currentMeasure.value = pendingTestData.value.measure
          testResult.value = pendingTestData.value.result
          testStep.value = 'results'
          showMeasureModal.value = true
          pendingTestData.value = null
        }, 300)
      }
    }

    // 🔥 NEW: دالة مساعدة لحفظ نتيجة التقييم بعد المصادقة
    const saveAssessmentResultAfterAuth = async () => {
      try {
        const savedSessionKey = localStorage.getItem('pending_assessment_session')
        const scaleId = localStorage.getItem('pending_assessment_scale_id')
        
        if (savedSessionKey && scaleId) {
          console.log('💾 محاولة حفظ النتيجة بعد التسجيل:', { scaleId, savedSessionKey })
          
          const result = await frontendScalesStore.saveAssessmentResult(scaleId, savedSessionKey)
          console.log('✅ تم حفظ النتيجة بنجاح:', result)
          
          return result
        } else if (pendingTestData.value && pendingTestData.value.answers) {
          // إذا لم يكن هناك session key، إعادة إرسال الاختبار
          console.log('🔄 إعادة إرسال الاختبار بعد التسجيل')
          const result = await frontendScalesStore.submitTestWithAuthCheck(
            pendingTestData.value.measure.id, 
            pendingTestData.value.answers
          )
          return result
        }
      } catch (error) {
        console.error('❌ خطأ في حفظ النتيجة بعد التسجيل:', error)
        throw error
      }
      return null
    }

    // 🔥 NEW: معالجة عرض النتائج بعد المصادقة
    const handleShowResultsAfterAuth = () => {
      console.log('📊 عرض النتائج بعد المصادقة')
      if (pendingTestData.value) {
        closeAuthModal()
        setTimeout(() => {
          currentMeasure.value = pendingTestData.value.measure
          testResult.value = pendingTestData.value.result
          testStep.value = 'results'
          showMeasureModal.value = true
          pendingTestData.value = null
        }, 300)
      }
    }

    const retakeTest = () => {
      testStep.value = 'questions'
      testAnswers.value = new Array(currentMeasure.value.questions.length).fill(null)
      testResult.value = null
      sessionKey.value = null
    }

    const showOtherMeasures = () => {
      console.log('📋 عرض المقاييس الأخرى')
      closeMeasureModal()
    }

    // معالجة فتح التسجيل من المودال
    const handleOpenRegistration = () => {
      console.log('🔐 فتح التسجيل من الاختبار')
      closeMeasureModal()
      setTimeout(() => {
        showAuthForResults.value = true
        showAuthModal.value = true
      }, 300)
    }

    const handlePasswordReset = (userData) => {
      console.log('🔑 إعادة تعيين كلمة المرور:', userData)
      closeAuthModal()
    }

    const closeAuthModal = () => {
      console.log('❌ إغلاق مودال التسجيل')
      showAuthModal.value = false
      showAuthForResults.value = false
    }

    // دالة للتحقق من اتصال الخادم
    const checkServerConnection = async () => {
      console.log('🔍 التحقق من اتصال الخادم...')
      try {
        const isServerOnline = await frontendScalesStore.checkServerStatus()
        if (isServerOnline) {
          console.log('✅ الخادم متاح، جاري إعادة تحميل البيانات...')
          await fetchMeasuresData()
        } else {
          error.value = 'الخادم غير متاح. يرجى تشغيل خادم Laravel.'
        }
      } catch (err) {
        console.error('❌ فشل في التحقق من اتصال الخادم:', err)
        error.value = 'تعذر الوصول إلى الخادم. تأكد من تشغيل `php artisan serve --port=8000`'
      }
    }

    return {
      searchQuery,
      activeFilter,
      showAuthModal,
      showAuthForResults,
      showMeasureModal,
      currentMeasure,
      testStep,
      testAnswers,
      testResult,
      scales,
      resources,
      filteredMeasures,
      popularMeasures,
      currentLanguage,
      loading,
      error,
      dataLoaded,
      translate,
      handleMeasureClick,
      closeAuthModal,
      handleRegistrationSuccess,
      handleLoginSuccess,
      handlePasswordReset,
      handleShowResultsAfterAuth,
      closeMeasureModal,
      startTest,
      handleTestSubmit,
      retakeTest,
      showOtherMeasures,
      handleOpenRegistration,
      fetchMeasuresData,
      handleFilterChange,
      handleSearchChange,
      checkServerConnection
    }
  }
}
</script>