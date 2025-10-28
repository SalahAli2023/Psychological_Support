<template>
  <section class="py-16 bg-gradient-to-br from-pink-50 to-green-50">
    <div class="container mx-auto px-4">
      <!-- العنوان -->
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-3 text-gray-800">مقاييس متخصصة لصحة المرأة</h2>
        <p class="text-lg text-gray-600">النفسية والتربوية المعتمدة</p>
      </div>
      
      <!-- التصنيفات الرئيسية -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div 
          v-for="(category, index) in categories" 
          :key="index"
          class="bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-100"
          @click="$emit('filter-change', category.filter)"
        >
          <!-- الأيقونة بدون خلفية -->
          <div class="w-16 h-16 rounded-xl flex items-center justify-center mb-4 mx-auto">
            <i :class="category.icon" class="text-3xl" :style="`color: ${category.color1};`"></i>
          </div>
          <h3 class="text-lg font-bold text-center mb-2 text-gray-800">{{ category.title }}</h3>
          <p class="text-sm text-gray-600 text-center mb-4 leading-relaxed">{{ category.description }}</p>
          <div class="flex justify-center gap-6 text-sm">
            <span class="flex items-center gap-2">
              <i class="fas fa-clipboard-list text-gray-400"></i>
              <span class="text-gray-700 font-medium">{{ category.count }}</span>
            </span>
            <span class="flex items-center gap-2">
              <i class="fas fa-clock text-gray-400"></i>
              <span class="text-gray-700 font-medium">{{ category.time }} د</span>
            </span>
          </div>
        </div>
      </div>
      
      <!-- شريط البحث -->
      <div class="max-w-2xl mx-auto">
        <div class="relative">
          <input 
            type="text" 
            :value="searchQuery"
            @input="$emit('update:searchQuery', $event.target.value)"
            placeholder="ابحث عن مقياس معين..."
            class="w-full px-6 py-4 pr-32 rounded-2xl text-gray-800 focus:outline-none focus:ring-4 shadow-lg border-0 bg-white"
            style="focus:ring-color: #D6A29A40;"
          >
          <div class="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-3">
            <button class="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-300 hover:shadow-lg"
                    style="background: linear-gradient(135deg, #D6A29A, #9EBF3B);">
              <i class="fas fa-search text-sm"></i>
            </button>
            <span class="text-sm font-semibold px-3 py-1.5 rounded-full text-white shadow-sm"
                  style="background: linear-gradient(135deg, #D6A29A, #9EBF3B);">
              {{ filteredMeasuresCount }} نتيجة
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'WomenHealthSection',
  props: {
    searchQuery: {
      type: String,
      default: ''
    },
    filteredMeasuresCount: {
      type: Number,
      default: 0
    }
  },
  emits: ['filter-change', 'update:searchQuery'],
  setup() {
    const categories = [
      {
        title: 'الصحة النفسية',
        description: 'تقييم الحالة النفسية العامة والرفاهية العاطفية',
        icon: 'fas fa-brain',
        color1: '#D6A29A',
        color2: '#E8B4B8',
        count: 12,
        time: '15-20',
        filter: 'psychological'
      },
      {
        title: 'الأمومة والطفولة',
        description: 'تقييم العلاقة بين الأم والطفل والتكيف الأسري',
        icon: 'fas fa-baby',
        color1: '#9EBF3B',
        color2: '#B8D06E',
        count: 8,
        time: '20-25',
        filter: 'motherhood'
      },
      {
        title: 'العلاقات الأسرية',
        description: 'تحسين جودة العلاقات والتواصل الأسري',
        icon: 'fas fa-home',
        color1: '#D6A29A',
        color2: '#9EBF3B',
        count: 10,
        time: '15-30',
        filter: 'family'
      },
      {
        title: 'التطوير الذاتي',
        description: 'تطوير الثقة بالنفس والمهارات الشخصية',
        icon: 'fas fa-rocket',
        color1: '#9EBF3B',
        color2: '#D6A29A',
        count: 15,
        time: '10-15',
        filter: 'development'
      }
    ]

    return {
      categories
    }
  }
}
</script>

<style scoped>
/* تأثيرات بسيطة */
.transition-all {
  transition: all 0.3s ease;
}

/* تحسين مظهر حقل البحث عند التركيز */
input:focus {
  box-shadow: 0 0 0 4px rgba(214, 162, 154, 0.1);
  border: 1px solid rgba(214, 162, 154, 0.3);
}
</style>