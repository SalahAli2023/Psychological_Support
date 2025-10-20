<!-- EventsHero.vue - مع مسافة مناسبة -->
<template>
  <!-- هيدر الفعاليات -->
  <section class="relative py-20 bg-gradient-to-br from-[#9EBF3B]/10 to-[#D6A29A]/10 font-almarai overflow-hidden" dir="rtl">
    <!-- أشكال زخرفية -->
    <div class="absolute top-10 left-10 w-60 h-60 bg-[#9EBF3B] opacity-5 rounded-full blur-3xl animate-pulse-slow"></div>
    <div class="absolute bottom-10 right-10 w-80 h-80 bg-[#D6A29A] opacity-5 rounded-full blur-3xl animate-pulse-slow"></div>

    <div class="relative z-10 max-w-6xl mx-auto px-6 text-center">
      <!-- العنوان الرئيسي -->
      <div class="inline-block relative mb-8 animate-fade-in-up">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          <span class="text-[#9EBF3B]"> الفعاليات </span>
          <span class="text-[#D6A29A]">والورش </span>
        </h1>
        <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#9EBF3B] to-[#D6A29A] rounded-full"></div>
      </div>
      
      <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
        اكتشف فعالياتنا وورش العمل المتنوعة لدعم صحتك النفسية وتطوير مهاراتك
      </p>
    </div>
  </section>
</template>

<script setup>
// لا حاجة لبيانات هنا
</script>

<style scoped>
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

@keyframes pulseSlow {
  0%, 100% {
    opacity: 0.05;
  }
  50% {
    opacity: 0.08;
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animate-pulse-slow {
  animation: pulseSlow 4s ease-in-out infinite;
}
</style>