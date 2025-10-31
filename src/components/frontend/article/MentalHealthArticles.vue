<template>
  <div class="font-almarai" >
    <!-- Header -->
    <Header />

    <!-- Hero Section -->
    <Hero 
      title="مقالات الدعم النفسي"
      highlight=""
      subtitle="اكتشف مقالات متنوعة في مجال الصحة النفسية والدعم النفسي والتنمية الذاتية"
      :buttons="[
        { text: 'ابدأ الرحلة', icon: 'fas fa-play-circle', primary: true },
        { text: 'المزيد عنا', icon: 'fas fa-info-circle', primary: false }
      ]"
    />

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Category Filter -->
      <div class="w-full flex justify-center mb-8">
        <div class="w-full max-w-4xl">
          <CategoryFilter 
            :categories="categories"
            :activeCategory="activeCategory"
            @category-change="handleCategoryChange"
            @search-change="handleSearchChange"
          />
        </div>
      </div>

      <!-- Articles Grid -->
      <div class="mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ArticleCard
            v-for="article in paginatedArticles"
            :key="article.id"
            :article="article"
            @read-more="handleReadMore"
          />
        </div>
      </div>

      <!-- No Results -->
      <div v-if="filteredArticles.length === 0" class="text-center py-12 bg-white rounded-xl shadow-md">
        <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
        <h3 class="text-xl font-bold text-[#065f46] mb-2">لا توجد مقالات</h3>
        <p class="text-gray-600">جرب بحثاً آخر أو فئة مختلفة</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <Pagination 
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-items="filteredArticles.length"
          @page-change="handlePageChange"
        />
      </div>
    </div>

   
  </div>
</template>

<script>
import Header from '@/components/frontend/layouts/header.vue'
import Footer from '@/components/frontend/layouts/footer.vue'
import Hero from '@/components/frontend/layouts/hero.vue'
import ArticleCard from './ArticleCard.vue'
import CategoryFilter from './CategoryFilter.vue'
import Pagination from './Pagination.vue'
import { articles } from './articles-data.js'

export default {
  name: 'MentalHealthArticles',
  components: {
    Header,
    Footer,
    Hero,
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

<style scoped>
/* تحسينات إضافية للغة العربية */
.font-almarai {
  font-family: 'Almarai', sans-serif;
}

/* تحسين المسافات للعربية */
.grid > * {
  margin-bottom: 1.5rem;
}

/* تحسين الظلال */
.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>