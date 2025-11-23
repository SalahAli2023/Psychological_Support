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
    <RegistrationModal
      :show-registration="showRegistrationModal"
      :language="currentLanguage"
      @close="closeRegistrationModal"
      @switch-to-login="switchToLogin"
      @registration-success="handleRegistrationSuccess"
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
import RegistrationModal from '@/components/frontend/auth/RegistrationModal.vue'
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
    RegistrationModal
  },
  setup() {
    // استخدام الـ stores
    const frontendScalesStore = useFrontendScalesStore()
    const authStore = useAuthStore()
    
    // الحالة العامة
    const searchQuery = ref('')
    const activeFilter = ref('allMeasures')
    const showRegistrationModal = ref(false)
    const showMeasureModal = ref(false)
    const currentMeasure = ref(null)
    const currentLanguage = ref(localStorage.getItem('preferredLanguage') || 'ar')
    
    // حالة الاختبار
    const testStep = ref('info')
    const testAnswers = ref([])
    const testResult = ref(null)
    const sessionKey = ref(null)
    const pendingTestData = ref(null) // بيانات الاختبار المعلقة

    // 🔥 NEW: فحص وتحويل من admin
    const checkAndRedirectFromAdmin = () => {
      const currentPath = window.location.pathname;
      if (currentPath.includes('/admin/login')) {
        console.log('🚫 تم اكتشاف تحويل إلى admin/login - إعادة التوجيه إلى الصفحة الرئيسية');
        window.history.replaceState({}, '', '/measures');
        showRegistrationModal.value = true;
      }
    }

    // تحديث اللغة تلقائيًا عند تغييرها من الهيدر
    const handleLanguageChange = (event) => {
      console.log('🔄 تغيير اللغة إلى:', event.detail.language)
      currentLanguage.value = event.detail.language
    }

    onMounted(() => {
      console.log('🚀 تحميل صفحة المقاييس...')
      
      // 🔥 NEW: فحص وتحويل من admin فور التحميل
      checkAndRedirectFromAdmin()
      
      window.addEventListener('languageChanged', handleLanguageChange)
      
      // 🔥 NEW: مراقبة تغييرات المسار لمنع التحويل إلى admin
      window.addEventListener('popstate', checkAndRedirectFromAdmin)
      
      fetchMeasuresData()
    })

    onUnmounted(() => {
      console.log('🧹 تنظيف صفحة المقاييس...')
      window.removeEventListener('languageChanged', handleLanguageChange)
      window.removeEventListener('popstate', checkAndRedirectFromAdmin)
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
      console.log('🔍 تطبيق الفلترة...')
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
      
      console.log('✅ عدد النتائج بعد الفلترة:', filtered.length)
      return filtered
    })

    // دوال جلب البيانات
    const fetchMeasuresData = async () => {
      console.log('🔄 بدء جلب بيانات المقاييس...')
      try {
        // جلب البيانات بالتوازي
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
      console.log('🎛️ تغيير الفلتر إلى:', filter)
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
      console.log('🔎 تغيير البحث إلى:', query)
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
        
        // فتح مودال الأسئلة مباشرة
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

    // 🔥 NEW: دالة handleTestSubmit المحسنة مع منع التحويل
    const handleTestSubmit = async (answers) => {
      console.log('📤 معالجة إرسال الاختبار')
      
      // 🔥 NEW: تحقق إضافي لمنع التحويل إلى admin
      if (window.location.pathname.includes('/admin')) {
        console.error('❌ محاولة الوصول إلى admin من الفرونتند - فتح التسجيل')
        openRegistrationForGuest([])
        return
      }
      
      try {
        const frontendScalesStore = useFrontendScalesStore()
        
        // تحويل الإجابات للصيغة المطلوبة
        const formattedAnswers = currentMeasure.value.questions.map((question, index) => ({
          question_id: question.id,
          option_id: answers[index]
        })).filter(answer => answer.option_id)

        console.log('📤 إرسال الإجابات:', formattedAnswers)

        // استخدام الدالة المحسنة من الـ store
        const result = await frontendScalesStore.submitTestWithAuthCheck(
          currentMeasure.value.id, 
          formattedAnswers
        )
        
        console.log('📋 نتيجة الإرسال:', result)
        
        // 🔥 NEW: معالجة خاصة للتحويلات المحظورة
        if (result.blocked_admin_redirect || result.blocked_redirect) {
          console.log('🚫 تم منع تحويل إلى admin - فتح التسجيل')
          openRegistrationForGuest(formattedAnswers)
          return
        }
        
        // 🔥 التعديل: التحقق من أن result غير undefined
        if (!result) {
          console.error('❌ result is undefined - فتح التسجيل مباشرة')
          openRegistrationForGuest(formattedAnswers)
          return
        }
        
        // التحقق من requires_login بشكل صحيح
        if (result.requires_login === true) {
          console.log('🔐 مطلوب تسجيل دخول لحفظ النتيجة')
          handleGuestSubmission(result, formattedAnswers)
        } else {
          // إذا تم الإرسال بنجاح (سواء مسجل أو غير مسجل)
          testResult.value = result
          testStep.value = 'results'
          console.log('✅ تم حفظ النتيجة بنجاح')
        }
        
      } catch (error) {
        console.error('❌ خطأ في إرسال الاختبار:', error)
        
        // في حالة الخطأ، فتح مودال التسجيل
        openRegistrationForGuest([])
      }
    }

    // 🔥 NEW: دالة مساعدة لمعالجة إرسال الضيوف
    const handleGuestSubmission = (result, formattedAnswers) => {
      sessionKey.value = result.data?.session_key
      
      // حفظ البيانات المؤقتة في localStorage
      const sessionKeyToSave = result.data?.session_key || `temp_${Date.now()}_${currentMeasure.value.id}`
      localStorage.setItem('pending_assessment_session', sessionKeyToSave)
      localStorage.setItem('pending_assessment_scale_id', currentMeasure.value.id)
      
      pendingTestData.value = {
        measure: currentMeasure.value,
        answers: formattedAnswers,
        result: result
      }
      
      // فتح مودال التسجيل
      console.log('📝 فتح مودال التسجيل...')
      closeMeasureModal()
      setTimeout(() => {
        showRegistrationModal.value = true
      }, 300)
    }

    // 🔥 NEW: دالة لفتح التسجيل للضيوف
    const openRegistrationForGuest = (formattedAnswers) => {
      console.log('👤 فتح التسجيل للضيف...')
      
      // حفظ البيانات المؤقتة
      localStorage.setItem('pending_assessment_session', `temp_${Date.now()}_${currentMeasure.value.id}`)
      localStorage.setItem('pending_assessment_scale_id', currentMeasure.value.id)
      
      pendingTestData.value = {
        measure: currentMeasure.value,
        answers: formattedAnswers,
        result: null
      }
      
      closeMeasureModal()
      setTimeout(() => {
        showRegistrationModal.value = true
      }, 300)
    }

    // فتح مودال التسجيل
    const openRegistrationModal = () => {
      console.log('📝 فتح مودال التسجيل')
      showRegistrationModal.value = true
    }

    const closeRegistrationModal = () => {
      console.log('❌ إغلاق مودال التسجيل')
      showRegistrationModal.value = false
    }

    // 🔥 NEW: دالة handleRegistrationSuccess المحسنة مع التحقق من null
    const handleRegistrationSuccess = async (savedResult) => {
      console.log('✅ تسجيل ناجح، معالجة النتيجة:', savedResult)
      console.log('📊 بيانات الاختبار المعلقة:', pendingTestData.value)
      
      closeRegistrationModal()
      
      // 🔥 NEW: التحقق من وجود بيانات اختبار معلقة
      if (!pendingTestData.value) {
        console.log('ℹ️ لا توجد بيانات اختبار معلقة - إغلاق المودال فقط')
        return
      }
      
      // 🔥 NEW: التحقق من وجود measure في البيانات المعلقة
      if (!pendingTestData.value.measure) {
        console.error('❌ بيانات measure مفقودة في pendingTestData')
        return
      }
      
      if (savedResult) {
        // إذا تم حفظ النتيجة بنجاح، عرضها مباشرة
        console.log('💾 تم حفظ النتيجة في user_assessments بنجاح')
        currentMeasure.value = pendingTestData.value.measure
        testResult.value = savedResult
        testStep.value = 'results'
        showMeasureModal.value = true
        
        // 🔥 NEW: تنظيف البيانات المؤقتة بعد الاستخدام
        pendingTestData.value = null
        localStorage.removeItem('pending_assessment_session')
        localStorage.removeItem('pending_assessment_scale_id')
      } else if (pendingTestData.value && pendingTestData.value.measure) {
        // إذا لم يتم حفظ النتيجة، إعادة فتح المودال مع البيانات الأصلية
        console.log('🔄 إعادة فتح المودال مع البيانات الأصلية')
        currentMeasure.value = pendingTestData.value.measure
        testResult.value = pendingTestData.value.result
        testStep.value = 'results'
        showMeasureModal.value = true
      } else {
        console.error('❌ لا توجد بيانات صالحة لعرض النتيجة')
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
        openRegistrationModal()
      }, 300)
    }

    const switchToLogin = () => {
      console.log('🔐 التحويل لتسجيل الدخول')
      // يمكنك إضافة منطق التحويل لتسجيل الدخول هنا
    }

    // 🔥 NEW: دالة للتحقق من اتصال الخادم
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
      showRegistrationModal,
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
      closeRegistrationModal,
      handleRegistrationSuccess,
      closeMeasureModal,
      startTest,
      handleTestSubmit,
      retakeTest,
      showOtherMeasures,
      handleOpenRegistration,
      switchToLogin,
      fetchMeasuresData,
      handleFilterChange,
      handleSearchChange,
      checkServerConnection
    }
  }
}
</script>