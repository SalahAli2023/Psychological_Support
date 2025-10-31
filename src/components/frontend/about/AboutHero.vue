
<template>
  <Hero 
    title="من "
    highlight="نحن"
    subtitle="نحن نعمل على تمكين المجتمع وتقديم برامج دعم نفسي واجتماعي ذات تأثير حقيقي."
      :buttons="[
        { text: 'ابدأ الرحلة', icon: 'fas fa-play-circle', primary: true },
        { text: 'المزيد عنا', icon: 'fas fa-info-circle', primary: false }
      ]"
  />
</template>

<script setup>
import Hero from '@/components/frontend/layouts/hero.vue'
</script>
