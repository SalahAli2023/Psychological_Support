<template>
  <section class="py-20 bg-gradient-to-br from-primary-green/5 to-primary-pink/5">
    <div class="max-w-7xl mx-auto px-6">

      <!-- العنوان باستخدام Component جاهز -->
      <TitleSection
        :mainText="translate('about.statistics.title')"
        :highlightText="translate('about.statistics.highlight')"
        textColor="text-gray-900"
        highlightColor="text-primary-green"
        subtitleText="translate('about.statistics.subtitle')"
         gradientClass="bg-primary-green"
      />

      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-12">
        <div 
          v-for="stat in statistics" 
          :key="stat.id"
          class="text-center bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 animate-count-up"
          :style="`animation-delay: ${stat.id * 0.2}s`"
          @mouseenter="startCounter(stat)"
        >
          <div class="text-3xl md:text-4xl font-bold text-primary-green mb-2" :id="`counter-${stat.id}`">
            {{ stat.initialValue }}
          </div>
          <div class="text-gray-600 text-base">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useTranslations } from '@/composables/useTranslations'
import TitleSection from '@/components/frontend/layouts/TitleSection.vue'

const { currentLanguage, translate } = useTranslations()

const statisticsData = ref([
  { id: 1, value: '5000+', targetValue: '5000', ar: 'جلسة استشارية', en: 'Counseling Sessions' },
  { id: 2, value: '200+', targetValue: '200', ar: 'ورشة تدريبية', en: 'Training Workshops' },
  { id: 3, value: '98%', targetValue: '98', ar: 'رضا العملاء', en: 'Customer Satisfaction' },
  { id: 4, value: '50+', targetValue: '50', ar: 'أخصائي معتمد', en: 'Certified Specialists' }
])

const statistics = computed(() => {
  return statisticsData.value.map(stat => ({
    ...stat,
    label: currentLanguage.value === 'ar' ? stat.ar : stat.en,
    initialValue: '0' + (stat.value.includes('%') ? '%' : '+')
  }))
})

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
  setTimeout(() => {
    statistics.value.forEach(stat => {
      startCounter(stat)
    })
  }, 1000)
})
</script>

<style scoped>
@keyframes fadeInDown { from{opacity:0;transform:translateY(-30px);} to{opacity:1;transform:translateY(0);} }
@keyframes fadeInUp { from{opacity:0;transform:translateY(30px);} to{opacity:1;transform:translateY(0);} }
@keyframes countUp { from{opacity:0;transform:scale(0.8);} to{opacity:1;transform:scale(1);} }

.animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; }
.animate-fade-in-up-delay { animation: fadeInUp 0.8s ease-out 0.3s forwards; opacity:0; }
.animate-count-up { animation: countUp 0.6s ease-out forwards; opacity:0; }
</style>
