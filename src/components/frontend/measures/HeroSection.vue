<template>
  <section class="bg-primary-green/10 py-32">
    <div class="container mx-auto px-6 text-center">
      <!-- العنوان الرئيسي -->
      <h1 class="text-4xl font-bold text-gray-800 mb-4">
        {{ translate('measuresHero.title') }}
      </h1>

      <!-- العنوان الفرعي -->
      <p class="text-lg text-gray-600 mb-8">
        {{ translate('measuresHero.subtitle') }}
      </p>

      <!-- الوصف -->
      <p class="max-w-2xl mx-auto text-gray-700 mb-10">
        {{ translate('measuresHero.description') }}
      </p>

      <!-- زر البدء -->
      <button
        @click="$emit('explore-measures')"
        class="px-8 py-4 bg-primary-green text-white rounded-lg hover:bg-opacity-90 transition-all font-medium text-lg"
      >
        {{ translate('measureModal.startTest') }}
      </button>
    </div>
  </section>
</template>

<script>
import { t } from '@/locales'

export default {
  name: 'MeasureHero',
  props: {
    language: { type: String, default: 'ar' }
  },
  emits: ['explore-measures'],
  methods: {
    translate(key) {
      return t(key, this.language)
    }
  }
}
</script>

<style scoped>
</style>
