<!-- EventDetails.vue -->
<template>
  <div class="min-h-screen bg-gray-50">

    <!-- مسار التنقل (Breadcrumb) -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <nav class="flex items-center space-x-2 text-sm text-gray-600" dir="rtl">
          <router-link to="/" class="hover:text-primary-green transition-colors duration-300">
            {{ currentLanguage === 'ar' ? 'الرئيسية' : 'Home' }}
          </router-link>
          <i class="fas fa-chevron-left text-xs text-gray-400"></i>
          <span 
            class="hover:text-primary-green transition-colors duration-300 cursor-pointer"
            @click="handleBackToEvents"
          >
            {{ currentLanguage === 'ar' ? 'الفعاليات' : 'Events' }}
          </span>
          <i class="fas fa-chevron-left text-xs text-gray-400"></i>
          <span class="text-primary-green font-medium">{{ event.title }}</span>
        </nav>
      </div>
    </div>

    <!-- محتوى الصفحة الرئيسي -->

    <div class="max-w-7xl mx-auto py-8">

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- العمود الأيسر - محتوى الفعالية -->
        <div class="lg:col-span-2">
          
          <!-- الصورة الرئيسية أولاً -->

          <div class="bg-white rounded-2xl shadow-1xl overflow-hidden mb-8">

            <img 
              :src="event.media" 
              :alt="event.title" 
              class="w-full h-64 md:h-80 object-cover"
            />
          </div>

          <!-- رأس الفعالية -->

          <div class="bg-white rounded-2xl shadow-1xl p-6 mb-8">

            <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div class="flex-1">
                <!-- العنوان -->
                <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {{ event.title }}
                </h1>
                
                <!-- معلومات الفعالية -->
                <div class="space-y-3">
                  <div class="flex items-center gap-3 text-gray-700">
                    <div class="w-10 h-10 bg-primary-green bg-opacity-10 rounded-xl flex items-center justify-center">
                      <i class="fas fa-calendar text-primary-green"></i>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">{{ currentLanguage === 'ar' ? 'التاريخ والوقت' : 'Date & Time' }}</p>
                      <p class="font-medium">{{ event.date }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-3 text-gray-700">
                    <div class="w-10 h-10 bg-primary-pink bg-opacity-10 rounded-xl flex items-center justify-center">
                      <i class="fas fa-map-marker-alt text-primary-pink"></i>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">{{ currentLanguage === 'ar' ? 'الموقع' : 'Location' }}</p>
                      <p class="font-medium">{{ event.location }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-3 text-gray-700">
                    <div class="w-10 h-10 bg-primary-green bg-opacity-10 rounded-xl flex items-center justify-center">
                      <i class="fas fa-clock text-primary-green"></i>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">{{ currentLanguage === 'ar' ? 'المدة' : 'Duration' }}</p>
                      <p class="font-medium">{{ event.duration }}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- شارة النوع -->
              <div class="flex-shrink-0">
                <span :class="`inline-block text-sm font-semibold px-4 py-2 rounded-full ${getCategoryStyle(event.type)}`">
                  {{ getTranslatedCategory(event.type) }}
                </span>
              </div>
            </div>
          </div>

          <!-- محتوى الفعالية -->

          <div class="bg-white rounded-2xl shadow-1xl p-6">

            <!-- النبذة العامة -->
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-primary-green inline-block">
                {{ currentLanguage === 'ar' ? 'نبذة عن الفعالية' : 'Event Overview' }}
              </h2>
              <p class="text-gray-700 leading-relaxed text-lg">
                {{ event.fullDescription }}
              </p>
            </div>

            <!-- المواضيع المغطاة -->
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-primary-pink inline-block">
                {{ currentLanguage === 'ar' ? 'المواضيع المغطاة' : 'Covered Topics' }}
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="(topic, index) in event.topics" 
                  :key="index"
                  class="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300"
                >
                  <i class="fas fa-check text-primary-green mt-1 flex-shrink-0"></i>
                  <span class="text-gray-700">{{ topic }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- العمود الأيمن - Sidebar -->
        <div class="lg:col-span-1">
          <div class="sticky top-8 space-y-6">
            
            <!-- استخدام مكون RelatedEvents -->
            <RelatedEvents 
              :events="allEvents"
              :currentEvent="event"
              @event-click="handleRelatedEventClick"
            />

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ArticleHero from '@/components/frontend/layouts/ArticleHero.vue'
import RelatedEvents from '@/components/frontend/events/RelatedEvents.vue'
import { useTranslations } from '@/composables/useTranslations'

// استخدام composable الترجمة
const { currentLanguage, translate } = useTranslations()

// تعريف الـ props والأحداث
const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'navigate-to-event'])

// بيانات جميع الفعاليات لاستخدامها في RelatedEvents
const allEvents = ref([
  {
    id: 1,
    title: 'أمسية التعامل مع التوتر',
    type: 'أمسيات',
    media: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    date: '15 نوفمبر 2023',
    description: 'أمسية تفاعلية للتعرف على طرق فعالة للتعامل مع التوتر والضغوط اليومية.'
  },
  {
    id: 2,
    title: 'ورشة بناء العلاقات الصحية',
    type: 'ورش عمل',
    media: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    date: '22 نوفمبر 2023',
    description: 'ورشة عملية تهدف إلى تعزيز مهارات التواصل وبناء علاقات صحية مع الآخرين.'
  },
  {
    id: 3,
    title: 'فعالية الصحة النفسية في العمل',
    type: 'فعاليات',
    media: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    date: '30 نوفمبر 2023',
    description: 'فعالية توعوية حول أهمية الصحة النفسية في بيئة العمل.'
  },
  {
    id: 4,
    title: 'أمسية التفكير الإيجابي',
    type: 'أمسيات',
    media: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    date: '5 ديسمبر 2023',
    description: 'جلسة حوارية حول قوة التفكير الإيجابي وتأثيره على الصحة النفسية.'
  },
  {
    id: 5,
    title: 'ورشة إدارة الوقت',
    type: 'ورش عمل',
    media: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    date: '12 ديسمبر 2023',
    description: 'ورشة عملية تقدم استراتيجيات فعالة لإدارة الوقت وتحقيق التوازن.'
  }
])

// دالة للحصول على نمط التصنيف
const getCategoryStyle = (type) => {
  const styles = {
    'أمسيات': 'bg-green-100 text-green-700',
    'فعاليات': 'bg-green-100 text-green-700',
    'ورش عمل': 'bg-green-100 text-green-700'
  }
  return styles[type] || 'bg-gray-100 text-gray-700'
}

// دالة لترجمة التصنيف
const getTranslatedCategory = (type) => {
  const categories = {
    'أمسيات': currentLanguage === 'ar' ? 'أمسيات' : 'Evenings',
    'فعاليات': currentLanguage === 'ar' ? 'فعاليات' : 'Events',
    'ورش عمل': currentLanguage === 'ar' ? 'ورش عمل' : 'Workshops'
  }
  return categories[type] || type
}

// معالجة النقر على فعالية ذات صلة
const handleRelatedEventClick = (relatedEvent) => {
  emit('navigate-to-event', relatedEvent)
}

// معالجة العودة إلى صفحة الفعاليات عبر مسار التنقل
const handleBackToEvents = () => {
  emit('close')
}

// التأكد من أن الصفحة تبدأ من الأعلى
onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* تحسينات للتصميم المتجاوب */
@media (max-width: 1024px) {
  .sticky {
    position: static;
  }
}
</style>