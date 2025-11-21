<template>
  <div>
    <!-- الفلترة للجوال -->
    <button 
      @click="toggleMobileFilter"
      class="md:hidden w-full bg-white text-gray-800 px-6 py-4 rounded-xl flex items-center justify-between font-bold text-lg mb-4 border border-gray-200 hover:bg-gray-50 transition-all duration-200"
      :class="isRTL ? 'flex-row-reverse' : 'flex-row'"
    >
      <span class="flex items-center gap-3" :class="isRTL ? 'flex-row-reverse' : 'flex-row'">
        <i class="fas fa-filter text-lg text-primary-green"></i>
        {{ translate('filters.mobileTitle') }}
      </span>
      <i :class="showMobileFilter ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" class="text-gray-600 text-sm transition-transform duration-200"></i>
    </button>

    <!-- الفلتر للجوال -->
    <transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 transform -translate-y-2"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform -translate-y-2"
    >
      <div v-if="showMobileFilter" class="md:hidden bg-white p-5 rounded-xl border border-gray-200 mb-4">
        <!-- الهيدر -->
        <div class="flex justify-between items-center mb-5 pb-4 border-b border-gray-100" :class="isRTL ? 'flex-row-reverse' : 'flex-row'">
          <div class="flex items-center gap-3" :class="isRTL ? 'flex-row-reverse' : 'flex-row'">
            <div class="w-9 h-9 bg-primary-green rounded-lg flex items-center justify-center">
              <i class="fas fa-filter text-white text-base"></i>
            </div>
            <div :class="isRTL ? 'text-right' : 'text-left'">
              <h3 class="font-bold text-lg text-gray-800">{{ translate('filters.title') }}</h3>
              <p class="text-xs text-gray-500">{{ translate('filters.subtitle') }}</p>
            </div>
          </div>
          <button @click="toggleMobileFilter" class="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-lg flex items-center justify-center transition-colors duration-200">
            <i class="fas fa-times text-sm"></i>
          </button>
        </div>
        
        <!-- قسم الفلاتر -->
        <div class="max-h-80 overflow-y-auto pr-2">
          <FilterSection 
            :filters="translatedFilters"
            :selectedFilters="selectedFilters"
            :openDropdowns="openDropdowns"
            @toggle-dropdown="toggleDropdown"
            @toggle-filter="toggleFilterItem"
          />
        </div>
        
        <!-- أزرار الإجراءات -->
        <div class="flex gap-2 mt-6 pt-5 border-t border-gray-100" :class="isRTL ? 'flex-row-reverse' : 'flex-row'">
          <button
            @click="clearFilters"
            class="flex-1 border border-red-500 text-red-500 px-4 py-3 rounded-lg hover:bg-red-50 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
            :class="isRTL ? 'flex-row-reverse' : 'flex-row'"
          >
            <i class="fas fa-broom text-sm"></i>
            {{ translate('buttons.clearAll') }}
          </button>
          <button
            @click="toggleMobileFilter"
            class="flex-1 bg-primary-green text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
            :class="isRTL ? 'flex-row-reverse' : 'flex-row'"
          >
            <i class="fas fa-check text-sm"></i>
            {{ translate('buttons.applyFilters') }}
          </button>
        </div>
      </div>
    </transition>

    <!-- الفلتر للشاشات الكبيرة -->
    <div class="hidden md:block w-full md:w-72 bg-white p-6 rounded-xl border border-gray-200 h-fit sticky top-24">
      <!-- الهيدر -->
      <div class="flex justify-between items-center mb-6 pb-4 border-b border-gray-100" :class="isRTL ? 'flex-row-reverse' : 'flex-row'">
        <div class="flex items-center gap-3" :class="isRTL ? 'flex-row-reverse' : 'flex-row'">
          <div class="w-10 h-10 bg-primary-green rounded-xl flex items-center justify-center">
            <i class="fas fa-filter text-white text-lg"></i>
          </div>
          <div :class="isRTL ? 'text-right' : 'text-left'">
            <h3 class="font-bold text-xl text-gray-800">{{ translate('filters.title') }}</h3>
            <p class="text-xs text-gray-500 mt-1">{{ translate('filters.subtitle') }}</p>
          </div>
        </div>
        <button 
          @click="clearFilters" 
          class="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-lg flex items-center justify-center transition-colors duration-200"
          :title="translate('buttons.resetFilters')"
        >
          <i class="fas fa-redo-alt text-xs"></i>
        </button>
      </div>
      
      <!-- إحصائيات الفلاتر -->
      <div class="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
        <div class="flex justify-between items-center text-sm" :class="isRTL ? 'flex-row-reverse' : 'flex-row'">
          <span class="text-gray-600 font-medium">{{ translate('filters.appliedFilters') }}:</span>
          <span class="bg-primary-green text-white px-2 py-1 rounded-full font-medium text-xs">
            {{ getAppliedFiltersCount }}
          </span>
        </div>
      </div>
      
      <!-- قسم الفلاتر -->
      <div class="space-y-3 max-h-[450px] overflow-y-auto pr-2">
        <FilterSection 
          :filters="translatedFilters"
          :selectedFilters="selectedFilters"
          :openDropdowns="openDropdowns"
          @toggle-dropdown="toggleDropdown"
          @toggle-filter="toggleFilterItem"
        />
      </div>
      
      <!-- زر تطبيق الفلاتر -->
      <button
        @click="$emit('apply-filters')"
        class="w-full mt-6 bg-primary-green text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
        :class="isRTL ? 'flex-row-reverse' : 'flex-row'"
      >
        <i class="fas fa-check text-sm"></i>
        {{ translate('buttons.applyFilters') }}
        <span v-if="getAppliedFiltersCount > 0" class="bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
          {{ getAppliedFiltersCount }}
        </span>
      </button>
    </div>
  </div>
</template>

<script>
import FilterSection from './FilterSection.vue'
import { useTranslations } from '@/composables/useTranslations'

export default {
  name: 'BookFilters',
  components: {
    FilterSection
  },
  props: {
    filters: {
      type: Object,
      required: true
    },
    selectedFilters: {
      type: Object,
      required: true
    },
    openDropdowns: {
      type: Object,
      required: true
    }
  },
  setup() {
    const { translate, currentLanguage } = useTranslations()
    
    const isRTL = currentLanguage.value === 'ar'
    
    return {
      translate,
      isRTL
    }
  },
  data() {
    return {
      showMobileFilter: false
    }
  },
  computed: {
    getAppliedFiltersCount() {
      let count = 0;
      Object.values(this.selectedFilters).forEach(filterArray => {
        count += filterArray.length;
      });
      return count;
    },
    translatedFilters() {
      // تحويل مفاتيح الفلاتر بناءً على اللغة
      const translated = {}
      Object.keys(this.filters).forEach(key => {
        const translatedKey = this.getTranslatedFilterKey(key)
        translated[translatedKey] = this.filters[key]
      })
      return translated
    }
  },
  emits: ['toggle-dropdown', 'toggle-filter', 'clear-filters', 'apply-filters'],
  methods: {
    getTranslatedFilterKey(oldKey) {
      const keyMap = {
        'التصنيفات': this.translate('filters.categories'),
        'اسم المؤلف': this.translate('filters.authors'),
        'اللغة': this.translate('filters.languages'),
        'سنة النشر': this.translate('filters.years'),
        'التقييم': this.translate('filters.ratings')
      }
      return keyMap[oldKey] || oldKey
    },
    toggleMobileFilter() {
      this.showMobileFilter = !this.showMobileFilter;
    },
    toggleDropdown(title) {
      this.$emit('toggle-dropdown', title);
    },
    clearFilters() {
      this.$emit('clear-filters');
      if (this.showMobileFilter) {
        this.showMobileFilter = false;
      }
    },
    toggleFilterItem(category, item) {
      this.$emit('toggle-filter', category, item);
    }
  }
};
</script>

<style scoped>
/* تخصيص شريط التمرير */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* تحسينات للاستجابة على الجوال */
@media (max-width: 768px) {
  .sticky {
    position: static;
  }
}
</style>