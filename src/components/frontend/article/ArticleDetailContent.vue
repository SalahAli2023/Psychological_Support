<template>
  <div v-cloak>
    <!-- Hero Section -->
    <Hero
      :titleKey="'articleDetailHero.title'"
      :highlightKey="'articleDetailHero.highlight'"
      :subtitleKey="'articleDetailHero.subtitle'"
      :buttons="heroButtons"
      @cta="handleHeroCta"
    />

    <!-- Breadcrumb Outside Main Layout -->
<div class="breadcrumb-container">
      <div class="breadcrumb-wrapper">
        <div class="article-breadcrumb">
          <span class="breadcrumb-item" @click="goBack">{{ translate('breadcrumb.articles') }}</span>
          <!-- تغيير اتجاه الأيقونة حسب اللغة -->
          <i class="fas" :class="isRTL ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
          <span class="breadcrumb-item current">{{ article.category }}</span>
          <i class="fas" :class="isRTL ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
          <span class="breadcrumb-item" :id="`article-${article.id}`">{{ article.title }}</span>
        </div>
      </div>
    </div>

    <!-- Main Content Layout -->
    <div class="main-layout">
      <!-- Main Content - Article Details -->
      <main class="article-main">
        <!-- Article Header with Title Above Image -->
        <div class="article-header">
          <div class="article-title-section">
            <h1 class="article-main-title">{{ article.title }}</h1>
            <div class="article-meta">
              <span class="meta-item">
                <i class="fas fa-calendar-alt"></i>
                {{ article.date }}
              </span>
              <span class="meta-item mr-2">
                <i class="fas fa-clock"></i>
                {{ translate('article.readingTime') }}: {{ article.readingTime || '5 دقائق' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Featured Image -->
        <div class="featured-image">
          <img :src="article.image" :alt="article.title" class="article-featured-img">
          <div class="image-overlay">
            <div class="category-badge">{{ article.category }}</div>
          </div>
        </div>

        <!-- Article Content -->
        <div class="article-content-main">
          <!-- Author Info -->
          <div class="author-section">
            <div class="author-avatar">
              <img :src="article.author.avatar" :alt="article.author.name">
            </div>
            <div class="author-details">
              <h3 class="author-name">{{ article.author.name }}</h3>
              <p class="author-title">{{ article.author.title }}</p>
            </div>
            <button class="like-btn" @click="toggleLike">
              <i class="fas fa-heart" :class="{ liked: isLiked }"></i>
              <span>{{ likeCount }}</span>
            </button>
          </div>

          <!-- Article Text Content -->
          <div class="article-text-content">
            <!-- Introduction -->
            <section class="content-section" v-if="article.fullContent?.introduction">
              <div class="content-text">
                <p class="introduction-text">{{ article.fullContent.introduction }}</p>
              </div>
            </section>

            <!-- Main Content -->
            <section class="content-section" v-if="article.fullContent?.content">
              <div class="article-full-content" v-html="article.fullContent.content"></div>
            </section>

            <!-- Article Attachments -->
            <section class="content-section" v-if="article.fullContent?.attachments && article.fullContent.attachments.length > 0">
              <h2 class="section-title-main">
                <i class="fas fa-paperclip"></i>
                {{ translate('attachments.title') }}
              </h2>
              <div class="attachments-grid">
                <div 
                  v-for="attachment in article.fullContent.attachments" 
                  :key="attachment.id"
                  class="attachment-item"
                  @click="openAttachment(attachment)"
                >
                  <div class="attachment-icon">
                    <i :class="getAttachmentIcon(attachment.type)"></i>
                  </div>
                  <div class="attachment-info">
                    <h4 class="attachment-title">{{ attachment.title }}</h4>
                    <span class="attachment-type">{{ getAttachmentTypeText(attachment.type) }}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Test Button Section -->
           <section class="content-section test-section">
          <div class="test-container">
            <div class="test-content">
              <div class="test-icon">
                <i class="fas fa-brain"></i>
              </div>
              <div class="test-text">
                <h3 class="test-title">{{ translate('testSection.title') }}</h3>
                <p class="test-description">
                  {{ translate('testSection.description') }}
                </p>
              </div>
            </div>
            <button class="test-btn" @click="startTest">
              <span>{{ translate('testSection.startButton') }}</span>
              <!-- تغيير اتجاه الأيقونة حسب اللغة -->
              <i class="fas" :class="isRTL ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
            </button>
          </div>
        </section>
        </div>
      </main>

      <!-- Right Sidebar - Related Articles -->
      <aside class="sidebar">
        <div class="sidebar-card">
          <h3 class="sidebar-title">
            <i class="fas fa-link"></i>
            {{ translate('sidebar.relatedArticles') }}
          </h3>
          
          <div class="related-articles-list">
            <div 
              v-for="relatedArticle in relatedArticles" 
              :key="relatedArticle.id" 
              class="related-article-item"
              @click="goToArticle(relatedArticle.id)"
            >
              <div class="related-article-image">
                <img :src="relatedArticle.image" :alt="relatedArticle.title">
                <div class="article-badge">{{ relatedArticle.badge }}</div>
              </div>
              <div class="related-article-content">
                <h4 class="related-article-title">{{ relatedArticle.title }}</h4>
                <p class="related-article-excerpt">{{ relatedArticle.excerpt }}</p>
                <div class="related-article-meta">
                  <span class="meta-item">
                    <i class="fas fa-calendar-alt"></i>
                    {{ relatedArticle.date }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
import { articles } from './articles-data.js'
import Hero from '@/components/frontend/layouts/hero.vue'
import { useTranslations } from '@/composables/useTranslations'
import { inject } from 'vue'

export default {
  name: 'ArticleDetailContent',
  components: {
    Hero
  },
  props: {
    articleId: {
      type: [String, Number],
      required: true
    }
  },
  setup() {
    const { translate } = useTranslations()
    const { currentLanguage } = inject('languageState')
    
    const isRTL = currentLanguage.value === 'ar'
    
    return {
      translate,
      isRTL
    }
  },
  computed: {
    article() {
      return this.findArticleById(this.articleId) || this.getDefaultArticle()
    },
    relatedArticles() {
      return articles
        .filter(a => a.id !== this.article.id)
        .slice(0, 4)
    },
    heroButtons() {
      return [
        {
          text: this.translate('buttons.startReading'),
          icon: 'fas fa-book-open',
          primary: true
        },
        {
          text: this.translate('buttons.relatedArticles'),
          icon: 'fas fa-link'
        }
      ]
    }
  },
  methods: {
    handleHeroCta(btn) {
      if (btn.text === this.translate('buttons.startReading')) {
        const articleElement = document.getElementById(`article-${this.article.id}`)
        if (articleElement) {
          articleElement.scrollIntoView({ behavior: 'smooth' })
        }
      } else if (btn.text === this.translate('buttons.relatedArticles')) {
        const sidebarElement = document.querySelector('.sidebar')
        if (sidebarElement) {
          sidebarElement.scrollIntoView({ behavior: 'smooth' })
        }
      }
    },
    getAttachmentTypeText(type) {
      // استخدام الترجمة بدلاً من النصوص الثابتة
      return this.translate(`attachments.types.${type}`) || this.translate('attachments.types.document')
    },
    startTest() {
      alert(`${this.translate('testSection.startButton')}: ${this.article.category}`)
    },
    // ... باقي الدوال تبقى كما هي
    findArticleById(id) {
      return articles.find(article => article.id == id)
    },
    getDefaultArticle() {
      return {
        id: 0,
        title: 'المقال غير موجود',
        category: 'غير مصنف',
        excerpt: 'عذراً، المقال الذي تبحث عنه غير موجود.',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
        date: 'غير معروف',
        readingTime: 'غير معروف',
        author: {
          name: 'غير معروف',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
          title: 'غير معروف',
          bio: 'غير معروف'
        },
        fullContent: {
          introduction: 'المقال غير موجود.',
          content: '<p>عذراً، المقال الذي تبحث عنه غير موجود أو قد تم حذفه.</p>'
        }
      }
    },
    toggleLike() {
      this.isLiked = !this.isLiked
      this.likeCount += this.isLiked ? 1 : -1
    },
    getAttachmentIcon(type) {
      const icons = {
        image: 'fas fa-image',
        video: 'fas fa-video',
        pdf: 'fas fa-file-pdf',
        document: 'fas fa-file-alt'
      }
      return icons[type] || 'fas fa-paperclip'
    },
    openAttachment(attachment) {
      if (attachment.type === 'image' || attachment.type === 'video') {
        window.open(attachment.url, '_blank')
      } else {
        window.open(attachment.url, '_blank')
      }
    },
    goBack() {
      this.$router.push('/article')
    },
    goToArticle(id) {
      this.$router.push(`/article/${id}`)
    }
  }
}
</script>