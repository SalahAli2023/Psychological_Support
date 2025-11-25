<template>
  <div class="transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col bg-white rounded-2xl overflow-hidden relative shadow-lg h-full hover:-translate-y-4 hover:shadow-2xl group">
    <!-- Gradient Top Border -->
    <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9EBF3B] to-[#D6A29A] opacity-80 transition-all duration-400 ease-in-out z-10 group-hover:opacity-100 group-hover:h-1.5"></div>

    <!-- Image Container -->
    <div class="overflow-hidden h-60 relative bg-gradient-to-br from-gray-100 to-gray-300">
      <div class="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
      <!-- في القالب -->
      <img 
        :src="getImageUrl(article.image)" 
        :alt="article.title"
        class="w-full h-48 object-cover"
        @error="handleImageError"
      />
    </div>

    <!-- Badge -->
    <div class="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold bg-white text-gray-700 shadow-lg absolute top-3 right-3 z-10 transition-all duration-300 ease-in-out group-hover:-translate-y-1 group-hover:shadow-xl">
      {{ article.badge }}
    </div>

    <!-- Content -->
    <div class="p-7 flex flex-col flex-1">

      <!-- Title -->
      <h3 class="text-xl font-extrabold text-gray-800 mb-3 line-clamp-2 leading-relaxed">{{ article.title }}</h3>

      <!-- Excerpt -->
      <p class="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">{{ article.excerpt }}</p>

      <!-- Author and Read More -->
      <div class="flex justify-between items-center mt-auto pt-4 pb-4 border-t border-gray-100">
        <div class="flex items-center gap-3">
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <i class="fas fa-user text-sm text-[#9EBF3B]"></i>
              <span class="text-sm font-semibold text-gray-700">{{ article.author.name }}</span>
            </div>
            <span class="text-xs text-gray-400 flex items-center gap-1.5">
              <i class="fas fa-calendar-alt text-[#9EBF3B] text-xs"></i>
              {{ article.date }}
            </span>
          </div>
        </div>
        <button class="inline-flex items-center gap-2 text-white bg-[#9EBF3B] border-none cursor-pointer text-sm font-bold transition-all duration-300 ease-in-out px-3 py-2 rounded-lg hover:gap-3 hover:bg-[#D6A29A] hover:-translate-x-1" @click="$emit('read-more', article.id)">
          <span>{{ readMoreText }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useTranslations } from '@/composables/useTranslations'

export default {
  name: 'ArticleCard',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  emits: ['read-more'],
  setup() {
    const { translate } = useTranslations()
    
    const readMoreText = translate('buttons.readMore')
    
    return {
      readMoreText
    }
  },
  // في ArticleCard.vue
  methods: {
    getImageUrl(path) {
      if (!path) return null
      if (path.startsWith('http')) return path
      if (path.startsWith('storage/')) return `/${path}`
      return `/storage/${path}`
    },
    
    handleImageError(event) {
      console.error('خطأ في تحميل صورة المقال:', event.target.src)
      event.target.style.display = 'none'
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.group-hover\:scale-112:hover {
  transform: scale(1.12);
}
</style>