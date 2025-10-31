<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <!-- الصورة -->
        <div class="order-2 lg:order-1">
          <div class="relative rounded-2xl overflow-hidden animate-float">
            <img 
              src="/images/جلسات.png" 
              alt="مركز الدراسات الاستراتيجية لدعم المرأة والطفل"
              class="w-full h-auto"
            />
            <!-- تراكب متدرج -->
            <div class="absolute inset-0 bg-gradient-to-br from-[#9EBF3B]/10 to-[#D6A29A]/10 transition-opacity duration-500 hover:opacity-0"></div>
          </div>
        </div>
        
        <!-- المحتوى -->
        <div class="order-1 lg:order-2 text-right">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6 animate-fade-in-right">
            <span class="text-[#9EBF3B]">مركز الدراسات الاستراتيجية</span> لدعم المرأة والطفل
          </h2>
          
          <div class="space-y-4 text-gray-600 leading-relaxed">
            <p class="animate-fade-in-up" style="animation-delay: 0.1s">
              مركز الدراسات الاستراتيجية لدعم المرأة والطفل - اليمن هو مؤسسة مدنية مستقلة غير ربحية 
              يتمتع بشخصية قانونية مستقلة. تأسس وفق قانون الجمعيات والمؤسسات الأهلية رقم (1) لسنة 2001م 
              ولائحته التنفيذية في 20/12/2018 بموجب ترخيص مكتب وزارة الشئون الاجتماعية والعمل رقم (80/ م) 
              ومقره الرئيسي محافظة تعز.
            </p>
            
            <p class="animate-fade-in-up" style="animation-delay: 0.2s">
              ويهدف إلى دعم المرأة والطفل بشكل خاص والفئات الضعيفة والمهمشة على وجه العموم من خلال 
              الدراسات والأبحاث المتخصصة والمساهمة في تطوير الاستراتيجيات والسياسات والرؤى الخاصة 
              بتمكين وتحسين أوضاع المرأة والطفل وكافة الفئات الضعيفة والمهمشة وحمايتهم من العنف والتمييز.
            </p>
            
            <p class="animate-fade-in-up" style="animation-delay: 0.3s">
              وكذلك يعمل من خلال المشاريع والبرامج والأنشطة الموجهة لحماية الحقوق والحريات وتعزيز 
              الديمقراطية والحكم الرشيد وبناء السلام والأمن والتنمية، ودعم الهياكل الرسمية وغير الرسمية 
              التي تعني بحماية ورعاية النساء المعنفات والأطفال الجانحين.
            </p>

            <p class="animate-fade-in-up" style="animation-delay: 0.4s">
              ويتفاعل المركز مع كافة الأطراف المدنية المحلية والإقليمية والدولية من خلال التنسيق 
              والشراكات التي تساهم في تحقيق أهداف المركز.
            </p>
          </div>
          
          <div class="mt-8 flex flex-wrap gap-4">
            <div class="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 hover:shadow-md transition-all duration-300 animate-bounce-in" style="animation-delay: 0.5s">
              <div class="w-3 h-3 bg-[#9EBF3B] rounded-full"></div>
              <span class="text-gray-700 font-medium text-sm">مؤسسة مستقلة</span>
            </div>
            <div class="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 hover:shadow-md transition-all duration-300 animate-bounce-in" style="animation-delay: 0.6s">
              <div class="w-3 h-3 bg-[#D6A29A] rounded-full"></div>
              <span class="text-gray-700 font-medium text-sm">غير ربحي</span>
            </div>
            <div class="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 hover:shadow-md transition-all duration-300 animate-bounce-in" style="animation-delay: 0.7s">
              <div class="w-3 h-3 bg-[#9EBF3B] rounded-full"></div>
              <span class="text-gray-700 font-medium text-sm">مرخص رسمياً</span>
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
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
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

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-fade-in-right {
  animation: fadeInRight 0.8s ease-out forwards;
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

.animate-bounce-in {
  animation: bounceIn 0.6s ease-out forwards;
  opacity: 0;
}
</style>