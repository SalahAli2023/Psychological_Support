import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/frontend/home.vue'
import EventsPage from '../components/frontend/EventsPage.vue'
import MeasuresPage from '../components/frontend/MeasuresPage.vue'

import ArticleMain from '../components/frontend/article/ArticleMain.vue'
import ArticleDetail from '../components/frontend/article/ArticleDetail.vue'

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
  },
  {
    path: '/measures',
    name: 'Measures',
    component: MeasuresPage
  },
  {
    path: '/article',
    name: 'Article',
    component: ArticleMain
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: ArticleDetail,
    props: true
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
