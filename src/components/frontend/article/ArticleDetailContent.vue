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
    <div class="bg-gray-50 border-b border-gray-200 py-4 mb-8">
      <div class="max-w-7xl mx-auto px-8">
        <div class="flex items-center gap-2 text-sm text-gray-500 mx-2">
          <span class="cursor-pointer transition-colors duration-300 hover:text-[#9EBF3B]" @click="goBack">{{ translate('breadcrumb.articles') }}</span>
          <i class="fas" :class="isRTL ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
          <span class="cursor-pointer transition-colors duration-300 hover:text-[#9EBF3B]">{{ article.category }}</span>
          <i class="fas" :class="isRTL ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
          <span class="text-[#9EBF3B] font-semibold" :id="`article-${article.id}`">{{ article.title }}</span>
        </div>
      </div>
    </div>

    <!-- Main Content Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 max-w-7xl mx-auto px-8 pb-8">
      <!-- Main Content - Article Details -->
      <main class="bg-white rounded-1xl p-8 shadow-lg border border-gray-100">
        <!-- Article Header with Title Above Image -->
        <div class="mb-8">
          <div class="mb-8 pb-6 border-b border-gray-200">
            <h1 class="text-3xl font-bold text-gray-800 leading-tight mb-4 scroll-mt-24">{{ article.title }}</h1>
            <div class="flex gap-6 text-sm text-gray-500">
              <span class="flex items-center gap-2">
                <i class="fas fa-calendar-alt text-[#9EBF3B]"></i>
                {{ article.date }}
              </span>
              <span class="flex items-center gap-2 mr-2">
                <i class="fas fa-clock text-[#9EBF3B]"></i>
                {{ translate('article.readingTime') }}: {{ article.readingTime || '5 دقائق' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Featured Image -->
        <div class="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
          <img :src="article.image" :alt="article.title" class="w-full h-96 object-cover">
          <div class="absolute top-4 right-4">
            <div class="bg-[#9EBF3B] text-white px-3 py-1 rounded text-xs font-semibold">{{ article.category }}</div>
          </div>
        </div>

        <!-- Article Content -->
        <div class="mt-8">
          <!-- Author Info -->
          <div class="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
            <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-[#9EBF3B]">
              <img :src="article.author.avatar" :alt="article.author.name" class="w-full h-full object-cover">
            </div>
            <div class="flex-1">
              <h3 class="text-base font-semibold text-gray-800 mb-1">{{ article.author.name }}</h3>
              <p class="text-sm text-[#9EBF3B] m-0">{{ article.author.title }}</p>
            </div>
            <button class="bg-gray-50 border border-gray-200 rounded-full px-4 py-2 cursor-pointer transition-all duration-300 flex items-center gap-2 text-gray-500 hover:bg-gray-100 hover:border-pink-400" @click="toggleLike">
              <i class="fas fa-heart transition-colors duration-300" :class="{ 'text-red-500': isLiked }"></i>
              <span>{{ likeCount }}</span>
            </button>
          </div>

          <!-- Article Text Content -->
          <div class="mb-8">
            <!-- Introduction -->
            <section class="pb-8 border-b border-gray-200" v-if="article.fullContent?.introduction">
              <div>
                <p class="text-base leading-relaxed text-gray-700 font-medium mb-6">{{ article.fullContent.introduction }}</p>
              </div>
            </section>

            <!-- Main Content -->
            <section class="pb-8 border-b border-gray-200" v-if="article.fullContent?.content">
              <div class="text-gray-600 leading-loose" v-html="article.fullContent.content"></div>
            </section>

            <!-- Article Attachments -->
            <section class="pb-8 border-b border-gray-200" v-if="article.fullContent?.attachments && article.fullContent.attachments.length > 0">
              <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <i class="fas fa-paperclip text-[#9EBF3B]"></i>
                {{ translate('attachments.title') }}
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="attachment in article.fullContent.attachments" 
                  :key="attachment.id"
                  class="bg-gray-50 rounded-xl p-4 cursor-pointer transition-all duration-300 border border-gray-200 flex items-center gap-4 hover:bg-white hover:shadow-md hover:-translate-y-1 hover:border-[#9EBF3B]"
                  @click="openAttachment(attachment)"
                >
                  <div class="w-10 h-10 rounded-full bg-[#9EBF3B] text-white flex items-center justify-center text-base flex-shrink-0">
                    <i :class="getAttachmentIcon(attachment.type)"></i>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-sm font-semibold text-gray-800 mb-1">{{ attachment.title }}</h4>
                    <span class="text-xs text-gray-500">{{ getAttachmentTypeText(attachment.type) }}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- Test Button Section -->
           <section class="bg-gradient-to-br from-[#9EBF3B] to-[#7CA52D] rounded-3xl p-6 md:p-10 mt-8 relative overflow-hidden">
              <div class="absolute inset-0 opacity-30"></div>
              <div class="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 relative z-10">
                <!-- الجزء الأيسر: المحتوى -->
                <div class="flex items-center gap-4 lg:gap-6 flex-1 w-full lg:w-auto">
                  <!-- الأيقونة -->
                  <div class="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-xl lg:text-2xl text-white border-2 border-white/30 flex-shrink-0">
                    <i class="fas fa-brain"></i>
                  </div>
                  
                  <!-- النص -->
                  <div class="flex-1 min-w-0">
                    <h3 class="text-lg lg:text-xl font-bold text-white mb-2">{{ translate('testSection.title') }}</h3>
                    <p class="text-sm text-white/90 leading-normal m-0 line-clamp-2">
                      {{ translate('testSection.description') }}
                    </p>
                  </div>
                </div>
                
                <!-- الزر - الآن يأتي أسفل المحتوى على الشاشات الصغيرة -->
                <button class="bg-white text-[#9EBF3B] border-none px-6 py-3 lg:px-8 lg:py-4 rounded-full font-bold text-sm lg:text-base cursor-pointer transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:-translate-y-1 hover:shadow-xl hover:gap-4 active:-translate-y-0.5 whitespace-nowrap w-full lg:w-auto order-first lg:order-last">
                  <span>{{ translate('testSection.startButton') }}</span>
                  <i class="fas" :class="isRTL ? 'fa-arrow-left' : 'fa-arrow-right'"></i>
                </button>
              </div>
            </section>
        </div>
      </main>

      <!-- Right Sidebar - Related Articles -->
 <aside class="sticky top-8 h-fit lg:order-2 order-1">
    <div class="bg-white rounded-1xl p-6 shadow-lg border border-gray-100">
      <h3 class="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
        <i class="fas fa-link text-[#9EBF3B]"></i>
        {{ translate('sidebar.relatedArticles') }}
      </h3>
      
      <div class="flex flex-col gap-4">
        <div 
          v-for="relatedArticle in relatedArticles" 
          :key="relatedArticle.id" 
          class="flex items-center gap-4 p-3 cursor-pointer transition-all duration-300 rounded-xl hover:bg-gray-50 hover:translate-x-1"
          @click="goToArticle(relatedArticle.id)"
        >
          <!-- الصورة الدائرية -->
          <div class="flex-shrink-0">
            <div class="w-14 h-14 rounded-full overflow-hidden border-2 border-[#9EBF3B]">
              <img 
                :src="relatedArticle.image" 
                :alt="relatedArticle.title" 
                class="w-full h-full object-cover"
              >
            </div>
          </div>
          
          <!-- المحتوى النصي -->
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-semibold text-gray-800 mb-1 leading-tight line-clamp-2">
              {{ relatedArticle.title }}
            </h4>
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <i class="fas fa-calendar-alt text-[#9EBF3B]"></i>
              <span>{{ relatedArticle.date }}</span>
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
      return this.translate(`attachments.types.${type}`) || this.translate('attachments.types.document')
    },
    startTest() {
      alert(`${this.translate('testSection.startButton')}: ${this.article.category}`)
    },
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