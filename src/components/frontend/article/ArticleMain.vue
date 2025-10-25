<template>
  <div class="bg-white">
    <!-- الهيدر -->
    <Header />
    
    <!-- الهيرو -->
    <!-- <Hero /> -->
    
    <!-- محتوى المقالات -->
    <MentalHealthArticles />
    
    <!-- الفوتر -->
    <Footer />
  </div>
</template>

<script>
import MentalHealthArticles from './MentalHealthArticles.vue'
import Header from '@/components/frontend/layouts/Header.vue'  
//  import Hero from './ArticleHero.vue'      
import Footer from '@/components/frontend/layouts/Footer.vue'  

export default {
  name: 'ArticleMain',
  components: {
    MentalHealthArticles,
    Header,
    // Hero,
    Footer
  }
}
</script>