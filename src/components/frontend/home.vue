<template>
  <div>
    <Header />
    <Hero />
    <Feilds />
    <VisionMission />
    <articles />
    <HeadingComponent />
    
    <SuccessMetrics />
    <FAQSection />
    <Footer />
  </div>
</template>

<script setup>
import articles from '@/components/frontend/homepage/articles.vue'
import Header from '@/components/frontend/homepage/hero.vue'
import Hero from '@/components/frontend/layouts/header.vue'
import HeadingComponent from '@/components/frontend/homepage/HeadingComponent.vue'
import Feilds from '@/components/frontend/homepage/Feilds.vue'
import SuccessMetrics from '@/components/frontend/homepage/SuccessMetrics.vue'
import VisionMission from '@/components/frontend/homepage/VisionMission.vue'
import FAQSection from '@/components/frontend/homepage/FAQSection.vue'
import Footer from '@/components/frontend/layouts/footer.vue'

</script>
