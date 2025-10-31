<template>
  <div class="font-almarai" dir="rtl">
    <!-- Header -->
    <Header />

    <!-- Hero Section -->
    <Hero 
      title="مكتبتنا الإلكترونية"
      highlight="اكتشف عالماً من المعرفة"
      subtitle="تصفح مجموعتنا الواسعة من الكتب والمراجع في مختلف المجالات واستمتع بتجربة قراءة فريدة"
      :buttons="[
        { text: 'ابدأ التصفح', icon: 'fas fa-book-open', primary: true },
        { text: 'تعرف علينا أكثر', icon: 'fas fa-info-circle', primary: false }
      ]"
    />

    <!-- محتوى المكتبة -->
    <section class="max-w-7xl mx-auto px-6 py-10">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- الفلترة للجوال -->
        <button 
          @click="toggleMobileFilter"
          class="md:hidden w-full bg-white border border-gray-300 px-4 py-3 rounded-lg flex items-center justify-between font-semibold text-gray-700 mb-4 shadow-sm"
        >
          <span>فلاتر البحث</span>
          <i :class="showMobileFilter ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" class="text-[#9EBF3B]"></i>
        </button>

        <!-- الفلتر للجوال -->
        <div v-if="showMobileFilter" class="md:hidden bg-white p-4 rounded-lg shadow-lg mb-6 border border-gray-200">
          <div class="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
            <h3 class="font-bold text-lg text-gray-800">فلاتر البحث</h3>
            <button @click="toggleMobileFilter" class="text-gray-500 hover:text-red-500 transition">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          
          <div class="space-y-4">
            <div v-for="(items, title) in filters" :key="title" class="filter-dropdown">
              <button 
                @click="toggleDropdown(title)"
                class="w-full flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-200"
              >
                <span class="font-medium text-gray-700">{{ title }}</span>
                <i :class="openDropdowns[title] ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" class="text-[#9EBF3B] transition-transform duration-300"></i>
              </button>
              
              <transition
                enter-active-class="transition-all duration-300 ease-out"
                leave-active-class="transition-all duration-200 ease-in"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-96"
                leave-from-class="opacity-100 max-h-96"
                leave-to-class="opacity-0 max-h-0"
              >
                <div v-if="openDropdowns[title]" class="mt-2 space-y-2 overflow-hidden">
                  <div 
                    v-for="item in items" 
                    :key="item"
                    class="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    @click="toggleFilterItem(title, item)"
                  >
                    <div class="flex items-center justify-center w-5 h-5 border border-gray-300 rounded mr-2 transition-all duration-200"
                         :class="isFilterSelected(title, item) ? 'bg-[#9EBF3B] border-[#9EBF3B]' : 'bg-white'">
                      <i v-if="isFilterSelected(title, item)" class="fas fa-check text-white text-xs"></i>
                    </div>
                    <span :class="isFilterSelected(title, item) ? 'text-[#9EBF3B] font-medium' : 'text-gray-700'">
                      {{ item }}
                    </span>
                  </div>
                </div>
              </transition>
            </div>
          </div>
          
          <div class="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <button
              @click="clearFilters"
              class="flex-1 border border-red-500 text-red-500 px-4 py-3 rounded-lg hover:bg-red-50 transition font-semibold flex items-center justify-center gap-2"
            >
              <i class="fas fa-times"></i>
              مسح الكل
            </button>
            <button
              @click="toggleMobileFilter"
              class="flex-1 bg-[#9EBF3B] text-white px-4 py-3 rounded-lg hover:bg-[#8cad35] transition font-semibold flex items-center justify-center gap-2"
            >
              <i class="fas fa-check"></i>
              تطبيق
            </button>
          </div>
        </div>

        <!-- الفلتر للشاشات الكبيرة -->
        <div class="hidden md:block w-full md:w-1/4 bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit">
          <div class="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h3 class="font-bold text-xl text-gray-800">تصفية النتائج</h3>
            <button 
              @click="clearFilters" 
              class="text-sm text-red-500 hover:text-red-700 transition flex items-center gap-1 font-medium"
            >
              <i class="fas fa-redo-alt text-xs"></i>
              إعادة تعيين
            </button>
          </div>
          
          <div class="space-y-4">
            <div v-for="(items, title) in filters" :key="title" class="filter-dropdown">
              <button 
                @click="toggleDropdown(title)"
                class="w-full flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-200"
              >
                <span class="font-medium text-gray-700">{{ title }}</span>
                <i :class="openDropdowns[title] ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" class="text-[#9EBF3B] transition-transform duration-300"></i>
              </button>
              
              <transition
                enter-active-class="transition-all duration-300 ease-out"
                leave-active-class="transition-all duration-200 ease-in"
                enter-from-class="opacity-0 max-h-0"
                enter-to-class="opacity-100 max-h-96"
                leave-from-class="opacity-100 max-h-96"
                leave-to-class="opacity-0 max-h-0"
              >
                <div v-if="openDropdowns[title]" class="mt-2 space-y-2 overflow-hidden">
                  <div 
                    v-for="item in items" 
                    :key="item"
                    class="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    @click="toggleFilterItem(title, item)"
                  >
                    <div class="flex items-center justify-center w-5 h-5 border border-gray-300 rounded mr-2 transition-all duration-200"
                         :class="isFilterSelected(title, item) ? 'bg-[#9EBF3B] border-[#9EBF3B]' : 'bg-white'">
                      <i v-if="isFilterSelected(title, item)" class="fas fa-check text-white text-xs"></i>
                    </div>
                    <span :class="isFilterSelected(title, item) ? 'text-[#9EBF3B] font-medium' : 'text-gray-700'">
                      {{ item }}
                    </span>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- عرض الكتب -->
        <div class="flex-1">
          <!-- شريط البحث -->
          <div class="hidden md:flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div class="flex gap-2 w-full">
              <input
                v-model="search"
                type="text"
                placeholder="البحث عن كتاب، مؤلف، أو كلمة مفتاحية..."
                class="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9EBF3B] focus:border-transparent text-gray-700"
                @keyup.enter="searchBooks"
              />
              <button
                @click="searchBooks"
                class="bg-[#9EBF3B] text-white px-6 py-3 rounded-lg hover:bg-[#8cad35] transition duration-300 flex items-center gap-2 shadow-md hover:shadow-lg min-w-[120px] justify-center"
              >
                <i class="fas fa-search"></i>
                <span class="hidden sm:inline">بحث</span>
              </button>
            </div>
          </div>

          <!-- عرض النتائج -->
          <div class="mb-4 text-gray-600">
            {{ filteredBooks.length }} كتاب متوفر
          </div>
          
          <!-- شبكة الكتب -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="book in filteredBooks"
              :key="book.id"
              class="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1"
              @click="openBookModal(book)"
            >
              <!-- صورة الكتاب -->
              <div class="relative h-48 overflow-hidden">
                <img 
                  :src="book.cover" 
                  :alt="book.title" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                
                <!-- زر المفضلة -->
                <button
                  @click.stop="toggleFavorite(book.id)"
                  class="absolute top-2 left-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 shadow-md"
                >
                  <i :class="book.isFavorite ? 'fas text-red-500' : 'far text-gray-600'" class="fa-heart"></i>
                </button>
              </div>
              
              <!-- معلومات الكتاب -->
              <div class="p-3">
                <h3 class="text-sm font-semibold text-gray-800 mb-1 line-clamp-2 text-center">{{ book.title }}</h3>
                <p class="text-xs text-gray-600 text-center">{{ book.author }}</p>
                <div class="flex justify-center items-center mt-2">
                  <div class="flex text-yellow-400">
                    <i v-for="star in 5" :key="star" 
                       :class="star <= Math.floor(book.rating) ? 'fas' : star - 0.5 <= book.rating ? 'fas fa-star-half-alt' : 'far'" 
                       class="fa-star text-xs">
                    </i>
                  </div>
                  <span class="text-xs text-gray-500 mr-1">({{ book.rating }})</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- لا توجد نتائج -->
          <div v-if="filteredBooks.length === 0" class="text-center py-12">
            <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">لا توجد نتائج</h3>
            <p class="text-gray-500">جرب تغيير كلمات البحث أو الفلاتر</p>
          </div>
        </div>
      </div>
    </section>

    <!-- المودال -->
    <transition name="modal">
      <div v-if="selectedBook" class="fixed inset-0 mt-18 z-50 overflow-y-auto">
        <!-- الخلفية الشفافة -->
        <div class="fixed inset-0 bg-white/80 backdrop-blur-md transition-opacity" @click="closeModal"></div>
        
        <!-- محتوى المودال -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="relative bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 modal-content border border-white/30">
            
            <!-- زر الإغلاق -->
            <button 
              @click="closeModal"
              class="absolute top-4 left-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all duration-300 shadow-lg border border-gray-200"
            >
              <i class="fas fa-times text-lg"></i>
            </button>

            <!-- زر المفضلة -->
            <button
              @click="toggleFavoriteModal(selectedBook.id)"
              class="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-pink-50 transition-all duration-300 shadow-lg border border-gray-200"
            >
              <i :class="selectedBook.isFavorite ? 'fas text-red-500' : 'far text-gray-600'" class="fa-heart"></i>
            </button>

            <div class="flex flex-col md:flex-row h-full">
              <!-- الجانب الأيسر - صورة الكتاب -->
              <div class="md:w-2/5  bg-gradient-to-br from-[#9EBF3B] to-[#7CA52D] p-8 flex items-center justify-center relative overflow-hidden backdrop-blur-sm">
                <!-- تأثيرات زخرفية شفافة -->
                <div class="absolute top-0 left-0 w-32 h-32 bg-[#9EBF3B]/10 rounded-full -translate-x-16 -translate-y-16"></div>
                <div class="absolute bottom-0 right-0 w-48 h-48 bg-[#7CA52D]/5 rounded-full translate-x-24 translate-y-24"></div>
                
                <div class="relative z-10 w-48 h-64 mx-auto">
                  <img 
                    :src="selectedBook.cover" 
                    :alt="selectedBook.title" 
                    class="w-full h-full object-cover rounded-xl shadow-2xl border-8 border-white/30"
                  />
                  <!-- شارة التقييم -->
                  <div class="absolute -bottom-3 -left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-1">
                    <i class="fas fa-star text-sm"></i>
                    <span class="font-bold text-sm">{{ selectedBook.rating }}</span>
                  </div>
                </div>
              </div>

              <!-- الجانب الأيمن - محتوى الكتاب -->
              <div class="md:w-3/5 p-8 flex flex-col h-full overflow-y-auto">
                <!-- العنوان والمؤلف -->
                <div class="mb-6">
                  <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-3 leading-tight">
                    {{ selectedBook.title }}
                  </h2>
                  <div class="flex items-center gap-2 text-gray-600 mb-4">
                    <i class="fas fa-user-edit text-[#9EBF3B]"></i>
                    <span class="text-lg font-medium">{{ selectedBook.author }}</span>
                  </div>
                  
                  <!-- التصنيف والسنة -->
                  <div class="flex flex-wrap gap-2 mb-4">
                    <span class="bg-blue-100/80 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 backdrop-blur-sm">
                      <i class="fas fa-tag text-xs"></i>
                      {{ selectedBook.category }}
                    </span>
                    <span class="bg-purple-100/80 text-purple-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 backdrop-blur-sm">
                      <i class="fas fa-calendar text-xs"></i>
                      {{ selectedBook.year }}
                    </span>
                  </div>
                </div>

                <!-- التقييم -->
                <div class="mb-6">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="flex text-yellow-400 text-lg">
                      <i v-for="star in 5" :key="star" 
                         :class="star <= Math.floor(selectedBook.rating) ? 'fas' : star - 0.5 <= selectedBook.rating ? 'fas fa-star-half-alt' : 'far'" 
                         class="fa-star">
                      </i>
                    </div>
                    <span class="text-gray-600 font-semibold">({{ selectedBook.rating }})</span>
                  </div>
                  <p class="text-gray-500 text-sm">بناءً على 124 تقييم</p>
                </div>

                <!-- الوصف -->
                <div class="mb-8">
                  <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <i class="fas fa-file-alt text-[#9EBF3B]"></i>
                    نبذة عن الكتاب
                  </h3>
                  <p class="text-gray-600 leading-relaxed text-justify">
                    {{ selectedBook.description }}
                  </p>
                </div>

                <!-- الإحصائيات -->
                <div class="grid grid-cols-3 gap-4 mb-8">
                  <div class="text-center p-3 bg-gray-50/80 rounded-xl backdrop-blur-sm">
                    <div class="text-2xl font-bold text-[#9EBF3B] mb-1">328</div>
                    <div class="text-xs text-gray-500">صفحة</div>
                  </div>
                  <div class="text-center p-3 bg-gray-50/80 rounded-xl backdrop-blur-sm">
                    <div class="text-2xl font-bold text-[#9EBF3B] mb-1">4.2</div>
                    <div class="text-xs text-gray-500">ساعات قراءة</div>
                  </div>
                  <div class="text-center p-3 bg-gray-50/80 rounded-xl backdrop-blur-sm">
                    <div class="text-2xl font-bold text-[#9EBF3B] mb-1">15K</div>
                    <div class="text-xs text-gray-500">قارئ</div>
                  </div>
                </div>

                <!-- أزرار الإجراءات -->
                <div class="flex flex-col sm:flex-row gap-3 mt-auto">
                  <button 
                    @click="downloadBook(selectedBook.id)"
                    class="flex-1 bg-gradient-to-r from-[#9EBF3B] to-[#8cad35] text-white px-6 py-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 font-semibold text-lg backdrop-blur-sm"
                  >
                    <i class="fas fa-download text-xl"></i>
                    تحميل الكتاب
                  </button>
                  
                  <button 
                    @click="previewBook(selectedBook.id)"
                    class="flex-1 border-2 border-[#9EBF3B] text-[#9EBF3B] px-6 py-4 rounded-xl hover:bg-[#9EBF3B] hover:text-white transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 font-semibold text-lg backdrop-blur-sm"
                  >
                    <i class="fas fa-eye text-xl"></i>
                    معاينة
                  </button>
                  
                  <button 
                    @click="rateBook(selectedBook.id)"
                    class="flex-1 border-2 border-yellow-500 text-yellow-500 px-6 py-4 rounded-xl hover:bg-yellow-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 font-semibold text-lg backdrop-blur-sm"
                  >
                    <i class="fas fa-star text-xl"></i>
                    تقييم
                  </button>
                </div>

                <!-- معلومات إضافية -->
                <div class="mt-6 pt-6 border-t border-gray-200/50">
                  <div class="flex justify-between text-sm text-gray-500">
                    <span class="flex items-center gap-1">
                      <i class="fas fa-language"></i>
                      اللغة: العربية
                    </span>
                    <span class="flex items-center gap-1">
                      <i class="fas fa-file-pdf"></i>
                      PDF - 5.2 MB
                    </span>
                    <span class="flex items-center gap-1">
                      <i class="fas fa-shield-alt"></i>
                      مرخصة
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/frontend/layouts/header.vue'
import Footer from '@/components/frontend/layouts/footer.vue'
import Hero from '@/components/frontend/layouts/hero.vue'

export default {
  name: 'BooksPage',
  components: {
    Header,
    Footer,
    Hero
  },
  data() {
    return {
      search: "",
      showMobileFilter: false,
      selectedBook: null,
      openDropdowns: {
        التصنيفات: true,
        "اسم المؤلف": false,
        اللغة: false,
        "سنة النشر": false,
        التقييم: false
      },
      selectedFilters: {
        التصنيفات: [],
        "اسم المؤلف": [],
        اللغة: [],
        "سنة النشر": [],
        التقييم: []
      },
      filters: {
        التصنيفات: ["علم النفس", "التنمية الذاتية", "الأطفال", "العلاج الأسري", "القلق والتوتر", "العلاقات", "الإدمان"],
        "اسم المؤلف": ["د.محمد طه", "جينى بيب", "د.شارون مارتين", "جوناثان هايدت", "د.برين براون", "د.سارة أحمد", "د.أحمد خالد", "د.نورة السعيد", "د.ياسمين علي"],
        اللغة: ["عربي", "إنجليزي"],
        "سنة النشر": ["2024", "2023", "2022", "2021", "2020", "2019"],
        التقييم: ["5 نجوم", "4 نجوم", "3 نجوم", "نجمتان", "نجمة"]
      },
      books: [
        { id: 1, title: "لا بطعم الفلامنكو", author: "د.محمد طه", category: "علم النفس", year: "2024", rating: 4.5, cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop", description: "كتاب يقدم رؤية جديدة في فهم وتحليل السلوك البشري.", isFavorite: false },
        { id: 2, title: "مرحبا طفلي ووداعا أفكاري المتطفلة", author: "جينى بيب", category: "الأطفال", year: "2023", rating: 4.8, cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop", description: "دليل عملي للآباء للتعامل مع الأفكار السلبية.", isFavorite: false },
        { id: 3, title: "الدليل العملي للعلاج المعرفي السلوكي", author: "د.شارون مارتين", category: "علم النفس", year: "2023", rating: 4.6, cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop", description: "استراتيجيات فعالة للتغلب على السلوك الكمالي.", isFavorite: false },
        { id: 4, title: "الجيل المضطرب", author: "جوناثان هايدت", category: "علم النفس", year: "2024", rating: 4.7, cover: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop", description: "تحليل عميق لتأثير شبكات التواصل الاجتماعي.", isFavorite: false },
        { id: 5, title: "الضعف الذي يجعلنا أقوياء", author: "د.برين براون", category: "التنمية الذاتية", year: "2022", rating: 4.9, cover: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop", description: "كيف يمكن للضعف أن يكون مصدراً للقوة.", isFavorite: false },
        { id: 6, title: "العلاج الأسري في القرن الحادي والعشرين", author: "د.سارة أحمد", category: "العلاج الأسري", year: "2023", rating: 4.4, cover: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop", description: "تطورات وتقنيات حديثة في العلاج الأسري.", isFavorite: false },
        { id: 7, title: "القلق وكيفية التغلب عليه", author: "د.أحمد خالد", category: "القلق والتوتر", year: "2024", rating: 4.3, cover: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3f?w=400&h=600&fit=crop", description: "استراتيجيات عملية للتعامل مع اضطرابات القلق.", isFavorite: false },
        { id: 8, title: "تنمية الذكاء العاطفي لدى الأطفال", author: "د.نورة السعيد", category: "الأطفال", year: "2023", rating: 4.6, cover: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=600&fit=crop", description: "دليل شامل لتنمية الذكاء العاطفي لدى الأطفال.", isFavorite: false },
        { id: 9, title: "فن التواصل في العلاقات", author: "د.ياسمين علي", category: "العلاقات", year: "2024", rating: 4.5, cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop", description: "أساليب فعالة لتحسين التواصل في العلاقات الشخصية.", isFavorite: false },
        { id: 10, title: "التعافي من الإدمان", author: "د.خالد السعدي", category: "الإدمان", year: "2023", rating: 4.7, cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop", description: "رحلة التعافي من الإدمان بأساليب علمية.", isFavorite: false },
        { id: 11, title: "المرونة النفسية", author: "د.سمر القحطاني", category: "التنمية الذاتية", year: "2022", rating: 4.8, cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop", description: "كيفية بناء المرونة النفسية في مواجهة التحديات.", isFavorite: false },
        { id: 12, title: "العلاج باللعب للأطفال", author: "د.فاطمة الزهراء", category: "الأطفال", year: "2024", rating: 4.6, cover: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&h=600&fit=crop", description: "استخدام اللعب كأداة علاجية للأطفال.", isFavorite: false },
        { id: 13, title: "أتصال وتواصل", author: "د.ياسمين  القاضي", category: " العلاقات", year: "2024", rating: 4.3, cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop", description: "استراتيجيات عملية للتعامل مع اضطرابات القلق.", isFavorite: false },

      ]
    };
  },
  computed: {
    filteredBooks() {
      let result = this.books;
      
      if (this.search) {
        const searchLower = this.search.toLowerCase();
        result = result.filter(book => 
          book.title.toLowerCase().includes(searchLower) || 
          book.author.toLowerCase().includes(searchLower) ||
          book.description.toLowerCase().includes(searchLower) ||
          book.category.toLowerCase().includes(searchLower)
        );
      }
      
      Object.keys(this.selectedFilters).forEach(filterType => {
        if (this.selectedFilters[filterType] && this.selectedFilters[filterType].length > 0) {
          if (filterType === "اسم المؤلف") {
            result = result.filter(book => 
              this.selectedFilters[filterType].some(author => book.author.includes(author))
            );
          } else if (filterType === "التصنيفات") {
            result = result.filter(book => 
              this.selectedFilters[filterType].includes(book.category)
            );
          } else if (filterType === "سنة النشر") {
            result = result.filter(book => 
              this.selectedFilters[filterType].includes(book.year)
            );
          } else if (filterType === "التقييم") {
            result = result.filter(book => {
              const rating = book.rating;
              return this.selectedFilters[filterType].some(ratingFilter => {
                if (ratingFilter === "5 نجوم") return rating >= 4.5;
                if (ratingFilter === "4 نجوم") return rating >= 3.5 && rating < 4.5;
                if (ratingFilter === "3 نجوم") return rating >= 2.5 && rating < 3.5;
                if (ratingFilter === "نجمتان") return rating >= 1.5 && rating < 2.5;
                if (ratingFilter === "نجمة") return rating < 1.5;
                return false;
              });
            });
          }
        }
      });
      
      return result;
    }
  },
  methods: {
    toggleMobileFilter() {
      this.showMobileFilter = !this.showMobileFilter;
    },
    toggleDropdown(title) {
      this.openDropdowns[title] = !this.openDropdowns[title];
    },
    clearFilters() {
      Object.keys(this.selectedFilters).forEach(key => {
        this.selectedFilters[key] = [];
      });
    },
    searchBooks() {
      // البحث يتم التعامل معه في computed
    },
    toggleFavorite(bookId) {
      const book = this.books.find(b => b.id === bookId);
      if (book) {
        book.isFavorite = !book.isFavorite;
        if (book.isFavorite) {
          this.$toast.success('تمت الإضافة إلى المفضلة', { position: 'top-left', duration: 2000 });
        } else {
          this.$toast.info('تمت الإزالة من المفضلة', { position: 'top-left', duration: 2000 });
        }
      }
    },
    toggleFavoriteModal(bookId) {
      this.toggleFavorite(bookId);
      // تحديث selectedBook إذا كان مفتوحاً في المودال
      if (this.selectedBook && this.selectedBook.id === bookId) {
        this.selectedBook.isFavorite = !this.selectedBook.isFavorite;
      }
    },
    toggleFilterItem(category, item) {
      const index = this.selectedFilters[category].indexOf(item);
      if (index > -1) {
        this.selectedFilters[category].splice(index, 1);
      } else {
        this.selectedFilters[category].push(item);
      }
    },
    isFilterSelected(category, item) {
      return this.selectedFilters[category].includes(item);
    },
    openBookModal(book) {
      this.selectedBook = { ...book };
      // لا نمنع التمرير - نسمح بالـ scroll في المتصفح
    },
    closeModal() {
      this.selectedBook = null;
    },
    downloadBook(bookId) {
      this.$toast.success('جاري تحميل الكتاب...', { position: 'top-left', duration: 3000 });
    },
    previewBook(bookId) {
      this.$toast.info('جاري فتح المعاينة...', { position: 'top-left', duration: 2000 });
    },
    rateBook(bookId) {
      this.$toast.warning('فتح صفحة التقييم...', { position: 'top-left', duration: 2000 });
    }
  }
};
</script>

<style scoped>
.font-almarai {
  font-family: 'Almarai', sans-serif;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* أنيميشن المودال */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.4s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.4s ease, opacity 0.4s ease;
}

.modal-enter-from .modal-content {
  opacity: 0;
  transform: scale(0.8) translateY(-50px);
}

.modal-leave-to .modal-content {
  opacity: 0;
  transform: scale(0.8) translateY(50px);
}

/* تخصيص شريط التمرير */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #9EBF3B;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #8cad35;
}

/* تأثيرات إضافية */
.shadow-2xl {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.backdrop-blur-sm {
  backdrop-filter: blur(4px);
}

.backdrop-blur-md {
  backdrop-filter: blur(8px);
}

.backdrop-blur-lg {
  backdrop-filter: blur(16px);
}

/* تحسينات للاستجابة */
@media (max-width: 768px) {
  .modal-content {
    margin: 1rem;
    max-height: 95vh;
  }
  
  .flex-col.md\:flex-row {
    flex-direction: column;
  }
  
  .md\:w-2\/5, .md\:w-3\/5 {
    width: 100%;
  }
}

/* أنماط الفلاتر */
.filter-dropdown {
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 1rem;
}

.filter-dropdown:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

/* السماح بالتمرير دائمًا */
body {
  overflow-y: auto !important;
}
</style>