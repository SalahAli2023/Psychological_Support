<template>
  <div>
    <!-- شبكة الفعاليات ذات الصلة -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <article 
        v-for="event in filteredEvents" 
        :key="event.id"
        class="group bg-gray-50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
        @click="handleEventClick(event)"
      >
        <!-- صورة الفعالية -->
        <div class="relative overflow-hidden h-40">
          <img 
            :src="event.media" 
            :alt="event.title" 
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          
          <!-- شارة النوع -->
          <div class="absolute top-3 left-3">
            <span 
              :class="`inline-block text-xs font-semibold px-2 py-1 rounded-full ${getCategoryStyle(event.type)}`"
            >
              {{ event.type }}
            </span>
          </div>
          
          <!-- تراكب لوني عند التمرير -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <!-- محتوى الفعالية -->
        <div class="p-4">
          <!-- العنوان -->
          <h3 class="font-bold text-gray-900 mb-2 group-hover:text-[#D6A29A] transition-colors duration-300 line-clamp-2">
            {{ event.title }}
          </h3>

          <!-- الوصف -->
          <p class="text-gray-600 text-sm mb-3 line-clamp-2">
            {{ event.description }}
          </p>

          <!-- معلومات إضافية -->
          <div class="flex items-center justify-between text-xs text-gray-500">
            <div class="flex items-center gap-1">
              <i class="fas fa-calendar text-[#9EBF3B]"></i>
              <span>{{ event.date }}</span>
            </div>
            <div class="flex items-center gap-1">
              <i class="fas fa-clock text-[#D6A29A]"></i>
              <span>{{ event.duration }}</span>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- رسالة عدم وجود فعاليات ذات صلة -->
    <div v-if="filteredEvents.length === 0" class="text-center py-8">
      <i class="fas fa-link text-4xl text-gray-300 mb-3"></i>
      <h3 class="text-lg font-bold text-gray-700 mb-1">لا توجد فعاليات ذات صلة</h3>
      <p class="text-gray-500 text-sm">لم نتمكن من العثور على فعاليات مشابهة</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// بيانات الفعاليات
const props = defineProps({
  events: {
    type: Array,
    default: () => []
  },
  currentEvent: {
    type: Object,
    default: null
  }
})

// إرسال الأحداث للوالد
const emit = defineEmits(['event-click'])

// الفعاليات المصفاة (استبعاد الفعالية الحالية)
const filteredEvents = computed(() => {
  return props.events.filter(event => 
    event.id !== props.currentEvent?.id
  ).slice(0, 3) // عرض 3 فعاليات كحد أقصى
})

// دالة للحصول على نمط التصنيف
const getCategoryStyle = (type) => {
  const styles = {
    'أمسيات': 'bg-blue-100 text-blue-700',
    'فعاليات': 'bg-green-100 text-green-700',
    'ورش عمل': 'bg-pink-100 text-pink-700'
  }
  return styles[type] || 'bg-gray-100 text-gray-700'
}

// النقر على فعالية
const handleEventClick = (event) => {
  emit('event-click', event)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>