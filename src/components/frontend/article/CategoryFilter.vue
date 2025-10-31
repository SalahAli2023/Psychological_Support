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
          placeholder="ابحث في المقالات..."
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
            {{ category.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
  data() {
    return {
      searchQuery: '',
      isDropdownOpen: false
    }
  },
  computed: {
    activeCategoryName() {
      const category = this.categories.find(cat => cat.id === this.activeCategory);
      return category ? category.name : 'جميع المقالات';
    },
    activeCategoryIcon() {
      const category = this.categories.find(cat => cat.id === this.activeCategory);
      return category ? category.icon : 'fa-list';
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
    // إغلاق القائمة المنسدلة عند النقر خارجها
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.closeDropdown();
      }
    });
  }
}
</script>