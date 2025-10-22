<template>
  <section dir="rtl" class="relative py-12 md:py-20 overflow-hidden bg-gradient-to-br from-gray-50 to-white font-almarai">
    <div class="text-center mb-10 md:mb-16 px-4">
        <div class="inline-block relative">
          <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            كيف <span class="text-[#9EBF3B]">تعمل</span> منصتنا؟
          </h2>
          <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 md:w-24 h-1 bg-gradient-to-r from-[#9EBF3B] to-[#D6A29A] rounded-full"></div>
        </div>
        <p class="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mt-4">
          رحلة بسيطة ومباشرة نحو صحة نفسية أفضل في 4 خطوات فقط
        </p>
      </div>
    
    <!-- Desktop Layout -->
    <div v-if="!isMobile" class="relative flex justify-between items-center max-w-7xl mx-auto px-8">
      
      <!-- Step 1 -->
      <div class="flex flex-col items-center text-center space-y-3 translate-y-[-40px] relative z-10">
        <div class="bg-gradient-to-br from-[#9EBF3B] to-emerald-400 text-white text-4xl font-semibold w-24 h-24 flex items-center justify-center rounded-2xl shadow-md">
          01
        </div>
        <h3 class="text-lg font-bold">سجل واحجز</h3>
        <p class="text-gray-600 w-56">
          أنشئ حسابك واختر الموعد المناسب مع الأخصائي الذي يناسب احتياجاتك
        </p>
      </div>

      <!-- Connector 1→2 -->
      <svg
        class="absolute right-[210px] top-[60px] w-[200px] h-[160px] z-0"
        fill="none"
        stroke="#9EBF3B"
        stroke-width="2.5"
        stroke-dasharray="6 6"
        stroke-linecap="round"
      >
        <path d="M 200 -60 C 160 180, 80 -20, 30 60" />
      </svg>

      <!-- Step 2 -->
      <div class="flex flex-col items-center text-center space-y-3 translate-y-[60px] relative z-10">
        <div class="bg-gradient-to-br from-[#D6A29A] to-pink-400 text-white text-4xl font-semibold w-24 h-24 flex items-center justify-center rounded-2xl shadow-md">
          02
        </div>
        <h3 class="text-lg font-bold">اجتمع بأخصائنا</h3>
        <p class="text-gray-600 w-56">
          قابل أخصائيك عبر الجلسات الافتراضية أو احجز موعداً في العيادة
        </p>
      </div>

      <!-- Connector 2→3 -->
      <svg
        class="absolute right-[550px] top-[100px] w-[200px] h-[160px] z-0"
        fill="none"
        stroke="#D6A29A"
        stroke-width="2.5"
        stroke-dasharray="6 6"
        stroke-linecap="round"
      >
        <path d="M 200 40 C 120 -40, 80 160, 0 40" />
      </svg>

      <!-- Step 3 -->
      <div class="flex flex-col items-center text-center space-y-3 translate-y-[-40px] relative z-10">
        <div class="bg-gradient-to-br from-[#9EBF3B] to-emerald-400 text-white text-4xl font-semibold w-24 h-24 flex items-center justify-center rounded-2xl shadow-md">
          03
        </div>
        <h3 class="text-lg font-bold">احصل على الدعم</h3>
        <p class="text-gray-600 w-56">
          تلقى العلاج والدعم المناسب مع متابعة مستمرة لتطور حالتك
        </p>
      </div>

      <!-- Connector 3→4 -->
      <svg
        class="absolute right-[890px] top-[60px] w-[200px] h-[160px] z-0"
        fill="none"
        stroke="#9EBF3B"
        stroke-width="2.5"
        stroke-dasharray="6 6"
        stroke-linecap="round"
      >
        <path d="M 200 60 C 120 140, 80 -40, 0 60" />
      </svg>

      <!-- Step 4 -->
      <div class="flex flex-col items-center text-center space-y-3 translate-y-[60px] relative z-10">
        <div class="bg-gradient-to-br from-[#D6A29A] to-pink-400 text-white text-4xl font-semibold w-24 h-24 flex items-center justify-center rounded-2xl shadow-md">
          04
        </div>
        <h3 class="text-lg font-bold">تابع تقدمك</h3>
        <p class="text-gray-600 w-56">
          تابع تحسن صحتك النفسية مع تقارير دورية ونصائح مخصصة
        </p>
      </div>
    </div>

    <!-- Mobile Layout - بدون خطوط -->
    <div v-else class="max-w-md mx-auto px-4">
      <!-- Step 1 -->
      <div class="flex items-start mb-10">
        <div class="bg-gradient-to-br from-[#9EBF3B] to-emerald-400 text-white text-2xl font-semibold w-16 h-16 flex items-center justify-center rounded-xl shadow-md flex-shrink-0 ml-4">
          01
        </div>
        <div class="text-right">
          <h3 class="text-lg font-bold mb-2">سجل واحجز</h3>
          <p class="text-gray-600 text-sm">
            أنشئ حسابك واختر الموعد المناسب مع الأخصائي الذي يناسب احتياجاتك
          </p>
        </div>
      </div>

      <!-- Step 2 -->
      <div class="flex items-start mb-10">
        <div class="bg-gradient-to-br from-[#D6A29A] to-pink-400 text-white text-2xl font-semibold w-16 h-16 flex items-center justify-center rounded-xl shadow-md flex-shrink-0 ml-4">
          02
        </div>
        <div class="text-right">
          <h3 class="text-lg font-bold mb-2">اجتمع بأخصائنا</h3>
          <p class="text-gray-600 text-sm">
            قابل أخصائيك عبر الجلسات الافتراضية أو احجز موعداً في العيادة
          </p>
        </div>
      </div>

      <!-- Step 3 -->
      <div class="flex items-start mb-10">
        <div class="bg-gradient-to-br from-[#9EBF3B] to-emerald-400 text-white text-2xl font-semibold w-16 h-16 flex items-center justify-center rounded-xl shadow-md flex-shrink-0 ml-4">
          03
        </div>
        <div class="text-right">
          <h3 class="text-lg font-bold mb-2">احصل على الدعم</h3>
          <p class="text-gray-600 text-sm">
            تلقى العلاج والدعم المناسب مع متابعة مستمرة لتطور حالتك
          </p>
        </div>
      </div>

      <!-- Step 4 -->
      <div class="flex items-start">
        <div class="bg-gradient-to-br from-[#D6A29A] to-pink-400 text-white text-2xl font-semibold w-16 h-16 flex items-center justify-center rounded-xl shadow-md flex-shrink-0 ml-4">
          04
        </div>
        <div class="text-right">
          <h3 class="text-lg font-bold mb-2">تابع تقدمك</h3>
          <p class="text-gray-600 text-sm">
            تابع تحسن صحتك النفسية مع تقارير دورية ونصائح مخصصة
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
const isMobile = ref(false);

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style scoped>
/* إضافة تأثير الظل للدوائر */
div.bg-gradient-to-br {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
</style>