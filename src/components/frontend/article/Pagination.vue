<template>
  <div class="flex flex-col items-center space-y-6" :dir="currentLanguage === 'ar' ? 'rtl' : 'ltr'">
    <!-- معلومات الصفحة -->
    <div class="text-gray-600 text-sm">
      {{ showingText }}
    </div>

    <!-- أزرار الصفحات -->
    <div class="flex items-center" :class="currentLanguage === 'ar' ? 'space-x-2 space-x-reverse' : 'space-x-2'">
      <!-- زر الصفحة السابقة -->
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        :class="[
          'pagination-btn',
          'prev-next-btn',
          currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary hover:text-white'
        ]"
      >
        <i :class="currentLanguage === 'ar' ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
      </button>

      <!-- أرقام الصفحات -->
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="goToPage(page)"
        :class="[
          'pagination-btn',
          'page-number',
          page === currentPage 
            ? 'active-page' 
            : 'inactive-page hover:bg-gray-100'
        ]"
      >
        {{ page }}
      </button>

      <!-- زر الصفحة التالية -->
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        :class="[
          'pagination-btn',
          'prev-next-btn',
          currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary hover:text-white'
        ]"
      >
        <i :class="currentLanguage === 'ar' ? 'fas fa-chevron-left' : 'fas fa-chevron-right'"></i>
      </button>
    </div>

    <!-- نقاط التقدم -->
    <div class="flex" :class="currentLanguage === 'ar' ? 'space-x-1 space-x-reverse' : 'space-x-1'">
      <div
        v-for="page in totalPages"
        :key="page"
        :class="[
          'h-1 rounded-full transition-all duration-300 cursor-pointer',
          page === currentPage 
            ? 'bg-primary w-6' 
            : 'bg-gray-300 w-2 hover:bg-gray-400'
        ]"
        @click="goToPage(page)"
      ></div>
    </div>
  </div>
</template>

<script>
import { useTranslations } from '@/composables/useTranslations'
import { computed } from 'vue'

export default {
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    totalItems: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Number,
      default: 6
    }
  },
  setup(props) {
    const { translate, currentLanguage } = useTranslations()
    
    // نص عرض النتائج مع الترجمة
    const showingText = computed(() => {
      const start = (props.currentPage - 1) * props.itemsPerPage + 1
      const end = Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
      
      if (currentLanguage.value === 'ar') {
        return `عرض ${start}-${end} من أصل ${props.totalItems} مقالة`
      } else {
        return `Showing ${start}-${end} of ${props.totalItems} articles`
      }
    })

    const paginationText = {
      previous: translate('pagination.previous'),
      next: translate('pagination.next'),
      page: translate('pagination.page'),
      of: translate('pagination.of'),
      showing: translate('pagination.showing'),
      to: translate('pagination.to'),
      ofResults: translate('pagination.ofResults'),
      results: translate('pagination.results')
    }
    
    return {
      paginationText,
      showingText,
      currentLanguage
    }
  },
  computed: {
    startItem() {
      return (this.currentPage - 1) * this.itemsPerPage + 1;
    },
    endItem() {
      const end = this.currentPage * this.itemsPerPage;
      return end > this.totalItems ? this.totalItems : end;
    },
    visiblePages() {
      const pages = [];
      const maxVisible = 5;
      
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(this.totalPages, start + maxVisible - 1);
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    }
  },
  methods: {
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
        this.$emit('page-change', page);
      }
    }
  },
  emits: ['page-change']
}
</script>

<style scoped>

</style>