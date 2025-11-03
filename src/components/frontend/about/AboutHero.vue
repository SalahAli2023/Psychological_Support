<template>
  <Hero 
    :title="translate('about.hero.title')"
    :highlight="translate('about.hero.highlight')"
    :subtitle="translate('about.hero.subtitle')"
    :buttons="[
      { text: translate('buttons.startJourney'), icon: 'fas fa-play-circle', primary: true },
      { text: translate('buttons.learnMore'), icon: 'fas fa-info-circle', primary: false }
    ]"
  />
</template>

<script setup>
import Hero from '@/components/frontend/layouts/hero.vue'
import { useTranslations } from '@/composables/useTranslations'

const { translate } = useTranslations()
</script>