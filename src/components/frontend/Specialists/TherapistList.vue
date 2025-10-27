<template>
  <div class="font-almarai" >
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
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex gap-8">
        <!-- Main content -->
        <div class="flex-1 space-y-6">
          <div v-for="therapist in filteredTherapists" :key="therapist.id" class="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <div class="flex gap-6">
              <!-- Profile Image -->
              <div class="relative">
                <img :src="therapist.image" :alt="therapist.name" class="w-24 h-24 rounded-full object-cover ring-4 ring-[#9EBF3B]" />
              </div>

              <!-- Therapist Info -->
              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-xl font-bold text-[#065f46] mb-1">{{ therapist.name }}</h3>
                    <p class="text-[#047857] font-medium mb-2">{{ therapist.title }}</p>

                    <!-- Rating -->
                    <div class="flex items-center gap-2 mb-3">
                      <div class="flex">
                        <i v-for="i in 5" :key="i" class="fas fa-star text-[#D6A29A]"></i>
                      </div>
                      <span class="text-[#059669] font-semibold">{{ therapist.rating }}/50 جلسة</span>
                    </div>

                    <!-- Description -->
                    <p class="text-gray-700 mb-3 leading-relaxed">{{ therapist.description }}</p>

                    <!-- Session Duration -->
                    <p class="text-[#059669] font-medium">مدة الجلسة : 45 دقيقة</p>
                  </div>

                  <!-- Book Button -->
                  <div class="flex flex-col items-end">
                    <router-link :to="`/therapist/${therapist.id}`" class="inline-flex items-center gap-2 bg-gradient-to-r from-[#9EBF3B] to-[#D6A29A] text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all">
                      <span>احجز</span>
                      <i class="fas fa-arrow-left text-sm"></i>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter Sidebar -->
        <div class="w-80">
          <div class="sticky top-8 p-6 bg-gradient-to-br from-white to-[#f8faf7] rounded-2xl shadow-xl border border-[#9EBF3B]/30">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6 pb-4 border-b border-[#9EBF3B]/30">
              <div class="flex items-center gap-3">
                <i class="fas fa-sliders-h text-[#9EBF3B] text-xl"></i>
                <h2 class="text-xl font-bold text-[#065f46]">تصفية النتائج</h2>
              </div>
              <button v-if="isAnyFilterActive" @click="resetFilters" class="text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 px-3 py-1 rounded-lg transition-colors">
                مسح الكل
              </button>
            </div>

            <!-- Selected chips -->
            <div v-if="filters.specializations.length" class="flex flex-wrap gap-2 mb-6 p-4 bg-[#9EBF3B]/10 rounded-xl">
              <span v-for="spec in filters.specializations" :key="`chip-${spec}`" class="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-full bg-white text-[#065f46] border border-[#9EBF3B] shadow-sm">
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
                  class="w-full border-2 border-[#9EBF3B]/30 focus:border-[#9EBF3B] focus:ring-2 focus:ring-[#9EBF3B]/20 rounded-xl py-3 px-4 pr-12 transition-all duration-200 bg-white" 
                  placeholder="ابحث عن المعالج..." 
                />
                <i class="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9EBF3B] text-lg"></i>
              </div>
            </div>

            <!-- Gender Filter -->
            <div class="mb-6">
              <h3 class="text-lg font-bold text-[#065f46] mb-4">الجنس</h3>
              <div class="space-y-3">
                <label class="flex items-center justify-between p-4 border-2 border-[#9EBF3B]/30 rounded-xl hover:border-[#9EBF3B] hover:bg-[#9EBF3B]/5 cursor-pointer transition-all duration-200 bg-white">
                  <div class="flex items-center">
                    <input v-model="filters.gender" type="radio" value="all" class="ml-3 w-5 h-5 text-[#9EBF3B]" /> 
                    <span class="text-gray-700 font-medium">كلاهما</span>
                  </div>
                  <i class="far fa-user text-[#9EBF3B] text-lg"></i>
                </label>
                <label class="flex items-center justify-between p-4 border-2 border-[#9EBF3B]/30 rounded-xl hover:border-[#9EBF3B] hover:bg-[#9EBF3B]/5 cursor-pointer transition-all duration-200 bg-white">
                  <div class="flex items-center">
                    <input v-model="filters.gender" type="radio" value="male" class="ml-3 w-5 h-5 text-[#9EBF3B]" /> 
                    <span class="text-gray-700 font-medium">ذكر</span>
                  </div>
                  <i class="fas fa-mars text-[#9EBF3B] text-lg"></i>
                </label>
                <label class="flex items-center justify-between p-4 border-2 border-[#9EBF3B]/30 rounded-xl hover:border-[#9EBF3B] hover:bg-[#9EBF3B]/5 cursor-pointer transition-all duration-200 bg-white">
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
                <label v-for="specialization in specializations" :key="specialization" class="flex items-center justify-between p-3 text-sm border-2 border-[#9EBF3B]/30 rounded-xl hover:border-[#9EBF3B] hover:bg-[#9EBF3B]/5 cursor-pointer transition-all duration-200 bg-white">
                  <div class="flex items-center">
                    <input v-model="filters.specializations" :value="specialization" type="checkbox" class="ml-2 w-4 h-4 text-[#9EBF3B] rounded" /> 
                    <span class="text-gray-700 font-medium">{{ specialization }}</span>
                  </div>
                  <i class="fas fa-plus text-[#9EBF3B] text-sm"></i>
                </label>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="space-y-3">
              <button @click="resetFilters" class="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
                إعادة ضبط
              </button>
              <button @click="applyFilters" class="w-full bg-gradient-to-r from-[#9EBF3B] to-[#D6A29A] hover:from-[#8cad35] hover:to-[#c9928a] text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
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
      ]
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
    }
  },
  methods: {
    applyFilters(){},
    resetFilters(){ this.searchQuery=''; this.filters.gender='all'; this.filters.specializations=[]; },
    removeSpecialization(spec){ this.filters.specializations=this.filters.specializations.filter(s=>s!==spec); }
  }
}
</script>