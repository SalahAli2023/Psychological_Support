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
        
        <!-- الفلترة -->
        <BookFilters
          :filters="filters"
          :selectedFilters="selectedFilters"
          :openDropdowns="openDropdowns"
          @toggle-dropdown="toggleDropdown"
          @toggle-filter="toggleFilterItem"
          @clear-filters="clearFilters"
          @apply-filters="applyFilters"
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
                v-model="searchQuery"
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

          <!-- الترقيم -->
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
import { useLibraryStore } from '@/stores/library'
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
    const { currentLanguage } = inject('languageState')
    const libraryStore = useLibraryStore()
    
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
      searchPlaceholder,
      libraryStore
    }
  },
  data() {
    return {
      searchQuery: "",
      selectedBook: null,
      currentPage: 1,
      booksPerPage: 12,
      // استخدام البيانات الحقيقية من الـ store
      books: [],
      categories: [],
      loading: false,
      // الفلاتر
      openDropdowns: {
        categories: true,
        authors: false,
        languages: false,
        years: false,
        ratings: false
      },
      selectedFilters: {
        categories: [],
        authors: [],
        languages: [],
        years: [],
        ratings: []
      },
      filters: {
        categories: [],
        authors: [],
        languages: ["عربي", "إنجليزي"],
        years: ["2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017"],
        ratings: ["5 نجوم", "4 نجوم", "3 نجوم", "نجمتان", "نجمة"]
      }
    };
  },
  async mounted() {
    await this.loadBooks()
    await this.loadCategories()
    this.initializeFilters()
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
      
      if (this.searchQuery) {
        const searchLower = this.searchQuery.toLowerCase();
        result = result.filter(book => 
          book.title?.toLowerCase().includes(searchLower) || 
          book.author?.toLowerCase().includes(searchLower) ||
          book.description?.toLowerCase().includes(searchLower) ||
          book.category?.toLowerCase().includes(searchLower)
        );
      }
      
      // تطبيق الفلاتر
      Object.keys(this.selectedFilters).forEach(filterKey => {
        if (this.selectedFilters[filterKey] && this.selectedFilters[filterKey].length > 0) {
          if (filterKey === 'authors') {
            result = result.filter(book => 
              this.selectedFilters[filterKey].some(author => book.author?.includes(author))
            );
          } else if (filterKey === 'categories') {
            result = result.filter(book => 
              this.selectedFilters[filterKey].includes(book.category)
            );
          } else if (filterKey === 'years') {
            result = result.filter(book => 
              this.selectedFilters[filterKey].includes(book.year)
            );
          } else if (filterKey === 'ratings') {
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
  methods: {
    async loadBooks() {
      this.loading = true
      try {
        await this.libraryStore.fetchItems()
        this.books = this.libraryStore.items
      } catch (error) {
        console.error('Failed to load books:', error)
      } finally {
        this.loading = false
      }
    },
    async loadCategories() {
      try {
        await this.libraryStore.fetchCategories()
        this.categories = this.libraryStore.categories
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    },
    initializeFilters() {
      // تهيئة فلاتر التصنيفات من البيانات الحقيقية
      this.filters.categories = this.categories.map(cat => 
        this.isRTL ? cat.name_ar : cat.name_en
      )
      
      // تهيئة فلاتر المؤلفين من البيانات الحقيقية
      const authors = new Set()
      this.books.forEach(book => {
        if (book.author) authors.add(book.author)
      })
      this.filters.authors = Array.from(authors)
    },
    toggleDropdown(title) {
      this.openDropdowns[title] = !this.openDropdowns[title];
    },
    clearFilters() {
      Object.keys(this.selectedFilters).forEach(key => {
        this.selectedFilters[key] = [];
      });
      this.currentPage = 1;
    },
    applyFilters() {
      this.currentPage = 1;
    },
    searchBooks() {
      this.currentPage = 1;
    },
    toggleFavorite(bookId) {
      this.libraryStore.toggleFavorite(bookId)
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
      // زيادة المشاهدات عند فتح المودال
      this.libraryStore.incrementViews(book.id)
    },
    closeModal() {
      this.selectedBook = null;
    },
    downloadBook(bookId) {
      this.libraryStore.downloadItem(bookId)
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
      // يمكنك فتح مودال التقييم هنا
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