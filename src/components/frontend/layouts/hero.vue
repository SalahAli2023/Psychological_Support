<template>
  <section class="relative pt-30 pb-10 hero-gradient" >
    <!-- أشكال عائمة للتزيين -->
    <!-- <div v-if="floatingShapes" class="floating-shapes">
      <div v-for="(shape, index) in 3" :key="index" :class="`shape shape-${index+1}`"></div>
    </div> -->

    <div class="container mx-auto px-4 text-center relative z-10">
      <!-- العنوان الرئيسي -->
      <h1 class="text-3xl md:text-4xl font-bold mb-4">
        <span :class="titleClass">{{ title }}</span>
        <span v-if="highlight" :class="highlightClass">{{ highlight }}</span>
      </h1>

      <!-- الوصف -->
      <p v-if="subtitle" class="text-gray-600 text-xl max-w-2xl mx-auto mb-8">
        {{ subtitle }}
      </p>

      <!-- الأزرار -->
      <div class="flex justify-center gap-4">
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
const props = defineProps({
  title: { type: String, required: true },
  highlight: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  titleClass: { type: String, default: 'text-primary' },
  highlightClass: { type: String, default: 'text-secondary' },
  buttons: { type: Array, default: () => [] }, // [{ text: 'ابدأ الرحلة', icon: 'fas fa-play', primary: true }]
  floatingShapes: { type: Boolean, default: true }
})

const buttonClasses = (btn) => {
  const base = 'px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors';
  if (btn.primary) return `${base} btn-primary text-white`;
  return `${base} border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary`;
}

defineEmits(['cta']);
</script>

<style scoped>
.hero-gradient {
  background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
  position: relative;
}

/* الأشكال العائمة */
.floating-shapes .shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.2;
  background: #9EBF3B;
}

.shape-1 { width: 120px; height: 120px; top: 10%; left: 5%; }
.shape-2 { width: 200px; height: 200px; top: 30%; right: 10%; }
.shape-3 { width: 100px; height: 100px; bottom: 10%; left: 20%; }

.btn-primary {
  background: linear-gradient(to right, #9EBF3B, #8aab34);
}
</style>
