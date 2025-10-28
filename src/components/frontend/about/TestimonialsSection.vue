<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          ماذا يقول <span class="text-[#D6A29A]">عملاؤنا</span>
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          آراء وتقييمات من مستفيدين حقيقيين من خدماتنا
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="testimonial in testimonials" 
          :key="testimonial.id"
          class="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all duration-300"
        >
          <!-- التقييم -->
          <div class="flex justify-center mb-4">
            <div class="flex gap-1">
              <i 
                v-for="star in 5" 
                :key="star"
                class="fas fa-star text-yellow-400"
                :class="{ 'text-gray-300': star > testimonial.rating }"
              ></i>
            </div>
          </div>
          
          <!-- النص -->
          <p class="text-gray-700 text-lg leading-relaxed mb-6 text-center">
            "{{ testimonial.text }}"
          </p>
          
          <!-- المعلومات -->
          <div class="flex items-center gap-4 justify-center">
            <div class="w-12 h-12 bg-gradient-to-br from-[#9EBF3B] to-emerald-500 rounded-full flex items-center justify-center">
              <span class="text-white font-bold text-sm">{{ testimonial.initials }}</span>
            </div>
            <div class="text-right">
              <div class="font-bold text-gray-900">{{ testimonial.name }}</div>
              <div class="text-gray-500 text-sm">{{ testimonial.role }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- شريط الثقة -->
      <!-- <div class="mt-16 bg-gradient-to-r from-[#9EBF3B] to-[#D6A29A] rounded-2xl p-8 text-white text-center">
        <h3 class="text-2xl md:text-3xl font-bold mb-4">نثق بنا لأننا نثق بكم</h3>
        <p class="text-xl opacity-90 max-w-2xl mx-auto">
          نعتز بثقة عملائنا ونعمل دائمًا على تقديم الأفضل لنساهم في رحلتكم نحو الصحة النفسية المتوازنة
        </p>
      </div> -->
    </div>
  </section>
</template>

<script setup>
const testimonials = [
  {
    id: 1,
    text: 'تجربة رائعة مع الفريق المتخصص، ساعدوني في تخطي أصعب المراحل بحرفية عالية واهتمام حقيقي.',
    rating: 5,
    name: 'أحمد محمد',
    role: 'مستفيد من الخدمات',
    initials: 'أح'
  },
  {
    id: 2,
    text: 'الورش التدريبية ممتازة والمحتوى علمي وعملي، استفدت كثيرًا في مجال عملي كأخصائي نفسي.',
    rating: 5,
    name: 'د. فاطمة علي',
    role: 'أخصائية نفسية',
    initials: 'فط'
  },
  {
    id: 3,
    text: 'السرية والاحترافية كانتا على أعلى مستوى، أشعر بالأمان والثقة في التعامل مع المنصة.',
    rating: 4,
    name: 'سارة عبدالله',
    role: 'مستفيدة من الاستشارات',
    initials: 'سر'
  }
]
</script>


