<template>
  <!-- قسم مجالات التخصص -->
  <section 
    ref="sectionRef"
    class="relative py-16 bg-white font-almarai overflow-hidden"
  >
    <!-- أشكال زخرفية في الخلفية -->
    <div 
      class="absolute top-10 left-10 w-32 h-32 bg-[#D6A29A] opacity-10 rounded-full blur-2xl transition-all duration-1000 delay-300"
      :class="decorativeClass"
    ></div>
    <div 
      class="absolute bottom-10 right-10 w-40 h-40 bg-[#9EBF3B] opacity-10 rounded-full blur-2xl transition-all duration-1000 delay-500"
      :class="decorativeClass"
    ></div>
    
    <div class="relative z-10 max-w-6xl mx-auto px-6">
      <!-- العنوان الرئيسي -->
      <div class="text-center mb-12">
        <h2 
          class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 transition-all duration-700"
          :class="titleClass"
        >
          <span class="text-[#9EBF3B]">مجالات </span>
          <span class="text-gray-800">  </span>
          <span class="text-[#D6A29A]">تخصصنا </span>
        </h2>
        <p 
          class="text-gray-600 max-w-xl mx-auto transition-all duration-700"
          :class="contentItemClass"
        >
          نقدم خدمات متخصصة في مختلف مجالات الصحة النفسية
        </p>
      </div>

      <!-- مجالات التخصص -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="(specialty, index) in specialties" 
          :key="index" 
          class="group relative bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 overflow-hidden"
          :class="{ 
            'opacity-0 translate-y-8': !isVisible,
            'opacity-100 translate-y-0': isVisible
          }"
          :style="{ 
            transitionDelay: `${index * 100 + 300}ms`
          }"
        >
          
          <!-- تأثير اللون المتحرك -->
          <div class="absolute inset-0 bg-gradient-to-l from-[#9EBF3B] to-[#D6A29A] opacity-0 group-hover:opacity-5 transform translate-x-full group-hover:translate-x-0 transition-all duration-700 ease-out"></div>
          
          <!-- أيقونة المجال -->
          <div 
            class="relative z-10 w-12 h-12 bg-[#9EBF3B] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#D6A29A] transition-all duration-500"
            :class="{ 
              'scale-0': !isVisible,
              'scale-100': isVisible
            }"
            :style="{ 
              transitionDelay: `${index * 100 + 500}ms`
            }"
          >
            <i :class="specialty.icon" class="text-white group-hover:scale-110 transition-transform duration-300"></i>
          </div>

          <!-- محتوى المجال -->
          <div class="relative z-10">
            <h3 
              class="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#9EBF3B] transition-colors duration-500"
              :class="{ 
                'opacity-0 translate-x-4': !isVisible,
                'opacity-100 translate-x-0': isVisible
              }"
              :style="{ 
                transitionDelay: `${index * 100 + 400}ms`
              }"
            >
              {{ specialty.title }}
            </h3>
            <p 
              class="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-500"
              :class="{ 
                'opacity-0': !isVisible,
                'opacity-100': isVisible
              }"
              :style="{ 
                transitionDelay: `${index * 100 + 600}ms`
              }"
            >
              {{ specialty.description }}
            </p>
          </div>

          <!-- خط سفلي متحرك -->
          <div class="absolute bottom-0 right-0 w-0 h-1 bg-gradient-to-l from-[#9EBF3B] to-[#D6A29A] group-hover:w-full transition-all duration-700 ease-out"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useScrollAnimation } from '@/assets/js/animations.js'

export default {
  name: "SpecialtiesSection",
  mixins: [useScrollAnimation],
  data() {
    return {
      specialties: [
        {
          icon: 'fas fa-sad-tear',
          title: 'القلق والاكتئاب',
          description: 'علاج اضطرابات القلق والاكتئاب بمختلف درجاتها باستخدام أحدث الأساليب العلاجية.'
        },
        {
          icon: 'fas fa-family',
          title: 'الاستشارات الأسرية',
          description: 'تحسين العلاقات الأسرية وحل النزاعات وتعزيز التواصل الفعال بين أفراد الأسرة.'
        },
        {
          icon: 'fas fa-user-graduate',
          title: 'صحة الأطفال والمراهقين',
          description: 'دعم الصحة النفسية للأطفال والمراهقين وعلاج المشكلات السلوكية والنفسية.'
        },
        {
          icon: 'fas fa-briefcase',
          title: 'الإرشاد المهني',
          description: 'مساعدة الأفراد في التغلب على ضغوط العمل وتحقيق التوازن بين الحياة الشخصية والمهنية.'
        },
        {
          icon: 'fas fa-heartbeat',
          title: 'الصدمات النفسية',
          description: 'علاج آثار الصدمات النفسية واضطراب ما بعد الصدمة باستخدام أساليب علاجية متخصصة.'
        },
        {
          icon: 'fas fa-brain',
          title: 'تعزيز الصحة النفسية',
          description: 'برامج وقائية وتنموية لتعزيز الصحة النفسية والمرونة النفسية لدى الأفراد.'
        }
      ]
    }
  },
  computed: {
    decorativeClass() {
      return {
        'opacity-10 scale-100': this.isVisible,
        'opacity-0 scale-50': !this.isVisible
      }
    }
  }
}
</script>

<style scoped>
/* تحسين الانتقالات */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* تأثيرات إضافية للبطاقات */
.group {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.group:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* تأثير على الأيقونات */
.w-12.h-12 {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* تحسين التجاوب */
@media (max-width: 768px) {
  .text-3xl {
    font-size: 2rem;
  }
  
  .gap-6 {
    gap: 1rem;
  }
  
  .p-6 {
    padding: 1.25rem;
  }
}
</style>