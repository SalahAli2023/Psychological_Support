<template>
  <div v-cloak>
    <!-- Hero Section -->
    <section class="py-20 hero-gradient">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
      <div class="container mx-auto px-4 text-center relative z-10">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
          <span class="text-primary">مقالات</span>
          <span class="text-secondary"> الدعم النفسي</span>
        </h1>
        <p class="text-gray-600 text-xl max-w-2xl mx-auto mb-8">
          اكتشف مقالات متنوعة في مجال الصحة النفسية والدعم النفسي والتنمية الذاتية
        </p>
        <div class="flex justify-center gap-4">
          <button class="btn-primary px-8 py-3 rounded-lg font-medium flex items-center gap-2">
            <i class="fas fa-play-circle"></i>
            ابدأ الرحلة
          </button>
          <button class="px-8 py-3 rounded-lg font-medium flex items-center gap-2 border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary transition-colors">
            <i class="fas fa-info-circle"></i>
            المزيد عنا
          </button>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-16">
      <!-- Category Filter -->
      <CategoryFilter 
         :categories="categories"
        :activeCategory="activeCategory"
        @category-change="handleCategoryChange"
        @search-change="handleSearchChange"
      />

      <!-- Articles Grid -->
      <div class="articles-container">
        <div class="articles-grid">
          <ArticleCard
            v-for="article in paginatedArticles"
            :key="article.id"
            :article="article"
            @read-more="handleReadMore"
          />
        </div>
      </div>

      <!-- No Results -->
      <div v-if="filteredArticles.length === 0" class="no-results">
        <i class="fas fa-search"></i>
        <h3 class="text-xl font-bold text-gray-600 mb-2">لا توجد مقالات</h3>
        <p class="text-gray-500">جرب بحثاً آخر أو فئة مختلفة</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="text-center mt-16">
        <Pagination 
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-items="filteredArticles.length"
          @page-change="handlePageChange"
        />
      </div>
    </main>
  </div>
</template>

<script>
import ArticleCard from './ArticleCard.vue'
import CategoryFilter from './CategoryFilter.vue'
import Pagination from './Pagination.vue'
import { articles } from './articles-data.js'
export default {
  name: 'MentalHealthArticles',
  components: {
    ArticleCard,
    CategoryFilter,
    Pagination
  },
  data() {
    return {
      activeCategory: 'all',
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 6,
      categories: [
        { id: 'all', name: 'جميع المقالات', icon: 'fa-list' },
        { id: 'القلق والتوتر', name: 'القلق والتوتر', icon: 'fa-heart-pulse' },
        { id: 'الاكتئاب', name: 'الاكتئاب', icon: 'fa-cloud-rain' },
        { id: 'أساسيات', name: 'أساسيات', icon: 'fa-graduation-cap' },
        { id: 'تنمية الذات', name: 'تنمية الذات', icon: 'fa-rocket' },
        { id: 'العلاقات', name: 'العلاقات', icon: 'fa-handshake' },
      ],
       articles: articles
      
    };
  },
  computed: {
    filteredArticles() {
      return this.articles.filter((article) => {
        const matchesCategory = this.activeCategory === 'all' || article.category === this.activeCategory;
        const matchesSearch = article.title.includes(this.searchQuery) || article.excerpt.includes(this.searchQuery);
        return matchesCategory && matchesSearch;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredArticles.length / this.itemsPerPage);
    },
    paginatedArticles() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredArticles.slice(start, end);
    }
  },
  methods: {
    handleCategoryChange(categoryId) {
      this.activeCategory = categoryId;
      this.currentPage = 1;
    },
    handleSearchChange(query) {
      this.searchQuery = query;
      this.currentPage = 1;
    },
    handleReadMore(articleId) {
      // الانتقال إلى صفحة تفاصيل المقالة
      this.$router.push(`/article/${articleId}`);
    },
    handlePageChange(page) {
      this.currentPage = page;
      // التمرير لأعلى الصفحة عند تغيير الصفحة
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
</script>