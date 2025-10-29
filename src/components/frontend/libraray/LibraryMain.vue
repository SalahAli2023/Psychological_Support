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
   <!-- قسم الفعاليات والورش -->
    <!-- <section id="events-section" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6"> -->
    <!-- محتوى المكتبة -->
    <section class="max-w-7xl mx-auto px-6 py-10">
      <!-- محتوى الصفحة -->
      <div class="flex flex-col md:flex-row gap-6">
        <!-- الفلترة -->
        <!-- زر فتح الفلتر للجوال -->
        <button 
          @click="toggleMobileFilter"
          class="md:hidden w-full bg-white border border-gray-300 px-4 py-3 rounded-lg flex items-center justify-between font-semibold text-gray-700 mb-4 shadow-sm"
        >
          <span>فلاتر البحث</span>
          <i :class="showMobileFilter ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" class="text-[#9EBF3B]"></i>
        </button>

        <!-- الفلتر للجوال (منسدل) -->
        <div v-if="showMobileFilter" class="md:hidden bg-white p-4 rounded-lg shadow-lg mb-6 border border-gray-200">
          <div class="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
            <h3 class="font-bold text-lg text-gray-800">فلاتر البحث</h3>
            <button @click="toggleMobileFilter" class="text-gray-500 hover:text-red-500 transition">
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
          
          <div class="space-y-4">
            <!-- === بداية التصميم الجديد للفلاتر المنسدلة بدون سكرول === -->
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
            <!-- === نهاية التصميم الجديد === -->
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

        <!-- === بداية التصميم الجديد للفلاتر المنسدلة على الشاشات الكبيرة === -->
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
        <!-- === نهاية التصميم الجديد === -->

        <!-- عرض الكتب -->
        <div class="flex-1">
          <!-- إخفاء البحث على الجوال -->
          <div class="hidden md:flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div class="flex gap-2 w-full">
              <input
                v-model="search"
                type="text"
                placeholder="البحث عن كتاب، مؤلف، أو كلمة مفتاحية..."
                class="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#9EBF3B] focus:border-transparent text-gray-700"
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
          
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="book in filteredBooks"
              :key="book.id"
              class="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer"
              @click="viewBook(book.id)"
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
        { id: 12, title: "العلاج باللعب للأطفال", author: "د.فاطمة الزهراء", category: "الأطفال", year: "2024", rating: 4.6, cover: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&h=600&fit=crop", description: "استخدام اللعب كأداة علاجية للأطفال.", isFavorite: false }
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
          } else if (filterType === "اللغة") {
            // يمكن إضافة حقل اللغة لكل كتاب
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
      // إعادة تعيين جميع الفلاتر إلى مصفوفات فارغة
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
      }
    },
    viewBook(bookId) {
      console.log('View book:', bookId);
      this.$router.push(`/books/${bookId}`);
    },
    toggleFilterItem(category, item) {
      const index = this.selectedFilters[category].indexOf(item);
      if (index > -1) {
        // إذا كان الفلتر محددًا، قم بإزالته
        this.selectedFilters[category].splice(index, 1);
      } else {
        // إذا لم يكن محددًا، قم بإضافته
        this.selectedFilters[category].push(item);
      }
    },
    isFilterSelected(category, item) {
      return this.selectedFilters[category].includes(item);
    }
  }
};
</script>

<style>
.font-almarai {
  font-family: 'Almarai', sans-serif;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* === أنماط الفلاتر الجديدة === */
.filter-dropdown {
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 1rem;
}

.filter-dropdown:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

/* تحسينات للحركات والانتقالات */
.transition-all {
  transition-property: all;
}

.duration-300 {
  transition-duration: 300ms;
}

.duration-200 {
  transition-duration: 200ms;
}

.ease-out {
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1);
}

.ease-in {
  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
}
</style>