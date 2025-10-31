<!-- ArticleCard.vue -->
<template>
  <article class="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer flex flex-col h-full relative">
    
    <!-- صورة المقال مع التصنيف في الأعلى -->
    <div class="relative overflow-hidden h-48 image-overlay-container">
      <img :src="article.image" :alt="article.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      <!-- تراكب لوني عند التمرير -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <!-- التصنيف في أعلى يمين الصورة -->
      <div class="absolute top-3 right-3 z-10">
        <span class="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-white text-gray-800 shadow-md border border-gray-200 whitespace-nowrap">
          {{ article.category }}
        </span>
      </div>
    </div>

    <!-- محتوى المقال -->
    <div class="p-6 flex flex-col flex-1">
      <!-- العنوان -->
      <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#D6A29A] transition-colors duration-300">
        {{ article.title }}
      </h3>

      <!-- الوصف -->
      <div class="flex-grow mb-4">
        <p class="text-gray-600 text-sm line-clamp-3">
          {{ article.description }}
        </p>
      </div>

      <!-- قسم المعلومات - مثبت في الأسفل دائماً -->
      <div class="mt-auto pt-4">
        <div class="flex items-center justify-between text-xs text-gray-500">
          <!-- معلومات الكاتب والتاريخ -->
          <div class="flex flex-col">
            <!-- اسم الكاتب -->
            <div class="flex items-center gap-2 mb-1">
              <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
              </svg>
              <span>{{ article.author }}</span>
            </div>
            <!-- التاريخ تحت الاسم -->
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
              </svg>
              <span>{{ article.date }}</span>
            </div>
          </div>
          
          <!-- زر "اقرأ المزيد" -->
          <button class="bg-[#9EBF3B] text-white font-semibold text-xs px-3 py-3 rounded-lg shadow-md hover:bg-[#9EBF3B] hover:shadow-lg transition-all duration-300 whitespace-nowrap">
            اقرأ المزيد
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
// تعريف الـ props التي يستقبلها المكون
defineProps({
  article: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
/* لقطع النصوص الطويلة وإضافة "..." في النهاية */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* إضافة الإطار المتدرج مع حواف دائرية في أسفل الكارد */
article {
  position: relative;
}

article::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(to left, #9EBF3B, #D6A29A);
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
}
</style>