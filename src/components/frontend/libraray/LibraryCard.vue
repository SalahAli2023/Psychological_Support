
<template>
  <div
    class="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1"
    @click="$emit('open-modal', book)"
  >
    <!-- صورة الكتاب -->
    <div class="relative h-48 overflow-hidden">
      <img 
        :src="book.cover" 
        :alt="book.title" 
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
      />
      
      <!-- زر المفضلة -->
      <button
        @click.stop="$emit('toggle-favorite', book.id)"
        class="absolute top-2 left-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 shadow-md"
      >
        <i :class="book.isFavorite ? 'fas text-red-500' : 'far text-gray-600'" class="fa-heart"></i>
      </button>
    </div>
    
    <!-- معلومات الكتاب -->
    <div class="p-3">
      <h4 class="text-sm font-semibold text-gray-800 mb-1 line-clamp-2 text-center">{{ book.title }}</h4>
      <p class="text-xs text-gray-600 text-center">{{ book.author }}</p>
      <div class="flex justify-center items-center mt-2">
        <div class="flex text-yellow-400">
          <i v-for="star in 5" :key="star" 
             :class="star <= Math.floor(book.rating) ? 'fas' : star - 0.5 <= book.rating ? 'fas fa-star-half-alt' : 'far'" 
             class="fa-star text-xs">
          </i>
        </div>
        <span class="text-xs text-gray-500 mr-1">({{ book.rating }})</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookCard',
  props: {
    book: {
      type: Object,
      required: true
    }
  },
  emits: ['toggle-favorite', 'open-modal']
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

</style>