<template>
  <section class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          {{ translate('testimonials.title') }}<span class="text-[#D6A29A]">{{ translate('testimonials.highlight') }}</span>
        </h2>
        <p class="text-base text-gray-600 max-w-2xl mx-auto">
          {{ translate('testimonials.subtitle') }}
        </p>
      </div>

      <!-- السلايدر -->
      <div class="relative overflow-hidden">
        <!-- العناصر المنزلقة -->
        <div 
          class="flex transition-transform duration-500 ease-in-out"
          :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        >
          <div 
            v-for="(group, groupIndex) in testimonialGroups" 
            :key="groupIndex"
            class="w-full flex-shrink-0 px-2"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="testimonial in group" 
                :key="testimonial.id"
                class="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-300 h-full"
              >
                <!-- التقييم -->
                <div class="flex justify-center mb-3">
                  <div class="flex gap-1">
                    <i 
                      v-for="star in 5" 
                      :key="star"
                      class="fas fa-star text-yellow-400 text-xs"
                      :class="{ 'text-gray-300': star > testimonial.rating }"
                    ></i>
                  </div>
                </div>
                
                <!-- النص -->
                <p class="text-gray-700 text-sm leading-relaxed mb-3 text-center line-clamp-3">
                  "{{ currentLanguage === 'ar' ? testimonial.text.ar : testimonial.text.en }}"
                </p>
                
                <!-- المعلومات -->
                <div class="flex items-center gap-2 justify-center" :dir="currentLanguage === 'ar' ? 'rtl' : 'ltr'">
                  <div class="w-8 h-8 bg-gradient-to-br from-[#9EBF3B] to-emerald-500 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold text-xs">{{ getInitials(testimonial) }}</span>
                  </div>
                  <div class="text-right">
                    <div class="font-bold text-gray-900 text-xs">{{ currentLanguage === 'ar' ? testimonial.name.ar : testimonial.name.en }}</div>
                    <div class="text-gray-500 text-xs">{{ getTranslatedRole(testimonial.role) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- أزرار التنقل -->
        <button 
          @click="prevSlide"
          class="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border border-gray-200 items-center justify-center hover:bg-[#9EBF3B] hover:text-white transition-all duration-300 z-10"
        >
          <i class="fas fa-chevron-right text-xs"></i>
        </button>
        
        <button 
          @click="nextSlide"
          class="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border border-gray-200 items-center justify-center hover:bg-[#9EBF3B] hover:text-white transition-all duration-300 z-10"
        >
          <i class="fas fa-chevron-left text-xs"></i>
        </button>
        
        <!-- النقاط الإرشادية - دائماً 3 دوائر -->
        <div class="flex justify-center gap-1 mt-6">
          <button 
            v-for="index in 3" 
            :key="index"
            @click="goToCalculatedSlide(index - 1)"
            class="w-2 h-2 rounded-full transition-all duration-300"
            :class="getDotClass(index - 1)"
          ></button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useTranslations } from '@/composables/useTranslations'

const { currentLanguage, translate } = useTranslations()

const currentIndex = ref(0)
const autoPlay = ref(true)
const itemsPerGroup = ref(3)
let autoPlayInterval

const testimonials = [
  {
    id: 1,
    text: {
      ar: 'تجربة رائعة مع الفريق المتخصص، ساعدوني في تخطي أصعب المراحل بحرفية عالية واهتمام حقيقي.',
      en: 'Amazing experience with the specialized team, they helped me overcome the most difficult stages with high professionalism and genuine care.'
    },
    rating: 5,
    name: {
      ar: 'أحمد محمد',
      en: 'Ahmed Mohammed'
    },
    role: 'beneficiary',
    initials: {
      ar: 'أح',
      en: 'AM'
    }
  },
  {
    id: 2,
    text: {
      ar: 'الورش التدريبية ممتازة والمحتوى علمي وعملي، استفدت كثيرًا في مجال عملي كأخصائي نفسي.',
      en: 'The training workshops are excellent and the content is scientific and practical, I benefited a lot in my work as a psychologist.'
    },
    rating: 5,
    name: {
      ar: 'د. فاطمة علي',
      en: 'Dr. Fatima Ali'
    },
    role: 'psychologist',
    initials: {
      ar: 'فط',
      en: 'FA'
    }
  },
  {
    id: 3,
    text: {
      ar: 'السرية والاحترافية كانتا على أعلى مستوى، أشعر بالأمان والثقة في التعامل مع المنصة.',
      en: 'Confidentiality and professionalism were at the highest level, I feel safe and confident in dealing with the platform.'
    },
    rating: 4,
    name: {
      ar: 'سارة عبدالله',
      en: 'Sara Abdullah'
    },
    role: 'consultation',
    initials: {
      ar: 'سر',
      en: 'SA'
    }
  },
  {
    id: 4,
    text: {
      ar: 'خدمة مميزة وفريق محترف، ساعدني في تطوير مهاراتي وتحسين أدائي الوظيفي بشكل ملحوظ.',
      en: 'Distinctive service and professional team, helped me develop my skills and significantly improve my job performance.'
    },
    rating: 5,
    name: {
      ar: 'خالد الحربي',
      en: 'Khalid Al-Harbi'
    },
    role: 'manager',
    initials: {
      ar: 'خل',
      en: 'KH'
    }
  },
  {
    id: 5,
    text: {
      ar: 'الدعم المستمر والمتابعة كانت ممتازة، أشكر الفريق على جهودهم المتميزة.',
      en: 'Continuous support and follow-up were excellent, I thank the team for their outstanding efforts.'
    },
    rating: 4,
    name: {
      ar: 'نورة السعد',
      en: 'Nora Al-Saad'
    },
    role: 'teacher',
    initials: {
      ar: 'نو',
      en: 'NS'
    }
  },
  {
    id: 6,
    text: {
      ar: 'التجربة فاقت توقعاتي، الخدمة سريعة والمحتوى قيم ومفيد للغاية.',
      en: 'The experience exceeded my expectations, the service is fast and the content is very valuable and useful.'
    },
    rating: 5,
    name: {
      ar: 'محمد الشمري',
      en: 'Mohammed Al-Shammari'
    },
    role: 'student',
    initials: {
      ar: 'مح',
      en: 'MS'
    }
  }
]

// دالة للحصول على الأحرف الأولى بناءً على اللغة
const getInitials = (testimonial) => {
  return currentLanguage.value === 'ar' ? testimonial.initials.ar : testimonial.initials.en
}

// دالة لترجمة الأدوار
const getTranslatedRole = (roleKey) => {
  const roles = {
    beneficiary: translate('testimonials.roles.beneficiary'),
    psychologist: translate('testimonials.roles.psychologist'),
    consultation: translate('testimonials.roles.consultation'),
    manager: translate('testimonials.roles.manager'),
    teacher: translate('testimonials.roles.teacher'),
    student: translate('testimonials.roles.student')
  }
  return roles[roleKey] || roleKey
}

// تحديث عدد العناصر حسب حجم الشاشة
const updateItemsPerGroup = () => {
  const width = window.innerWidth
  if (width < 768) {
    itemsPerGroup.value = 1
  } else if (width < 1024) {
    itemsPerGroup.value = 2
  } else {
    itemsPerGroup.value = 3
  }
  // إعادة تعيين الفهرس عند تغيير التجميع
  currentIndex.value = 0
}

// تجميع الآراء في مجموعات - مع computed لتفعيل التحديث التلقائي
const testimonialGroups = computed(() => {
  const groups = []
  for (let i = 0; i < testimonials.length; i += itemsPerGroup.value) {
    groups.push(testimonials.slice(i, i + itemsPerGroup.value))
  }
  return groups
})

const totalGroups = computed(() => testimonialGroups.value.length)

// حساب الفهرس للدوائر الثلاثة
const getCalculatedIndex = (dotIndex) => {
  const total = totalGroups.value
  if (total <= 3) {
    return dotIndex
  }
  
  // إذا كان هناك أكثر من 3 مجموعات، نحسب الفهرس بناءً على الموضع الحالي
  if (currentIndex.value < 2) {
    return dotIndex
  } else if (currentIndex.value >= total - 2) {
    return total - 3 + dotIndex
  } else {
    return currentIndex.value - 1 + dotIndex
  }
}

// الحصول على كلاس الدوائر
const getDotClass = (dotIndex) => {
  const calculatedIndex = getCalculatedIndex(dotIndex)
  return calculatedIndex === currentIndex.value ? 'bg-[#9EBF3B] w-3' : 'bg-gray-300'
}

// الانتقال إلى السلايدر المحسوب
const goToCalculatedSlide = (dotIndex) => {
  const targetIndex = getCalculatedIndex(dotIndex)
  if (targetIndex >= 0 && targetIndex < totalGroups.value) {
    currentIndex.value = targetIndex
    resetAutoPlay()
  }
}

const nextSlide = () => {
  if (totalGroups.value > 0) {
    currentIndex.value = (currentIndex.value + 1) % totalGroups.value
    resetAutoPlay()
  }
}

const prevSlide = () => {
  if (totalGroups.value > 0) {
    currentIndex.value = (currentIndex.value - 1 + totalGroups.value) % totalGroups.value
    resetAutoPlay()
  }
}

const goToSlide = (index) => {
  if (index >= 0 && index < totalGroups.value) {
    currentIndex.value = index
    resetAutoPlay()
  }
}

const resetAutoPlay = () => {
  if (autoPlay.value) {
    clearInterval(autoPlayInterval)
    startAutoPlay()
  }
}

const startAutoPlay = () => {
  if (autoPlay.value && totalGroups.value > 1) {
    autoPlayInterval = setInterval(() => {
      nextSlide()
    }, 5000)
  }
}

const stopAutoPlay = () => {
  clearInterval(autoPlayInterval)
}

// مراقبة تغيير عدد المجموعات لإعادة تعيين التشغيل التلقائي
watch(totalGroups, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    currentIndex.value = 0
    resetAutoPlay()
  }
})

// مراقبة تغيير اللغة لتحديث الأحرف الأولى
watch(currentLanguage, () => {
  // سيتم تحديث الأحرف الأولى تلقائياً عبر دالة getInitials
})

// دالة لإعادة الحساب عند تغيير حجم النافذة
const handleResize = () => {
  updateItemsPerGroup()
}

onMounted(() => {
  updateItemsPerGroup()
  window.addEventListener('resize', handleResize)
  startAutoPlay()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  stopAutoPlay()
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* تحسينات للجوال */
@media (max-width: 768px) {
  .px-2 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

/* تأثيرات للسيولة */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}
</style>