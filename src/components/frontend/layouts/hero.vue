<template>
  <section class="relative pt-30 pb-10 hero-gradient">
    <div class="container mx-auto px-4 text-center relative z-10">
      <!-- العنوان الرئيسي مع الكلمة الأخيرة خضراء -->
      <h1 class="hero-title">
        <span class="text-black">{{ displayTitle }}</span>
        <span v-if="displayHighlight" class="text-[#9EBF3B]"> {{ displayHighlight }}</span>
      </h1>

      <!-- الوصف -->
      <p v-if="subtitle" class="text-gray-600 text-xl max-w-2xl mx-auto mb-8">
        {{ subtitle }}
      </p>

      <!-- الأزرار -->
      <div class="flex justify-center gap-4 text-white">
        <button
          v-for="(btn, index) in buttons"
          :key="index"
          @click="$emit('cta', btn)"
          :class="buttonClasses(btn)"
        >
          <i v-if="btn.icon" :class="btn.icon"></i>
          {{ btn.text }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  highlight: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  buttons: { type: Array, default: () => [] },
  floatingShapes: { type: Boolean, default: true },
  autoSplit: { type: Boolean, default: true } // إضافة خاصية للتحكم في التقسيم التلقائي
})

// تقسيم العنوان تلقائياً إذا لم يتم提供 highlight
const titleWords = computed(() => props.title.split(' '))
const lastWord = computed(() => titleWords.value[titleWords.value.length - 1])
const titleWithoutLastWord = computed(() => {
  const words = [...titleWords.value]
  words.pop()
  return words.join(' ')
})

// تحديد ما سيتم عرضه
const displayTitle = computed(() => {
  // إذا كان هناك highlight محدد، استخدم العنوان كاملاً
  if (props.highlight) return props.title
  // إذا كان التقسيم التلقائي مفعلاً، استخدم العنوان بدون الكلمة الأخيرة
  if (props.autoSplit) return titleWithoutLastWord.value
  // إذا لم يكن هناك تقسيم، استخدم العنوان كاملاً
  return props.title
})

const displayHighlight = computed(() => {
  // إذا كان هناك highlight محدد، استخدمه
  if (props.highlight) return props.highlight
  // إذا كان التقسيم التلقائي مفعلاً، استخدم الكلمة الأخيرة
  if (props.autoSplit) return lastWord.value
  // إذا لم يكن هناك تقسيم، لا تعرض anything
  return ''
})

const buttonClasses = (btn) => {
  const base = 'px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors duration-300';
  if (btn.primary) return `${base} btn-primary text-white hover:shadow-lg transform hover:scale-105`;
  return `${base} border-2 border-gray-300 text-gray-700 hover:border-[#9EBF3B] hover:text-[#9EBF3B] hover:shadow-md`;
}

defineEmits(['cta']);
</script>

<style scoped>
.hero-gradient {
  background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
  position: relative;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  direction: rtl;
}

.btn-primary {
  background: linear-gradient(to right, #9EBF3B, #8aab34);
  box-shadow: 0 4px 15px rgba(158, 191, 59, 0.3);
}

.btn-primary:hover {
  background: linear-gradient(to right, #8aab34, #7a9a2e);
  box-shadow: 0 6px 20px rgba(158, 191, 59, 0.4);
}

/* الأشكال العائمة */
.floating-shapes .shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  background: #9EBF3B;
  animation: float 6s ease-in-out infinite;
}

.shape-1 { 
  width: 120px; 
  height: 120px; 
  top: 10%; 
  left: 5%; 
  animation-delay: 0s;
}
.shape-2 { 
  width: 200px; 
  height: 200px; 
  top: 30%; 
  right: 10%; 
  animation-delay: 2s;
}
.shape-3 { 
  width: 100px; 
  height: 100px; 
  bottom: 10%; 
  left: 20%; 
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }
  
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .flex.justify-center.gap-4 {
    flex-direction: row; /* الأزرار جنب بعض */
    flex-wrap: wrap; /* تسمح بالنزول لسطر جديد إذا المساحة ضاقت */
    justify-content: center;
  }

  button {
    width: auto;
    max-width: none;
    justify-content: center;
  }
}

}
</style>