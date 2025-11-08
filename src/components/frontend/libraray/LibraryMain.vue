<template>
  <div class="font-almarai" :dir="isRTL ? 'rtl' : 'ltr'">
    <!-- Header -->
    <Header />

    <!-- Hero Section -->
    <Hero 
      :titleKey="'libraryHero.title'"
      :highlightKey="'libraryHero.highlight'"
      :subtitleKey="'libraryHero.subtitle'"
      :buttons="heroButtons"
    />

    <!-- محتوى المكتبة -->
    <section class="max-w-7xl mx-auto px-6 py-10">
      <div class="flex flex-col md:flex-row gap-6" >
        
        <!-- الفلترة - في العربية تكون على اليمين، في الإنجليزية على اليسار -->
        <BookFilters
          :filters="filters"
          :selectedFilters="selectedFilters"
          :openDropdowns="openDropdowns"
          @toggle-dropdown="toggleDropdown"
          @toggle-filter="toggleFilterItem"
          @clear-filters="clearFilters"
        />

        <!-- عرض الكتب -->
        <div class="flex-1">
          <!-- شريط البحث -->
          <div class="hidden md:flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4" 
               :class="isRTL ? 'md:flex-row-reverse' : 'md:flex-row'">
            <div class="flex gap-2 w-full" :class="isRTL ? 'flex-row-reverse' : 'flex-row'">
              
              <!-- في العربية: زر البحث أولاً ثم حقل الإدخال -->
              <button
                v-if="isRTL"
                @click="searchBooks"
                class="bg-primary-green text-white px-6 py-3 rounded-lg hover:bg-secondary-green transition duration-300 flex items-center gap-2 shadow-md hover:shadow-lg min-w-[120px] justify-center"
                :class="isRTL ? 'flex-row-reverse' : 'flex-row'"
              >
                <i class="fas fa-search" :class="isRTL ? 'ml-2' : 'mr-2'"></i>
                <span>{{ translate('buttons.search') }}</span>
              </button>
              
              <input
                v-model="search"
                type="text"
                :placeholder="searchPlaceholder"
                class="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent text-gray-700"
                :class="isRTL ? 'text-right placeholder:text-right' : 'text-left placeholder:text-left'"
                @keyup.enter="searchBooks"
              />
              
              <!-- في الإنجليزية: حقل الإدخال أولاً ثم زر البحث -->
              <button
                v-if="!isRTL"
                @click="searchBooks"
                class="bg-primary-green text-white px-6 py-3 rounded-lg hover:bg-secondary-green transition duration-300 flex items-center gap-2 shadow-md hover:shadow-lg min-w-[120px] justify-center"
                :class="isRTL ? 'flex-row-reverse' : 'flex-row'"
              >
                <span>{{ translate('buttons.search') }}</span>
                <i class="fas fa-search" :class="isRTL ? 'ml-2' : 'mr-2'"></i>
              </button>
            </div>
          </div>

          <!-- عرض النتائج -->
          <div class="mb-4 text-gray-600 text-center md:text-start" :class="isRTL ? 'text-right' : 'text-left'">
            {{ showingResultsText }}
          </div>
          
          <!-- شبكة الكتب -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <BookCard
              v-for="book in paginatedBooks"
              :key="book.id"
              :book="book"
              @toggle-favorite="toggleFavorite"
              @open-modal="openBookModal"
            />
          </div>
          
          <!-- لا توجد نتائج -->
          <div v-if="filteredBooks.length === 0" class="text-center py-12">
            <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">{{ translate('library.noResults') }}</h3>
            <p class="text-gray-500">{{ translate('library.tryDifferentSearch') }}</p>
          </div>

          <div v-if="totalPages > 1" class="flex justify-center mt-8">
            <div class="flex flex-col items-center space-y-6" :dir="isRTL ? 'rtl' : 'ltr'">
              <!-- أزرار الصفحات -->
              <div class="flex items-center" :class="isRTL ? 'space-x-2 space-x-reverse' : 'space-x-2'">
                <!-- زر الصفحة السابقة -->
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  :class="[
                    'pagination-btn',
                    'prev-next-btn',
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary hover:text-white'
                  ]"
                >
                  <i :class="isRTL ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
                </button>

                <!-- أرقام الصفحات -->
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    'pagination-btn',
                    'page-number',
                    page === currentPage 
                      ? 'active-page' 
                      : 'inactive-page hover:bg-gray-100'
                  ]"
                >
                  {{ page }}
                </button>

                <!-- زر الصفحة التالية -->
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  :class="[
                    'pagination-btn',
                    'prev-next-btn',
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary hover:text-white'
                  ]"
                >
                  <i :class="isRTL ? 'fas fa-chevron-left' : 'fas fa-chevron-right'"></i>
                </button>
              </div>

              <!-- نقاط التقدم -->
              <div class="flex" :class="isRTL ? 'space-x-1 space-x-reverse' : 'space-x-1'">
                <div
                  v-for="page in totalPages"
                  :key="page"
                  :class="[
                    'h-1 rounded-full transition-all duration-300 cursor-pointer',
                    page === currentPage 
                      ? 'bg-primary w-6' 
                      : 'bg-gray-300 w-2 hover:bg-gray-400'
                  ]"
                  @click="goToPage(page)"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- المودال -->
    <BookModal
      :selectedBook="selectedBook"
      @close="closeModal"
      @toggle-favorite="toggleFavoriteModal"
      @download="downloadBook"
      @preview="previewBook"
      @rate="rateBook"
    />

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/frontend/layouts/header.vue'
import Footer from '@/components/frontend/layouts/footer.vue'
import Hero from '@/components/frontend/layouts/hero.vue'
import BookModal from '@/components/frontend/libraray/BookModal.vue'
import BookFilters from '@/components/frontend/libraray/BookFilters.vue'
import BookCard from '@/components/frontend/libraray/LibraryCard.vue'
import { useTranslations } from '@/composables/useTranslations'
import { inject } from 'vue'
export default {
  name: 'BooksPage',
  components: {
    Header,
    Footer,
    Hero,
    BookModal,
    BookFilters,
    BookCard
  },
  setup() {
    const { translate } = useTranslations()
    const { currentLanguage } = inject('languageState') // استخدم inject للحصول على currentLanguage
    
    const isRTL = currentLanguage.value === 'ar'
    
    const heroButtons = [
      { 
        text: translate('buttons.startJourney'), 
        icon: 'fas fa-play-circle', 
        primary: true 
      },
      { 
        text: translate('buttons.learnMore'), 
        icon: 'fas fa-info-circle', 
        primary: false 
      }
    ]

    const searchPlaceholder = isRTL ? 
      'البحث عن كتاب، مؤلف، أو كلمة مفتاحية...' : 
      'Search for a book, author, or keyword...'

    return {
      translate,
      isRTL,
      heroButtons,
      searchPlaceholder
    }
  },
  data() {
    // استخدام مفاتيح ثابتة بدلاً من النصوص المترجمة
    const filterKeys = {
      categories: 'categories',
      authors: 'authors', 
      languages: 'languages',
      years: 'years',
      ratings: 'ratings'
    }
    
    return {
      search: "",
      selectedBook: null,
      currentPage: 1,
      booksPerPage: 12,
      filterKeys, // إضافة مفاتيح الفلاتر الثابتة
      openDropdowns: {
        [filterKeys.categories]: true,
        [filterKeys.authors]: false,
        [filterKeys.languages]: false,
        [filterKeys.years]: false,
        [filterKeys.ratings]: false
      },
      selectedFilters: {
        [filterKeys.categories]: [],
        [filterKeys.authors]: [],
        [filterKeys.languages]: [],
        [filterKeys.years]: [],
        [filterKeys.ratings]: []
      },
      filters: {
        [this.translate('filters.categories')]: ["علم النفس", "التنمية الذاتية", "الأطفال", "العلاج الأسري", "القلق والتوتر", "العلاقات", "الإدمان", "التربية", "العلاج المعرفي السلوكي", "العلاج بالفن"],
        [this.translate('filters.authors')]: ["د.محمد طه", "جينى بيب", "د.شارون مارتين", "جوناثان هايدت", "د.برين براون", "د.سارة أحمد", "د.أحمد خالد", "د.نورة السعيد", "د.ياسمين علي", "د.طارق الحبيب", "د.نيفين عبدالهادي", "د.إبراهيم الفقي"],
        [this.translate('filters.languages')]: ["عربي", "إنجليزي"],
        [this.translate('filters.years')]: ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017"],
        [this.translate('filters.ratings')]: ["5 نجوم", "4 نجوم", "3 نجوم", "نجمتان", "نجمة"]
      },

      /* 🟢 أربعة وعشرون كتابًا */
      books: [
        {
          id: 1,
          title: "لا بطعم الفلامنكو",
          author: "د.محمد طه",
          category: "علم النفس",
          year: "2024",
          rating: 4.5,
          cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
          description: "كتاب يقدم رؤية جديدة في فهم وتحليل السلوك البشري بأسلوب قصصي ممتع.",
          isFavorite: false
        },
        {
          id: 2,
          title: "قوة العادات",
          author: "تشارلز دويج",
          category: "التنمية الذاتية",
          year: "2023",
          rating: 4.8,
          cover: "https://images.unsplash.com/photo-1589820296156-2454c1c5b9c4?w=400&h=600&fit=crop",
          description: "تحليل عميق لعلم تكوين العادات وكيفية تغييرها لتحقيق النجاح الشخصي.",
          isFavorite: false
        },
        {
          id: 3,
          title: "العلاقات السامة",
          author: "د.شارون مارتين",
          category: "العلاقات",
          year: "2022",
          rating: 4.3,
          cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
          description: "دليل للتعامل مع العلاقات المؤذية وبناء حدود صحية تضمن الهدوء الداخلي.",
          isFavorite: false
        },
        {
          id: 4,
          title: "عقل الطفل الكامل",
          author: "د.دانييل سيغل",
          category: "الأطفال",
          year: "2021",
          rating: 4.9,
          cover: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=600&fit=crop",
          description: "كتاب تربوي رائع يشرح كيف يعمل دماغ الطفل وكيفية توجيه سلوكه بلطف ووعي.",
          isFavorite: false
        },
        {
          id: 5,
          title: "القلق: استخدام العقل لفهم الذات",
          author: "جينى بيب",
          category: "القلق والتوتر",
          year: "2023",
          rating: 4.1,
          cover: "https://images.unsplash.com/photo-1473187983305-f615310e7daa?w=400&h=600&fit=crop",
          description: "يساعدك الكتاب على تحويل القلق من عبء إلى قوة دافعة للنمو الذاتي.",
          isFavorite: false
        },
        {
          id: 6,
          title: "الهشاشة والقوة",
          author: "د.برين براون",
          category: "العلاج الأسري",
          year: "2020",
          rating: 4.7,
          cover: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
          description: "رحلة في فهم الشجاعة العاطفية والقدرة على التواصل بصدق داخل الأسرة.",
          isFavorite: false
        },
        {
          id: 7,
          title: "الإدمان والعقل البشري",
          author: "د.أحمد خالد",
          category: "الإدمان",
          year: "2021",
          rating: 4.2,
          cover: "https://images.unsplash.com/photo-1535909339361-9b2eeb9b7f36?w=400&h=600&fit=crop",
          description: "يتناول الكتاب تفسيراً علمياً ونفسياً لآليات الإدمان وطرق التعافي الحديثة.",
          isFavorite: false
        },
        {
          id: 8,
          title: "فن الهدوء الداخلي",
          author: "د.نورة السعيد",
          category: "التنمية الذاتية",
          year: "2024",
          rating: 5.0,
          cover: "https://images.unsplash.com/photo-1473181488821-2d23949a045a?w=400&h=600&fit=crop",
          description: "دليل عملي للتأمل والعيش بسلام وسط ضوضاء العالم الحديث.",
          isFavorite: false
        },
        {
          id: 9,
          title: "العلاج المعرفي السلوكي",
          author: "د.طارق الحبيب",
          category: "العلاج المعرفي السلوكي",
          year: "2023",
          rating: 4.6,
          cover: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=600&fit=crop",
          description: "دليل شامل لفهم وتطبيق العلاج المعرفي السلوكي في الحياة اليومية.",
          isFavorite: false
        },
        {
          id: 10,
          title: "تربية بلا صراخ",
          author: "د.نيفين عبدالهادي",
          category: "التربية",
          year: "2022",
          rating: 4.4,
          cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
          description: "أساليب عملية لتربية الأطفال بفعالية دون اللجوء للصراخ أو العقاب القاسي.",
          isFavorite: false
        },
        {
          id: 11,
          title: "قوة التفكير الإيجابي",
          author: "د.إبراهيم الفقي",
          category: "التنمية الذاتية",
          year: "2019",
          rating: 4.3,
          cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
          description: "كيفية استخدام قوة التفكير الإيجابي لتغيير حياتك وتحقيق أهدافك.",
          isFavorite: false
        },
        {
          id: 12,
          title: "العلاج بالفن والتعبير",
          author: "د.سارة أحمد",
          category: "العلاج بالفن",
          year: "2021",
          rating: 4.7,
          cover: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop",
          description: "استخدام الفن كوسيلة للتعبير عن المشاعر والشفاء النفسي.",
          isFavorite: false
        },
        {
          id: 13,
          title: "الذكاء العاطفي في العمل",
          author: "د.ياسمين علي",
          category: "علم النفس",
          year: "2020",
          rating: 4.5,
          cover: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=600&fit=crop",
          description: "كيفية تطوير الذكاء العاطفي لتحسين الأداء المهني والعلاقات في العمل.",
          isFavorite: false
        },
        {
          id: 14,
          title: "أسرار النوم الصحي",
          author: "د.محمد طه",
          category: "علم النفس",
          year: "2023",
          rating: 4.8,
          cover: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=600&fit=crop",
          description: "دليل علمي لفهم النوم وتحسين جودته لتأثير إيجابي على الصحة النفسية.",
          isFavorite: false
        },
        {
          id: 15,
          title: "التواصل غير العنيف",
          author: "د.برين براون",
          category: "العلاقات",
          year: "2022",
          rating: 4.6,
          cover: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=600&fit=crop",
          description: "تعلم فن التواصل الفعال الذي يحترم احتياجاتك واحتياجات الآخرين.",
          isFavorite: false
        },
        {
          id: 16,
          title: "المرونة النفسية",
          author: "د.أحمد خالد",
          category: "التنمية الذاتية",
          year: "2024",
          rating: 4.9,
          cover: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=600&fit=crop",
          description: "كيفية تطوير المرونة النفسية للتكيف مع التحديات والضغوط الحياتية.",
          isFavorite: false
        },
        {
          id: 17,
          title: "علم نفس الألوان",
          author: "د.سارة أحمد",
          category: "علم النفس",
          year: "2023",
          rating: 4.4,
          cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
          description: "كيف تؤثر الألوان على مشاعرنا وسلوكنا وقراراتنا اليومية.",
          isFavorite: false
        },
        {
          id: 18,
          title: "القيادة الوجدانية",
          author: "د.طارق الحبيب",
          category: "التنمية الذاتية",
          year: "2022",
          rating: 4.7,
          cover: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
          description: "فن القيادة بالقلب والعقل لتحفيز الفرق وتحقيق النجاح المستدام.",
          isFavorite: false
        },
        {
          id: 19,
          title: "العلاج بالكتابة",
          author: "د.نورة السعيد",
          category: "العلاج بالفن",
          year: "2021",
          rating: 4.5,
          cover: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=600&fit=crop",
          description: "كيف يمكن للكتابة أن تكون وسيلة فعالة للشفاء والتعبير عن الذات.",
          isFavorite: false
        },
        {
          id: 20,
          title: "تربية المراهقين",
          author: "د.نيفين عبدالهادي",
          category: "التربية",
          year: "2024",
          rating: 4.8,
          cover: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=600&fit=crop",
          description: "دليل عملي لفهم واحتواء مرحلة المراهقة بكل تحدياتها وفرصها.",
          isFavorite: false
        },
        {
          id: 21,
          title: "إدارة الغضب",
          author: "د.ياسمين علي",
          category: "العلاج المعرفي السلوكي",
          year: "2023",
          rating: 4.6,
          cover: "https://images.unsplash.com/photo-1543857778-c4a1a569eafe?w=400&h=600&fit=crop",
          description: "تقنيات عملية للتحكم في الغضب وتحويله إلى طاقة إيجابية.",
          isFavorite: false
        },
        {
          id: 22,
          title: "علم السعادة",
          author: "د.محمد طه",
          category: "علم النفس",
          year: "2022",
          rating: 4.9,
          cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
          description: "الأبحاث العلمية الحديثة حول السعادة وكيفية تحقيقها في الحياة اليومية.",
          isFavorite: false
        },
        {
          id: 23,
          title: "العلاج بالطبيعة",
          author: "د.أحمد خالد",
          category: "العلاج بالفن",
          year: "2021",
          rating: 4.3,
          cover: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop",
          description: "كيف يمكن للطبيعة أن تكون مصدراً للشفاء والراحة النفسية.",
          isFavorite: false
        },
        {
          id: 24,
          title: "الذكاء الاجتماعي",
          author: "د.برين براون",
          category: "العلاقات",
          year: "2020",
          rating: 4.7,
          cover: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=600&fit=crop",
          description: "تنمية المهارات الاجتماعية لبناء علاقات ناجحة في الحياة والعمل.",
          isFavorite: false
        }
      ]
    };
  },

  computed: {
    showingResultsText() {
      const start = this.startIndex + 1
      const end = this.endIndex
      const total = this.filteredBooks.length
      
      if (this.isRTL) {
        return `عرض ${start}-${end} من ${total} كتاب`
      } else {
        return `Showing ${start}-${end} of ${total} books`
      }
    },
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
      
      // استخدام المفاتيح الثابتة بدلاً من النصوص المترجمة
      Object.keys(this.selectedFilters).forEach(filterKey => {
        if (this.selectedFilters[filterKey] && this.selectedFilters[filterKey].length > 0) {
          if (filterKey === this.filterKeys.authors) {
            result = result.filter(book => 
              this.selectedFilters[filterKey].some(author => book.author.includes(author))
            );
          } else if (filterKey === this.filterKeys.categories) {
            result = result.filter(book => 
              this.selectedFilters[filterKey].includes(book.category)
            );
          } else if (filterKey === this.filterKeys.years) {
            result = result.filter(book => 
              this.selectedFilters[filterKey].includes(book.year)
            );
          } else if (filterKey === this.filterKeys.ratings) {
            result = result.filter(book => {
              const rating = book.rating;
              return this.selectedFilters[filterKey].some(ratingFilter => {
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
    },
    totalPages() {
      return Math.ceil(this.filteredBooks.length / this.booksPerPage);
    },
    paginatedBooks() {
      const startIndex = (this.currentPage - 1) * this.booksPerPage;
      const endIndex = startIndex + this.booksPerPage;
      return this.filteredBooks.slice(startIndex, endIndex);
    },
    startIndex() {
      return (this.currentPage - 1) * this.booksPerPage;
    },
    endIndex() {
      return Math.min(this.startIndex + this.booksPerPage, this.filteredBooks.length);
    },
    visiblePages() {
      const pages = [];
      const total = this.totalPages;
      const current = this.currentPage;
      
      let start = Math.max(1, current - 2);
      let end = Math.min(total, start + 4);
      
      if (end - start < 4) {
        start = Math.max(1, end - 4);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    }
  },
  watch: {
    search() {
      this.currentPage = 1;
    },
    selectedFilters: {
      handler() {
        this.currentPage = 1;
      },
      deep: true
    }
  },
  methods: {
    toggleDropdown(title) {
      this.openDropdowns[title] = !this.openDropdowns[title];
    },
    clearFilters() {
      Object.keys(this.selectedFilters).forEach(key => {
        this.selectedFilters[key] = [];
      });
      this.currentPage = 1;
    },
    searchBooks() {
      this.currentPage = 1;
    },
    toggleFavorite(bookId) {
      const book = this.books.find(b => b.id === bookId);
      if (book) {
        book.isFavorite = !book.isFavorite;
        if (book.isFavorite) {
          this.$toast.success(this.translate('messages.addedToFavorites'), { 
            position: this.isRTL ? 'top-right' : 'top-left', 
            duration: 2000 
          });
        } else {
          this.$toast.info(this.translate('messages.removedFromFavorites'), { 
            position: this.isRTL ? 'top-right' : 'top-left', 
            duration: 2000 
          });
        }
      }
    },
    toggleFavoriteModal(bookId) {
      this.toggleFavorite(bookId);
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
    openBookModal(book) {
      this.selectedBook = { ...book };
    },
    closeModal() {
      this.selectedBook = null;
    },
    downloadBook(bookId) {
      this.$toast.success(this.translate('messages.downloading'), { 
        position: this.isRTL ? 'top-right' : 'top-left', 
        duration: 3000 
      });
    },
    previewBook(bookId) {
      this.$toast.info(this.translate('messages.previewing'), { 
        position: this.isRTL ? 'top-right' : 'top-left', 
        duration: 2000 
      });
    },
    rateBook(bookId) {
      this.$toast.warning(this.translate('messages.openingRating'), { 
        position: this.isRTL ? 'top-right' : 'top-left', 
        duration: 2000 
      });
    },
    goToPage(page) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }
};
</script>

