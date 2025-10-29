<template>
  <div class="measure-card bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group" @click="$emit('click')">
    <!-- صورة المقياس -->
    <div class="relative h-40 overflow-hidden">
      <img :src="measure.image" :alt="measure.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      
      <!-- شارة الفئة -->
      <div class="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white"
           :style="measure.category === 'women' ? 'background-color: #D6A29A;' : 'background-color: #9EBF3B;'">
        {{ measure.category === 'women' ? 'صحة المرأة' : 'صحة الطفل' }}
      </div>
      
      <!-- أيقونة المقياس -->
      <div class="absolute bottom-3 left-3 w-12 h-12 rounded-lg flex items-center justify-center bg-white/20 backdrop-blur-sm">
        <i :class="measure.icon" class="text-white text-xl"></i>
      </div>
    </div>
    
    <!-- المحتوى -->
    <div class="p-5">
      <h3 class="text-xl font-bold mb-3 text-gray-800 group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300"
          :style="measure.category === 'women' ? 
                  'background-image: linear-gradient(to right, #D6A29A, #E8B4B8);' : 
                  'background-image: linear-gradient(to right, #9EBF3B, #B8D06E);'">
        {{ measure.title }}
      </h3>
      
      <p class="text-gray-600 text-sm mb-4 line-clamp-2">
        {{ measure.description }}
      </p>
      
      <!-- الإحصائيات -->
      <div class="flex justify-between mb-4">
        <div class="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
          <i class="fas fa-question-circle text-sm" 
             :style="measure.category === 'women' ? 'color: #D6A29A;' : 'color: #9EBF3B;'"></i>
          <span class="text-sm font-medium text-gray-700">{{ measure.questions.length }} سؤال</span>
        </div>
        
        <div class="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
          <i class="fas fa-clock text-sm" 
             :style="measure.category === 'women' ? 'color: #D6A29A;' : 'color: #9EBF3B;'"></i>
          <span class="text-sm font-medium text-gray-700">{{ measure.time }} دقيقة</span>
        </div>
      </div>
      
      <!-- زر البدء -->
      <button class="w-full py-3 text-white rounded-xl transition-all duration-300 font-medium flex items-center justify-center gap-2 group-hover:shadow-lg"
              :style="measure.category === 'women' ? 
                      'background: linear-gradient(to right, #D6A29A, #E8B4B8);' : 
                      'background: linear-gradient(to right, #9EBF3B, #B8D06E);'">
        <span>ابدأ التقييم</span>
        <i class="fas fa-arrow-left text-sm transition-transform duration-300 group-hover:translate-x-1"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MeasureCard',
  
  props: {
    measure: {
      type: Object,
      required: true
    }
  },
  emits: ['click']
}
</script>

<style scoped>
.measure-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.measure-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

/* لقص النص الطويل */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>