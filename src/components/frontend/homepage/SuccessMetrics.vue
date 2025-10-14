<template>
  <!-- قسم الإحصائيات والإنجازات -->
  <section class="relative py-20 bg-gray-50 font-almarai overflow-hidden" dir="rtl">
    <!-- أشكال زخرفية متحركة في الخلفية -->
    <div class="absolute top-0 left-0 w-64 h-64 bg-[#9EBF3B] opacity-10 rounded-full blur-3xl animate-float-slow"></div>
    <div class="absolute bottom-0 right-0 w-80 h-80 bg-[#D6A29A] opacity-10 rounded-full blur-3xl animate-float-slow" style="animation-delay: 2s"></div>

    <div class="relative z-10 max-w-7xl mx-auto px-6">
      <!-- العنوان الرئيسي -->
      <div class="text-center mb-16">
        <div class="inline-block relative">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            <span class="text-[#9EBF3B]">إنجازاتنا</span>
            <span class="text-gray-800 mx-2">•</span>
            <span class="text-[#D6A29A]">البارزة</span>
          </h2>
          <!-- الخط الزخرفي تحت العنوان -->
          <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#9EBF3B] to-[#D6A29A] rounded-full"></div>
        </div>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mt-4">
          أرقام تعكس نجاحنا ونلتزم بتحسين الصحة النفسية
        </p>
      </div>

      <!-- شبكة الإحصائيات -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div v-for="stat in statistics" :key="stat.label" 
             class="group text-center bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-[#9EBF3B] transition-all duration-500 hover:shadow-xl hover:-translate-y-2">
          <div class="text-3xl md:text-4xl font-bold mb-3">
            <span class="text-[#9EBF3B]">{{ stat.value }}</span>
          </div>
          <p class="text-gray-700 text-base font-medium group-hover:text-[#D6A29A] transition-colors duration-500">{{ stat.label }}</p>
          <!-- الخط الزخرفي الذي يظهر عند التمرير -->
          <div class="w-10 h-1 bg-[#D6A29A] rounded-full mx-auto mt-3 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center"></div>
        </div>
      </div>

      <!-- قسم فريق الخبراء -->
      <div class="bg-white rounded-3xl p-8 mb-12 border-2 border-gray-100">
        <div class="text-center mb-8">
          <h3 class="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
            فريق <span class="text-[#9EBF3B]">خبرائنا</span>
          </h3>
          <p class="text-base text-gray-600 max-w-2xl mx-auto">
            نخبة من الأخصائيين المعتمدين ذوي الخبرة الواسعة في مجالات متعددة
          </p>
        </div>

        <!-- شبكة الخبراء -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="expert in experts" :key="expert.name"
               class="group text-center bg-gray-50 rounded-2xl p-6 border-2 border-gray-200 hover:border-[#9EBF3B] transition-all duration-500 hover:shadow-lg">
            <div class="relative inline-block mb-4">
              <img 
                :src="expert.image" 
                :alt="expert.name"
                class="w-20 h-20 rounded-2xl object-cover mx-auto border-2 border-gray-300 group-hover:border-[#D6A29A] transition-all duration-500"
              />
              <!-- نقطة الحالة الخضراء -->
              <div class="absolute -top-1 -right-1 w-4 h-4 bg-[#9EBF3B] rounded-full"></div>
            </div>
            <h4 class="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#9EBF3B] transition-colors duration-500">{{ expert.name }}</h4>
            <p class="text-[#D6A29A] font-medium mb-3 group-hover:text-[#9EBF3B] transition-colors duration-500">{{ expert.specialty }}</p>
            <p class="text-gray-600 text-sm leading-relaxed mb-4">{{ expert.description }}</p>
            
            <!-- التخصصات -->
            <div class="flex flex-wrap gap-2 justify-center">
              <span v-for="skill in expert.skills" :key="skill"
                    class="bg-[#9EBF3B] text-white px-3 py-1 rounded-full text-xs border border-[#9EBF3B] hover:bg-[#D6A29A] hover:border-[#D6A29A] transition-all duration-500">
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- دعوة للعمل (CTA) -->
      <div class="text-center">
        <button class="relative bg-[#9EBF3B] hover:bg-[#D6A29A] text-white font-bold text-base px-8 py-4 rounded-xl border-2 border-[#9EBF3B] hover:border-[#D6A29A] transition-all duration-500 transform hover:scale-105 hover:shadow-xl group overflow-hidden">
          <span class="relative z-10 flex items-center gap-2">
            ابدأ رحلتك نحو الصحة النفسية
            <!-- أيقونة السهم (تتطلب مكتبة مثل Font Awesome) -->
            <i class="fas fa-arrow-left text-white group-hover:translate-x-1 transition-transform duration-300"></i>
          </span>
          <!-- تأثير التدرج اللوني عند التمرير -->
          <div class="absolute inset-0 rounded-xl bg-gradient-to-r from-[#9EBF3B] to-[#D6A29A] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// بيانات الإحصائيات
const statistics = ref([
  { value: '+5000', label: 'جلسة دعم' },
  { value: '+150', label: 'أخصائي معتمد' },
  { value: '98%', label: 'رضا العملاء' },
  { value: '+100', label: 'ورشة تدريبية' }
])

// بيانات فريق الخبراء
const experts = ref([
  {
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80',
    name: 'د. أحمد محمد',
    specialty: 'أخصائي العلاج النفسي',
    description: 'خبرة 15 عاماً في العلاج المعرفي السلوكي والاستشارات الأسرية',
    skills: ['العلاج المعرفي', 'الاستشارات الأسرية', 'إدارة الضغوط']
  },
  {
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80',
    name: 'د. سارة الخالد',
    specialty: 'استشاري الصحة النفسية',
    description: 'متخصصة في علاج القلق والاكتئاب وتطوير الذات',
    skills: ['علاج القلق', 'التنمية الذاتية', 'الدعم النفسي']
  },
  {
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80',
    name: 'د. خالد العلي',
    specialty: 'معالج نفسي إكلينيكي',
    description: 'خبير في العلاج الجشطالتي والاستشارات الزوجية',
    skills: ['العلاج الجشطالتي', 'الاستشارات الزوجية', 'تحليل الشخصية']
  }
])
</script>

<style scoped>
/* ملاحظة: تأكد من إضافة خط 'Almarai' لمشروعك */
/* import url('https://fonts.googleapis.com/css2?family=Almarai:wght@400;700;800&display=swap'); */

/* حركة الطفو البطيئة للأشكال الخلفية */
@keyframes float-slow {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}
</style>