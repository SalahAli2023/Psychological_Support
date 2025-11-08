<template>
  <section 
    ref="sectionRef"
    class="relative py-16 bg-gradient-to-br from-primary-green/10 via-primary-pink/10 to-white font-almarai text-gray-800 overflow-hidden transition-all duration-1000"
    :class="sectionClass"
  >
    <div class="absolute top-0 left-0 w-72 h-72 bg-primary-green opacity-10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-0 w-80 h-80 bg-primary-pink opacity-10 rounded-full blur-3xl"></div>

    <div class="max-w-6xl mx-auto px-4 text-center relative z-10">
      <!-- العنوان -->
      <div class="inline-block relative text-center w-full mb-16">
        <TitleSection
          :mainText="translate('home.stats.title')"
          :highlightText="translate('home.stats.highlight')"
        />
      </div>

      <!-- الأرقام -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
        <!-- الرقم 1 -->
        <div class="flex flex-col items-center justify-end transition-all duration-700 delay-200"
             :class="contentItemClass">
          <div class="w-24 h-24 mb-4 flex items-center justify-center">
            <img src="/images/دولة.png" alt="خريطة" class="w-full h-full object-contain light-green-filter transition-all duration-700">
          </div>
          <span 
            class="text-3xl md:text-4xl font-bold text-primary-green"
          >{{ animatedCounters[0] }}</span>
          <p class="mt-2 text-base md:text-lg text-gray-700">{{ translate('home.stats.items.countries') }}</p>
        </div>

        <!-- الرقم 2 -->
        <div class="flex flex-col items-center justify-end transition-all duration-700 delay-300"
             :class="contentItemClass">
          <div class="w-24 h-24 mb-4 flex items-center justify-center">
            <img src="/images/سؤال.png" alt="سؤال" class="w-full h-full object-contain light-green-filter transition-all duration-700">
          </div>
          <span 
            class="text-3xl md:text-4xl font-bold text-primary-green"
          >{{ animatedCounters[1] }}</span>
          <p class="mt-2 text-base md:text-lg text-gray-700">{{ translate('home.stats.items.questions') }}</p>
        </div>

        <!-- الرقم 3 -->
        <div class="flex flex-col items-center justify-end transition-all duration-700 delay-400"
             :class="contentItemClass">
          <div class="w-24 h-24 mb-4 flex items-center justify-center">
            <img src="/images/جلسات.png" alt="جلسة" class="w-full h-full object-contain light-pink-filter transition-all duration-700">
          </div>
          <span 
            class="text-3xl md:text-4xl font-bold text-primary-pink"
          >{{ animatedCounters[2] }}</span>
          <p class="mt-2 text-base md:text-lg text-gray-700">{{ translate('home.stats.items.sessions') }}</p>
        </div>

        <!-- الرقم 4 -->
        <div class="flex flex-col items-center justify-end transition-all duration-700 delay-500"
             :class="contentItemClass">
          <div class="w-24 h-24 mb-4 flex items-center justify-center">
            <img src="/images/مستخدمون.png" alt="مستخدمين" class="w-full h-full object-contain light-pink-filter transition-all duration-700">
          </div>
          <span 
            class="text-3xl md:text-4xl font-bold text-primary-pink"
          >{{ animatedCounters[3] }}</span>
          <p class="mt-2 text-base md:text-lg text-gray-700">{{ translate('home.stats.items.users') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useScrollAnimation } from '@/assets/js/animations.js'
import TitleSection from '@/components/frontend/homepage/TitleSection.vue'

export default {
  name: "StatsSection",
  mixins: [useScrollAnimation],
   components: {
    TitleSection
  },
  inject: ['languageState'],
  data() {
    return {
      animatedCounters: [0, 0, 0, 0],
      targetValues: [12, 4500, 2105, 3320],
      animationStarted: false
    }
  },
  computed: {
    translate() {
      return this.languageState?.translate || ((key) => key)
    }
  },
  watch: {
    isVisible(newVal) {
      if (newVal && !this.animationStarted) {
        // عندما يصبح السكشن مرئياً، ابدأ تحريك الأرقام
        this.startCountAnimation();
        this.animationStarted = true;
      } else if (!newVal) {
        // عندما يختفي السكشن، أعد تعيين الأرقام إلى الصفر
        this.resetCounters();
        this.animationStarted = false;
      }
    }
  },
  methods: {
    startCountAnimation() {
      this.targetValues.forEach((target, index) => {
        this.animateCounter(index, target, index * 200);
      });
    },

    animateCounter(index, target, delay) {
      setTimeout(() => {
        let current = 0;
        const duration = 2000;
        const increment = target / (duration / 16);
        
        const updateCounter = () => {
          current += increment;
          if (current < target) {
            this.animatedCounters[index] = Math.floor(current);
            requestAnimationFrame(updateCounter);
          } else {
            this.animatedCounters[index] = target;
          }
        };
        
        updateCounter();
      }, delay);
    },

    resetCounters() {
      this.animatedCounters = [0, 0, 0, 0];
    }
  }
};
</script>

<style scoped>
.light-green-filter {
  filter: invert(56%) sepia(67%) saturate(385%) hue-rotate(35deg) brightness(95%) contrast(85%) opacity(0.7);
}

.light-pink-filter {
  filter: invert(76%) sepia(10%) saturate(600%) hue-rotate(320deg) brightness(90%) contrast(85%) opacity(0.7);
}

/* تحسين التجاوب */
@media (max-width: 768px) {
  .text-3xl {
    font-size: 2rem;
  }
  
  .text-base {
    font-size: 0.9rem;
  }
  
  .w-24 {
    width: 4rem;
    height: 4rem;
  }
}

/* تحسين الانتقالات */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>