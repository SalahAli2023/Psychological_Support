<template>
  <div class="space-y-4 p-2 sm:p-4">
    <!-- العنوان والأزرار -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl font-semibold text-primary">المقالات</h1>
        <p class="text-sm text-secondary mt-1">إدارة المقالات والمحتوى المنشور</p>
      </div>
      <Button variant="primary" @click="handleCreate" class="w-full sm:w-auto">
        <PlusIcon class="h-4 w-4 mr-2" />
        إضافة مقال
      </Button>
    </div>

    <!-- رسائل التنبيه -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
      {{ successMessage }}
    </div>
    
    <!-- أدوات البحث والتصفية -->
    <ArticleSearchFilters
      :search-query="searchQuery"
      :category-filter="categoryFilter"
      :status-filter="statusFilter"
      :filtered-articles="filteredArticles.length"
      @update:searchQuery="searchQuery = $event"
      @update:categoryFilter="categoryFilter = $event"
      @update:statusFilter="statusFilter = $event"
      @clear="clearFilters"
    />

    <!-- جدول المقالات -->
    <Card>
      <template #header>
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div class="text-base sm:text-lg">قائمة المقالات</div>
          <div class="text-sm text-secondary">
            الصفحة {{ currentPage }} من {{ totalPages }}
          </div>
        </div>
      </template>
      
      <div class="overflow-x-auto -mx-2 sm:mx-0">
        <div class="min-w-full inline-block align-middle">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="text-start text-secondary bg-secondary">
                <th class="px-2 sm:px-4 py-3 text-start font-medium text-xs sm:text-sm">#</th>
                <th class="px-2 sm:px-4 py-3 text-start font-medium text-xs sm:text-sm">المقال</th>
                <th class="px-2 sm:px-4 py-3 text-start font-medium text-xs sm:text-sm hidden sm:table-cell">التصنيف</th>
                <th class="px-2 sm:px-4 py-3 text-start font-medium text-xs sm:text-sm">تاريخ النشر</th>
                <th class="px-2 sm:px-4 py-3 text-start font-medium text-xs sm:text-sm hidden md:table-cell">المشاهدات</th>
                <th class="px-2 sm:px-4 py-3 text-start font-medium text-xs sm:text-sm">الحالة</th>
                <th class="px-2 sm:px-4 py-3 text-start font-medium text-xs sm:text-sm">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(article, index) in paginatedArticles" 
                :key="article.id" 
                class="border-t border-primary hover:bg-secondary transition-colors"
              >
                <!-- ترقيم المقالات -->
                <td class="px-2 sm:px-4 py-3 text-primary font-medium text-xs sm:text-sm text-center">
                  {{ startIndex + index + 1 }}
                </td>
                
                <!-- معلومات المقال -->
                <td class="px-2 sm:px-4 py-3 text-primary">
                  <div class="flex items-center gap-3">
                    <img 
                      v-if="article.image" 
                      :src="getImageUrl(article.image)" 
                      :alt="article.title_ar"
                      class="w-10 h-10 rounded-lg object-cover"
                      @error="handleImageError"
                    >
                    <div v-else class="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                      <DocumentTextIcon class="h-5 w-5 text-gray-500" />
                    </div>
                    <div class="flex flex-col">
                      <span class="font-medium text-primary">{{ article.title_ar }}</span>
                      <span class="text-xs text-secondary sm:hidden mt-1">{{ article.category?.name_ar }}</span>
                      <span class="text-xs text-secondary">{{ article.excerpt_ar?.substring(0, 50) }}...</span>
                    </div>
                  </div>
                </td>
                
                <!-- التصنيف -->
                <td class="px-2 sm:px-4 py-3 text-primary text-xs sm:text-sm hidden sm:table-cell">
                  <span class="badge badge-neutral">{{ article.category?.name_ar }}</span>
                </td>
                
                <!-- تاريخ النشر -->
                <td class="px-2 sm:px-4 py-3 text-primary text-xs sm:text-sm">
                  <div>{{ formatDate(article.published_at) }}</div>
                  <div class="text-xs text-secondary">{{ formatRelativeTime(article.published_at) }}</div>
                </td>
                
                <!-- المشاهدات -->
                <td class="px-2 sm:px-4 py-3 text-primary text-xs sm:text-sm hidden md:table-cell">
                  <div class="flex items-center gap-1">
                    <EyeIcon class="h-4 w-4 text-secondary" />
                    {{ article.views }}
                  </div>
                </td>
                
                <!-- الحالة -->
                <td class="px-2 sm:px-4 py-3 text-xs sm:text-sm">
                  <span :class="['badge', article.is_published ? 'badge-brand' : 'badge-neutral']">
                    {{ article.is_published ? 'منشور' : 'مسودة' }}
                  </span>
                </td>
                
                <!-- الإجراءات -->
                <td class="px-2 sm:px-4 py-3">
                  <div class="flex gap-1 sm:gap-2 flex-wrap">
                    <Button size="sm" variant="outline" @click="handleEdit(article)" class="text-xs px-2 py-1">
                      تعديل
                    </Button>
                    <button 
                      @click="handleTogglePublish(article)" 
                      class="p-1 text-secondary hover:text-primary"
                      :title="article.is_published ? 'إلغاء النشر' : 'نشر'"
                    >
                      <EyeIcon v-if="article.is_published" class="h-4 w-4" />
                      <EyeSlashIcon v-else class="h-4 w-4" />
                    </button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      @click="handleDelete(article.id)" 
                      class="text-xs px-2 py-1 text-accent-500 border-accent-500 hover:bg-accent-500 hover:text-white"
                    >
                      حذف
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- لا توجد مقالات -->
      <div 
        v-if="!loading && paginatedArticles.length === 0" 
        class="text-center py-8 text-secondary"
      >
        <DocumentTextIcon class="h-16 w-16 mx-auto mb-4 text-secondary" />
        <h3 class="text-base sm:text-lg font-medium text-primary mb-2">لا توجد مقالات</h3>
        <p class="text-secondary mb-4 text-sm sm:text-base">لم نتمكن من العثور على مقالات مطابقة لبحثك</p>
        <Button @click="handleCreate" variant="outline" class="text-sm">
          إضافة مقال جديد
        </Button>
      </div>

      <!-- الترقيم -->
      <div v-if="!loading && paginatedArticles.length > 0" class="flex flex-col sm:flex-row items-center justify-center sm:justify-between px-4 py-3 border-t gap-3">
        <!-- معلومات الصفحة للشاشات الصغيرة -->
        <div class="sm:hidden text-sm text-secondary text-center">
          الصفحة {{ currentPage }} من {{ totalPages }}
        </div>
        
        <div class="flex items-center gap-2 w-full sm:w-auto justify-center">
          <Button 
            @click="changePage(currentPage - 1)" 
            :disabled="currentPage === 1"
            variant="outline"
            size="sm"
            class="flex-1 sm:flex-none"
          >
            السابق
          </Button>
          
          <div class="flex gap-1 overflow-x-auto max-w-[200px] sm:max-w-none py-2">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="typeof page === 'number' && changePage(page)"
              :class="[
                'px-3 py-1 rounded text-sm min-w-[40px] flex-shrink-0',
                page === currentPage 
                  ? 'bg-primary text-white' 
                  : 'text-secondary hover:bg-gray-100',
                typeof page !== 'number' && 'cursor-default'
              ]"
              :disabled="typeof page !== 'number'"
            >
              {{ page }}
            </button>
          </div>

          <Button 
            @click="changePage(currentPage + 1)" 
            :disabled="currentPage === totalPages"
            variant="outline"
            size="sm"
            class="flex-1 sm:flex-none"
          >
            التالي
          </Button>
        </div>

        <!-- معلومات الصفحة للشاشات الكبيرة -->
        <div class="hidden sm:block text-sm text-secondary">
          الصفحة {{ currentPage }} من {{ totalPages }}
        </div>
      </div>

      <!-- حالة التحميل -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    </Card>

    <!-- نموذج إنشاء/تعديل المقال -->
		<ArticleForm
			v-if="showForm"
			:article="editingArticle"
			@save="handleSave"
			@cancel="handleCancelForm"
		/>


    <!-- تأكيد الحذف -->
    <DeleteConfirmModal
      :show="showDeleteConfirm"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { EyeIcon, EyeSlashIcon, DocumentTextIcon, PlusIcon } from '@heroicons/vue/24/outline'
import Button from '@/components/dashboard/component/ui/Button.vue'
import Card from '@/components/dashboard/component/ui/Card.vue'
import ArticleForm from './ArticleForm.vue'
import DeleteConfirmModal from '@/components/dashboard/events/DeleteConfirmModal.vue'
import ArticleSearchFilters from './ArticleSearchFilters.vue'
import { useArticleStore } from '@/stores/articles'
import type { Article } from '@/types/article'
import api from '@/utils/api'

const articleStore = useArticleStore()

// البيانات التفاعلية
const loading = ref(false)
const showForm = ref(false)

const editingArticle = ref<Article | null>(null)
const error = ref('')
const successMessage = ref('')
const showDeleteConfirm = ref(false)
const deleteTargetId = ref<string | null>(null)

// البحث والتصفية
const searchQuery = ref('')
const categoryFilter = ref('')
const statusFilter = ref('')

// الترقيم
const currentPage = ref(1)
const itemsPerPage = ref(10)

// استخدام ref منفصل لتتبع حالة النشر
const publishStates = ref<Record<string, boolean>>({})

// الحوسبة
const articles = computed(() => {
  return articleStore.articles.map(article => ({
    ...article,
    is_published: publishStates.value[article.id] ?? article.is_published
  }))
})

// تصفية المقالات - تم التصحيح هنا
const filteredArticles = computed(() => {
  return articles.value.filter(article => {
    const matchesSearch = !searchQuery.value || 
      article.title_ar?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      article.title_en?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      article.excerpt_ar?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      article.excerpt_en?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      article.content_ar?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      article.content_en?.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // التصحيح: تحويل categoryFilter إلى رقم للمقارنة
    const matchesCategory = !categoryFilter.value || 
      article.category_id?.toString() === categoryFilter.value
    
    const matchesStatus = !statusFilter.value || 
      (statusFilter.value === 'active' && article.is_published) ||
      (statusFilter.value === 'inactive' && !article.is_published)
    
    return matchesSearch && matchesCategory && matchesStatus
  })
})

const totalPages = computed(() => Math.ceil(filteredArticles.value.length / itemsPerPage.value))

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredArticles.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  return pages
})

// Watchers
watch([searchQuery, categoryFilter, statusFilter], () => {
  currentPage.value = 1
})

watch(itemsPerPage, () => {
  currentPage.value = 1
})

// الدوال
const clearFilters = () => {
  searchQuery.value = ''
  categoryFilter.value = ''
  statusFilter.value = ''
}

const fetchArticles = async () => {
  loading.value = true
  error.value = ''
  try {
    await articleStore.fetchArticles()
    await articleStore.fetchCategories()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'فشل في تحميل المقالات'
    console.error('Failed to fetch articles:', err)
  } finally {
    loading.value = false
  }
}

const handleCreate = () => {
  editingArticle.value = null
  showForm.value = true
}

const handleEdit = async (article: Article) => {
  try {
    console.log('🔄 جلب بيانات المقال الكاملة للتعديل...', article.id)
    
    // جلب البيانات الكاملة من API مع العلاقات
    const response = await api.get(`/articles/${article.id}?include=attachments,category,author,scaleCategory`)
    const fullArticle = response.data.data
    
    console.log('📦 بيانات المقال الكاملة:', fullArticle)
    console.log('📎 المرفقات في البيانات الكاملة:', fullArticle.attachments)
    
    editingArticle.value = { ...fullArticle }
    showForm.value = true
  } catch (error) {
    console.error('❌ فشل في جلب بيانات المقال:', error)
    console.log('🔄 استخدام البيانات الموجودة كبديل...')
    
    // استخدام البيانات الموجودة كبديل مع تحميل إضافي إذا لزم الأمر
    editingArticle.value = { ...article }
    showForm.value = true
  }
}

const handleDelete = async (articleId: string) => {
  deleteTargetId.value = articleId
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!deleteTargetId.value) return

  loading.value = true
  error.value = ''
  
  try {
    await articleStore.deleteArticle(deleteTargetId.value)
    delete publishStates.value[deleteTargetId.value]
    successMessage.value = 'تم حذف المقال بنجاح'
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
    
  } catch (err: any) {
    error.value = err.response?.data?.message || 'فشل في حذف المقال'
    console.error('Failed to delete article:', err)
  } finally {
    loading.value = false
    showDeleteConfirm.value = false
    deleteTargetId.value = null
  }
}

const getImageUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  if (path.startsWith('storage/')) return `/${path}`
  return `/storage/${path}`
}

const handleImageError = (event) => {
  console.error('خطأ في تحميل صورة المقال:', event.target.src)
  event.target.style.display = 'none'
}

const handleTogglePublish = async (article: Article) => {
  loading.value = true
  error.value = ''
  
  const currentState = publishStates.value[article.id] ?? article.is_published
  const newState = !currentState
  
  try {
    // تحديث الحالة محلياً أولاً
    publishStates.value[article.id] = newState
    
    const formData = new FormData()
    formData.append('is_published', newState ? '1' : '0')
    formData.append('_method', 'PUT')

    await articleStore.updateArticle(article.id, formData)
    
    successMessage.value = newState ? 'تم نشر المقال بنجاح' : 'تم إلغاء نشر المقال'
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
    
  } catch (err: any) {
    error.value = err.response?.data?.message || 'فشل في تحديث حالة المقال'
    console.error('Failed to toggle publish:', err)
    
    // التراجع عن التغيير في حالة الخطأ
    delete publishStates.value[article.id]
  } finally {
    loading.value = false
  }
}

const handleSave = async () => {
  error.value = ''
  successMessage.value = 'تم حفظ المقال بنجاح'
  
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
  
  await fetchArticles()
  handleCancelForm()
}

const handleCancelForm = () => {
  showForm.value = false
  editingArticle.value = null
}

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    return dateString
  }
}

const formatRelativeTime = (dateString: string) => {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'منذ يوم'
    if (diffDays < 7) return `منذ ${diffDays} أيام`
    if (diffDays < 30) return `منذ ${Math.ceil(diffDays / 7)} أسابيع`
    if (diffDays < 365) return `منذ ${Math.ceil(diffDays / 30)} أشهر`
    return `منذ ${Math.ceil(diffDays / 365)} سنوات`
  } catch (error) {
    return ''
  }
}

// عند التحميل
onMounted(() => {
  fetchArticles()
})
</script>

<style scoped>
.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-brand {
  background-color: rgb(220 252 231);
  color: rgb(22 101 52);
}

.badge-neutral {
  background-color: rgb(254 249 195);
  color: rgb(113 63 18);
}

/* تحسين مظهر الأرقام في الجدول */
td:first-child {
  font-weight: 600;
  color: #4b5563;
}

/* تخصيص شريط التمرير للجوال */
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>