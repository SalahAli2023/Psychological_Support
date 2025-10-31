
<template>
  <div class="flex flex-col items-center space-y-6">
    <!-- معلومات الصفحة -->
    <!-- <div class="text-gray-600 text-sm">
      عرض {{ startItem }}-{{ endItem }} من أصل {{ totalItems }} مقالة
    </div> -->

    <!-- أزرار الصفحات -->
    <div class="flex items-center space-x-2 space-x-reverse">
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
        <i class="fas fa-chevron-right"></i>
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
        <i class="fas fa-chevron-left"></i>
      </button>
    </div>

    <!-- نقاط التقدم -->
    <div class="flex space-x-1 space-x-reverse">
      <div
        v-for="page in totalPages"
        :key="page"
        :class="[
          'h-1 rounded-full transition-all duration-300',
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
      
      // تعديل البداية إذا كنا في النهاية
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