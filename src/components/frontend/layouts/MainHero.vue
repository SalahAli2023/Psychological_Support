<template>
  <!-- الهيرو الرئيسي القابل للتخصيص -->
  <section 
    class="relative font-almarai overflow-hidden" 
    dir="rtl" 
    :style="heroStyle"
  >
    
    <!-- فيديو/صورة الخلفية -->
    <div class="absolute inset-0">
      <!-- فيديو الخلفية -->
      <video 
        v-if="backgroundType === 'video' && backgroundVideo"
        autoplay 
        muted 
        loop 
        playsinline
        class="w-full h-full object-cover"
      >
        <source :src="backgroundVideo" type="video/mp4">
      </video>
      
      <!-- صورة الخلفية -->
      <img 
        v-else-if="backgroundType === 'image' && backgroundImage"
        :src="backgroundImage" 
        :alt="title"
        class="w-full h-full object-cover"
      />
      
      <!-- تراكب لوني فوق الخلفية -->
      <div 
        class="absolute inset-0 transition-all duration-500"
        :class="overlayClass"
      ></div>
    </div>

    <!-- أشكال زخرفية -->
    <div 
      v-if="showDecorations"
      class="absolute top-5 left-5 w-40 h-40 bg-emerald-400/25 rounded-full blur-xl"
    ></div>
    <div 
      v-if="showDecorations"
      class="absolute bottom-5 right-5 w-60 h-60 bg-purple-400/25 rounded-full blur-xl"
    ></div>
    <div 
      v-if="showDecorations"
      class="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-300/30 rounded-full blur-lg"
    ></div>

    <!-- المحتوى الرئيسي -->
    <div class="relative z-10 w-full h-full flex items-center justify-center">
      <div class="max-w-4xl mx-auto px-6 w-full">
        <div 
          class="text-center"
          :class="contentAlignment === 'right' ? 'text-right' : contentAlignment === 'left' ? 'text-left' : 'text-center'"
        >
          
          <!-- العنوان الرئيسي -->
          <div class="inline-block relative">
            <h1 
              class="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg"
            >
              {{ title }}
              <span 
                v-if="subtitle"
                class="text-emerald-300 block mt-1"
              >
                {{ subtitle }}
              </span>
            </h1>
            <div 
              v-if="showUnderline"
              class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full"
            ></div>
          </div>

          <!-- الوصف -->
          <p 
            v-if="description"
            class="text-lg text-white/90 leading-relaxed max-w-2xl mx-auto font-medium drop-shadow-md mt-6"
          >
            {{ description }}
          </p>

          <!-- الأزرار -->
          <div 
            v-if="buttons && buttons.length"
            class="flex flex-wrap gap-4 justify-center mt-8"
          >
            <button
              v-for="(button, index) in buttons"
              :key="index"
              @click="handleButtonClick(button)"
              class="px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              :class="button.class || 'bg-[#9EBF3B] hover:bg-[#8aab34] text-white'"
            >
              {{ button.text }}
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- زر التمرير للأسفل -->
    <div 
      v-if="showScrollButton"
      class="absolute bottom-4 left-1/2 transform -translate-x-1/2"
    >
      <div class="animate-bounce">
        <i class="fas fa-chevron-down text-white/80 text-xl"></i>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

// الخصائص القابلة للتخصيص
const props = defineProps({
  // المحتوى الأساسي
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  
  // الخلفية
  backgroundType: {
    type: String,
    default: 'color', // 'color', 'image', 'video'
    validator: (value) => ['color', 'image', 'video'].includes(value)
  },
  backgroundColor: {
    type: String,
    default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  backgroundImage: {
    type: String,
    default: ''
  },
  backgroundVideo: {
    type: String,
    default: ''
  },
  
  // التصميم
  height: {
    type: String,
    default: '60vh'
  },
  minHeight: {
    type: String,
    default: '500px'
  },
  contentAlignment: {
    type: String,
    default: 'center', // 'center', 'right', 'left'
    validator: (value) => ['center', 'right', 'left'].includes(value)
  },
  
  // العناصر الإضافية
  showDecorations: {
    type: Boolean,
    default: true
  },
  showUnderline: {
    type: Boolean,
    default: true
  },
  showScrollButton: {
    type: Boolean,
    default: true
  },
  
  // التراكب
  overlayColor: {
    type: String,
    default: 'bg-black/30'
  },
  
  // الأزرار
  buttons: {
    type: Array,
    default: () => []
  }
})

// نمط الهيرو الديناميكي
const heroStyle = computed(() => {
  const style = {
    height: props.height,
    minHeight: props.minHeight
  }
  
  if (props.backgroundType === 'color' && props.backgroundColor) {
    style.background = props.backgroundColor
  }
  
  return style
})

// كلاس التراكب
const overlayClass = computed(() => {
  if (props.backgroundType === 'color') {
    return 'bg-transparent'
  }
  return props.overlayColor
})

// معالجة النقر على الأزرار
const emit = defineEmits(['button-click'])

const handleButtonClick = (button) => {
  emit('button-click', button)
  
  // إذا كان هناك رابط، الانتقال إليه
  if (button.link) {
    if (button.link.startsWith('http')) {
      window.open(button.link, button.target || '_self')
    } else {
      // استخدام Vue Router للتنقل الداخلي
      const router = useRouter?.()
      if (router && !button.link.startsWith('http')) {
        router.push(button.link)
      }
    }
  }
  
  // إذا كان هناك دالة، تنفيذها
  if (button.action && typeof button.action === 'function') {
    button.action()
  }
}
</script>

<style scoped>
/* تأثيرات بسيطة */
section {
  transition: all 0.3s ease-in-out;
}

/* تأثير التطريز على النص */
.drop-shadow-lg {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
}

.drop-shadow-md {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

/* حركة التمرير */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 2s infinite;
}
</style>