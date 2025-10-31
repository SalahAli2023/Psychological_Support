<template>
  <div v-cloak>
    <!-- Hero Section -->
 <Hero
      :title="heroTitle"
      :highlight="heroHighlight"
      :subtitle="heroSubtitle"
      :buttons="heroButtons"
      background="solid"
      align="center"
      size="medium"
      @cta="handleHeroCta"
    />

    <!-- Breadcrumb Outside Main Layout -->
    <div class="breadcrumb-container">
      <div class="breadcrumb-wrapper">
        <div class="article-breadcrumb">
          <span class="breadcrumb-item" @click="goBack">المقالات</span>
          <i class="fas fa-chevron-left"></i>
          <span class="breadcrumb-item current">{{ article.category }}</span>
          <i class="fas fa-chevron-left"></i>
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
              <span class="meta-item mr-2 ">
                <i class="fas fa-clock"></i>
                وقت القراءة: {{ article.readingTime || '5 دقائق' }}
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
                المرفقات
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
                  <h3 class="test-title">اختبر معلوماتك</h3>
                  <p class="test-description">
                    قم باختبار فهمك للموضوع من خلال أسئلة تفاعلية مصممة خصيصاً لهذا المقال
                  </p>
                </div>
              </div>
              <button class="test-btn" @click="startTest">
                <span>ابدأ الاختبار</span>
                <i class="fas fa-arrow-left"></i>
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
            مقالات ذات صلة
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
  data() {
    return {
      isLiked: false,
      likeCount: 0
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
          text: 'ابدأ القراءة',
          icon: 'fas fa-book-open',
          primary: true
        },
        {
          text: 'مقالات ذات صلة',
          icon: 'fas fa-link'
        }
      ]
    },
    // نصوص الهيرو المتجاوبة
    heroTitle() {
      return ' تفاصيل '
    },
    heroHighlight() {
      return 'المقال '
    },
    heroSubtitle() {
      if (window.innerWidth < 640) {
        return 'استفد من المحتوى القيم وتعرف على المزيد من المقالات المتعلقة بهذا الموضوع'
      } else if (window.innerWidth < 1024) {
        return 'استفد من المحتوى القيم وتعرف على المزيد من المقالات ذات الصلة بالموضوع'
      } else {
        return 'استفد من المحتوى القيم وتعرف على المزيد من المقالات ذات الصلة التي تثري معرفتك وتوسع آفاقك'
      }
    }
  },
  
  methods: {
    handleHeroCta(btn) {
      if (btn.text === 'ابدأ القراءة') {
        const articleElement = document.getElementById(`article-${this.article.id}`)
        if (articleElement) {
          articleElement.scrollIntoView({ behavior: 'smooth' })
        }
      } else if (btn.text === 'مقالات ذات صلة') {
        const sidebarElement = document.querySelector('.sidebar')
        if (sidebarElement) {
          sidebarElement.scrollIntoView({ behavior: 'smooth' })
        }
      }
    },
    // باقي الدوال كما هي...
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
    getAttachmentTypeText(type) {
      const types = {
        image: 'صورة',
        video: 'فيديو',
        pdf: 'ملف PDF',
        document: 'مستند'
      }
      return types[type] || 'ملف'
    },
    openAttachment(attachment) {
      if (attachment.type === 'image' || attachment.type === 'video') {
        window.open(attachment.url, '_blank')
      } else {
        window.open(attachment.url, '_blank')
      }
    },
    startTest() {
      alert(`سيبدأ اختبار في موضوع: ${this.article.category}`)
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

<style scoped>
/* Breadcrumb Container */
.breadcrumb-container {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 1rem 0;
  margin-bottom: 2rem;
 
}

.breadcrumb-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.article-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #6b7280;
  margin-right: 2rem;
}

.breadcrumb-item {
  cursor: pointer;
  transition: color 0.3s ease;
}

.breadcrumb-item:hover {
  color: #9EBF3B;
}

.breadcrumb-item.current {
  color: #9EBF3B;
  font-weight: 600;
}

.article-main-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.4;
  scroll-margin-top: 100px;
}

/* Main Layout */
.main-layout {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
}

/* Sidebar Styles */
.sidebar {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.sidebar-card {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
}

.sidebar-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sidebar-title i {
  color: #9EBF3B;
}

/* Related Articles */
.related-articles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.related-article-item {
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.related-article-item:hover {
  transform: translateX(5px);
  background: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: #9EBF3B;
}

.related-article-image {
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 0.75rem;
}

.related-article-image img {
  width: 100%;
  height: 100px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.related-article-item:hover .related-article-image img {
  transform: scale(1.05);
}

.article-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #9EBF3B;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
}

.related-article-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.related-article-excerpt {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-article-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.7rem;
  color: #9ca3af;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Main Article Content */
.article-main {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.article-header {
  margin-bottom: 2rem;
}

.article-title-section {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.article-main-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.3;
  margin-bottom: 1rem;
}

.article-meta {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  font-size: 0.85rem;
  color: #6b7280;
}

.article-meta .meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Featured Image */
.featured-image {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.article-featured-img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.category-badge {
  background: #9EBF3B;
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.75rem;
}

/* Article Content Main */
.article-content-main {
  margin-top: 2rem;
}

/* Author Section */
.author-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #9EBF3B;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-details {
  flex: 1;
}

.author-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.author-title {
  font-size: 0.8rem;
  color: #9EBF3B;
  margin: 0;
}

.like-btn {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 50px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
}

.like-btn:hover {
  background: #f1f5f9;
  border-color: #D6A29A;
}

.like-btn .fa-heart {
  transition: color 0.3s ease;
}

.like-btn .fa-heart.liked {
  color: #ef4444;
}

/* Article Text Content */
.article-text-content {
  margin-bottom: 2rem;
}

.content-section {
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.content-section:last-child {
  border-bottom: none;
}

.section-title-main {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-title-main i {
  color: #9EBF3B;
}

.content-text {
  font-size: 0.9rem;
  line-height: 1.6;
  color: #4b5563;
}

.introduction-text {
  font-size: 1rem;
  line-height: 1.7;
  color: #374151;
  font-weight: 500;
  margin-bottom: 1.5rem;
}

/* Article Full Content Styles */
.article-full-content {
  font-size: 0.95rem;
  line-height: 1.8;
  color: #4b5563;
}

.article-full-content h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
  margin: 2rem 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #9EBF3B;
}

.article-full-content h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin: 1.5rem 0 0.8rem 0;
}

.article-full-content p {
  margin-bottom: 1.2rem;
  text-align: justify;
}

.article-full-content ul {
  margin: 1rem 0;
  padding-right: 1.5rem;
}

.article-full-content li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.article-full-content strong {
  color: #1f2937;
  font-weight: 600;
}

/* Attachments Grid */
.attachments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.attachment-item {
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.attachment-item:hover {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: #9EBF3B;
}

.attachment-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #9EBF3B;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.attachment-info {
  flex: 1;
}

.attachment-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.attachment-type {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Test Button Section */
.test-section {
  background: linear-gradient(135deg, #D6A29A 0%, #9EBF3B 100%);
  border-radius: 1.5rem;
  padding: 2.5rem;
  margin-top: 2rem;
  position: relative;
  overflow: hidden;
}

.test-section::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
  opacity: 0.3;
}

.test-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  position: relative;
  z-index: 2;
}

.test-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
}

.test-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.test-text {
  flex: 1;
}

.test-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
}

.test-description {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  margin: 0;
}

.test-btn {
  background: white;
  color: #9EBF3B;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
}

.test-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
  gap: 1rem;
}

.test-btn:active {
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 1.5rem 1.5rem;
  }
  
  .sidebar {
    order: 2;
    position: static;
  }
  
  .article-main {
    order: 1;
  }
  
  .test-container {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
  
  .test-content {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .breadcrumb-wrapper {
    padding: 0 1.5rem;
  }
  
  .main-layout {
    padding: 0 1rem 1rem;
    gap: 1rem;
  }
  
  .article-main {
    padding: 1.5rem;
  }
  
  .article-main-title {
    font-size: 1.5rem;
  }
  
  .article-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .article-featured-img {
    height: 250px;
  }
  
  .attachments-grid {
    grid-template-columns: 1fr;
  }
  
  .test-section {
    padding: 2rem 1.5rem;
  }
  
  .test-icon {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
  
  .test-title {
    font-size: 1.3rem;
  }
  
  .test-btn {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .breadcrumb-wrapper {
    padding: 0 1rem;
  }
  
  .author-section {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .article-main {
    padding: 1rem;
  }
  
  .article-main-title {
    font-size: 1.3rem;
  }
  
  .test-section {
    padding: 1.5rem 1rem;
  }
  
  .test-icon {
    width: 50px;
    height: 50px;
    font-size: 1.3rem;
  }
  
  .test-title {
    font-size: 1.1rem;
  }
  
  .test-description {
    font-size: 0.85rem;
  }
  
  .article-full-content {
    font-size: 0.9rem;
  }
  
  .article-full-content h3 {
    font-size: 1.1rem;
  }
  
  .article-full-content h4 {
    font-size: 1rem;
  }
}
</style>