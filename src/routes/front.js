import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/frontend/home.vue'
import EventsPage from '../components/frontend/EventsPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/events',
    name: 'Events',
    component: EventsPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
