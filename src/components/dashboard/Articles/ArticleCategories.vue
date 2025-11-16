<template>
  <div class="space-y-4 p-2 sm:p-4">
    <!-- العنوان والأزرار -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl font-semibold text-primary">تصنيفات المقالات</h1>
        <p class="text-sm text-secondary mt-1">إدارة التصنيفات والمجالات</p>
      </div>
      <Button variant="primary" @click="handleCreate" class="w-full sm:w-auto">
        <PlusIcon class="h-4 w-4 mr-2" />
        إضافة تصنيف
      </Button>
    </div>

    <!-- رسائل التنبيه -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
      {{ successMessage }}
    </div>

    <!-- البحث والتصفية -->
    <Card>
      <template #header>
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div class="text-base sm:text-lg">قائمة التصنيفات</div>
          <div class="flex gap-2 w-full sm:w-auto">
            <div class="relative flex-1 sm:flex-none sm:w-64">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="ابحث عن تصنيف..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <Button @click="clearFilters" variant="outline" class="whitespace-nowrap">
              مسح الفلاتر
            </Button>
          </div>
        </div>
      </template>

      <!-- جدول التصنيفات -->
      <div class="overflow-x-auto">
        <table class="w-full min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                التصنيف
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الوصف
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                عدد المقالات
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="category in filteredCategories" 
              :key="category.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div 
                    class="w-4 h-4 rounded-full flex-shrink-0 mr-3"
                    :style="{ backgroundColor: category.color || '#6b7280' }"
                  ></div>
                  <div class="text-right">
                    <div class="text-sm font-medium text-gray-900">{{ category.name_ar }}</div>
                    <div class="text-sm text-gray-500">{{ category.name_en }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 max-w-xs truncate">
                  {{ category.description_ar || 'لا يوجد وصف' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {{ getArticlesCount(category.id) }} مقال
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex gap-2 justify-end">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    @click="handleEdit(category)"
                    class="text-xs"
                  >
                    تعديل
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    @click="handleDelete(category.id)"
                    class="text-xs text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                  >
                    حذف
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- لا توجد تصنيفات -->
      <div 
        v-if="!loading && filteredCategories.length === 0" 
        class="text-center py-8 text-secondary"
      >
        <TagIcon class="h-16 w-16 mx-auto mb-4 text-secondary" />
        <h3 class="text-base sm:text-lg font-medium text-primary mb-2">لا توجد تصنيفات</h3>
        <p class="text-secondary mb-4 text-sm sm:text-base">
          {{ searchQuery ? 'لم نتمكن من العثور على تصنيفات مطابقة لبحثك' : 'لم تقم بإضافة أي تصنيفات بعد' }}
        </p>
        <Button @click="handleCreate" variant="outline" class="text-sm">
          إضافة تصنيف جديد
        </Button>
      </div>

      <!-- حالة التحميل -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    </Card>

    <!-- نموذج إنشاء/تعديل التصنيف -->
    <ArticleCategoryForm
      v-if="showForm"
      :category="editingCategory"
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
import { ref, computed, onMounted } from 'vue'
import { PlusIcon, MagnifyingGlassIcon, TagIcon } from '@heroicons/vue/24/outline'
import Button from '@/components/dashboard/component/ui/Button.vue'
import Card from '@/components/dashboard/component/ui/Card.vue'
import ArticleCategoryForm from './ArticleCategoryForm.vue'
import DeleteConfirmModal from '@/components/dashboard/events/DeleteConfirmModal.vue'
import { useArticleStore } from '@/stores/articles'
import type { ArticleCategory } from '@/types/article'

const articleStore = useArticleStore()

// البيانات التفاعلية
const loading = ref(false)
const showForm = ref(false)
const editingCategory = ref<ArticleCategory | null>(null)
const error = ref('')
const successMessage = ref('')
const showDeleteConfirm = ref(false)
const deleteTargetId = ref<string | null>(null)
const searchQuery = ref('')

// الحوسبة
const categories = computed(() => articleStore.categories)
const articles = computed(() => articleStore.articles)

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value
  
  const query = searchQuery.value.toLowerCase()
  return categories.value.filter(category => 
    category.name_ar?.toLowerCase().includes(query) ||
    category.name_en?.toLowerCase().includes(query) ||
    category.description_ar?.toLowerCase().includes(query) ||
    category.description_en?.toLowerCase().includes(query)
  )
})

// الدوال
const getArticlesCount = (categoryId: string) => {
  return articles.value.filter(article => article.category_id === categoryId).length
}

const clearFilters = () => {
  searchQuery.value = ''
}

const fetchData = async () => {
  loading.value = true
  error.value = ''
  try {
    await articleStore.fetchCategories()
    await articleStore.fetchArticles() // لمعرفة عدد المقالات في كل تصنيف
  } catch (err: any) {
    error.value = err.response?.data?.message || 'فشل في تحميل التصنيفات'
    console.error('Failed to fetch categories:', err)
  } finally {
    loading.value = false
  }
}

const handleCreate = () => {
  editingCategory.value = null
  showForm.value = true
}

const handleEdit = (category: ArticleCategory) => {
  editingCategory.value = { ...category }
  showForm.value = true
}

const handleDelete = async (categoryId: string) => {
  const articlesCount = getArticlesCount(categoryId)
  if (articlesCount > 0) {
    error.value = `لا يمكن حذف هذا التصنيف لأنه يحتوي على ${articlesCount} مقال. يرجى نقل المقالات أولاً.`
    return
  }
  
  deleteTargetId.value = categoryId
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!deleteTargetId.value) return

  loading.value = true
  error.value = ''
  
  try {
    // استخدم دالة الـ store مباشرة بدلاً من deleteCategory المحلية
    await articleStore.deleteCategory(deleteTargetId.value)
    successMessage.value = 'تم حذف التصنيف بنجاح'
    
    setTimeout(() => {
      successMessage.value = ''
    }, 2000)
    
    // إعادة تحميل البيانات
    await fetchData()
    
  } catch (err: any) {
    error.value = err.response?.data?.message || 'فشل في حذف التصنيف'
    console.error('Failed to delete category:', err)
  } finally {
    loading.value = false
    showDeleteConfirm.value = false
    deleteTargetId.value = null
  }
}

const handleSave = async () => {
  error.value = ''
  successMessage.value = 'تم حفظ التصنيف بنجاح'
  
  setTimeout(() => {
    successMessage.value = ''
  }, 2000)
  
  await fetchData()
  handleCancelForm()
}

const handleCancelForm = () => {
  showForm.value = false
  editingCategory.value = null
  error.value = '' 
}

// عند التحميل
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-neutral {
  background-color: rgb(254 249 195);
  color: rgb(113 63 18);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* تحسينات للجدول */
table {
  border-collapse: collapse;
  width: 100%;
}

th, td {
  text-align: right;
  padding: 12px 16px;
}

th {
  background-color: #f9fafb;
  font-weight: 600;
}

tr:nth-child(even) {
  background-color: #f8f9fa;
}
</style>