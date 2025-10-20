<template>
  <div class="min-h-screen bg-gray-50">
    <Header />
    
    <!-- محتوى صفحة الفعاليات -->
    <main class="pt-8"> <!-- مسافة صغيرة من الهيدر -->
      <!-- هيدر الفعاليات -->
      <EventsHero />
      
      <!-- قسم الفعاليات والورش -->
      <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-6">
          <EventsFilter @filter-change="handleFilterChange" />
          
          <!-- عرض قائمة الفعاليات أو تفاصيل الفعالية -->
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
    </main>
    
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from '@/components/frontend/layouts/header.vue'
import Footer from '@/components/frontend/layouts/footer.vue'
import EventsHero from '@/components/frontend/events/EventsHero.vue'
import EventsFilter from '@/components/frontend/events/EventsFilter.vue'
import EventsList from '@/components/frontend/events/EventsList.vue'
import EventDetails from '@/components/frontend/events/EventDetails.vue'

// معايير الفلترة
const filterCriteria = ref({
  search: '',
  category: 'all'
})

// الفعالية المحددة
const selectedEvent = ref(null)

// معالجة تغيير الفلترة
const handleFilterChange = (filter) => {
  filterCriteria.value = filter
}

// معالجة اختيار فعالية
const handleEventSelected = (event) => {
  selectedEvent.value = event
  // التمرير لأعلى الصفحة عند عرض التفاصيل
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// معالجة إغلاق التفاصيل
const handleCloseDetails = () => {
  selectedEvent.value = null
}

// معالجة التنقل إلى فعالية أخرى
const handleNavigateToEvent = (event) => {
  selectedEvent.value = event
  // التمرير لأعلى الصفحة عند عرض التفاصيل
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>