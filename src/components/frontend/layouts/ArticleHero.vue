[file name]: ArticleHero.vue
[file content begin]
<template>
  <section
    class="relative font-almarai overflow-hidden flex items-center justify-center"
    dir="rtl"
    :style="{ minHeight: height }"
  >
    <!-- خلفية الفيديو -->
    <div class="absolute inset-0">
      <video
        v-if="type === 'video' && src"
        autoplay
        muted
        loop
        playsinline
        class="w-full h-full object-cover"
      >
        <source :src="getVideoPath(src)" type="video/mp4" />
      </video>

      <img
        v-else-if="type === 'image' && src"
        :src="src"
        :alt="title"
        class="w-full h-full object-cover"
      />

      <div
        v-else
        class="w-full h-full"
        :style="{ background }"
      />

      <!-- طبقة شفافة داكنة لتحسين وضوح النص -->
      <div class="absolute inset-0 bg-black/70"></div>
      
      <!-- تأثير تدرج إضافي -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
    </div>

    <!-- المحتوى الرئيسي - متمركز تماماً -->
    <div class="relative z-10 w-full max-w-6xl mx-auto px-6 text-center">
      
      <!-- البادج -->
      <div v-if="badge" class="mb-8">
        <span class="inline-block px-6 py-3 text-base font-medium rounded-full bg-[#9EBF3B]/20 text-[#9EBF3B] border border-[#9EBF3B]/30 backdrop-blur-sm">
          {{ badge }}
        </span>
      </div>

      <!-- العنوان الرئيسي -->
      <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
        <span class="text-[#9EBF3B]">{{ title }}</span>
        <span 
          v-if="highlight" 
          class="block text-[#D6A29A] mt-4"
        >
          {{ highlight }}
        </span>
      </h1>

      <!-- الوصف - باللون الأبيض -->
      <p 
        v-if="subtitle"
        class="text-xl md:text-2xl text-white mb-12 leading-relaxed max-w-3xl mx-auto font-light"
      >
        {{ subtitle }}
      </p>

      <!-- الأزرار -->
      <div class="flex flex-wrap gap-6 justify-center">
        <button
          v-for="(btn, idx) in buttons"
          :key="idx"
          @click="$emit('cta', btn)"
          class="px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border-0"
          :class="btn.primary 
            ? 'bg-gradient-to-r from-[#9EBF3B] to-[#8aab34] hover:from-[#D6A29A] hover:to-[#c47a73] text-white shadow-lg' 
            : 'bg-white/10 hover:bg-[#9EBF3B] text-white backdrop-blur-md'"
        >
          <span class="flex items-center gap-3">
            {{ btn.text }}
            <i v-if="btn.icon" :class="btn.icon"></i>
          </span>
        </button>
      </div>

      <!-- الإحصائيات -->
      <div 
        v-if="stats && stats.length > 0"
        class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto"
      >
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="text-center"
        >
          <div class="text-3xl font-bold text-[#9EBF3B] mb-2">{{ stat.value }}</div>
          <div class="text-lg text-white font-medium">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- سهم التمرير -->
    <div 
      v-if="scrollIndicator"
      class="absolute bottom-8 left-1/2 transform -translate-x-1/2"
    >
      <div class="animate-bounce">
        <i class="fas fa-chevron-down text-[#9EBF3B] text-2xl"></i>
      </div>
    </div>
  </section>
</template>

<script setup>
/* الخصائص الأساسية */
const props = defineProps({
  type: { type: String, default: 'color' },
  src: { type: String, default: '' },
  background: { type: String, default: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' },
  height: { type: String, default: '70vh' },
  badge: { type: String, default: '' },
  title: { type: String, required: true },
  highlight: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  buttons: { type: Array, default: () => [] },
  stats: { type: Array, default: () => [] },
  scrollIndicator: { type: Boolean, default: true }
})

/* دالة مسار الفيديو */
const getVideoPath = (videoSrc) => {
  if (videoSrc.startsWith('http')) return videoSrc
  if (videoSrc.startsWith('/')) return videoSrc
  return `/images/${videoSrc}`
}

/* الأحداث */
defineEmits(['cta'])
</script>

<style scoped>
/* حركة السهم */
@keyframes bounce {
  0%, 100% { 
    transform: translateY(0); 
  }
  50% { 
    transform: translateY(-15px); 
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}

/* تحسينات إضافية */
section {
  text-align: center !important;
}
</style>
[file content end]