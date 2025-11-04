<template>
  <section class="relative h-screen text-white overflow-hidden font-almarai" >
    <!-- خلفية الفيديو -->
    <video
      autoplay
      muted
      loop
      playsinline
      class="absolute inset-0 w-full h-full object-cover z-0"
    >
      <source src="http://localhost:5173/images/hipno-video.mp4" type="video/mp4">
    </video>

    <!-- طبقة شفافة فوق الفيديو -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent z-10"></div>

    <!-- المحتوى الرئيسي -->
    <div
      class="absolute inset-0 z-20 flex flex-col sm:flex-row sm:items-start sm:justify-start px-4 gap-6 items-center justify-center text-center  sm:bottom-20 sm:ps-20 sm:inset-auto"
    >
      <!-- زر الفأرة -->
      <div class="pt-2 hidden md:block animate-fadeUp delay-[1200ms]">
        <button class="relative w-12 h-12 md:mt-20 rounded-2xl bg-[#9EBF3B] flex items-center justify-center text-white hover:bg-[#8aab34] transition-all duration-300 shadow-md hover:shadow-lg">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAWCAYAAAAmaHdCAAABGklEQVQ4jdWUMU4CURRFz4AJWrmDKUApKOxoZgduwC24Dk0s2IAFCZ2VnVPQGFsLZQnWlAQKE4LBY+HTkEmGGShMvM3Lf+/e839+fj4AaqreqXPraR7+FCBRT4Fn4Bi4B96o1glwASyADDVXP9SsRvhXaha5HHWp5rsANkC5umwALWBWYmqrY7VdwpkBrUbFZmfAedRSVUFq6U8gn4W6F+QJuIxaqoNtwyRJ3oFhxUb/6GJrQ9Z8v9p91ALWDWAKdPeEdIEp6ij+iM4uabUTuRFqPxYPalITkIRftf/THEZjUAUKwCD8w83BkfoYg7HaKwH0Ym74D4uGpnqjrsI0UW/Vq6iT6K/C19x23FS9Vl/VRQQX6kv002LmC1STO77xU5VDAAAAAElFTkSuQmCC"
            alt="أيقونة الفأرة"
            class="w-4 h-8 object-contain"
          />
        </button>
      </div>

      <!-- النصوص -->
      <div class="mt-20 flex flex-col gap-6 items-center sm:items-start">
        <h1 class="text-xl sm:text-3xl md:text-4xl font-bold leading-snug max-w-2xl animate-fadeUp">
  {{ translate('hero.title') }}
</h1>


        <a
          href="#"
          class="bg-[#9EBF3B] hover:bg-[#8aab34] text-white font-semibold h-14 w-[200px] rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 text-lg animate-fadeUp delay-[600ms]"
        >
          احجز جلستك &gt;
        </a>
      </div>
    </div>

    <!-- نقاط زخرفية -->
    <div class="absolute bottom-8 left-8 z-20 flex gap-2 animate-fadeUp delay-[1800ms]">
      <div class="w-3 h-3 bg-[#9EBF3B] rounded-full"></div>
      <div class="w-3 h-3 bg-[#D6A29A] rounded-full opacity-60"></div>
      <div class="w-3 h-3 bg-[#9EBF3B] rounded-full opacity-40"></div>
    </div>
  </section>
</template>

<script setup>
// لا حاجة لتعديلات هنا
import { inject } from 'vue'

import { useTranslations } from '@/composables/useTranslations'

// const { toggleLanguage, translate } = useTranslations()
const { currentLanguage, toggleLanguage, translate } = inject('languageState')

</script>

<style scoped>
@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeUp {
  animation: fadeUp 1.2s ease-out forwards;
  opacity: 0;
}

.delay-\[600ms\] {
  animation-delay: 0.6s;
}
.delay-\[1200ms\] {
  animation-delay: 1.2s;
}
.delay-\[1800ms\] {
  animation-delay: 1.8s;
}
</style>
