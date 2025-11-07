<template>
  <Hero 
    :title="translate('measuresHero.title')"
    :highlight="translate('measuresHero.titleKey')"
    :subtitle="translate('measuresHero.description')"
    :subtitleKey="translate('measuresHero.subtitle')"

    :buttons="[
      { text: translate('measureModal.startTest'), icon: 'fas fa-play-circle', primary: true },
      { text: translate('buttons.learnMore'), icon: 'fas fa-info-circle', primary: false }
    ]"
  />
</template>

<script setup>
import Hero from '@/components/frontend/layouts/hero.vue'
import { useTranslations } from '@/composables/useTranslations'

const { translate } = useTranslations()
</script>