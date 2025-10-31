<template>
  <section class="py-20 bg-gradient-to-br from-gray-50 to-white">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in-down">
          رؤيتنا ورسالتنا
        </h2>
        <p class="text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in-up-delay">
          نسعى لتحقيق التميز في دعم المرأة والطفل والفئات الضعيفة في اليمن
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- الرؤية -->
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 animate-card-slide" style="animation-delay: 0.1s">
          <div class="w-16 h-16 bg-[#9EBF3B] rounded-2xl flex items-center justify-center mb-6 mx-auto hover:scale-110 transition-transform duration-300">
            <i class="fas fa-eye text-white text-2xl"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4 text-center animate-fade-in">رؤيتنا</h3>
          <p class="text-gray-600 leading-relaxed text-center animate-fade-in-delay">
            أن نكون في طليعة المجتمع المدني المتخصص في صناعة مستقبل أفضل للنساء 
            والأطفال والفئات الضعيفة في اليمن
          </p>
        </div>
        
        <!-- الرسالة -->
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 animate-card-slide" style="animation-delay: 0.2s">
          <div class="w-16 h-16 bg-[#D6A29A] rounded-2xl flex items-center justify-center mb-6 mx-auto hover:scale-110 transition-transform duration-300">
            <i class="fas fa-bullseye text-white text-2xl"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4 text-center animate-fade-in">رسالتنا</h3>
          <p class="text-gray-600 leading-relaxed text-center animate-fade-in-delay">
            نسعى الى دعم ومساندة المرأة والطفل والفئات الضعيفة والمهمشة من خلال تعزيز قيم 
            المشاركة والحماية والأمن والسلم المجتمعي، وفق رؤى واستراتيجيات ممنهجة من خلال 
            الخبرات والكفاءات المتخصصة للوقاية والحد من آثار العنف والانتهاكات وصولا الى 
            إرساء قيم العدالة والانصاف وسيادة القانون.
          </p>
        </div>
        
        <!-- القيم -->
        <div class="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 animate-card-slide" style="animation-delay: 0.3s">
          <div class="w-16 h-16 bg-[#9EBF3B] rounded-2xl flex items-center justify-center mb-6 mx-auto hover:scale-110 transition-transform duration-300">
            <i class="fas fa-heart text-white text-2xl"></i>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-4 text-center animate-fade-in">قيمنا</h3>
          <div class="space-y-3 text-right">
            <div class="flex items-center gap-3 text-gray-600 animate-fade-in-list" style="animation-delay: 0.4s">
              <i class="fas fa-check text-[#9EBF3B]"></i>
              <span>العدالة والإنصاف</span>
            </div>
            <div class="flex items-center gap-3 text-gray-600 animate-fade-in-list" style="animation-delay: 0.5s">
              <i class="fas fa-check text-[#9EBF3B]"></i>
              <span>الحماية والأمن</span>
            </div>
            <div class="flex items-center gap-3 text-gray-600 animate-fade-in-list" style="animation-delay: 0.6s">
              <i class="fas fa-check text-[#9EBF3B]"></i>
              <span>المشاركة المجتمعية</span>
            </div>
            <div class="flex items-center gap-3 text-gray-600 animate-fade-in-list" style="animation-delay: 0.7s">
              <i class="fas fa-check text-[#9EBF3B]"></i>
              <span>الشفافية والنزاهة</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
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
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cardSlide {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fadeInList {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in-down {
  animation: fadeInDown 0.8s ease-out forwards;
}

.animate-fade-in-up-delay {
  animation: fadeInUp 0.8s ease-out 0.3s forwards;
  opacity: 0;
}

.animate-card-slide {
  animation: cardSlide 0.6s ease-out forwards;
  opacity: 0;
}

.animate-fade-in {
  animation: fadeInUp 0.6s ease-out 0.4s forwards;
  opacity: 0;
}

.animate-fade-in-delay {
  animation: fadeInUp 0.6s ease-out 0.6s forwards;
  opacity: 0;
}

.animate-fade-in-list {
  animation: fadeInList 0.5s ease-out forwards;
  opacity: 0;
}
</style>