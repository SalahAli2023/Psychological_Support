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
          @measure-click="openRegistrationModal"
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
      :language="currentLanguage"
      @close="closeMeasureModal"
      @show-other-measures="showOtherMeasures"
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
import { useFrontendScalesStore } from '@/stores/frontendScales.store' // 🔥 الجديد
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
    // استخدام الـ store الجديد الخاص بالفرونت
    const frontendScalesStore = useFrontendScalesStore()
    
    // الحالة العامة
    const searchQuery = ref('')
    const activeFilter = ref('allMeasures')
    const showRegistrationModal = ref(false)
    const showMeasureModal = ref(false)
    const currentMeasure = ref(null)
    const currentLanguage = ref(localStorage.getItem('preferredLanguage') || 'ar')

    // تحديث اللغة تلقائيًا عند تغييرها من الهيدر
    const handleLanguageChange = (event) => {
      console.log('🔄 تغيير اللغة إلى:', event.detail.language)
      currentLanguage.value = event.detail.language
    }

    onMounted(() => {
      console.log('🚀 تحميل صفحة المقاييس مع الـ Store الجديد...')
      window.addEventListener('languageChanged', handleLanguageChange)
      fetchMeasuresData()
    })

    onUnmounted(() => {
      console.log('🧹 تنظيف صفحة المقاييس...')
      window.removeEventListener('languageChanged', handleLanguageChange)
    })

    // البيانات
    const resources = ref(resourcesData)

    // الحسابات من الـ Store الجديد
    const scales = computed(() => frontendScalesStore.scales)
    const loading = computed(() => frontendScalesStore.loading)
    const error = computed(() => frontendScalesStore.error)
    const dataLoaded = computed(() => frontendScalesStore.dataLoaded)
    const popularMeasures = computed(() => frontendScalesStore.popularMeasures)

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
      console.log('🔄 بدء جلب بيانات المقاييس من الـ Store الجديد...')
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
      
      // إذا كان الفلتر مختلفاً عن "الكل"، قم بجلب البيانات من السيرفر
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
      
      // إذا كان البحث غير فارغ، قم بالبحث في السيرفر
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

    const openRegistrationModal = async (measure) => {
      console.log('📝 فتح مودال التسجيل للمقياس:', measure.id)
      try {
        const fullScale = await frontendScalesStore.fetchFrontendFullScale(measure.id)
        currentMeasure.value = fullScale
        showRegistrationModal.value = true
      } catch (error) {
        console.error('❌ خطأ في جلب بيانات المقياس:', error)
        currentMeasure.value = measure
        showRegistrationModal.value = true
      }
    }

    const closeRegistrationModal = () => {
      console.log('❌ إغلاق مودال التسجيل')
      showRegistrationModal.value = false
      currentMeasure.value = null
    }

    const handleRegistrationSuccess = () => {
      console.log('✅ تسجيل ناجح، فتح مودال الاختبار')
      closeRegistrationModal()
      openMeasureModal()
    }

    const openMeasureModal = () => {
      if (currentMeasure.value) {
        console.log('🎯 فتح مودال الاختبار')
        showMeasureModal.value = true
      }
    }
    
    const closeMeasureModal = () => {
      console.log('❌ إغلاق مودال الاختبار')
      showMeasureModal.value = false
      currentMeasure.value = null
    }
    
    const showOtherMeasures = () => {
      console.log('📋 عرض المقاييس الأخرى')
      closeMeasureModal()
    }

    const switchToLogin = () => {
      console.log('🔐 التحويل لتسجيل الدخول')
    }

    return {
      searchQuery,
      activeFilter,
      showRegistrationModal,
      showMeasureModal,
      currentMeasure,
      scales,
      resources,
      filteredMeasures,
      popularMeasures,
      currentLanguage,
      loading,
      error,
      dataLoaded,
      translate,
      openRegistrationModal,
      closeRegistrationModal,
      handleRegistrationSuccess,
      openMeasureModal,
      closeMeasureModal,
      showOtherMeasures,
      switchToLogin,
      fetchMeasuresData,
      handleFilterChange,
      handleSearchChange
    }
  }
}
</script>