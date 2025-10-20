<template>
  <div class="min-h-screen bg-white">
    <!-- هيدر تفاصيل الفعالية -->
    <section class="relative pt-28 pb-16 bg-gradient-to-br from-[#9EBF3B]/10 to-[#D6A29A]/10 font-almarai overflow-hidden" dir="rtl">
      <!-- أشكال زخرفية متحركة -->
      <div class="absolute top-10 left-10 w-60 h-60 bg-[#9EBF3B] opacity-5 rounded-full blur-3xl animate-float-slow"></div>
      <div class="absolute bottom-10 right-10 w-80 h-80 bg-[#D6A29A] opacity-5 rounded-full blur-3xl animate-float-slow animation-delay-2000"></div>

      <div class="relative z-10 max-w-6xl mx-auto px-6">
        <!-- زر العودة مع أنيميشن -->
        <div class="mb-6 animate-fade-in-down">
          <button 
            @click="$emit('close')"
            class="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-gray-700 font-medium py-2.5 px-4 rounded-xl transition-all duration-300 backdrop-blur-sm shadow-md hover:shadow-lg hover:scale-105 border border-gray-100 text-sm"
          >
            <i class="fas fa-arrow-right text-[#9EBF3B] text-xs"></i>
            العودة إلى الفعاليات
          </button>
        </div>
        
        <div class="flex flex-col lg:flex-row gap-8 items-start">
          <!-- صورة الفعالية مع أنيميشن -->
          <div class="lg:w-1/2 animate-fade-in-left">
            <div class="rounded-2xl overflow-hidden shadow-xl group relative">
              <img 
                :src="event.media" 
                :alt="event.title" 
                class="w-full h-72 lg:h-80 object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              
              <!-- شارة النوع العائمة -->
              <div class="absolute top-4 left-4 animate-bounce-slow">
                <span 
                  :class="`inline-block text-xs font-semibold px-3 py-1.5 rounded-full shadow-md ${getCategoryStyle(event.type)} border border-white/30 backdrop-blur-sm`"
                >
                  <i :class="getCategoryIcon(event.type)" class="ml-1.5 text-xs"></i>
                  {{ event.type }}
                </span>
              </div>
            </div>
          </div>
          
          <!-- معلومات الفعالية مع أنيميشن -->
          <div class="lg:w-1/2 animate-fade-in-right">
            <!-- العنوان -->
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              <span class="bg-gradient-to-l from-[#9EBF3B] to-[#D6A29A] bg-clip-text text-transparent">
                {{ event.title }}
              </span>
            </h1>
            
            <!-- الوصف المختصر -->
            <p class="text-gray-600 mb-6 leading-relaxed text-base">
              {{ event.description }}
            </p>
            
            <!-- معلومات التاريخ والوقت -->
            <div class="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 mb-6 hover:shadow-xl transition-all duration-300">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center gap-3 group hover:transform hover:scale-105 transition-all duration-300">
                  <div class="w-12 h-12 bg-gradient-to-br from-[#9EBF3B] to-[#9EBF3B]/80 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                    <i class="fas fa-calendar text-white text-sm"></i>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 font-medium">التاريخ</p>
                    <p class="font-semibold text-gray-800 text-sm">{{ event.date }}</p>
                  </div>
                </div>
                
                <div class="flex items-center gap-3 group hover:transform hover:scale-105 transition-all duration-300">
                  <div class="w-12 h-12 bg-gradient-to-br from-[#D6A29A] to-[#D6A29A]/80 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                    <i class="fas fa-clock text-white text-sm"></i>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 font-medium">المدة</p>
                    <p class="font-semibold text-gray-800 text-sm">{{ event.duration }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-3 group hover:transform hover:scale-105 transition-all duration-300">
                  <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                    <i class="fas fa-map-marker-alt text-white text-sm"></i>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 font-medium">المكان</p>
                    <p class="font-semibold text-gray-800 text-sm">{{ event.location }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-3 group hover:transform hover:scale-105 transition-all duration-300">
                  <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                    <i class="fas fa-users text-white text-sm"></i>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 font-medium">المتحدثون</p>
                    <p class="font-semibold text-gray-800 text-sm">{{ event.speakers?.length || 0 }} متحدث</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- محتوى الصفحة الرئيسي -->
    <main class="py-16 bg-white">
      <div class="max-w-6xl mx-auto px-6">
        <!-- قسم تفاصيل الفعالية -->
        <section class="mb-16 animate-fade-in-up animation-delay-300">
          <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div class="w-10 h-10 bg-gradient-to-br from-[#9EBF3B] to-[#9EBF3B]/80 rounded-lg flex items-center justify-center shadow-md">
                <i class="fas fa-info-circle text-white text-sm"></i>
              </div>
              <h2 class="text-xl font-bold text-gray-900">تفاصيل الفعالية</h2>
            </div>
            
            <div class="text-gray-700 leading-relaxed text-justify">
              <p class="text-base leading-7">{{ event.fullDescription }}</p>
            </div>
          </div>
        </section>

        <!-- قسم الأهداف والمحتوى -->
        <section class="mb-16 animate-fade-in-up animation-delay-500" v-if="event.topics && event.topics.length">
          <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div class="w-10 h-10 bg-gradient-to-br from-[#9EBF3B] to-[#9EBF3B]/80 rounded-lg flex items-center justify-center shadow-md">
                <i class="fas fa-bullseye text-white text-sm"></i>
              </div>
              <h2 class="text-xl font-bold text-gray-900">المواضيع الرئيسية</h2>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                v-for="(topic, index) in event.topics" 
                :key="index"
                class="group flex items-start gap-3 p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:transform hover:scale-105 border border-gray-100"
                :style="`animation-delay: ${index * 100}ms`"
              >
                <div class="w-8 h-8 bg-gradient-to-br from-[#9EBF3B] to-[#9EBF3B]/80 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm group-hover:shadow transition-all duration-300">
                  <i class="fas fa-check text-white text-xs"></i>
                </div>
                <p class="text-gray-700 text-sm font-medium">{{ topic }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- قسم المتحدثين -->
        <section class="mb-16 animate-fade-in-up animation-delay-700" v-if="event.speakers && event.speakers.length">
          <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div class="w-10 h-10 bg-gradient-to-br from-[#9EBF3B] to-[#9EBF3B]/80 rounded-lg flex items-center justify-center shadow-md">
                <i class="fas fa-microphone text-white text-sm"></i>
              </div>
              <h2 class="text-xl font-bold text-gray-900">المتحدثون</h2>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                v-for="(speaker, index) in event.speakers" 
                :key="speaker.id"
                class="group text-center p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:transform hover:scale-105 border border-gray-100"
                :style="`animation-delay: ${index * 200}ms`"
              >
                <div class="relative inline-block mb-4">
                  <div class="w-20 h-20 rounded-full overflow-hidden border-3 border-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <img 
                      :src="speaker.image" 
                      :alt="speaker.name" 
                      class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-[#9EBF3B] to-[#9EBF3B]/80 rounded-full flex items-center justify-center shadow-sm">
                    <i class="fas fa-microphone text-white text-xs"></i>
                  </div>
                </div>
                <h3 class="font-bold text-gray-900 text-base mb-2 group-hover:text-[#D6A29A] transition-colors duration-300">{{ speaker.name }}</h3>
                <p class="text-gray-600 text-sm font-medium">{{ speaker.specialty }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- قسم فعاليات ذات صلة -->
        <section class="animate-fade-in-up animation-delay-900">
          <div class="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div class="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
              <div class="w-10 h-10 bg-gradient-to-br from-[#9EBF3B] to-[#9EBF3B]/80 rounded-lg flex items-center justify-center shadow-md">
                <i class="fas fa-link text-white text-sm"></i>
              </div>
              <h2 class="text-xl font-bold text-gray-900">فعاليات ذات صلة</h2>
            </div>
            
            <RelatedEvents 
              :events="relatedEvents"
              :current-event="event"
              @event-click="handleRelatedEventClick"
            />
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import RelatedEvents from './RelatedEvents.vue'

// تعريف الأحداث
const emit = defineEmits(['close', 'navigate-to-event'])

// بيانات الفعالية الحالية
const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

// الفعاليات ذات الصلة
const relatedEvents = ref([])

// دالة للحصول على نمط التصنيف
const getCategoryStyle = (type) => {
  const styles = {
    'أمسيات': 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
    'فعاليات': 'bg-gradient-to-br from-green-500 to-green-600 text-white',
    'ورش عمل': 'bg-gradient-to-br from-pink-500 to-pink-600 text-white'
  }
  return styles[type] || 'bg-gradient-to-br from-gray-500 to-gray-600 text-white'
}

// دالة للحصول على أيقونة التصنيف
const getCategoryIcon = (type) => {
  const icons = {
    'أمسيات': 'fas fa-moon',
    'فعاليات': 'fas fa-calendar-alt',
    'ورش عمل': 'fas fa-tools'
  }
  return icons[type] || 'fas fa-star'
}

// النقر على فعالية ذات صلة
const handleRelatedEventClick = (event) => {
  emit('navigate-to-event', event)
}

// تحميل البيانات
onMounted(() => {
  // تحميل الفعاليات ذات الصلة
  relatedEvents.value = [
    {
      id: 4,
      title: 'أمسية التفكير الإيجابي',
      type: 'أمسيات',
      media: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      mediaType: 'image',
      description: 'جلسة حوارية حول قوة التفكير الإيجابي وتأثيره على الصحة النفسية.',
      fullDescription: 'أمسية ملهمة تستكشف قوة التفكير الإيجابي وكيف يمكن أن يحول حياتك. سنتعلم معاً تقنيات عملية لتطوير عقلية إيجابية والتغلب على الأفكار السلبية.',
      date: '5 ديسمبر 2023',
      duration: 'ساعة ونصف',
      location: 'قاعة المؤتمرات - المركز الرئيسي',
      topics: [
        'قوة العقلية الإيجابية',
        'التغلب على الأفكار السلبية',
        'تقنيات التفكير الإيجابي',
        'تطوير عادات عقلية صحية'
      ],
      speakers: [
        {
          id: 1,
          name: 'د. أحمد محمد',
          specialty: 'أخصائي العلاج النفسي',
          image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80'
        }
      ]
    },
    {
      id: 5,
      title: 'ورشة إدارة الوقت',
      type: 'ورش عمل',
      media: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      mediaType: 'image',
      description: 'ورشة عملية تقدم استراتيجيات فعالة لإدارة الوقت وتحقيق التوازن.',
      fullDescription: 'ورشة عملية تركز على تطوير مهارات إدارة الوقت بفعالية لتحقيق التوازن بين المسؤوليات المختلفة وتحسين الإنتاجية وجودة الحياة.',
      date: '12 ديسمبر 2023',
      duration: 'ساعتان ونصف',
      location: 'قاعة الورش - المبنى التعليمي',
      topics: [
        'تحديد الأولويات',
        'التخطيط الفعال',
        'تقنيات التركيز',
        'التغلب على التسويف'
      ],
      speakers: [
        {
          id: 2,
          name: 'د. سارة الخالد',
          specialty: 'استشاري العلاقات الأسرية',
          image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80'
        }
      ]
    }
  ]
})
</script>

<style scoped>
/* أنيميشن الدخول */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes bounceSlow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-fade-in-down {
  animation: fadeInDown 0.6s ease-out forwards;
}

.animate-fade-in-left {
  animation: fadeInLeft 0.6s ease-out forwards;
}

.animate-fade-in-right {
  animation: fadeInRight 0.6s ease-out forwards;
}

.animate-float-slow {
  animation: float 6s ease-in-out infinite;
}

.animate-bounce-slow {
  animation: bounceSlow 3s ease-in-out infinite;
}

.animation-delay-300 {
  animation-delay: 0.3s;
}

.animation-delay-500 {
  animation-delay: 0.5s;
}

.animation-delay-700 {
  animation-delay: 0.7s;
}

.animation-delay-900 {
  animation-delay: 0.9s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

/* تحسينات إضافية */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

.border-3 {
  border-width: 3px;
}
</style>