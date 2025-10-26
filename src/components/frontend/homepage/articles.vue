<!-- ArticlesSection.vue -->
<template>
  <!-- قسم المقالات التوعوية -->
  <section class="relative py-20 bg-white font-almarai overflow-hidden" >
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
        <!-- استخدام مكون ArticleCard داخل حلقة v-for -->
        <ArticleCard 
          v-for="article in articles" 
          :key="article.id" 
          :article="article" 
        />
      </div>

      <!-- دعوة للعمل (عرض جميع المقالات) -->
      <div class="text-center mt-12">
       <router-link
          to="/article"
          class="curtain-hover-btn relative bg-transparent text-[#9EBF3B] font-bold text-base px-8 py-4 rounded-xl border-2 border-[#9EBF3B] transition-all duration-500 transform hover:scale-105 hover:shadow-xl overflow-hidden group inline-block text-center"
        >
          <span class="flex items-center gap-2 relative z-10 transition-colors duration-500 group-hover:text-white">
            عرض جميع المقالات
            <i class="fas fa-arrow-left transition-colors duration-500 group-hover:text-white"></i>
          </span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
// استيراد مكون البطاقة
import ArticleCard from '../layouts/ArticleCard.vue'

// بيانات المقالات
const articles = ref([
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'القلق والتوتر',
    title: 'كيفية التعامل مع نوبات الهلع بفعالية',
    description: 'نوبات الهلع يمكن أن تكون تجربة مرعبة، ولكن هناك استراتيجيات فعالة يمكنك تعلمها للتعامل معها وتقليل تأثيرها على حياتك اليومية.',
    author: 'د. سارة الخالد',
    date: '15 أكتوبر 2023'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'تطوير الذات',
    title: 'قوة التفكير الإيجابي في تغيير حياتك',
    description: 'التفكير الإيجابي ليس مجرد شعار، بل هو علم مدعوم بأدلة. تعلم كيف يمكن لتغيير نمط تفكيرك أن يحسن صحتك النفسية والجسدية.',
    author: 'د. أحمد محمد',
    date: '8 أكتوبر 2023'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    category: 'العلاقات',
    title: 'أساسيات التواصل الصحي في العلاقات',
    description: 'التواصل هو حجر الزاوية في أي علاقة ناجحة. اكتشف المهارات الأساسية لتحسين طريقة تواصلك مع شريكك وأحبائك.',
    author: 'د. خالد العلي',
    date: '1 أكتوبر 2023'
  }
])
</script>

<style scoped>
/* تأثير الستار على زر عرض جميع المقالات */
.curtain-hover-btn {
  position: relative;
  overflow: hidden;
}

.curtain-hover-btn::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 100%;
  background-color: #9EBF3B;
  transition: width 0.5s ease-in-out;
  z-index: 1;
}

.curtain-hover-btn:hover::before {
  width: 100%;
}
</style>