[file name]: AboutHero.vue
[file content begin]
<template>
  <Hero 
    title="من نحن"
    highlight=""
    subtitle="نحن نعمل على تمكين المجتمع وتقديم برامج دعم نفسي واجتماعي ذات تأثير حقيقي."
    :buttons="[
      { text: 'استكشف خدماتنا', primary: false }
    ]"
  />
</template>

<script setup>
import Hero from '@/components/frontend/layouts/hero.vue'
</script>
[file content end]