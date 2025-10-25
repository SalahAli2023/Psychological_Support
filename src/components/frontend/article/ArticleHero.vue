<template>
  <!-- هيرو الفعاليات مع فيديو -->
  <section class="relative font-almarai overflow-hidden" dir="rtl" style="height: 40vh; min-height: 300px;">
    
    <!-- فيديو الخلفية -->
    <div class="absolute inset-0">
      <video 
        autoplay 
        muted 
        loop 
        playsinline
        class="w-full h-full object-cover"
      >
        <source src="http://localhost:5173/images/hipno-video.mp4" type="video/mp4">
        <!-- يمكن إضافة مصادر أخرى للفيديو -->
      </video>
      
      <!-- تراكب لوني فوق الفيديو -->
      <div class="absolute inset-0 bg-gradient-to-r from-emerald-600/40 via-blue-500/30 to-purple-600/40"></div>
      <div class="absolute inset-0 bg-black/30"></div>
    </div>

    <!-- أشكال زخرفية -->
    <div class="absolute top-5 left-5 w-40 h-40 bg-emerald-400/25 rounded-full blur-xl"></div>
    <div class="absolute bottom-5 right-5 w-60 h-60 bg-purple-400/25 rounded-full blur-xl"></div>
    <div class="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-300/30 rounded-full blur-lg"></div>

    <div class="relative z-10 w-full h-full flex items-center justify-center">
      <div class="max-w-4xl mx-auto px-6 w-full">
        <div class="max-w-2xl mx-auto text-center">
          
          <!-- العنوان الرئيسي -->
          <div class="inline-block relative">
            <h1 class="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
              
              <span class="text-emerald-300 block mt-1">مقالات الصحة النفسية</span>
            </h1>
            <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full"></div>
          </div>

          <!-- الوصف -->
          <p class="text-body-base text-white/90 leading-relaxed max-w-md mx-auto font-medium drop-shadow-md mt-6">
            اكتشف مقالات متنوعة في مجال الصحة النفسية والدعم النفسي والتنمية الذاتية
          </p>

        

        </div>
      </div>
    </div>

    <!-- زر التمرير للأسفل -->
    <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2">
      <div class="animate-bounce">
        <i class="fas fa-chevron-down text-white/80 text-xl"></i>
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

/* تحسينات إضافية */
.bg-emerald-600\/40 {
  background-color: rgba(5, 150, 105, 0.4);
}

.bg-blue-500\/30 {
  background-color: rgba(59, 130, 246, 0.3);
}

.bg-purple-600\/40 {
  background-color: rgba(147, 51, 234, 0.4);
}
</style>