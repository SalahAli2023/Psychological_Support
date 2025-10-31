<template>
  <div>
    <Header />
    
    <!-- الهيرو المعدل -->
    <ArticleHero
      type="video"
      src="hipno-video.mp4" 
      height="60vh"
      title="فعاليات الصحة"
      highlight="النفسية"
      subtitle="انضم إلى رحلتنا التفاعلية لاكتساب المعرفة وتبادل الخبرات في مجال الصحة النفسية"

          :buttons="[
        { text: 'ابدأ الرحلة', icon: 'fas fa-play-circle', primary: true },
        { text: 'المزيد عنا', icon: 'fas fa-info-circle', primary: false }

      ]"
      scroll-indicator
      @cta="handleCta"
    />
    
    <!-- قسم الفعاليات والورش -->
    <section id="events-section" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <!-- إظهار البحث والفلترة فقط عند عرض قائمة الفعاليات -->
        <EventsFilter 
          v-if="!selectedEvent"
          @filter-change="handleFilterChange" 
        />
        
        <EventsList 
          v-if="!selectedEvent"
          :filter="filterCriteria"
          @event-selected="handleEventSelected"
        />
        
        <EventDetails 
          v-else
          :event="selectedEvent"
          @close="handleCloseDetails"
          @navigate-to-event="handleNavigateToEvent"
        />
      </div>
    </section>
    
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '@/components/frontend/layouts/header.vue'
import Footer from '@/components/frontend/layouts/footer.vue'
import EventsFilter from '@/components/frontend/events/EventsFilter.vue'
import EventsList from '@/components/frontend/events/EventsList.vue'
import EventDetails from '@/components/frontend/events/EventDetails.vue'
import ArticleHero from './layouts/ArticleHero.vue'

// معايير الفلترة
const filterCriteria = ref({
  search: '',
  category: 'all'
})

// الفعالية المحددة
const selectedEvent = ref(null)

// معالجة أزرار الهيرو
const handleCta = (button) => {
  if (button.text === 'استكشف الفعاليات') {
    // التمرير لقسم الفعاليات
    document.getElementById('events-section').scrollIntoView({ 
      behavior: 'smooth' 
    })
  } else if (button.text === 'انضم إلينا') {
    // التنقل لصفحة الانضمام
    window.location.href = '/join'
  }
}

// معالجة تغيير الفلترة
const handleFilterChange = (filter) => {
  filterCriteria.value = filter
}

// معالجة اختيار فعالية
const handleEventSelected = (event) => {
  selectedEvent.value = event
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// معالجة إغلاق التفاصيل
const handleCloseDetails = () => {
  selectedEvent.value = null
}

// معالجة التنقل إلى فعالية أخرى
const handleNavigateToEvent = (event) => {
  selectedEvent.value = event
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>