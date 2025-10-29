<template>
  <div class="test-card bg-white rounded-xl shadow-lg p-6 cursor-pointer" @click="$emit('measure-click', measure)">
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
    <button class="w-full py-2 bg-primary-green text-white rounded-lg hover:bg-secondary-green transition-colors text-sm font-medium">
      ابدأ التقييم
    </button>
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
</style>