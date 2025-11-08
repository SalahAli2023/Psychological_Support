<template>
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold mb-4 text-gray-800">{{ translate('categorySection.title') }}</h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">{{ translate('categorySection.subtitle') }}</p>
      </div>
      
      <!-- شبكة التصنيفات -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="relative bg-white rounded-2xl shadow-xl p-6 cursor-pointer border-2 transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50 category-card"
          :class="activeCategory === category.id 
            ? 'border-primary-green ring-4 ring-primary-green/20' 
            : 'border-transparent hover:border-primary-green/30'"
          @click="$emit('filter-change', category.filter)"
        >
          <!-- أيقونة التصنيف -->
          <div 
            class="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 relative overflow-hidden transition-all duration-300 hover:scale-110 hover:rotate-6"
            :class="[category.color, 'hover:before:opacity-100']"
          >
            <i :class="category.icon" class="text-white text-3xl z-10"></i>
            <div class="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 transition-opacity duration-300 before:opacity-0"></div>
          </div>
          
          <!-- عنوان التصنيف -->
          <h3 class="text-xl font-bold text-center mb-4 text-gray-800">{{ translate(`categories.${category.id}.title`) }}</h3>
          
          <!-- وصف التصنيف -->
          <p class="text-gray-600 text-center mb-6 text-sm leading-relaxed">{{ translate(`categories.${category.id}.description`) }}</p>
          
          <!-- إحصائيات التصنيف -->
          <div class="flex justify-center gap-6 mb-6 text-sm">
            <div class="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
              <i class="fas fa-chart-bar text-primary-green"></i>
              <span class="font-semibold text-gray-700">{{ getMeasuresCount(category.id) }} {{ translate('categorySection.measuresCount') }}</span>
            </div>
            <div class="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
              <i class="fas fa-clock text-primary-green"></i>
              <span class="font-semibold text-gray-700">{{ getAverageTime(category.id) }} {{ translate('categorySection.averageTime') }}</span>
            </div>
          </div>
          
          <!-- زر التصفح -->
          <button class="w-full py-3 bg-gradient-to-l from-primary-green to-secondary-green text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-2 hover:scale-105">
            <span>{{ translate('categorySection.browseButton') }}</span>
            <i class="fas fa-arrow-left text-sm"></i>
          </button>

          <!-- شريط التمييز السفلي -->
          <div 
            class="absolute bottom-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-primary-green to-transparent transition-opacity duration-300"
            :class="activeCategory === category.id ? 'opacity-100' : 'opacity-0'"
          ></div>
        </div>
      </div>

      <!-- مؤشر التصنيف النشط -->
      <div class="text-center mt-8">
        <div class="inline-flex items-center gap-4 bg-gray-100 rounded-full px-6 py-3">
          <span class="text-gray-700 font-medium">{{ translate('categorySection.activeCategory') }}</span>
          <span class="bg-primary-green text-white px-4 py-1 rounded-full font-semibold flex items-center gap-2">
            <i :class="getActiveCategoryIcon" class="text-sm"></i>
            {{ getActiveCategoryTitle }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { computed } from 'vue'
import { categoriesData } from '@/data/measures'
import { useTranslations } from '@/composables/useTranslations'

export default {
  name: 'CategorySection',
  props: {
    activeCategory: {
      type: String,
      default: 'all'
    },
    searchQuery: {
      type: String,
      default: ''
    },
    measures: {
      type: Array,
      default: () => []
    },
    filteredMeasuresCount: {
      type: Number,
      default: 0
    },
    language: {
      type: String,
      default: 'ar'
    }
  },
  emits: ['filter-change', 'update:searchQuery'],
  setup(props) {
    const categories = categoriesData
    const { translate } = useTranslations()

    // دالة الترجمة
    const getMeasuresCount = (categoryId) => {
      if (categoryId === 'all') return props.measures.length
      
      const categoryMap = {
        'women': 'women',
        'children': 'children', 
      }
      
      return props.measures.filter(measure => 
        measure.category === categoryMap[categoryId]
      ).length
    }

    // حساب متوسط الوقت في كل تصنيف
    const getAverageTime = (categoryId) => {
      if (categoryId === 'all') {
        const times = props.measures.map(m => {
          const [min] = m.time.split('-').map(Number)
          return min
        })
        return Math.round(times.reduce((a, b) => a + b, 0) / times.length) || 0
      }
      
      const categoryMap = {
        'women': 'women',
        'children': 'children',
      }
      
      const categoryMeasures = props.measures.filter(measure => 
        measure.category === categoryMap[categoryId]
      )
      
      if (categoryMeasures.length === 0) return 0
      
      const times = categoryMeasures.map(m => {
        const [min] = m.time.split('-').map(Number)
        return min
      })
      
      return Math.round(times.reduce((a, b) => a + b, 0) / times.length)
    }

    // الحصول على أيقونة التصنيف النشط
    const getActiveCategoryIcon = computed(() => {
      const category = categories.find(cat => 
        props.activeCategory === 'allMeasures' ? cat.id === 'all' : cat.filter === props.activeCategory
      )
      return category?.icon || 'fas fa-layer-group'
    })

    // الحصول على عنوان التصنيف النشط
    const getActiveCategoryTitle = computed(() => {
      const category = categories.find(cat => 
        props.activeCategory === 'allMeasures' ? cat.id === 'all' : cat.filter === props.activeCategory
      )
      return category ? translate(`categories.${category.id}.title`) : translate('categories.all.title')
    })

    return {
      categories,
      translate,
      getMeasuresCount,
      getAverageTime,
      getActiveCategoryIcon,
      getActiveCategoryTitle
    }
  }
}
</script>

<style scoped>
/* CSS الضرورية فقط للتأثيرات التي لا تدعمها Tailwind */
.category-card-hover::before {
  background: linear-gradient(135deg, rgba(158, 191, 59, 0.05) 0%, rgba(214, 162, 154, 0.05) 100%);
  /* transition: all 0.3s ease; */
}

.category-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}
</style>