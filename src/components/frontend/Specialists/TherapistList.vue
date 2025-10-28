<template>
  <div class="font-almarai">
    <!-- Header -->
    <Header />

    <!-- Hero Section -->
    <Hero 
      title="الأخصائيون النفسيون"
      highlight=""
      subtitle="تعرف على أفضل الأخصائيين في مجال الصحة النفسية واحجز جلسات الدعم النفسي بسهولة"
      :buttons="[
        { text: 'ابدأ الرحلة', icon: 'fas fa-play-circle', primary: true },
        { text: 'المزيد عنا', icon: 'fas fa-info-circle', primary: false }
      ]"
    />

    <!-- Therapist List Page -->
    <div class="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <!-- Mobile Filter Button -->
      <div class="lg:hidden mb-4">
        <button 
          @click="showMobileFilter = !showMobileFilter"
          class="w-full flex items-center justify-between p-3 bg-[#D6A29A] text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <span class="flex items-center gap-2 font-bold text-base sm:text-lg">
            <i class="fas fa-sliders-h"></i>
            تصفية النتائج
            <span v-if="isAnyFilterActive" class="bg-white text-[#D6A29A] text-xs px-2 py-1 rounded-full">
              {{ activeFiltersCount }}
            </span>
          </span>
          <i class="fas fa-chevron-down transition-transform" :class="{ 'rotate-180': showMobileFilter }"></i>
        </button>
      </div>

      <div class="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <!-- Main content -->
        <div class="flex-1">
          <!-- Mobile Filter Overlay -->
          <div 
            v-if="showMobileFilter && windowWidth < 1024" 
            class="lg:hidden mb-4 relative z-40"
          >
            <div class="bg-white rounded-2xl shadow-2xl border border-[#9EBF3B] p-4 max-h-96 overflow-y-auto">
              <!-- Mobile Header -->
              <div class="flex items-center justify-between mb-4 pb-4 border-b border-[#9EBF3B] sticky top-0 bg-white">
                <h2 class="text-xl font-bold text-[#065f46]">تصفية النتائج</h2>
                <button @click="showMobileFilter = false" class="p-2 text-gray-500 hover:text-gray-700">
                  <i class="fas fa-times text-xl"></i>
                </button>
              </div>

              <!-- Selected chips -->
              <div v-if="filters.specializations.length" class="flex flex-wrap gap-2 mb-4 p-3 bg-[#D6A29A]/10 rounded-xl">
                <span v-for="spec in filters.specializations" :key="`chip-${spec}`" class="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-white text-[#065f46] border border-[#D6A29A] shadow-sm">
                  {{ spec }}
                  <button @click="removeSpecialization(spec)" class="hover:text-red-600 transition-colors pr-1">
                    <i class="fas fa-times text-xs"></i>
                  </button>
                </span>
              </div>

              <!-- Search -->
              <div class="mb-4">
                <label class="block text-sm font-bold text-[#065f46] mb-2">بحث باسم مقدم الرعاية</label>
                <div class="relative">
                  <input 
                    v-model="searchQuery" 
                    type="text" 
                    class="w-full border-2 border-[#9EBF3B] focus:border-[#9EBF3B] focus:ring-2 focus:ring-[#9EBF3B]/20 rounded-xl py-2 px-4 pr-12 transition-all duration-200 bg-white text-sm" 
                    placeholder="ابحث عن المعالج..." 
                  />
                  <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9EBF3B] text-base"></i>
                </div>
              </div>

              <!-- Gender Filter -->
              <div class="mb-4">
                <h3 class="text-base font-bold text-[#065f46] mb-3">الجنس</h3>
                <div class="space-y-2">
                  <label class="flex items-center justify-between p-3 border-2 border-[#9EBF3B] rounded-xl hover:border-[#9EBF3B] hover:bg-[#9EBF3B]/5 cursor-pointer transition-all duration-200 bg-white">
                    <div class="flex items-center">
                      <input v-model="filters.gender" type="radio" value="all" class="ml-2 w-4 h-4 text-[#9EBF3B]" /> 
                      <span class="text-gray-700 font-medium text-sm">كلاهما</span>
                    </div>
                    <i class="far fa-user text-[#9EBF3B] text-base"></i>
                  </label>
                  <label class="flex items-center justify-between p-3 border-2 border-[#D6A29A] rounded-xl hover:border-[#D6A29A] hover:bg-[#D6A29A]/5 cursor-pointer transition-all duration-200 bg-white">
                    <div class="flex items-center">
                      <input v-model="filters.gender" type="radio" value="male" class="ml-2 w-4 h-4 text-[#D6A29A]" /> 
                      <span class="text-gray-700 font-medium text-sm">ذكر</span>
                    </div>
                    <i class="fas fa-mars text-[#D6A29A] text-base"></i>
                  </label>
                  <label class="flex items-center justify-between p-3 border-2 border-[#9EBF3B] rounded-xl hover:border-[#9EBF3B] hover:bg-[#9EBF3B]/5 cursor-pointer transition-all duration-200 bg-white">
                    <div class="flex items-center">
                      <input v-model="filters.gender" type="radio" value="female" class="ml-2 w-4 h-4 text-[#9EBF3B]" /> 
                      <span class="text-gray-700 font-medium text-sm">أنثى</span>
                    </div>
                    <i class="fas fa-venus text-[#9EBF3B] text-base"></i>
                  </label>
                </div>
              </div>

              <!-- Specializations -->
              <div class="mb-4">
                <h3 class="text-base font-bold text-[#065f46] mb-3">التخصصات</h3>
                <div class="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  <label v-for="(specialization, index) in specializations" :key="specialization" 
                         class="flex items-center p-2 text-xs border-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 bg-white"
                         :class="index % 2 === 0 ? 'border-[#9EBF3B] hover:border-[#9EBF3B]' : 'border-[#D6A29A] hover:border-[#D6A29A]'">
                    <input v-model="filters.specializations" :value="specialization" type="checkbox" 
                           class="ml-2 w-3 h-3 rounded" 
                           :class="index % 2 === 0 ? 'text-[#9EBF3B]' : 'text-[#D6A29A]'" /> 
                    <span class="text-gray-700 font-medium mr-2">{{ specialization }}</span>
                  </label>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="space-y-2 sticky bottom-0 bg-white pt-2">
                <button @click="resetFilters" class="w-full bg-[#D6A29A] hover:bg-[#c9928a] text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all text-sm">
                  إعادة ضبط
                </button>
                <button @click="applyFilters" class="w-full bg-[#D6A29A] hover:bg-[#c9928a] text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all text-sm">
                  بحث
                </button>
              </div>
            </div>
          </div>

          <!-- Results Count -->
          <div class="bg-white p-3 sm:p-4 rounded-xl shadow-sm mb-4">
            <p class="text-sm sm:text-base text-gray-600">
              عرض <span class="font-bold text-[#D6A29A]">{{ filteredTherapists.length }}</span> أخصائي
            </p>
          </div>

          <!-- Therapists List -->
          <div class="space-y-4 sm:space-y-6">
            <div v-for="(therapist, index) in filteredTherapists" :key="therapist.id" class="p-4 sm:p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <div class="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <!-- Profile Image -->
                <div class="flex justify-center sm:justify-start">
                  <div class="relative">
                    <img :src="therapist.image" :alt="therapist.name" 
                         class="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-4"
                         :class="index % 2 === 0 ? 'ring-[#9EBF3B]' : 'ring-[#D6A29A]'" />
                  </div>
                </div>

                <!-- Therapist Info -->
                <div class="flex-1">
                  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div class="flex-1">
                      <h3 class="text-lg sm:text-xl font-bold text-[#065f46] mb-1">{{ therapist.name }}</h3>
                      <p class="text-[#047857] font-medium text-sm sm:text-base mb-2">{{ therapist.title }}</p>

                      <!-- Rating -->
                      <div class="flex items-center gap-2 mb-3">
                        <div class="flex">
                          <i v-for="i in 5" :key="i" class="fas fa-star text-sm text-[#D6A29A]"></i>
                        </div>
                        <span class="text-[#059669] font-semibold text-sm">{{ therapist.rating }}/50 جلسة</span>
                      </div>

                      <!-- Description -->
                      <p class="text-gray-700 mb-3 leading-relaxed text-sm sm:text-base">{{ therapist.description }}</p>

                      <!-- Session Duration -->
                      <p class="text-[#059669] font-medium text-sm">مدة الجلسة : 45 دقيقة</p>
                    </div>

                    <!-- Book Button -->
                    <div class="flex justify-center sm:justify-end">
                      <router-link :to="`/therapist/${therapist.id}`" 
                                   class="text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all text-sm sm:text-base bg-[#D6A29A] hover:bg-[#c9928a]">
                        احجز
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Results Message -->
            <div v-if="filteredTherapists.length === 0" class="text-center py-8 sm:py-12 bg-white rounded-xl shadow-sm">
              <i class="fas fa-search text-4xl sm:text-6xl text-gray-300 mb-3 sm:mb-4"></i>
              <h3 class="text-xl sm:text-2xl font-bold text-gray-600 mb-2">لا توجد نتائج</h3>
              <p class="text-gray-500 text-sm sm:text-base mb-4">لم نتمكن من العثور على أخصائيين مطابقين لمعايير البحث</p>
              <button 
                @click="resetFilters" 
                class="bg-[#D6A29A] hover:bg-[#c9928a] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all text-sm sm:text-base"
              >
                عرض جميع الأخصائيين
              </button>
            </div>
          </div>
        </div>

        <!-- Filter Sidebar - Desktop -->
        <div class="hidden lg:block w-80">
          <div class="p-6 bg-white rounded-2xl shadow-xl border border-[#9EBF3B] sticky top-8">
            <!-- Desktop Header -->
            <div class="flex items-center justify-between mb-6 pb-4 border-b border-[#9EBF3B]">
              <div class="flex items-center gap-3">
                <i class="fas fa-sliders-h text-[#9EBF3B] text-xl"></i>
                <h2 class="text-xl font-bold text-[#065f46]">تصفية النتائج</h2>
              </div>
              <button v-if="isAnyFilterActive" @click="resetFilters" class="text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 px-3 py-1 rounded-lg transition-colors">
                مسح الكل
              </button>
            </div>

            <!-- Selected chips -->
            <div v-if="filters.specializations.length" class="flex flex-wrap gap-2 mb-6 p-4 bg-[#D6A29A]/10 rounded-xl">
              <span v-for="spec in filters.specializations" :key="`chip-${spec}`" class="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-full bg-white text-[#065f46] border border-[#D6A29A] shadow-sm">
                {{ spec }}
                <button @click="removeSpecialization(spec)" class="hover:text-red-600 transition-colors pr-1">
                  <i class="fas fa-times text-xs"></i>
                </button>
              </span>
            </div>

            <!-- Search -->
            <div class="mb-6">
              <label class="block text-sm font-bold text-[#065f46] mb-3">بحث باسم مقدم الرعاية</label>
              <div class="relative">
                <input 
                  v-model="searchQuery" 
                  type="text" 
                  class="w-full border-2 border-[#9EBF3B] focus:border-[#9EBF3B] focus:ring-2 focus:ring-[#9EBF3B]/20 rounded-xl py-3 px-4 pr-12 transition-all duration-200 bg-white" 
                  placeholder="ابحث عن المعالج..." 
                />
                <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9EBF3B] text-lg"></i>
              </div>
            </div>

            <!-- Gender Filter -->
            <div class="mb-6">
              <h3 class="text-lg font-bold text-[#065f46] mb-4">الجنس</h3>
              <div class="space-y-3">
                <label class="flex items-center justify-between p-4 border-2 border-[#9EBF3B] rounded-xl hover:border-[#9EBF3B] hover:bg-[#9EBF3B]/5 cursor-pointer transition-all duration-200 bg-white">
                  <div class="flex items-center">
                    <input v-model="filters.gender" type="radio" value="all" class="ml-3 w-5 h-5 text-[#9EBF3B]" /> 
                    <span class="text-gray-700 font-medium">كلاهما</span>
                  </div>
                  <i class="far fa-user text-[#9EBF3B] text-lg"></i>
                </label>
                <label class="flex items-center justify-between p-4 border-2 border-[#D6A29A] rounded-xl hover:border-[#D6A29A] hover:bg-[#D6A29A]/5 cursor-pointer transition-all duration-200 bg-white">
                  <div class="flex items-center">
                    <input v-model="filters.gender" type="radio" value="male" class="ml-3 w-5 h-5 text-[#D6A29A]" /> 
                    <span class="text-gray-700 font-medium">ذكر</span>
                  </div>
                  <i class="fas fa-mars text-[#D6A29A] text-lg"></i>
                </label>
                <label class="flex items-center justify-between p-4 border-2 border-[#9EBF3B] rounded-xl hover:border-[#9EBF3B] hover:bg-[#9EBF3B]/5 cursor-pointer transition-all duration-200 bg-white">
                  <div class="flex items-center">
                    <input v-model="filters.gender" type="radio" value="female" class="ml-3 w-5 h-5 text-[#9EBF3B]" /> 
                    <span class="text-gray-700 font-medium">أنثى</span>
                  </div>
                  <i class="fas fa-venus text-[#9EBF3B] text-lg"></i>
                </label>
              </div>
            </div>

            <!-- Specializations -->
            <div class="mb-6">
              <h3 class="text-lg font-bold text-[#065f46] mb-4">التخصصات</h3>
              <div class="grid grid-cols-2 gap-3">
                <label v-for="(specialization, index) in specializations" :key="specialization" 
                       class="flex items-center p-3 text-sm border-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 bg-white"
                       :class="index % 2 === 0 ? 'border-[#9EBF3B] hover:border-[#9EBF3B]' : 'border-[#D6A29A] hover:border-[#D6A29A]'">
                  <input v-model="filters.specializations" :value="specialization" type="checkbox" 
                         class="ml-2 w-4 h-4 rounded" 
                         :class="index % 2 === 0 ? 'text-[#9EBF3B]' : 'text-[#D6A29A]'" /> 
                  <span class="text-gray-700 font-medium mr-2">{{ specialization }}</span>
                </label>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3">
              <button @click="resetFilters" class="w-full bg-[#ef4444] hover:bg-[#dc2626] text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
                 إعادة ضبط
              </button>
              <button @click="applyFilters" class="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
                 بحث
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/frontend/layouts/header.vue'
import Footer from '@/components/frontend/layouts/footer.vue'
import Hero from '@/components/frontend/layouts/hero.vue'

export default {
  name: 'TherapistList',
  components: { Header, Footer, Hero },
  data() {
    return {
      searchQuery: '',
      filters: { gender: 'all', specializations: [] },
      specializations: ['القلق والتوتر','الاكتئاب','الوسواس القهري','الإدمان','الأمراض النفسجسمانية','ضعف الثقة بالنفس','مشكلات المراهقين','التربية الخاصة','العلاجية','مشكلات منوعة'],
      therapists: [
        { id:1,name:'نسمة عبد الرحمن',title:'استشاري صحة نفسية وتربية خاصة',image:'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=256&h=256&fit=facearea&facepad=2&crop=faces&auto=format&q=80',rating:27,gender:'female',specializations:['القلق والتوتر','مشكلات المراهقين'],description:'خبرة تزيد عن 8 سنوات في مجال الصحة النفسية والعلاج السلوكي المعرفي، متخصصة في علاج اضطرابات القلق والاكتئاب لدى المراهقين والشباب.'},
        { id:2,name:'عمرو عادل',title:'استشاري الصحة النفسية ونفسي اكلينيكي',image:'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=256&h=256&fit=facearea&facepad=2&crop=faces&auto=format&q=80',rating:35,gender:'male',specializations:['الاكتئاب','العلاجية'],description:'أكثر من 15 عاماً من الخبرة في العلاج النفسي، أتبع منهجاً متكاملاً يجمع بين العلاج المعرفي السلوكي والعلاج الجدلي السلوكي والعلاج بالقبول والالتزام.'},
        { id:3,name:'فاطمة محمد',title:'أخصائية نفسية إكلينيكية',image:'https://images.unsplash.com/photo-1594824388852-8a5e4c7b6d7e?w=256&h=256&fit=facearea&facepad=2&crop=faces&auto=format&q=80',rating:42,gender:'female',specializations:['الوسواس القهري','الإدمان'],description:'متخصصة في علاج اضطرابات الوسواس القهري والإدمان، حاصلة على شهادات متقدمة في العلاج المعرفي السلوكي.'},
        { id:4,name:'أحمد السيد',title:'استشاري العلاج النفسي والسلوكي',image:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=facearea&facepad=2&crop=faces&auto=format&q=80',rating:31,gender:'male',specializations:['ضعف الثقة بالنفس','مشكلات منوعة'],description:'خبرة واسعة في العلاج النفسي والسلوكي، متخصص في بناء الثقة بالنفس وعلاج المشكلات النفسية المختلفة.'},
        { id:5,name:'مريم حسن',title:'أخصائية الإرشاد الأسري',image:'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=256&h=256&fit=facearea&facepad=2&crop=faces&auto=format&q=80',rating:28,gender:'female',specializations:['التربية الخاصة','مشكلات المراهقين'],description:'متخصصة في الإرشاد الأسري والتربية الخاصة، خبرة في التعامل مع الأطفال والمراهقين ذوي الاحتياجات الخاصة.'}
      ],
      showMobileFilter: false,
      windowWidth: window.innerWidth
    }
  },
  computed: {
    filteredTherapists() {
      let filtered = this.therapists;
      if (this.searchQuery) filtered = filtered.filter(t => t.name.includes(this.searchQuery) || t.title.includes(this.searchQuery));
      if (this.filters.gender !== 'all') filtered = filtered.filter(t => t.gender === this.filters.gender);
      if (this.filters.specializations.length) filtered = filtered.filter(t => this.filters.specializations.some(spec => t.specializations.includes(spec)));
      return filtered;
    },
    isAnyFilterActive() {
      return this.searchQuery.trim() !== '' || this.filters.gender !== 'all' || this.filters.specializations.length > 0;
    },
    activeFiltersCount() {
      let count = 0;
      if (this.searchQuery.trim() !== '') count++;
      if (this.filters.gender !== 'all') count++;
      count += this.filters.specializations.length;
      return count;
    }
  },
  methods: {
    applyFilters() {
      this.showMobileFilter = false;
    },
    resetFilters() { 
      this.searchQuery = ''; 
      this.filters.gender = 'all'; 
      this.filters.specializations = []; 
      this.showMobileFilter = false;
    },
    removeSpecialization(spec) { 
      this.filters.specializations = this.filters.specializations.filter(s => s !== spec); 
    },
    handleResize() {
      this.windowWidth = window.innerWidth;
      if (this.windowWidth >= 1024) {
        this.showMobileFilter = false;
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }
}
</script>

<style scoped>
/* تحسين مظهر القائمة المنسدلة */
.transition-transform {
  transition: transform 0.3s ease;
}

/* تحسين المسافات في الجوال */
@media (max-width: 768px) {
  .space-y-4 > * + * {
    margin-top: 1rem;
  }
}

/* تحسين التمرير في القائمة المنبثقة */
.max-h-96 {
  max-height: 24rem;
}

.max-h-32 {
  max-height: 8rem;
}
</style>