<template>
  <div v-cloak>
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-[#9EBF3B]"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-20">
      <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
      <h3 class="text-xl font-bold text-gray-800 mb-2">خطأ في تحميل المقال</h3>
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <button @click="fetchArticle" class="bg-[#9EBF3B] text-white px-6 py-2 rounded-lg hover:bg-[#8CAF2B]">
        إعادة المحاولة
      </button>
    </div>

    <!-- Content -->
    <div v-else>
      <!-- Hero Section -->
      <Hero
        :title="article.title"
        :subtitle="article.excerpt"
        :buttons="heroButtons"
        @cta="handleHeroCta"
      />

      <!-- Breadcrumb Outside Main Layout -->
      <div class="bg-gray-50 border-b border-gray-200 py-4 mb-8">
        <div class="max-w-7xl mx-auto px-8">
          <div class="flex items-center gap-2 text-sm text-gray-500 mx-2">
            <span class="cursor-pointer transition-colors duration-300 hover:text-[#9EBF3B]" @click="goBack">{{ translate('breadcrumb.articles') }}</span>
            <i class="fas" :class="isRTL ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
            <span class="cursor-pointer transition-colors duration-300 hover:text-[#9EBF3B]">{{ article.category?.name }}</span>
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
                  {{ formatDate(article.published_at) }}
                </span>
                <span class="flex items-center gap-2 mr-2">
                  <i class="fas fa-clock text-[#9EBF3B]"></i>
                  {{ translate('article.readingTime') }}: {{ calculateReadingTime(article.content) }}
                </span>
                <span class="flex items-center gap-2 mr-2">
                  <i class="fas fa-eye text-[#9EBF3B]"></i>
                  {{ article.views || 0 }} {{ translate('article.views') }}
                </span>
              </div>
            </div>
          </div>

          <!-- Featured Image -->
          <div class="relative rounded-2xl overflow-hidden mb-8 shadow-lg" v-if="article.image">
            <img :src="article.image" :alt="article.title" class="w-full h-96 object-cover">
            <div class="absolute top-4 right-4">
              <div class="bg-[#9EBF3B] text-white px-3 py-1 rounded text-xs font-semibold">{{ article.category?.name }}</div>
            </div>
          </div>

          <!-- Article Content -->
          <div class="mt-8">
            <!-- Author Info -->
            <div class="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200" v-if="article.author">
              <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-[#9EBF3B]">
                <img 
                  :src="article.author.avatar || getDefaultAvatar()" 
                  :alt="article.author.name" 
                  class="w-full h-full object-cover"
                >
              </div>
              <div class="flex-1">
                <h3 class="text-base font-semibold text-gray-800 mb-1">{{ article.author.name }}</h3>
                <p class="text-sm text-[#9EBF3B] m-0">{{ article.author.title || 'كاتب المقال' }}</p>
              </div>
              <button class="bg-gray-50 border border-gray-200 rounded-full px-4 py-2 cursor-pointer transition-all duration-300 flex items-center gap-2 text-gray-500 hover:bg-gray-100 hover:border-pink-400" @click="toggleLike">
                <i class="fas fa-heart transition-colors duration-300" :class="{ 'text-red-500': isLiked }"></i>
                <span>{{ likeCount }}</span>
              </button>
            </div>

            <!-- Article Text Content -->
            <div class="mb-8">
              <!-- Introduction -->
              <section class="pb-8 border-b border-gray-200" v-if="article.introduction">
                <div>
                  <p class="text-base leading-relaxed text-gray-700 font-medium mb-6">{{ article.introduction }}</p>
                </div>
              </section>

              <!-- Main Content -->
              <section class="pb-8 border-b border-gray-200" v-if="article.content">
                <div class="text-gray-600 leading-loose" v-html="formatContent(article.content)"></div>
              </section>

              <!-- Article Attachments -->
              <section class="pb-8 border-b border-gray-200" v-if="article.attachments && article.attachments.length > 0">
                <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <i class="fas fa-paperclip text-[#9EBF3B]"></i>
                  {{ translate('attachments.title') }}
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    v-for="attachment in article.attachments" 
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
                <button 
                  @click="startTest"
                  class="bg-white text-[#9EBF3B] border-none px-6 py-3 lg:px-8 lg:py-4 rounded-full font-bold text-sm lg:text-base cursor-pointer transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:-translate-y-1 hover:shadow-xl hover:gap-4 active:-translate-y-0.5 whitespace-nowrap w-full lg:w-auto order-first lg:order-last"
                >
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
                    <span>{{ formatDate(relatedArticle.published_at) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script>
import Hero from '@/components/frontend/layouts/hero.vue'
import { useTranslations } from '@/composables/useTranslations'
import { inject, ref, computed, onMounted, watch } from 'vue'
import api from '@/utils/api'

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
  setup(props) {
    const { translate } = useTranslations()
    const { currentLanguage } = inject('languageState')
    
    const isRTL = ref(currentLanguage.value === 'ar')
    const loading = ref(false)
    const error = ref(null)
    const article = ref({})
    const relatedArticles = ref([])
    const isLiked = ref(false)
    const likeCount = ref(0)

    // مراقبة تغيير اللغة
    watch(currentLanguage, (newLang) => {
      isRTL.value = newLang === 'ar'
      fetchArticle()
      fetchRelatedArticles()
    })

    // جلب المقال الرئيسي
    const fetchArticle = async () => {
      loading.value = true
      error.value = null
      
      try {
        const response = await api.get(`/articles/${props.articleId}`, {
          params: {
            locale: currentLanguage.value
          }
        })
        
        article.value = response.data.data || response.data
      } catch (err) {
        console.error('Failed to fetch article:', err)
        error.value = 'فشل في تحميل المقال. يرجى المحاولة مرة أخرى.'
      } finally {
        loading.value = false
      }
    }

    // جلب المقالات ذات الصلة
    const fetchRelatedArticles = async () => {
      try {
        const response = await api.get('/articles', {
          params: {
            is_published: true,
            locale: currentLanguage.value,
            per_page: 4,
            exclude: props.articleId
          }
        })
        
        relatedArticles.value = response.data.data || []
      } catch (err) {
        console.error('Failed to fetch related articles:', err)
        relatedArticles.value = []
      }
    }

    // تنسيق المحتوى
    const formatContent = (content) => {
      if (!content) return ''
      
      // تحويل الأسطر الجديدة إلى فقرات
      return content.replace(/\n/g, '</p><p>').replace(/<p><\/p>/g, '')
    }

    // تنسيق التاريخ
    const formatDate = (dateString) => {
      if (!dateString) return ''
      
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('ar-EG', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      } catch (error) {
        return dateString
      }
    }

    // حساب وقت القراءة
    const calculateReadingTime = (content) => {
      if (!content) return '5 دقائق'
      
      const wordsPerMinute = 200
      const words = content.split(/\s+/).length
      const minutes = Math.ceil(words / wordsPerMinute)
      
      return `${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`
    }

    // الحصول على الصورة الافتراضية للمؤلف
    const getDefaultAvatar = () => {
      return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    }

    // أيقونة المرفقات
    const getAttachmentIcon = (type) => {
      const icons = {
        image: 'fas fa-image',
        video: 'fas fa-video',
        pdf: 'fas fa-file-pdf',
        document: 'fas fa-file-alt'
      }
      return icons[type] || 'fas fa-paperclip'
    }

    // نص نوع المرفق
    const getAttachmentTypeText = (type) => {
      return translate(`attachments.types.${type}`) || translate('attachments.types.document')
    }

    // فتح المرفق
    const openAttachment = (attachment) => {
      if (attachment.url) {
        window.open(attachment.url, '_blank')
      }
    }

    // زر الإعجاب
    const toggleLike = () => {
      isLiked.value = !isLiked.value
      likeCount.value += isLiked.value ? 1 : -1
    }

    // بدء الاختبار
    const startTest = () => {
      alert(`${translate('testSection.startButton')}: ${article.value.category?.name}`)
    }

    // أزرار الهيرو
    const heroButtons = computed(() => {
      return [
        {
          text: translate('buttons.startReading'),
          icon: 'fas fa-book-open',
          primary: true
        },
        {
          text: translate('buttons.relatedArticles'),
          icon: 'fas fa-link'
        }
      ]
    })

    // معالجة زر الهيرو
    const handleHeroCta = (btn) => {
      if (btn.text === translate('buttons.startReading')) {
        const articleElement = document.getElementById(`article-${article.value.id}`)
        if (articleElement) {
          articleElement.scrollIntoView({ behavior: 'smooth' })
        }
      } else if (btn.text === translate('buttons.relatedArticles')) {
        const sidebarElement = document.querySelector('.sidebar')
        if (sidebarElement) {
          sidebarElement.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    // العودة للخلف
    const goBack = () => {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/articles')
    }

    // الانتقال لمقال آخر
    const goToArticle = (id) => {
      this.$router.push(`/article/${id}`)
    }

    // جلب البيانات عند التحميل
    onMounted(() => {
      fetchArticle()
      fetchRelatedArticles()
    })

    return {
      translate,
      isRTL,
      loading,
      error,
      article,
      relatedArticles,
      isLiked,
      likeCount,
      heroButtons,
      formatContent,
      formatDate,
      calculateReadingTime,
      getDefaultAvatar,
      getAttachmentIcon,
      getAttachmentTypeText,
      openAttachment,
      toggleLike,
      startTest,
      handleHeroCta,
      goBack,
      goToArticle,
      fetchArticle
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

[v-cloak] {
  display: none;
}
</style>