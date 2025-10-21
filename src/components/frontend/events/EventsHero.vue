<template>
  <!-- هيرو الفعاليات فقط -->
  <section class="relative font-almarai overflow-hidden" dir="rtl" style="height: 60vh; min-height: 400px;">
    
    <!-- خلفية متدرجة لونية: أخضر - أبيض - وردي -->
    <div class="absolute inset-0 bg-gradient-to-br from-[#9EBF3B] via-white to-[#D6A29A]"></div>
    
    <!-- تأثيرات إضافية للعمق -->
    <div class="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
    
    <!-- أشكال زخرفية -->
    <div class="absolute top-10 left-10 w-60 h-60 bg-[#9EBF3B]/10 rounded-full blur-2xl"></div>
    <div class="absolute bottom-10 right-10 w-80 h-80 bg-[#D6A29A]/10 rounded-full blur-2xl"></div>
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>

    <div class="relative z-10 w-full h-full flex items-center justify-center">
      <div class="max-w-4xl mx-auto px-6 w-full">
        <div class="max-w-2xl mx-auto text-center">
          
          <!-- العنوان الرئيسي -->
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            رحلة نحو
            <span class="text-[#9EBF3B] block mt-2">الصحة النفسية</span>
            <span class="text-gray-700 text-xl md:text-2xl block mt-2">والتوازن الداخلي</span>
          </h1>
          
          <!-- الخط الفاصل -->
          <div class="w-16 h-1 bg-gradient-to-r from-[#9EBF3B] to-[#D6A29A] mx-auto mb-6 rounded-full"></div>

          <!-- الوصف -->
          <p class="text-base md:text-lg text-gray-600 leading-relaxed max-w-md mx-auto font-medium">
            اكتشف فعالياتنا وورش العمل المتنوعة المصممة خصيصاً لدعم صحتك النفسية 
            وتطوير مهاراتك الشخصية
          </p>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// لا حاجة لبيانات هنا
</script>

<style scoped>
/* تأثيرات بسيطة */
section {
  transition: all 0.3s ease-in-out;
}
</style>