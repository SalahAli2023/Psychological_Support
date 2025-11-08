<template>
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4 text-gray-800">
          {{ translate('popularMeasures.title') }}
        </h2>
        <p class="text-gray-600 max-w-2xl mx-auto">
          {{ translate('popularMeasures.desc') }}
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="measure in measures" 
          :key="measure.id"
          class="bg-white rounded-xl shadow-lg p-6 cursor-pointer border-r-4 border-primary-pink transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl"
          @click="$emit('measure-click', measure)"
        >
          <h3 class="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
            <i :class="measure.icon" class="text-primary-pink"></i>
            {{ getTranslatedTitle(measure) }}
          </h3>
          <p class="text-gray-600 text-sm mb-4 flex-grow">
            {{ getTranslatedDescription(measure) }}
          </p>
          <div class="flex justify-between text-sm text-gray-500 mb-4">
            <div class="flex items-center gap-1">
              <i class="fas fa-question-circle"></i>
              <span>{{ measure.questions.length }} {{ translate('popularMeasures.questions') }}</span>
            </div>
            <div class="flex items-center gap-1">
              <i class="fas fa-clock"></i>
              <span>{{ measure.time }} {{ translate('popularMeasures.minutes') }}</span>
            </div>
          </div>

          <!-- نجوم التقييم -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="flex gap-0.5">
                <i 
                  v-for="i in 5" 
                  :key="i" 
                  class="fas fa-star text-sm" 
                  :class="i <= measure.rating 
                    ? 'text-transparent bg-gradient-to-br from-primary-green to-primary-pink bg-clip-text' 
                    : 'text-gray-300'"
                ></i>
              </div>
              <span class="text-xs text-gray-500 mr-1">({{ measure.reviews }})</span>
            </div>
          </div>

          <button class="w-full py-2 bg-primary-green text-white rounded-lg hover:bg-secondary-green transition-colors text-sm font-medium">
            {{ translate('popularMeasures.start') }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useTranslations } from '@/composables/useTranslations'

export default {
  name: 'PopularMeasures',
  props: {
    measures: {
      type: Array,
      default: () => []
    },
    language: {
      type: String,
      default: "ar"
    }
  },
  emits: ['measure-click'],
  setup(props) {
    const {translate} = useTranslations()
    const getTranslatedTitle = (measure) => {
      return typeof measure.title === 'object' ? measure.title[props.language] : measure.title;
    };

    const getTranslatedDescription = (measure) => {
      return typeof measure.description === 'object' ? measure.description[props.language] : measure.description;
    };

    return {
      translate,
      getTranslatedTitle,
      getTranslatedDescription
    };
  }
}
</script>

<style scoped>
</style>