<template>
  <HomePage v-if="currentPage === 'home'" />
  <EventsPage v-else-if="currentPage === 'events'" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HomePage from '@/components/home.vue'
import EventsPage from '@/components/EventsPage.vue'

const currentPage = ref('home')

onMounted(() => {
  window.addEventListener('change-page', (event) => {
    currentPage.value = event.detail.page
  })
})
</script>