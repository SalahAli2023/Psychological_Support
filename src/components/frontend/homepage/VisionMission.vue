<template>
  <section class="relative py-16 bg-gradient-to-br from-gray-50 to-white font-almarai overflow-hidden" dir="rtl">
    <!-- أشكال زخرفية في الخلفية -->
    <div class="absolute top-10 left-10 w-60 h-60 bg-[#9EBF3B] opacity-5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-10 right-10 w-80 h-80 bg-[#D6A29A] opacity-5 rounded-full blur-3xl"></div>

    <div class="relative z-10 max-w-6xl mx-auto px-6">
      <!-- العنوان الرئيسي -->
      <div class="text-center mb-16">
        <div class="inline-block relative">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span class="text-[#9EBF3B]">رؤيتنا </span>
            <span class="text-gray-800 mx-2">و</span>
            <span class="text-[#D6A29A]">رسالتنا</span>
          </h2>
          <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#9EBF3B] to-[#D6A29A] rounded-full"></div>
        </div>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mt-4">
          نعمل من أجل <span class="text-[#9EBF3B] font-medium">مجتمع</span> يتمتع 
          <span class="text-[#D6A29A] font-medium">بصحة نفسية</span> متوازنة
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        <!-- الرؤية -->
        <div class="group relative">
          <div class="absolute -inset-1 bg-gradient-to-r from-[#9EBF3B] to-emerald-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
          <div class="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group-hover:scale-102">
            <div class="flex items-center gap-4 mb-6">
              <div class="relative">
                <div class="w-16 h-16 bg-gradient-to-br from-[#9EBF3B] to-emerald-400 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition duration-300">
                  <i class="fas fa-eye text-white text-xl"></i>
                </div>
                <div class="absolute -top-1 -right-1 w-4 h-4 bg-[#9EBF3B] rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900">رؤيتنا</h3>
                <div class="w-12 h-1 bg-[#9EBF3B] rounded-full mt-1"></div>
              </div>
            </div>
            <p class="text-gray-700 leading-relaxed mb-6 text-base">
              أن نكون <span class="text-[#9EBF3B] font-medium">المنصة الرائدة</span> في تقديم خدمات الدعم النفسي والاستشارات المتخصصة 
              في منطقة الشرق الأوسط وشمال أفريقيا، وأن <span class="text-[#9EBF3B] font-medium">نساهم</span> في بناء مجتمع يتمتع 
              بصحة نفسية متكاملة.
            </p>
            <div class="flex gap-2">
              <div class="w-3 h-3 bg-[#9EBF3B] rounded-full animate-bounce" style="animation-delay: 0s"></div>
              <div class="w-3 h-3 bg-[#9EBF3B] rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
              <div class="w-3 h-3 bg-[#9EBF3B] rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
            </div>
          </div>
        </div>

        <!-- الرسالة -->
        <div class="group relative">
          <div class="absolute -inset-1 bg-gradient-to-r from-[#D6A29A] to-pink-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
          <div class="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group-hover:scale-102">
            <div class="flex items-center gap-4 mb-6">
              <div class="relative">
                <div class="w-16 h-16 bg-gradient-to-br from-[#D6A29A] to-pink-400 rounded-xl flex items-center justify-center shadow-lg transform group-hover:-rotate-6 transition duration-300">
                  <i class="fas fa-bullseye text-white text-xl"></i>
                </div>
                <div class="absolute -top-1 -right-1 w-4 h-4 bg-[#D6A29A] rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900">رسالتنا</h3>
                <div class="w-12 h-1 bg-[#D6A29A] rounded-full mt-1"></div>
              </div>
            </div>
            <p class="text-gray-700 leading-relaxed mb-6 text-base">
              تقديم خدمات نفسية <span class="text-[#D6A29A] font-medium">متكاملة</span> ومهنية من خلال فريق من الأخصائيين المعتمدين، 
              وتعزيز <span class="text-[#D6A29A] font-medium">الوعي</span> بأهمية الصحة النفسية، وتمكين الأفراد من تحقيق التوازن 
              النفسي والعاطفي.
            </p>
            <div class="flex gap-2">
              <div class="w-3 h-3 bg-[#D6A29A] rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-3 h-3 bg-[#D6A29A] rounded-full animate-bounce" style="animation-delay: 0.3s"></div>
              <div class="w-3 h-3 bg-[#D6A29A] rounded-full animate-bounce" style="animation-delay: 0.5s"></div>
            </div>
          </div>
        </div>

      </div>

      <!-- القيم -->
      <div class="mt-16 relative">
        <div class="relative bg-gradient-to-r from-[#9EBF3B] to-[#D6A29A] rounded-3xl p-8 text-white shadow-xl">
          <div class="text-center mb-12">
            <h3 class="text-2xl md:text-3xl font-bold mb-4">قيمنا</h3>
            <p class="text-base opacity-90 max-w-xl mx-auto">
              الأسس التي تُرشد خطانا نحو التميز والنجاح
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="(value, index) in values" :key="index" 
                 class="group text-center bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div class="relative inline-block mb-4">
                <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto transform group-hover:scale-110 transition duration-300">
                  <i :class="value.icon" class="text-white text-lg"></i>
                </div>
                <div class="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition duration-300"></div>
              </div>
              <h4 class="text-lg font-bold mb-3 text-white">{{ value.title }}</h4>
              <p class="text-white/80 text-sm leading-relaxed">{{ value.description }}</p>
            </div>
          </div>

          <!-- نقاط زخرفية -->
          <div class="absolute top-6 left-6 flex gap-1">
            <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div class="w-2 h-2 bg-white rounded-full animate-pulse" style="animation-delay: 0.5s"></div>
          </div>
          <div class="absolute bottom-6 right-6 flex gap-1">
            <div class="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div class="w-2 h-2 bg-white rounded-full animate-pulse" style="animation-delay: 0.5s"></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const values = [
  {
    icon: 'fas fa-shield-alt',
    title: 'السرية',
    description: 'نحافظ على خصوصية وسرية جميع المعلومات'
  },
  {
    icon: 'fas fa-hand-holding-heart',
    title: 'التعاطف',
    description: 'نقدم الدعم بقلوب مفتوحة وعقول متفتحة'
  },
  {
    icon: 'fas fa-award',
    title: 'المهنية',
    description: 'نلتزم بأعلى معايير الجودة والاحترافية'
  },
  {
    icon: 'fas fa-users',
    title: 'التعاون',
    description: 'نعمل معاً لتحقيق الأهداف المشتركة'
  }
]
</script>

<style scoped>
.group-hover\:scale-102 {
  transform: scale(1.02);
}
</style>