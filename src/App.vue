<template>
  <div :key="currentLanguage">
    <HeaderComponent />
    <router-view />
  </div>
</template>

<script setup>
import { useTranslations } from '@/composables/useTranslations'
const { currentLanguage } = useTranslations()
</script>
