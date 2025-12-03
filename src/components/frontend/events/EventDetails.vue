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
              <p class="text-gray-700 leading-relaxed text-lg" v-html="formatDescription(event.description_ar)">
              </p>
            </div>

            <!-- المواضيع المغطاة -->
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-primary-pink inline-block">
                {{ currentLanguage === 'ar' ? 'المواضيع المغطاة' : 'Covered Topics' }}
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="(topic, index) in getDefaultTopics()" 
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import ArticleHero from '@/components/frontend/layouts/ArticleHero.vue'
import RelatedEvents from '@/components/frontend/events/RelatedEvents.vue'
import { useTranslations } from '@/composables/useTranslations'
import { useEventStore } from '@/stores/events'

// استخدام composable الترجمة و store
const { currentLanguage, translate } = useTranslations()
const eventStore = useEventStore()
const router = useRouter()

// تعريف الـ props والأحداث
const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'navigate-to-event'])

// استخدام بيانات الفعاليات من الـ store للفعاليات ذات الصلة
const allEvents = computed(() => eventStore.events)

// دالة لتنسيق النص وإضافة فواصل للمواضيع المغطاة
const formatTopics = (topicsText) => {
  if (!topicsText) return [];
  
  // إذا كان نصاً عادياً، نقسمه بناء على الفواصل
  if (typeof topicsText === 'string') {
    return topicsText.split(/[،,]/).map(topic => topic.trim()).filter(topic => topic);
  }
  
  // إذا كان مصفوفة بالفعل، نعيدها كما هي
  return topicsText;
}

// دالة لتحويل النص إلى فقرات
const formatDescription = (text) => {
  if (!text) return '';
  return text.replace(/\n/g, '<br>');
}

// دالة للحصول على المواضيع الافتراضية
const getDefaultTopics = () => {
  if (currentLanguage.value === 'ar') {
    return [
      'أساسيات الصحة النفسية',
      'التعامل مع الضغوط النفسية',
      'تحسين جودة الحياة',
      'مهارات التواصل الفعال',
      'إدارة المشاعر والغضب',
      'تعزيز الثقة بالنفس'
    ]
  } else {
    return [
      'Mental Health Basics',
      'Dealing with Psychological Stress',
      'Improving Quality of Life',
      'Effective Communication Skills',
      'Managing Emotions and Anger',
      'Building Self-Confidence'
    ]
  }
}

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
    'أمسيات': currentLanguage.value === 'ar' ? 'أمسيات' : 'Evenings',
    'فعاليات': currentLanguage.value === 'ar' ? 'فعاليات' : 'Events',
    'ورش عمل': currentLanguage.value === 'ar' ? 'ورش عمل' : 'Workshops'
  }
  return categories[type] || type
}

// معالجة النقر على فعالية ذات صلة
const handleRelatedEventClick = (relatedEvent) => {
  emit('navigate-to-event', relatedEvent)
}

// معالجة العودة إلى صفحة الفعاليات عبر مسار التنقل
const handleBackToEvents = () => {
  // مسح حالة الصفحة من localStorage
  localStorage.removeItem('lastEventPage')
  emit('close')
  
  // استخدام router للعودة للصفحة الرئيسية
  router.push('/events')
}

// معالجة تحديث الصفحة
const handlePageRefresh = () => {
  // حفظ حالة الصفحة الحالية في localStorage
  localStorage.setItem('lastEventPage', 'details')
}

// التأكد من أن الصفحة تبدأ من الأعلى
onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  
  // إضافة مستمع لتحديث الصفحة
  window.addEventListener('beforeunload', handlePageRefresh)
})

onUnmounted(() => {
  // إزالة المستمع عند تدمير المكون
  window.removeEventListener('beforeunload', handlePageRefresh)
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