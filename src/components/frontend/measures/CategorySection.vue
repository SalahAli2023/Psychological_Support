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
          class="category-card bg-white rounded-2xl shadow-xl p-6 cursor-pointer border-2 transition-all duration-300"
          :class="activeCategory === category.id ? 'border-primary-green ring-4 ring-primary-green/20' : 'border-transparent'"
          @click="$emit('filter-change', category.filter)"
        >
          <!-- أيقونة التصنيف -->
          <div class="category-icon w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 relative overflow-hidden" :class="category.color">
            <i :class="category.icon" class="text-white text-3xl z-10"></i>
            <div class="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
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
          <button class="w-full py-3 bg-gradient-to-l from-primary-green to-secondary-green text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold text-lg flex items-center justify-center gap-2">
            <span>{{ translate('categorySection.browseButton') }}</span>
            <i class="fas fa-arrow-left text-sm"></i>
          </button>

          <!-- شريط التمييز السفلي -->
          <div class="absolute bottom-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-primary-green to-transparent opacity-0 transition-opacity duration-300" :class="activeCategory === category.id ? 'opacity-100' : ''"></div>
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

    <div class="text-center mt-12">
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">{{ translate('categorySection.searchHint') }}</p>
      </div>

    <!-- شريط البحث في قسم التصنيفات -->
      <div class="max-w-2xl mx-auto mt-4">
        <div class="relative">
          <input 
            type="text" 
            :value="searchQuery"
            @input="$emit('update:searchQuery', $event.target.value)"
            :placeholder="translate('categorySection.searchPlaceholder')"
            class="w-full px-6 py-4 pr-16 rounded-2xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-primary-green/30 shadow-lg border border-gray-200 text-lg"
          >
          <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
            <i class="fas fa-search text-xl"></i>
          </div>
          <div class="absolute left-10 top-1/2 transform -translate-y-1/2">
            <span class="bg-primary-green text-white px-3 py-1 rounded-full text-sm">
              {{ filteredMeasuresCount }} {{ translate('categorySection.resultsCount') }}
            </span>
          </div>
        </div>
      </div>

  </section>
</template>

<script>
import { computed } from 'vue'
import { categoriesData } from '@/data/measures'
import { t } from '@/locales'

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

    // دالة الترجمة
    const translate = (key) => {
      return t(key, props.language)
    }

    // حساب عدد المقاييس في كل تصنيف
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
        'specialists': 'specialists'
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
.category-card {
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(158, 191, 59, 0.05) 0%, rgba(214, 162, 154, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  border-radius: 1rem;
}

.category-card:hover::before {
  opacity: 1;
}

.category-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.category-icon {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.category-icon::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.category-card:hover .category-icon {
  transform: scale(1.1) rotate(5deg);
}

.category-card:hover .category-icon::before {
  opacity: 1;
}

/* تأثيرات للبحث */
.search-highlight {
  background: linear-gradient(120deg, #9EBF3B33, #D6A29A33);
  background-repeat: no-repeat;
  background-size: 100% 0.4em;
  background-position: 0 88%;
}
</style>