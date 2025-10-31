<template>
  <!-- شريط البحث والتصفية -->
  <div class="flex flex-col md:flex-row gap-4 mb-12">
    <!-- حقل البحث -->
    <div class="relative flex-1">
      <input 
        v-model="searchQuery"
        type="text" 
        placeholder="ابحث في الفعاليات والورش..."
        class="w-full px-12 py-4 bg-white border border-gray-300 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#9EBF3B] focus:ring-4 focus:ring-[#9EBF3B]/20 transition-all duration-300 text-base shadow-sm hover:shadow-md"
      />
      <i class="fas fa-search absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"></i>
    </div>

    <!-- قائمة التصفية -->
    <div class="relative">
      <select 
        v-model="selectedCategory"
        class="w-full md:w-48 px-4 py-4 bg-white border border-gray-300 rounded-2xl text-gray-800 focus:outline-none focus:border-[#9EBF3B] focus:ring-4 focus:ring-[#9EBF3B]/20 transition-all duration-300 appearance-none shadow-sm hover:shadow-md text-base"
      >
        <option value="all">جميع الفعاليات</option>
        <option value="أمسيات">الأمسيات</option>
        <option value="فعاليات">الفعاليات</option>
        <option value="ورش عمل">ورش العمل</option>
      </select>
      <!-- <i class="fas fa-chevron-down absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none text-sm"></i> -->
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, watch } from 'vue'

const searchQuery = ref('')
const selectedCategory = ref('all')

const emit = defineEmits(['filter-change'])

// مراقبة التغييرات وإرسالها للوالد
watch([searchQuery, selectedCategory], () => {
  emit('filter-change', {
    search: searchQuery.value,
    category: selectedCategory.value
  })
})
</script>

<style scoped>
/* إزالة خلفية السهم الافتراضي */
select {
  background-image: none !important;
  padding-left: 1rem !important;
}

/* إخفاء الأيقونة الافتراضية في بعض المتصفحات */
select::-ms-expand {
  display: none;
}

/* تحسين التركيز والظل */
input:focus, select:focus {
  box-shadow: 0 0 0 4px rgba(158, 191, 59, 0.1);
}

/* تحسين الظل عند التمرير */
input:hover, select:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* إخفاء السهم في Firefox */
select {
  -moz-appearance: none;
}

/* إخفاء السهم في Webkit */
select::-webkit-inner-spin-button,
select::-webkit-outer-spin-button,
select::-webkit-calendar-picker-indicator {
  display: none;
  -webkit-appearance: none;
}
</style>