<template>
  <div class="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-400 hover:shadow-md hover:-translate-y-1 flex flex-col h-full relative border border-gray-100 max-w-[200px]">
    <!-- الشريط العلوي -->
    <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#D6A29A] to-[#9EBF3B] opacity-80 hover:opacity-100 z-10"></div>
    
    <!-- صورة الكتاب -->
    <div class="h-32 overflow-hidden relative bg-gradient-to-br from-gray-100 to-gray-200">
      <img
        :src="item.coverImage"
        :alt="item.title"
        class="w-full h-full object-cover transition-transform duration-600 hover:scale-110"
      />
      <!-- تدرج خفيف في الأسفل -->
      <div class="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent"></div>
      
      <!-- البادج -->
      <div class="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-gray-800 shadow-sm absolute top-1.5 right-1.5 z-20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
        <i class="fas fa-tag text-[#9EBF3B] text-[8px]"></i>
        {{ typeLabel }}
      </div>
    </div>

    <!-- محتوى الكارد -->
    <div class="p-3 flex flex-col flex-1">
      <!-- العنوان -->
      <h3 class="text-sm font-extrabold text-gray-900 mb-1.5 line-clamp-2 leading-tight min-h-[2rem]">
        {{ item.title }}
      </h3>

      <!-- الوصف -->
      <p class="text-gray-600 text-[10px] leading-relaxed mb-2 line-clamp-2 flex-1">
        {{ item.description }}
      </p>

      <!-- المؤلف والتاريخ -->
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-0.5">
          <i class="fas fa-user text-[#9EBF3B] text-[8px]"></i>
          <span class="text-gray-700 text-[10px] font-semibold truncate max-w-[70px]">{{ item.author }}</span>
        </div>
        <div class="flex items-center gap-0.5 text-gray-500 text-[8px]">
          <i class="fas fa-calendar-alt text-[#9EBF3B] text-[8px]"></i>
          {{ formatDate(item.publishDate) }}
        </div>
      </div>

      <!-- الإحصائيات -->
      <div class="flex items-center justify-between text-[8px] text-gray-500 py-1.5 border-t border-gray-100">
        <div class="flex items-center gap-0.5">
          <i class="fas fa-download text-[#9EBF3B] text-[8px]"></i>
          <span>{{ item.downloads }}</span>
        </div>
        <div class="flex items-center gap-0.5">
          <i class="fas fa-eye text-[#D6A29A] text-[8px]"></i>
          <span>{{ item.views }}</span>
        </div>
        <div class="flex items-center gap-0.5">
          <i class="fas fa-file text-gray-400 text-[8px]"></i>
          <span>{{ item.fileSize }}</span>
        </div>
        <div class="flex items-center gap-0.5">
          <i class="fas fa-star text-yellow-400 text-[8px]"></i>
          <span>{{ item.rating }}</span>
        </div>
      </div>

      <!-- أزرار الإجراءات -->
      <div class="flex gap-1.5 pt-1.5 border-t border-gray-100">
        <button 
          @click="handlePreview(item)"
          class="flex-1 bg-[#9EBF3B] text-white px-2 py-1.5 rounded text-[10px] font-bold flex items-center justify-center gap-0.5 transition-all duration-300 hover:gap-1 hover:bg-[#8aaa2f] border-none cursor-pointer"
        >
          <span>معاينة</span>
          <i class="fas fa-eye text-[8px]"></i>
        </button>
        <button 
          @click="$emit('download', item)"
          class="flex-1 bg-[#D6A29A] text-white px-2 py-1.5 rounded text-[10px] font-bold flex items-center justify-center gap-0.5 transition-all duration-300 hover:gap-1 hover:bg-[#c99189] border-none cursor-pointer"
        >
          <span>تحميل</span>
          <i class="fas fa-download text-[8px]"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: { type: Object, required: true }
})
const emit = defineEmits(['download', 'preview'])

const handlePreview = (item) => {
  emit('preview', item) 
}

const typeLabel = computed(() => {
  const types = {
    book: 'كتاب',
    article: 'مقال',
    guide: 'دليل',
    research: 'بحث'
  }
  return types[props.item.type] || props.item.type
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>