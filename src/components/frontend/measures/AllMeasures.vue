<template>
  <section class="py-16 pb-24 bg-gray-50 font-almarai">
    <div class="container mx-auto px-4">
      <h2 class="text-2xl md:text-3xl font-bold mb-10 text-center text-gray-800">
        {{ translate('allMeasures.title') }}
      </h2>

      <!-- عرض المقاييس -->
      <div v-if="paginatedMeasures.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="measure in paginatedMeasures"
          :key="measure.id"
          class="measure-card bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer border border-gray-100 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl p-6"
          @click="$emit('measure-click', measure)"
        >
          <!-- الصورة -->
          <div class="relative h-48 md:h-56 overflow-hidden rounded-xl mb-4">
            <img
              :src="measure.image"
              :alt="measure.title"
              class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />

            <!-- شارة الفئة -->
            <div class="absolute top-3 right-3">
              <span
                class="text-xs px-3 py-1.5 rounded-full font-medium shadow-sm border bg-[#d5d4d320] text-black border-[#9EBF3B40]"
              >
                {{ getCategoryTitle(measure.category) }}
              </span>
            </div>

            <!-- الأيقونة -->
            <div class="absolute bottom-3 left-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
              <i :class="measure.icon" class="text-[#9EBF3B] text-lg"></i>
            </div>
          </div>

          <!-- المحتوى -->
          <div>
            <h3 class="text-lg font-semibold mb-2 text-gray-800">
              {{ getTranslatedTitle(measure) }}
            </h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-2">
              {{ getTranslatedDescription(measure) }}
            </p>

            <!-- الإحصائيات والزر -->
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-500">
                <div class="flex items-center gap-1 mb-1">
                  <i class="fas fa-question-circle text-[#9EBF3B]"></i>
                  <span>{{ measure.questions.length }} {{ translate('allMeasures.questions') }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <i class="fas fa-clock text-[#D6A29A]"></i>
                  <span>{{ measure.time }} {{ translate('allMeasures.minutes') }}</span>
                </div>
              </div>

              <!-- التقييم -->
              <div class="flex items-center gap-1 text-sm">
                <div class="flex text-yellow-400">
                  <i v-for="star in 5" :key="star" 
                     class="fas fa-star text-sm" 
                     :class="star <= measure.rating ? 'text-yellow-400' : 'text-gray-300'"></i>
                </div>
                <span class="text-gray-500">({{ measure.reviews }})</span>
              </div>
            </div>

            <!-- الزر -->
            <button class="w-full mt-4 px-6 py-2.5 bg-[#9EBF3B] text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 hover:bg-[#8cad35]">
              {{ translate('allMeasures.start') }}
            </button>
          </div>
        </div>
      </div>

      <!-- رسالة عدم وجود نتائج -->
      <div v-else class="text-center py-12">
        <div class="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-[#9EBF3B20]">
          <i class="fas fa-search text-3xl text-[#9EBF3B]"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-700 mb-2">
          {{ translate('allMeasures.noResults.title') }}
        </h3>
        <p class="text-gray-500">
          {{ translate('allMeasures.noResults.desc') }}
        </p>
      </div>

      <!-- التحكم في الصفحات -->
      <div v-if="totalPages > 1" class="flex justify-center mt-12">
        <nav class="flex items-center space-x-2 space-x-reverse">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded-md border text-sm font-medium"
            :class="currentPage === 1
              ? 'text-gray-400 border-gray-200 cursor-not-allowed'
              : 'text-[#9EBF3B] border-[#9EBF3B] hover:bg-[#9EBF3B] hover:text-white'"
          >
            {{ translate('allMeasures.pagination.prev') }}
          </button>

          <span class="px-4 text-gray-700 text-sm">
            {{ translate('allMeasures.pagination.page') }} {{ currentPage }} {{ translate('allMeasures.pagination.of') }} {{ totalPages }}
          </span>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded-md border text-sm font-medium"
            :class="currentPage === totalPages
              ? 'text-gray-400 border-gray-200 cursor-not-allowed'
              : 'text-[#D6A29A] border-secondary-pink hover:bg-[#D6A29A] hover:text-white'"
          >
            {{ translate('allMeasures.pagination.next') }}
          </button>
        </nav>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, computed } from "vue";
import { categoryTitles } from "@/data/measures";
import { t } from "@/locales";

export default {
  name: "MeasuresPage",
  props: {
    measures: { type: Array, default: () => [] },
    activeFilter: { type: String, default: "allMeasures" },
    language: { type: String, default: "ar" },
  },methods: {
    translate(key) {
      return t(key, this.language)
    }
  },

  emits: ["measure-click"],
  setup(props) {
    const currentPage = ref(1);
    const itemsPerPage = 9;
    const getDefaultImage = (category) => {
          const images = {
            women:
              "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",
            children:
              "https://images.unsplash.com/photo-1536623975707-c4b3b2af565d?auto=format&fit=crop&w=800&q=80",
          };
          return images[category] || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=800&q=80";
        };
    // تحضير المقاييس للعرض مع الترجمة
    const preparedMeasures = computed(() => {
      return props.measures.map(measure => ({
        ...measure,
        image: getDefaultImage(measure.category)
      }))
    })

    const totalPages = computed(() =>
      Math.ceil(preparedMeasures.value.length / itemsPerPage)
    );

    const paginatedMeasures = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      return preparedMeasures.value.slice(start, start + itemsPerPage);
    });

    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };

    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };
    // const getCategoryTitle = (category) => categoryTitles[category] || category;

    

    // const translate = (key) => t(key, props.language);

    const getCategoryTitle = (category) => {
      const title = categoryTitles[category];
      return typeof title === 'object' ? title[props.language] : title;
    };

    const getTranslatedTitle = (measure) => {
      return typeof measure.title === 'object' ? measure.title[props.language] : measure.title;
    };

    const getTranslatedDescription = (measure) => {
      return typeof measure.description === 'object' ? measure.description[props.language] : measure.description;
    };

    const translate = (key) => t(key, props.language);

    return {
      currentPage,
      totalPages,
      paginatedMeasures,
      nextPage,
      prevPage,
      getDefaultImage,

      getCategoryTitle,
      getTranslatedTitle,
      getTranslatedDescription,
      translate,
    };
  },
}
</script>

<style scoped>
.measure-card {
  transition: all 0.3s ease;
}
.measure-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

/* قص النص الطويل */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>