<template>

  <section class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          ماذا يقول <span class="text-[#D6A29A]">عملاؤنا</span>
        </h2>
        <p class="text-base text-gray-600 max-w-2xl mx-auto">

          آراء وتقييمات من مستفيدين حقيقيين من خدماتنا
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
                  "{{ testimonial.text }}"
                </p>
                
                <!-- المعلومات -->
                <div class="flex items-center gap-2 justify-center">
                  <div class="w-8 h-8 bg-gradient-to-br from-[#9EBF3B] to-emerald-500 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold text-xs">{{ testimonial.initials }}</span>
                  </div>
                  <div class="text-right">
                    <div class="font-bold text-gray-900 text-xs">{{ testimonial.name }}</div>
                    <div class="text-gray-500 text-xs">{{ testimonial.role }}</div>
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

const currentIndex = ref(0)
const autoPlay = ref(true)
const itemsPerGroup = ref(3)
let autoPlayInterval


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

  },
  {
    id: 4,
    text: 'خدمة مميزة وفريق محترف، ساعدني في تطوير مهاراتي وتحسين أدائي الوظيفي بشكل ملحوظ.',
    rating: 5,
    name: 'خالد الحربي',
    role: 'مدير موارد بشرية',
    initials: 'خل'
  },
  {
    id: 5,
    text: 'الدعم المستمر والمتابعة كانت ممتازة، أشكر الفريق على جهودهم المتميزة.',
    rating: 4,
    name: 'نورة السعد',
    role: 'معلمة',
    initials: 'نو'
  },
  {
    id: 6,
    text: 'التجربة فاقت توقعاتي، الخدمة سريعة والمحتوى قيم ومفيد للغاية.',
    rating: 5,
    name: 'محمد الشمري',
    role: 'طالب جامعي',
    initials: 'مح'
  }
]

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

