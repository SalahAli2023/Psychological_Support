<template>
  <!-- قسم المقالات التوعوية -->
  <section class="relative py-20 bg-white font-almarai overflow-hidden" dir="rtl">
    <!-- أشكال زخرفية في الخلفية -->
    <div class="absolute top-10 left-10 w-32 h-32 bg-[#D6A29A] opacity-5 rounded-full blur-2xl"></div>
    <div class="absolute bottom-10 right-10 w-40 h-40 bg-[#9EBF3B] opacity-5 rounded-full blur-2xl"></div>

    <div class="relative z-10 max-w-7xl mx-auto px-6">
      <!-- العنوان الرئيسي -->
      <div class="text-center mb-16">
        <div class="inline-block relative">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            مقالات <span class="text-[#9EBF3B]">توعوية</span>
          </h2>
          <!-- الخط الزخرفي تحت العنوان -->
          <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#9EBF3B] to-[#D6A29A] rounded-full"></div>
        </div>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mt-4">
          اكتشف مجموعة من المقالات المختارة لمساعدتك على فهم نفسك بشكل أفضل وتعزيز صحتك النفسية
        </p>
      </div>

      <!-- شبكة المقالات -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article v-for="article in articles" :key="article.id" 
                 class="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
          
          <!-- صورة المقال -->
          <div class="relative overflow-hidden h-48">
            <img :src="article.image" :alt="article.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <!-- تراكب لوني عند التمرير -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <!-- محتوى المقال -->
          <div class="p-6">
            <!-- التصنيف -->
            <span :class="`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${article.categoryStyle}`">
              {{ article.category }}
            </span>

            <!-- العنوان -->
            <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#D6A29A] transition-colors duration-300">
              {{ article.title }}
            </h3>

            <!-- الوصف -->
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">
              {{ article.description }}
            </p>

            <!-- معلومات إضافية (الكاتب والتاريخ) -->
            <div class="flex items-center justify-between text-xs text-gray-500">
              <div class="flex items-center gap-2">
                <!-- أيقونة كاتب بسيطة -->
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                </svg>
                <span>{{ article.author }}</span>
              </div>
              <div class="flex items-center gap-2">
                <!-- أيقونة تاريخ بسيطة -->
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/>
                </svg>
                <span>{{ article.date }}</span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- دعوة للعمل (عرض جميع المقالات) -->
      <div class="text-center mt-12">
        <button class="relative bg-transparent hover:bg-[#9EBF3B] text-[#9EBF3B] hover:text-white font-bold text-base px-8 py-4 rounded-xl border-2 border-[#9EBF3B] hover:border-[#9EBF3B] transition-all duration-500 transform hover:scale-105 hover:shadow-xl group">
          <span class="flex items-center gap-2">
            عرض جميع المقالات
            <i class="fas fa-arrow-left text-[#9EBF3B] group-hover:text-white transition-colors duration-300"></i>
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// بيانات المقالات
const articles = ref([
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'القلق والتوتر',
    categoryStyle: 'bg-blue-100 text-blue-700',
    title: 'كيفية التعامل مع نوبات الهلع بفعالية',
    description: 'نوبات الهلع يمكن أن تكون تجربة مرعبة، ولكن هناك استراتيجيات فعالة يمكنك تعلمها للتعامل معها وتقليل تأثيرها على حياتك اليومية.',
    author: 'د. سارة الخالد',
    date: '15 أكتوبر 2023'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'تطوير الذات',
    categoryStyle: 'bg-green-100 text-green-700',
    title: 'قوة التفكير الإيجابي في تغيير حياتك',
    description: 'التفكير الإيجابي ليس مجرد شعار، بل هو علم مدعوم بأدلة. تعلم كيف يمكن لتغيير نمط تفكيرك أن يحسن صحتك النفسية والجسدية.',
    author: 'د. أحمد محمد',
    date: '8 أكتوبر 2023'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'العلاقات',
    categoryStyle: 'bg-pink-100 text-pink-700',
    title: 'أساسيات التواصل الصحي في العلاقات',
    description: 'التواصل هو حجر الزاوية في أي علاقة ناجحة. اكتشف المهارات الأساسية لتحسين طريقة تواصلك مع شريكك وأحبائك.',
    author: 'د. خالد العلي',
    date: '1 أكتوبر 2023'
  }
])
</script>

<style scoped>
/* لقطع النصوص الطويلة وإضافة "..." في النهاية */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>