<template>
  <div class="search-filter-container">
    <!-- شريط البحث والتصفية -->
    <div class="search-filter-bar">
      <!-- محرك البحث -->
      <div class="search-box">
        <i class="fas fa-search search-icon"></i>
        <input
          type="text"
          v-model="searchQuery"
          @input="handleSearch"
          :placeholder="searchPlaceholder"
          class="search-input"
        />
      </div>

      <!-- القائمة المنسدلة للتصنيفات -->
      <div class="dropdown-container">
        <div class="dropdown-trigger" @click="toggleDropdown">
          <span>
            <i :class="['fas', activeCategoryIcon]"></i>
            {{ activeCategoryName }}
          </span>
          <i class="fas fa-chevron-down dropdown-arrow" :class="{ rotated: isDropdownOpen }"></i>
        </div>
        
        <div class="dropdown-menu" :class="{ open: isDropdownOpen }">
          <div
            v-for="category in categories"
            :key="category.id"
            @click="handleCategoryChange(category.id)"
            :class="['dropdown-item', { active: activeCategory === category.id }]"
          >
            <i :class="['fas', category.icon]"></i>
            {{ getTranslatedCategoryName(category) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useTranslations } from '@/composables/useTranslations'
import { computed } from 'vue'

export default {
  name: 'SearchAndFilter',
  props: {
    categories: {
      type: Array,
      required: true
    },
    activeCategory: {
      type: String,
      required: true
    }
  },
  emits: ['category-change', 'search-change'],
  setup(props) {
    const { translate, currentLanguage } = useTranslations()
    
    // استخدام computed لجعل searchPlaceholder تفاعلية
    const searchPlaceholder = computed(() => {
      return translate('filter.searchPlaceholder')
    })

    // دالة لترجمة أسماء التصنيفات
    const getTranslatedCategoryName = (category) => {
      if (category.id === 'all') {
        return translate('filter.allCategories')
      }
      // يمكنك إضافة ترجمات إضافية للتصنيفات الأخرى هنا
      return category.name
    }

    // دالة لترجمة التصنيف النشط
    const activeCategoryName = computed(() => {
      if (props.activeCategory === 'all') {
        return translate('filter.allCategories')
      }
      const category = props.categories.find(cat => cat.id === props.activeCategory)
      return category ? category.name : translate('filter.allCategories')
    })

    const activeCategoryIcon = computed(() => {
      const category = props.categories.find(cat => cat.id === props.activeCategory)
      return category ? category.icon : 'fa-list'
    })

    return {
      searchPlaceholder,
      getTranslatedCategoryName,
      activeCategoryName,
      activeCategoryIcon,
      currentLanguage
    }
  },
  data() {
    return {
      searchQuery: '',
      isDropdownOpen: false
    }
  },
  methods: {
    handleCategoryChange(categoryId) {
      this.$emit('category-change', categoryId);
      this.isDropdownOpen = false;
    },
    handleSearch() {
      this.$emit('search-change', this.searchQuery);
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    closeDropdown() {
      this.isDropdownOpen = false;
    }
  },
  mounted() {
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.closeDropdown();
      }
    });
  }
}
</script>