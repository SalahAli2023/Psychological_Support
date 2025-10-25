<template>
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4 text-gray-800">المقاييس الأكثر استخداماً</h2>
        <p class="text-gray-600 max-w-2xl mx-auto">مجموعة مختارة من المقاييس الأكثر شيوعاً بين المستخدمين</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="measure in measures" 
          :key="measure.id"
          class="test-card bg-white rounded-xl shadow-lg p-6 cursor-pointer"
          @click="$emit('measure-click', measure)"
        >
          <h3 class="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
            <i :class="measure.icon" class="text-primary-pink"></i>
            {{ measure.title }}
          </h3>
          <p class="text-gray-600 text-sm mb-4 flex-grow">
            {{ measure.description }}
          </p>
          <div class="flex justify-between text-sm text-gray-500 mb-4">
            <div class="flex items-center gap-1">
              <i class="fas fa-question-circle"></i>
              <span>{{ measure.questions.length }} أسئلة</span>
            </div>
            <div class="flex items-center gap-1">
              <i class="fas fa-clock"></i>
              <span>{{ measure.time }} دقائق</span>
            </div>
          </div>

          <!-- نجوم التقييم المعدلة -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="stars-container">
                <i 
                  v-for="i in 5" 
                  :key="i" 
                  class="fas fa-star text-sm" 
                  :class="i <= measure.rating ? 'star' : 'star empty'"
                ></i>
              </div>
              <span class="text-xs text-gray-500 mr-1">({{ measure.reviews }})</span>
            </div>
          </div>

          <button class="w-full py-2 bg-primary-green text-white rounded-lg hover:bg-secondary-green transition-colors text-sm font-medium">
            ابدأ التقييم
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'PopularMeasures',
  props: {
    measures: {
      type: Array,
      default: () => []
    }
  },
  emits: ['measure-click']
}
</script>

<style scoped>
.test-card {
  transition: all 0.3s ease;
  border-right: 4px solid #D6A29A;
}

.test-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

/* تنسيق نجوم التقييم */
.stars-container {
  display: flex;
  gap: 2px;
}

.star {
  background: linear-gradient(135deg, #9EBF3B, #D6A29A);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.star.empty {
  background: #E5E7EB;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>