[file name]: StatisticsSection.vue
[file content begin]
<template>
  <section class="py-20 bg-gradient-to-br from-[#9EBF3B]/5 to-[#D6A29A]/5">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-down">
          إنجازاتنا <span class="text-[#9EBF3B]">وأرقامنا</span>
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up-delay">
          نحن نفخر بما حققناه من إنجازات ونعمل دائمًا على التطوير والتحسين
        </p>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div 
          v-for="stat in statistics" 
          :key="stat.id"
          class="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 animate-count-up"
          :style="`animation-delay: ${stat.id * 0.2}s`"
          @mouseenter="startCounter(stat)"
        >
          <div class="text-4xl md:text-5xl font-bold text-[#9EBF3B] mb-2" :id="`counter-${stat.id}`">
            {{ stat.initialValue }}
          </div>
          <div class="text-gray-600 text-lg">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const statistics = ref([
  { id: 1, value: '5000+', label: 'جلسة استشارية', initialValue: '0', targetValue: '5000' },
  { id: 2, value: '200+', label: 'ورشة تدريبية', initialValue: '0', targetValue: '200' },
  { id: 3, value: '98%', label: 'رضا العملاء', initialValue: '0%', targetValue: '98%' },
  { id: 4, value: '50+', label: 'أخصائي معتمد', initialValue: '0', targetValue: '50' }
])

const startCounter = (stat) => {
  const element = document.getElementById(`counter-${stat.id}`)
  if (!element) return
  
  const target = parseInt(stat.targetValue)
  const current = parseInt(stat.initialValue) || 0
  
  if (current < target) {
    let currentValue = current
    const increment = target / 50
    const timer = setInterval(() => {
      currentValue += increment
      if (currentValue >= target) {
        element.textContent = stat.value
        clearInterval(timer)
      } else {
        element.textContent = Math.floor(currentValue) + (stat.value.includes('%') ? '%' : '+')
      }
    }, 30)
  }
}

onMounted(() => {
  // بدء العدادات بعد تحميل الصفحة
  setTimeout(() => {
    statistics.value.forEach(stat => {
      startCounter(stat)
    })
  }, 1000)
})
</script>

<style scoped>
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes countUp {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in-down {
  animation: fadeInDown 0.8s ease-out forwards;
}

.animate-fade-in-up-delay {
  animation: fadeInUp 0.8s ease-out 0.3s forwards;
  opacity: 0;
}

.animate-count-up {
  animation: countUp 0.6s ease-out forwards;
  opacity: 0;
}
</style>
[file content end]