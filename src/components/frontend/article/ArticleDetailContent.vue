<template>
  <div v-cloak>
    <!-- Hero Section with Title - Reduced Height -->
    <section class="hero-section">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
      
      <div class="container mx-auto px-4 text-center relative z-10">
        <!-- Back Button -->
        <button class="back-btn" @click="goBack">
          <i class="fas fa-arrow-right"></i>
          <span>العودة للمقالات</span>
        </button>

        <h1 class="hero-title">
          <span class="text-primary">مقالات</span>
          <span class="text-secondary"> الدعم النفسي</span>
        </h1>
        <p class="hero-subtitle">
          اكتشف مقالات متنوعة في مجال الصحة النفسية والدعم النفسي والتنمية الذاتية
        </p>
      </div>
    </section>

    <!-- Article Header Card - Moved below hero -->
    <div class="article-header-container">
      <div class="article-hero-card">
        <h1 class="article-title">{{ article.title }}</h1>
        
        <div class="article-meta-row">
          <div class="meta-item">
            <div class="meta-icon date">
              <i class="fas fa-calendar-alt"></i>
            </div>
            <div>
              <div class="meta-label">تاريخ النشر</div>
              <div class="meta-value">{{ article.date }}</div>
            </div>
          </div>
          
          <div class="meta-item">
            <div class="meta-icon category">
              <i class="fas fa-folder"></i>
            </div>
            <div>
              <div class="meta-label">الفئة</div>
              <div class="meta-value">{{ article.category }}</div>
            </div>
          </div>
          
          <div class="meta-item">
            <div class="meta-icon reading-time">
              <i class="fas fa-clock"></i>
            </div>
            <div>
              <div class="meta-label">وقت القراءة</div>
              <div class="meta-value">{{ article.readingTime || '8 دقائق' }}</div>
            </div>
          </div>
          
          <div class="meta-item">
            <div class="meta-icon views">
              <i class="fas fa-eye"></i>
            </div>
            <div>
              <div class="meta-label">المشاهدات</div>
              <div class="meta-value">{{ article.views || '1,245' }}</div>
            </div>
          </div>
        </div>

        <div class="article-tags">
          <span v-for="tag in article.tags" :key="tag" class="tag">
            <i class="fas fa-tag"></i>
            {{ tag }}
          </span>
        </div>

        <div class="share-buttons">
          <button class="share-btn facebook" @click="shareOnFacebook">
            <i class="fab fa-facebook-f"></i>
            <span>شارك</span>
          </button>
          <button class="share-btn twitter" @click="shareOnTwitter">
            <i class="fab fa-twitter"></i>
            <span>غرد</span>
          </button>
          <button class="share-btn linkedin" @click="shareOnLinkedIn">
            <i class="fab fa-linkedin-in"></i>
            <span>شارك</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main class="main-content">
      <!-- Article Content -->
      <div class="section-card">
        <h2 class="section-title">
          <i class="fas fa-align-left"></i>
          مقدمة
        </h2>
        
        <div class="article-content">
          <p>{{ article.fullContent?.introduction || article.excerpt }}</p>
          
          <img :src="article.image" :alt="article.title" class="content-image">
          
          <div class="highlight-box" v-if="article.fullContent?.highlight">
            <p>
              <strong>الفكرة الأساسية:</strong> {{ article.fullContent.highlight }}
            </p>
          </div>

          <p v-if="article.fullContent?.introParagraph">
            {{ article.fullContent.introParagraph }}
          </p>
        </div>
      </div>

      <!-- Key Points Section -->
      <div class="section-card" v-if="article.fullContent?.keyPoints">
        <h2 class="section-title">
          <i class="fas fa-lightbulb"></i>
          النقاط الأساسية
        </h2>
        
        <ul class="content-list">
          <li v-for="point in article.fullContent.keyPoints" :key="point">{{ point }}</li>
        </ul>
      </div>

      <!-- Practical Tips Section -->
      <div class="section-card" v-if="article.fullContent?.tips">
        <h2 class="section-title">
          <i class="fas fa-star"></i>
          نصائح عملية
        </h2>
        
        <div class="tips-grid">
          <div 
            v-for="(tip, index) in article.fullContent.tips" 
            :key="index" 
            :class="['tip-card', `tip-card-${(index % 4) + 1}`]"
          >
            <div class="tip-header">
              <i class="fas fa-check-circle tip-icon"></i>
              {{ tip.title }}
            </div>
            <p class="tip-description">{{ tip.description }}</p>
          </div>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="section-card" v-if="article.fullContent?.stats">
        <h2 class="section-title">
          <i class="fas fa-chart-bar"></i>
          أهمية الموضوع
        </h2>

        <div class="stats-grid">
          <div v-for="(stat, index) in article.fullContent.stats" :key="index" class="stats-card">
            <div :class="['stats-value', index % 2 === 0 ? 'stats-value-primary' : 'stats-value-secondary']">
              {{ stat.value }}
            </div>
            <div class="stats-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- Author Section -->
      <div class="section-card">
        <h2 class="section-title">
          <i class="fas fa-user-circle"></i>
          عن الكاتب
        </h2>

        <div class="author-card">
          <img :src="article.author.avatar" :alt="article.author.name" class="author-avatar">
          <div class="author-name">{{ article.author.name }}</div>
          <div class="author-title">{{ article.author.title || 'متخصص في الصحة النفسية' }}</div>
          <div class="author-bio">
            {{ article.author.bio || 'خبير في مجال الصحة النفسية والعلاقات الإنسانية، يهدف إلى تقديم محتوى عملي يساعد الأفراد على تحسين جودة حياتهم وبناء علاقات صحية.' }}
          </div>
        </div>
      </div>

      <!-- Related Articles Section -->
      <div class="section-card" v-if="relatedArticles.length > 0">
        <h2 class="section-title">
          <i class="fas fa-link"></i>
          مقالات ذات صلة
        </h2>

        <div class="related-articles">
          <div v-for="relatedArticle in relatedArticles" :key="relatedArticle.id" class="related-card">
            <img :src="relatedArticle.image" :alt="relatedArticle.title" class="related-image">
            <div class="related-content">
              <div class="related-title">{{ relatedArticle.title }}</div>
              <div class="related-excerpt">{{ relatedArticle.excerpt }}</div>
              <button class="read-btn" @click="goToArticle(relatedArticle.id)">
                <span>اقرأ المزيد</span>
                <i class="fas fa-arrow-left"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { articles } from './articles-data.js'

export default {
  name: 'ArticleDetailContent',
  props: {
    articleId: {
      type: [String, Number],
      required: true
    }
  },
  computed: {
    article() {
      return this.findArticleById(this.articleId) || this.getDefaultArticle()
    },
    relatedArticles() {
      return articles
        .filter(a => a.id !== this.article.id && a.category === this.article.category)
        .slice(0, 3)
    }
  },
  methods: {
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
        author: {
          name: 'غير معروف',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
        },
        tags: ['غير مصنف']
      }
    },
    goBack() {
      this.$router.push('/article')
    },
    goToArticle(id) {
      this.$router.push(`/article/${id}`)
    },
    shareOnFacebook() {
      const url = encodeURIComponent(window.location.href)
      const title = encodeURIComponent(this.article.title)
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`, '_blank')
    },
    shareOnTwitter() {
      const url = encodeURIComponent(window.location.href)
      const text = encodeURIComponent(this.article.title)
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank')
    },
    shareOnLinkedIn() {
      const url = encodeURIComponent(window.location.href)
      const title = encodeURIComponent(this.article.title)
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
    }
  }
}
</script>

<style scoped>
/* إضافة الأنماط الجديدة هنا */

/* Tips Grid */
.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.tip-card {
  padding: 1.5rem;
  border-radius: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.tip-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.tip-header {
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tip-icon {
  font-size: 1.1rem;
}

.tip-description {
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

/* Tip Card Colors */
.tip-card-1 {
  background: linear-gradient(135deg, #f0f9f0 0%, #e8f5e8 100%);
  border-right: 4px solid #10b981;
}

.tip-card-1 .tip-header {
  color: #065f46;
}

.tip-card-1 .tip-icon {
  color: #10b981;
}

.tip-card-2 {
  background: linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%);
  border-right: 4px solid #3b82f6;
}

.tip-card-2 .tip-header {
  color: #1e40af;
}

.tip-card-2 .tip-icon {
  color: #3b82f6;
}

.tip-card-3 {
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  border-right: 4px solid #8b5cf6;
}

.tip-card-3 .tip-header {
  color: #6b21a8;
}

.tip-card-3 .tip-icon {
  color: #8b5cf6;
}

.tip-card-4 {
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
  border-right: 4px solid #ec4899;
}

.tip-card-4 .tip-header {
  color: #9d174d;
}

.tip-card-4 .tip-icon {
  color: #ec4899;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.stats-value {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.stats-value-primary {
  color: #9EBF3B;
}

.stats-value-secondary {
  color: #D6A29A;
}

.stats-label {
  color: #6b7280;
}

/* باقي الأنماط الموجودة سابقاً تبقى كما هي */
.hero-section {
  background: linear-gradient(135deg, rgba(214, 162, 154, 0.15) 0%, rgba(158, 191, 59, 0.15) 100%);
  position: relative;
  overflow: hidden;
  padding: 40px 0 60px 0;
  min-height: 280px;
  display: flex;
  align-items: center;
}


.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 30% 70%, rgba(158, 191, 59, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 30%, rgba(214, 162, 154, 0.1) 0%, transparent 50%);
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 20s infinite linear;
}

.shape-1 {
  width: 80px;
  height: 80px;
  background: #9EBF3B;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 60px;
  height: 60px;
  background: #D6A29A;
  top: 60%;
  left: 85%;
  animation-delay: -5s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  background: #9EBF3B;
  top: 40%;
  left: 75%;
  animation-delay: -10s;
}

@keyframes float {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-15px) rotate(180deg);
  }
  100% {
    transform: translateY(0) rotate(360deg);
  }
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.75rem;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.1rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;
}

/* Article Header Container */
.article-header-container {
  display: flex;
  justify-content: center;
  margin-top: -50px;
  margin-bottom: 2rem;
  position: relative;
  z-index: 20;
}

.article-hero-card {
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  width: 90%;
  margin: 0 auto;
}

.article-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 1.5rem;
  line-height: 1.3;
  text-align: center;
}

.article-meta-row {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.meta-label {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 600;
}

.meta-value {
  font-size: 0.9rem;
  color: #1f2937;
  font-weight: 700;
}

.meta-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.meta-icon.date {
  background-color: rgba(158, 191, 59, 0.15);
  color: #9EBF3B;
}

.meta-icon.category {
  background-color: rgba(214, 162, 154, 0.15);
  color: #D6A29A;
}

.meta-icon.reading-time {
  background-color: rgba(158, 191, 59, 0.15);
  color: #9EBF3B;
}

.meta-icon.views {
  background-color: rgba(214, 162, 154, 0.15);
  color: #D6A29A;
}

.article-tags {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(158, 191, 59, 0.1);
  color: #9EBF3B;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.tag:hover {
  background-color: rgba(158, 191, 59, 0.2);
  transform: translateY(-2px);
}

/* Main Content with Consistent Spacing */
.main-content {
  padding: 1rem 0 3rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.section-card {
  background: white;
  border-radius: 1.25rem;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
  max-width: 1000px;
  width: 90%;
  margin: 0 auto;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title i {
  color: #9EBF3B;
  font-size: 1.25rem;
}

.article-content {
  font-size: 1.05rem;
  line-height: 1.7;
  color: #4b5563;
}

.article-content p {
  margin-bottom: 1.25rem;
}

.content-list {
  list-style: none;
  padding: 0;
}

.content-list li {
  padding: 0.75rem 0;
  padding-right: 2rem;
  position: relative;
  color: #4b5563;
  line-height: 1.7;
  font-size: 1.05rem;
}

.content-list li:before {
  content: '✓';
  position: absolute;
  right: 0;
  color: #9EBF3B;
  font-weight: bold;
  font-size: 1.25rem;
}

.author-card {
  background: linear-gradient(135deg, rgba(158, 191, 59, 0.05) 0%, rgba(214, 162, 154, 0.05) 100%);
  border-radius: 1.25rem;
  padding: 1.75rem;
  text-align: center;
  transition: all 0.3s ease;
}

.author-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.author-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto 1.25rem;
  border: 3px solid white;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  object-fit: cover;
}

.author-name {
  font-size: 1.35rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.author-title {
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.author-bio {
  font-size: 0.95rem;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

.related-articles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.related-card {
  background: white;
  border-radius: 1.25rem;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  position: relative;
}

.related-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.related-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.related-card:hover .related-image {
  transform: scale(1.03);
}

.related-content {
  padding: 1.5rem;
}

.related-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.related-excerpt {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 1.25rem;
  line-height: 1.5;
}

.read-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #9EBF3B;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  padding: 0.6rem 1.25rem;
  border-radius: 50px;
  background-color: rgba(158, 191, 59, 0.1);
}

.read-btn:hover {
  gap: 0.75rem;
  background-color: rgba(158, 191, 59, 0.2);
  transform: translateX(-3px);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #9EBF3B;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 50px;
  background-color: rgba(158, 191, 59, 0.1);
}

.back-btn:hover {
  gap: 0.75rem;
  background-color: rgba(158, 191, 59, 0.2);
}

.highlight-box {
  background: linear-gradient(135deg, rgba(158, 191, 59, 0.1) 0%, rgba(214, 162, 154, 0.1) 100%);
  border-right: 4px solid #9EBF3B;
  padding: 1.5rem;
  border-radius: 0.875rem;
  margin: 1.5rem 0;
}

.highlight-box p {
  margin: 0;
  color: #4b5563;
  line-height: 1.7;
  font-size: 1.05rem;
}

.stats-card {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 0.875rem;
  padding: 1.25rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  text-align: center;
}

.stats-card:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.text-primary {
  color: #9EBF3B;
}

.text-secondary {
  color: #D6A29A;
}

.content-image {
  width: 100%;
  border-radius: 0.875rem;
  margin: 1.5rem 0;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.share-buttons {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.share-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.share-btn.facebook {
  background-color: rgba(59, 89, 152, 0.1);
  color: #3b5998;
}

.share-btn.twitter {
  background-color: rgba(29, 161, 242, 0.1);
  color: #1da1f2;
}

.share-btn.linkedin {
  background-color: rgba(0, 119, 181, 0.1);
  color: #0077b5;
}

.share-btn:hover {
  transform: translateY(-2px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .hero-section {
    padding: 30px 0 40px 0;
    min-height: 220px;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .article-hero-card {
    padding: 1.5rem;
    margin-top: -30px;
  }
  
  .article-title {
    font-size: 1.75rem;
  }
  
  .article-meta-row {
    gap: 1rem;
  }
  
  .meta-item {
    flex-direction: column;
    text-align: center;
    gap: 0.25rem;
  }
  
  .section-card {
    padding: 1.5rem;
  }
  
  .main-content {
    gap: 1rem;
    padding: 0.5rem 0 2rem 0;
  }
}
</style>