<template>
  <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold mb-8 text-center text-gray-800">موارد مساعدة</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="resource in resources" :key="resource.id" class="bg-white rounded-xl shadow-lg overflow-hidden">
          <img :src="resource.image" :alt="resource.title" class="w-full h-48 object-cover">
          <div class="p-6">
            <h3 class="text-lg font-semibold mb-3 text-gray-800">{{ resource.title }}</h3>
            <p class="text-gray-600 text-sm mb-4">{{ resource.excerpt }}</p>
            <a :href="resource.link" class="text-primary-green hover:underline font-medium flex items-center gap-1">
              <span>اقرأ المزيد</span>
              <i class="fas fa-chevron-left text-sm"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ResourcesSection',
  props: {
    resources: {
      type: Array,
      default: () => []
    }
  }
}
</script>