<template>
  <!-- قسم فريق الخبراء -->
  <section class="relative py-20 bg-white font-almarai overflow-hidden" dir="rtl">
    <!-- أشكال زخرفية في الخلفية -->
    <div class="absolute top-0 left-0 w-72 h-72 bg-[#9EBF3B] opacity-5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-0 w-80 h-80 bg-[#D6A29A] opacity-5 rounded-full blur-3xl"></div>
    
    <div class="relative z-10 max-w-6xl mx-auto px-6">
      <!-- العنوان الرئيسي -->
      <div class="text-center mb-16">
        <div class="inline-block relative">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            فريق <span class="text-[#9EBF3B]">خبرائنا</span>
          </h2>
          <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#9EBF3B] to-[#D6A29A] rounded-full"></div>
        </div>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
          نخبة من الأخصائيين المعتمدين ذوي الخبرة الواسعة في مجالات متعددة
        </p>
      </div>

      <!-- كاروسيل الأخصائيين -->
      <div class="relative">
        <!-- زر السابق -->
        <button @click="prevExpert" class="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl border border-gray-200 flex items-center justify-center text-[#9EBF3B] hover:text-[#D6A29A] transition-all duration-300 hover:scale-110">
          <i class="fas fa-chevron-right text-lg"></i>
        </button>

        <!-- زر التالي -->
        <button @click="nextExpert" class="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl border border-gray-200 flex items-center justify-center text-[#9EBF3B] hover:text-[#D6A29A] transition-all duration-300 hover:scale-110">
          <i class="fas fa-chevron-left text-lg"></i>
        </button>

        <!-- === الحل الرئيسي: لف الكاروسيل في حاوية LTR === -->
        <div class="ltr" @mouseenter="stopAutoSlide" @mouseleave="startAutoSlide">
          <div class="overflow-hidden">
            <div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
              <div v-for="(expert, index) in experts" :key="expert.id" class="w-full flex-shrink-0 px-4">
                <div class="max-w-4xl mx-auto">
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <!-- الصورة -->
                    <div class="relative group">
                      <div class="relative">
                        <img 
                          :src="expert.image" 
                          :alt="expert.name"
                          class="w-80 h-80 rounded-3xl object-cover mx-auto shadow-2xl border-4 border-white transform group-hover:scale-105 transition-all duration-500"
                        />
                        <!-- تأثير خلف الصورة -->
                        <div class="absolute -inset-4 bg-gradient-to-br from-[#9EBF3B] to-[#D6A29A] rounded-3xl opacity-20 blur-xl transform group-hover:scale-105 transition-all duration-500"></div>
                      </div>
                    </div>

                    <!-- المعلومات -->
                    <div class="text-center lg:text-right">
                      <h3 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{{ expert.name }}</h3>
                      <p class="text-xl text-[#D6A29A] font-semibold mb-6">{{ expert.specialty }}</p>
                      
                      <!-- التخصصات -->
                      <div class="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
                        <span v-for="skill in expert.skills" :key="skill"
                              class="bg-gradient-to-r from-[#9EBF3B] to-emerald-400 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                          {{ skill }}
                        </span>
                      </div>

                      <!-- مؤشر التقدم -->
                      <div class="flex items-center justify-center lg:justify-start gap-2 mb-6">
                        <div v-for="n in experts.length" :key="n" 
                             class="w-3 h-3 rounded-full transition-all duration-300"
                             :class="n - 1 === currentIndex ? 'bg-[#9EBF3B] scale-125' : 'bg-gray-300'">
                        </div>
                      </div>

                      <!-- أزرار التواصل -->
                      <div class="flex gap-4 justify-center lg:justify-start">
                        <button class="bg-[#9EBF3B] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#8aa835] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                          <span class="flex items-center gap-2">
                            احجز استشارة
                            <i class="fas fa-calendar-check"></i>
                          </span>
                        </button>
                        <button class="bg-transparent text-[#9EBF3B] font-semibold py-3 px-6 rounded-xl border-2 border-[#9EBF3B] hover:bg-[#9EBF3B] hover:text-white transition-all duration-300">
                          <span class="flex items-center gap-2">
                            الملف الشخصي
                            <i class="fas fa-user"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- مؤشر الصفحات -->
      <div class="flex justify-center mt-12 gap-3">
        <button v-for="(expert, index) in experts" :key="expert.id"
                @click="goToExpert(index)"
                class="w-12 h-2 rounded-full transition-all duration-300"
                :class="index === currentIndex ? 'bg-[#9EBF3B]' : 'bg-gray-300 hover:bg-gray-400'">
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentIndex = ref(0)
let autoSlideInterval = null

// بيانات الأخصائيين - 5 أطباء
const experts = ref([
  {
    id: 1,
    name: 'د. أحمد محمد',
    specialty: 'أخصائي العلاج النفسي',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    skills: ['العلاج المعرفي', 'الاستشارات الأسرية', 'إدارة الضغوط']
  },
  {
    id: 2,
    name: 'د. سارة الخالد',
    specialty: 'استشاري الصحة النفسية',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    skills: ['علاج القلق', 'التنمية الذاتية', 'الدعم النفسي']
  },
  {
    id: 3,
    name: 'د. خالد العلي',
    specialty: 'معالج نفسي إكلينيكي',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    skills: ['العلاج الجشطالتي', 'الاستشارات الزوجية', 'تحليل الشخصية']
  },
  {
    id: 4,
    name: 'د. فاطمة الناصر',
    specialty: 'اخصائية العلاج السلوكي',
    image: 'https://images.unsplash.com/photo-1594824947933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    skills: ['العلاج السلوكي', 'إدارة الغضب', 'التدريب الذاتي']
  },
  {
    id: 5,
    name: 'د. محمد الحربي',
    specialty: 'استشاري العلاقات الأسرية',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    skills: ['العلاج الأسري', 'حل النزاعات', 'التواصل الفعال']
  }
])

// الانتقال للأخصائي السابق
const prevExpert = () => {
  currentIndex.value = currentIndex.value === 0 ? experts.value.length - 1 : currentIndex.value - 1
}

// الانتقال للأخصائي التالي
const nextExpert = () => {
  currentIndex.value = currentIndex.value === experts.value.length - 1 ? 0 : currentIndex.value + 1
}

// الانتقال لأخصائي محدد
const goToExpert = (index) => {
  currentIndex.value = index
}

// دوال التحكم بالتمرير التلقائي
const startAutoSlide = () => {
  autoSlideInterval = setInterval(() => {
    nextExpert()
  }, 5000)
}

const stopAutoSlide = () => {
  clearInterval(autoSlideInterval)
}

// تشغيل الكاروسيل تلقائياً عند تحميل المكون
onMounted(() => {
  startAutoSlide()
})

// تنظيف الـ interval عند إزالة المكون من الـ DOM
onUnmounted(() => {
  stopAutoSlide()
})
</script>

<style scoped>
/* تأثيرات مخصصة */
</style>