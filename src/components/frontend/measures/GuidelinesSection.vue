<template>
  <section class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <div class="guidelines-section rounded-2xl p-8 max-w-4xl mx-auto">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold mb-4 text-gray-800">
            {{ translate('guidelines.title', lang) }}
          </h2>
          <p class="text-gray-600">
            {{ translate('guidelines.subtitle', lang) }}
          </p>
        </div>

        <ul class="guidelines-list space-y-4 text-gray-700 text-lg">
          <li v-for="(item, index) in translate('guidelines.list', lang)" :key="index">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import { t } from '@/locales'
export default {
  name: 'GuidelinesSection',
  props: {
    language: { type: String, default: 'ar' }
  },
  methods: {
    translate(key) {
      return t(key, this.language)
    }
  }
}
</script>

<style scoped>
.guidelines-section {
  background: rgba(158, 191, 59, 0.05);
  border-right: 4px solid #9EBF3B;
}

.guidelines-list li {
  position: relative;
  padding-right: 30px;
}

.guidelines-list li::before {
  content: '✓';
  position: absolute;
  right: 0;
  top: 0;
  color: #9EBF3B;
  font-weight: bold;
}
</style>
