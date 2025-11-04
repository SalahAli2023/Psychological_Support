<template>
  <div>
    <Header />
    
    <!-- الهيرو -->
    <ArticleHero
      type="video"
      src="hipno-video.mp4" 
      height="60vh"
      :title="translate('events.hero.title')"
      :highlight="translate('events.hero.highlight')"
      :subtitle="translate('events.hero.subtitle')"
      :buttons="heroButtons"
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
import { ref, computed } from 'vue'
import Header from '@/components/frontend/layouts/header.vue'
import Footer from '@/components/frontend/layouts/footer.vue'
import EventsFilter from '@/components/frontend/events/EventsFilter.vue'
import EventsList from '@/components/frontend/events/EventsList.vue'
import EventDetails from '@/components/frontend/events/EventDetails.vue'
import ArticleHero from './layouts/ArticleHero.vue'
import { useTranslations } from '@/composables/useTranslations'

// استخدام composable الترجمة
const { currentLanguage, toggleLanguage, translate } = useTranslations()

// معايير الفلترة
const filterCriteria = ref({
  search: '',
  category: 'all'
})

// الفعالية المحددة
const selectedEvent = ref(null)

// أزرار الهيرو
const heroButtons = computed(() => [
  { text: translate('buttons.startJourney'), icon: 'fas fa-play-circle', primary: true },
  { text: translate('buttons.learnMore'), icon: 'fas fa-info-circle', primary: false }
])

// معالجة أزرار الهيرو
const handleCta = (button) => {
  if (button.text === translate('buttons.startJourney')) {
    // التمرير لقسم الفعاليات
    document.getElementById('events-section').scrollIntoView({ 
      behavior: 'smooth' 
    })
  } else if (button.text === translate('buttons.learnMore')) {
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