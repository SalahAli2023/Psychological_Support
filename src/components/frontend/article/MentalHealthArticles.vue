<template>
  <div class="font-almarai bg-white">
    <!-- Header -->
    <Header />

    <!-- Hero Section -->
    <Hero 
      :titleKey="'articlesHero.title'"
      :highlightKey="'articlesHero.highlight'"
      :subtitleKey="'articlesHero.subtitle'"
      :buttons="heroButtons"
    />

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Category Filter -->
      <CategoryFilter 
        :categories="translatedCategories"
        :activeCategory="activeCategory"
        @category-change="handleCategoryChange"
        @search-change="handleSearchChange"
      />

      <!-- Articles Grid -->
      <div class="mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <ArticleCard
            v-for="article in paginatedArticles"
            :key="article.id"
            :article="article"
            @read-more="handleReadMore"
          />
        </div>
      </div>

      <!-- No Results -->
      <div v-if="filteredArticles.length === 0" class="text-center py-12 bg-white rounded-xl shadow-md max-w-2xl mx-auto">
        <i class="fas fa-search text-4xl text-gray-400 mb-4"></i>
        <h3 class="text-xl font-bold text-emerald-800 mb-2">{{ noResultsText.title }}</h3>
        <p class="text-gray-600">{{ noResultsText.message }}</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <Pagination 
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-items="filteredArticles.length"
          :items-per-page="itemsPerPage"
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
import { useTranslations } from '@/composables/useTranslations'

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
  setup() {
    const { translate } = useTranslations()
    
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
    const noResultsText = {
      title: translate('noResults.title'),
      message: translate('noResults.message')
    }

    return {
      heroButtons,
      noResultsText
    }
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
    },
    translatedCategories() {
      const { translate } = useTranslations();
      
      return this.categories.map(category => {
        if (category.id === 'all') {
          return {
            ...category,
            name: translate('filters.allCategories')
          };
        }
        return category;
      });
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
      this.$router.push(`/article/${articleId}`);
    },
    handlePageChange(page) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
</script>

<style scoped>
.font-almarai {
  font-family: 'Almarai', sans-serif;
}
</style>    