<template>
  <!-- قسم فريق الخبراء -->
  <section 
    ref="sectionRef"
    class="relative py-16 md:py-20 bg-white font-almarai overflow-hidden transition-all duration-1000"
    :class="sectionClass"
  >
    <!-- أشكال زخرفية في الخلفية -->
    <div 
      class="absolute top-0 left-0 w-72 h-72 bg-primary-green opacity-5 rounded-full blur-3xl transition-all duration-1000 delay-300"
      :class="decorativeClass"
    ></div>
    <div 
      class="absolute bottom-0 right-0 w-80 h-80 bg-primary-pink opacity-5 rounded-full blur-3xl transition-all duration-1000 delay-500"
      :class="decorativeClass"
    ></div>
    
    <div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
      <!-- العنوان الرئيسي -->
      <div class="text-center mb-12 md:mb-16">
        <div class="inline-block relative">
          <TitleSection
            :mainText="translate('home.experts.title')"
            :highlightText="translate('home.experts.highlight')"
          />
        </div>
        <p 
          class="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mt-4 transition-all duration-700 delay-300"
          :class="contentItemClass"
        >
          {{ translate('home.experts.subtitle') }}
        </p>
      </div>

      <!-- كاروسيل الأخصائيين -->
      <div class="relative">
        <!-- زر السابق -->
        <button 
          @click="prevExpert" 
          class="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg hover:shadow-xl border border-gray-200 flex items-center justify-center text-primary-green hover:text-primary-pink transition-all duration-300 hover:scale-110"
          :class="navButtonClass"
        >
          <i class="fas fa-chevron-right text-sm md:text-lg"></i>
        </button>

        <!-- زر التالي -->
        <button 
          @click="nextExpert" 
          class="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg hover:shadow-xl border border-gray-200 flex items-center justify-center text-primary-green hover:text-primary-pink transition-all duration-300 hover:scale-110"
          :class="navButtonClass"
        >
          <i class="fas fa-chevron-left text-sm md:text-lg"></i>
        </button>

        <!-- الحاوية الرئيسية للسلايدر -->
        <div class="ltr" @mouseenter="stopAutoSlide" @mouseleave="startAutoSlide">
          <div class="overflow-hidden rounded-2xl">
            <div 
              class="flex transition-transform duration-700 ease-out" 
              :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
            >
              <div v-for="(expert, index) in experts" :key="expert.id" class="w-full flex-shrink-0 px-3 md:px-4">
                <div class="max-w-4xl mx-auto">
                  <div class="flex flex-col lg:grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                    <!-- الصورة -->
                    <div class="relative group transition-all duration-700 delay-200 order-2 lg:order-1"
                         :class="expertImageClass">
                      <div class="relative">
                        <img 
                          :src="expert.image" 
                          :alt="expert.name"
                          class="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-2xl md:rounded-3xl object-cover mx-auto border-4 border-white transform group-hover:scale-105 transition-all duration-500"
                        />
                      </div>
                    </div>

                    <!-- المعلومات -->
                    <div class=" transition-all duration-700 delay-400 order-1 lg:order-2"
                         :class="expertInfoClass">
                      <h3 class="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4">{{ expert.name }}</h3>
                      <p class="text-lg sm:text-xl text-primary-pink font-semibold mb-4 md:mb-6">{{ expert.specialty }}</p>
                      
                      <!-- الوصف -->
                      <p class="text-gray-600 leading-relaxed mb-6 md:mb-8 text-sm sm:text-base md:text-lg">
                        {{ expert.description }}
                      </p>

                      <!-- أزرار التواصل -->
                      <div class="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start transition-all duration-700 delay-600"
                           :class="buttonClass">
                        <button class="bg-primary-green text-white font-semibold py-2 md:py-3 px-6 md:px-8 rounded-xl hover:bg-[#8aa835] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base">
                          <span class="flex items-center gap-2 justify-center">
                            {{ translate('home.experts.book') }}
                            <i class="fas fa-calendar-check text-xs md:text-sm"></i>
                          </span>
                        </button>
                        <button class="bg-transparent text-primary-green font-semibold py-2 md:py-3 px-6 md:px-8 rounded-xl border-2 border-primary-green hover:bg-primary-green hover:text-white transition-all duration-300 transform hover:scale-105 text-sm md:text-base">
                          <span class="flex items-center gap-2 justify-center">
                            {{ translate('home.experts.profile') }}
                            <i class="fas fa-user text-xs md:text-sm"></i>
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

      <!-- مؤشر الصفحات (3 نقاط فقط) -->
      <div class="flex justify-center mt-8 md:mt-12 gap-2 md:gap-3 transition-all duration-700 delay-800"
           :class="buttonClass">
        <button 
          v-for="index in visibleIndices" 
          :key="index"
          @click="goToExpert(index)"
          class="w-8 h-2 md:w-12 md:h-2 rounded-full transition-all duration-300 hover:scale-110"
          :class="index === currentIndex ? 'bg-primary-green scale-110' : 'bg-gray-300 hover:bg-gray-400'"
        >
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import { useScrollAnimation } from '@/assets/js/animations.js'
import TitleSection from '@/components/frontend/layouts/TitleSection.vue'

export default {
  name: "ExpertsSection",
  mixins: [useScrollAnimation],
   components: {
    TitleSection
  },
  inject: ['languageState'],
  data() {
    return {
      currentIndex: 0,
      autoSlideInterval: null,
      experts: [
        {
          id: 1,
          name: 'د. أحمد محمد',
          specialty: 'أخصائي العلاج النفسي',
          image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
          description: 'أخصائي علاج نفسي معتمد بخبرة تزيد عن 15 عاماً في مجال الصحة النفسية. متخصص في العلاج المعرفي السلوكي والاستشارات الأسرية، مع تركيز على علاج القلق والاكتئاب وإدارة الضغوط النفسية.'
        },
        {
          id: 2,
          name: 'د. سارة الخالد',
          specialty: 'استشاري الصحة النفسية',
          image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
          description: 'استشارية صحة نفسية حاصلة على درجة الدكتوراه في علم النفس الإكلينيكي. تتمتع بخبرة 12 عاماً في تقديم الدعم النفسي والعلاجي للمراهقين والبالغين، مع اهتمام خاص بعلاج اضطرابات القلق وتعزيز الصحة النفسية.'
        },
        {
          id: 3,
          name: 'د. خالد العلي',
          specialty: 'معالج نفسي إكلينيكي',
          image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
          description: 'متخصص في العلاج السلوكي والاستشارات الزوجية، مع تركيز على تحليل الشخصية وعلاج المشكلات النفسية المرتبطة بالعلاقات الإنسانية.'
        },
        {
          id: 4,
          name: 'د. فاطمة الناصر',
          specialty: 'اخصائية العلاج السلوكي',
          image: 'https://images.unsplash.com/photo-1594824947933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
          description: 'أخصائية علاج سلوكي معتمدة متخصصة في العلاج المعرفي وإدارة الغضب والتدريب الذاتي، مع اهتمام خاص بعلاج الاضطرابات السلوكية لدى الأطفال والمراهقين.'
        },
        {
          id: 5,
          name: 'د. محمد الحربي',
          specialty: 'استشاري العلاقات الأسرية',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
          description: 'استشاري علاقات أسرية معتمد متخصص في العلاج الأسري وحل النزاعات وتحسين التواصل الفعال بين أفراد الأسرة، مع تركيز على بناء علاقات أسرية صحية ومستدامة.'
        }
      ]
    }
  },
  computed: {
    translate() {
      return this.languageState?.translate || ((key) => key)
    },
    decorativeClass() {
      return {
        'opacity-5 scale-100': this.isVisible,
        'opacity-0 scale-50': !this.isVisible
      }
    },
    navButtonClass() {
      return {
        'opacity-100': this.isVisible,
        'opacity-0': !this.isVisible
      }
    },
    expertImageClass() {
      return {
        'opacity-100 translate-x-0': this.isVisible,
        'opacity-0 -translate-x-8': !this.isVisible
      }
    },
    expertInfoClass() {
      return {
        'opacity-100 translate-x-0': this.isVisible,
        'opacity-0 translate-x-8': !this.isVisible
      }
    },
    // إرجاع 3 مؤشرات فقط (للحالي، السابق، التالي)
    visibleIndices() {
      const total = this.experts.length;
      const indices = [];
      
      // إضافة المؤشر الحالي
      indices.push(this.currentIndex);
      
      // إضافة المؤشر السابق
      const prevIndex = this.currentIndex === 0 ? total - 1 : this.currentIndex - 1;
      if (!indices.includes(prevIndex)) {
        indices.push(prevIndex);
      }
      
      // إضافة المؤشر التالي
      const nextIndex = this.currentIndex === total - 1 ? 0 : this.currentIndex + 1;
      if (!indices.includes(nextIndex)) {
        indices.push(nextIndex);
      }
      
      // ترتيب المؤشرات تصاعدياً
      return indices.sort((a, b) => a - b);
    }
  },
  mounted() {
    this.startAutoSlide()
  },
  beforeUnmount() {
    this.stopAutoSlide()
  },
  methods: {
    // الانتقال للأخصائي السابق
    prevExpert() {
      this.currentIndex = this.currentIndex === 0 ? this.experts.length - 1 : this.currentIndex - 1
    },

    // الانتقال للأخصائي التالي
    nextExpert() {
      this.currentIndex = this.currentIndex === this.experts.length - 1 ? 0 : this.currentIndex + 1
    },

    // الانتقال لأخصائي محدد
    goToExpert(index) {
      this.currentIndex = index
    },

    // دوال التحكم بالتمرير التلقائي
    startAutoSlide() {
      this.autoSlideInterval = setInterval(() => {
        this.nextExpert()
      }, 5000) // تغيير كل 5 ثواني
    },

    stopAutoSlide() {
      clearInterval(this.autoSlideInterval)
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

/* تحسين التجاوب */
@media (max-width: 640px) {
  .text-2xl {
    font-size: 1.5rem;
  }
  
  .text-xl {
    font-size: 1.25rem;
  }
  
  .text-lg {
    font-size: 1.125rem;
  }
  
  .w-64 {
    width: 16rem;
    height: 16rem;
  }
  
  .gap-8 {
    gap: 1.5rem;
  }
  
  /* تحسين أزرار التنقل على الجوال الصغير */
  .absolute.right-2,
  .absolute.left-2 {
    top: 40%;
  }
}

@media (max-width: 480px) {
  .text-2xl {
    font-size: 1.375rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
  }
  
  .w-64 {
    width: 14rem;
    height: 14rem;
  }
  
  .px-3 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
}

/* تأثيرات مخصصة للسلايدر */
.ltr {
  direction: ltr;
}

/* تحسين مظهر أزرار التنقل على الجوال */
@media (max-width: 640px) {
  .absolute.right-2,
  .absolute.left-2 {
    position: absolute;
    transform: translateY(-50%);
  }
}

/* تحسين المسافات على الشاشات الصغيرة */
@media (max-width: 768px) {
  .py-16 {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }
  
  .mb-12 {
    margin-bottom: 2rem;
  }
  
  .mt-8 {
    margin-top: 1.5rem;
  }
}

/* تحسين قراءة النص على الجوال */
@media (max-width: 640px) {
  .text-sm {
    font-size: 0.875rem;
    line-height: 1.5;
  }
}
</style>