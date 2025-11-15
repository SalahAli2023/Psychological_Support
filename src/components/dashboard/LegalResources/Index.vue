<template>
  <div class="space-y-4 p-2 sm:p-4">
    <!-- العنوان والأزرار -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl font-semibold text-primary">الموارد القانونية</h1>
      </div>
      <Button variant="primary" @click="showCreateForm = true" class="w-full sm:w-auto">
        <PlusIcon class="h-4 w-4 ml-2" />
        إضافة مورد جديد
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
    <SearchFilters
      :search-query="searchQuery"
      :type-filter="typeFilter"
      :category-filter="categoryFilter"
      :categories="categories"
      :filtered-count="filteredResources.length"
      @update:searchQuery="searchQuery = $event"
      @update:typeFilter="typeFilter = $event"
      @update:categoryFilter="categoryFilter = $event"
      @clear="clearFilters"
    />

    <!-- جدول الموارد -->
    <Card>
      <template #header>
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div class="text-base sm:text-lg">قائمة الموارد القانونية</div>
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
                <th class="px-2 sm:px-4 py-3 text-start font-medium text-xs sm:text-sm">رقم المادة</th>
                <th class="px-2 sm:px-4 py-3 text-start font-medium text-xs sm:text-sm">النص</th>
                <th class="px-2 sm:px-4 py-3 text-start font-medium text-xs sm:text-sm hidden sm:table-cell">نوع القانون</th>
                <th class="px-2 sm:px-4 py-3 text-start font-medium text-xs sm:text-sm">التصنيف</th>
                <th class="px-2 sm:px-4 py-3 text-start font-medium text-xs sm:text-sm">تاريخ الإضافة</th>
                <th class="px-2 sm:px-4 py-3 text-start font-medium text-xs sm:text-sm">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(resource, index) in paginatedResources" 
                :key="resource.id" 
                class="border-t border-primary hover:bg-secondary transition-colors"
              >
                <!-- ترقيم الموارد -->
                <td class="px-2 sm:px-4 py-3 text-primary font-medium text-xs sm:text-sm text-center">
                  {{ startIndex + index + 1 }}
                </td>
                
                <!-- رقم المادة -->
                <td class="px-2 sm:px-4 py-3 text-primary">
                  <div class="flex flex-col">
                    <span class="font-medium text-primary">{{ resource.article_number_ar }}</span>
                    <span class="text-xs text-secondary">{{ resource.article_number_en }}</span>
                  </div>
                </td>
                
                <!-- النص - 🔥 التحديث: استخدام truncateText بدلاً من النص الخام -->
                <td class="px-2 sm:px-4 py-3 text-primary">
                  <div class="max-w-xs">
                    <div class="text-primary mb-1" :title="stripHtml(resource.text_ar)">
                      {{ truncateText(resource.text_ar, 80) }}
                    </div>
                    <div class="text-xs text-secondary" :title="stripHtml(resource.text_en)">
                      {{ truncateText(resource.text_en, 80) }}
                    </div>
                  </div>
                </td>
                
                <!-- نوع القانون -->
                <td class="px-2 sm:px-4 py-3 text-primary text-xs sm:text-sm hidden sm:table-cell">
                  <span class="badge badge-neutral">{{ resource.law_type }}</span>
                </td>
                
                <!-- التصنيف -->
                <td class="px-2 sm:px-4 py-3 text-primary text-xs sm:text-sm">
                  <span class="badge badge-brand">{{ resource.category?.name || 'بدون تصنيف' }}</span>
                </td>
                
                <!-- تاريخ الإضافة -->
                <td class="px-2 sm:px-4 py-3 text-primary text-xs sm:text-sm">
                  {{ formatDate(resource.created_at) }}
                </td>
                
                <!-- الإجراءات -->
                <td class="px-2 sm:px-4 py-3">
                  <div class="flex gap-1 sm:gap-2 flex-wrap">
                    <Button size="sm" variant="outline" @click="handleEdit(resource)" class="text-xs px-2 py-1">
                      تعديل
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      @click="handleDelete(resource.id)" 
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

      <!-- لا توجد موارد -->
      <div 
        v-if="!loading && paginatedResources.length === 0" 
        class="text-center py-8 text-secondary"
      >
        <DocumentTextIcon class="h-16 w-16 mx-auto mb-4 text-secondary" />
        <h3 class="text-base sm:text-lg font-medium text-primary mb-2">لا توجد موارد قانونية</h3>
        <p class="text-secondary mb-4 text-sm sm:text-base">لم نتمكن من العثور على موارد مطابقة لبحثك</p>
        <Button @click="showCreateForm = true" variant="outline" class="text-sm">
          إضافة مورد جديد
        </Button>
      </div>

      <!-- الترقيم -->
      <div v-if="!loading && paginatedResources.length > 0" class="flex flex-col sm:flex-row items-center justify-center sm:justify-between px-4 py-3 border-t gap-3">
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

    <!-- نموذج إنشاء/تعديل المورد -->
    <LegalResourceForm
      v-if="showCreateForm || editingResource"
      :resource="editingResource"
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
import { ref, computed, watch, onMounted } from 'vue'
import { PlusIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'
import Button from '@/components/dashboard/component/ui/Button.vue'
import Card from '@/components/dashboard/component/ui/Card.vue'
import LegalResourceForm from './LegalResourceForm.vue'
import DeleteConfirmModal from './DeleteConfirmModal.vue'
import SearchFilters from './SearchFilters.vue'
import { useLegalResourceStore } from '@/stores/legalResources'

// استخدام المتجر
const legalResourceStore = useLegalResourceStore()

// البيانات التفاعلية
const loading = ref(false)
const showCreateForm = ref(false)
const editingResource = ref(null)
const error = ref('')
const successMessage = ref('')
const showDeleteConfirm = ref(false)
const deleteTargetId = ref(null)

// البحث والتصفية
const searchQuery = ref('')
const typeFilter = ref('')
const categoryFilter = ref('')

// 🔥 دالة لإزالة علامات HTML من النص
const stripHtml = (html) => {
  if (!html) return ''
  // إنشاء عنصر مؤقت
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html
  // إرجاع النص فقط بدون علامات HTML
  return tmp.textContent || tmp.innerText || ''
}

// 🔥 دالة لتقصير النص مع الحفاظ على الكلمات
const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  const cleanText = stripHtml(text)
  if (cleanText.length <= maxLength) return cleanText
  return cleanText.substring(0, maxLength) + '...'
}

// الحوسبة باستخدام بيانات المتجر
const resources = computed(() => legalResourceStore.resources)
const categories = computed(() => legalResourceStore.categories)
const currentPage = computed(() => legalResourceStore.currentPage)
const totalPages = computed(() => legalResourceStore.totalPages)
const itemsPerPage = computed({
  get: () => legalResourceStore.perPage,
  set: (value) => legalResourceStore.setPerPage(value)
})

// 🔥 إحصائيات حية
const stats = computed(() => {
  const totalResources = resources.value.length
  const lawTypes = [...new Set(resources.value.map(resource => resource.law_type))]
  const totalCategories = categories.value.length
  
  return {
    total_resources: totalResources,
    law_types_count: lawTypes.length,
    categories_count: totalCategories,
    updated_today: resources.value.filter(resource => {
      const updatedDate = new Date(resource.updated_at).toDateString()
      return updatedDate === new Date().toDateString()
    }).length
  }
})

const filteredResources = computed(() => {
  return resources.value.filter(resource => {
    // 🔥 البحث في النص بدون علامات HTML
    const cleanTextAr = stripHtml(resource.text_ar || '')
    const cleanTextEn = stripHtml(resource.text_en || '')
    
    const matchesSearch = !searchQuery.value || 
      cleanTextAr.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      cleanTextEn.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      resource.article_number_ar?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      resource.article_number_en?.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesType = !typeFilter.value || resource.law_type === typeFilter.value
    
    const matchesCategory = !categoryFilter.value || 
      resource.category_id?.toString() === categoryFilter.value
    
    return matchesSearch && matchesType && matchesCategory
  })
})

const paginatedResources = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredResources.value.slice(start, end)
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
watch([searchQuery, typeFilter, categoryFilter], () => {
  legalResourceStore.setPage(1)
})

watch(itemsPerPage, () => {
  legalResourceStore.setPage(1)
})

// الدوال
const clearFilters = () => {
  searchQuery.value = ''
  typeFilter.value = ''
  categoryFilter.value = ''
}

const fetchResources = async () => {
  loading.value = true
  error.value = ''
  try {
    await legalResourceStore.fetchResources()
  } catch (err) {
    error.value = 'فشل في تحميل الموارد القانونية'
    console.error('Failed to fetch resources:', err)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    await legalResourceStore.fetchCategories()
  } catch (err) {
    console.error('Failed to fetch categories:', err)
  }
}

const handleEdit = (resource) => {
  editingResource.value = { ...resource }
}

const handleDelete = async (resourceId) => {
  deleteTargetId.value = resourceId
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!deleteTargetId.value) return

  loading.value = true
  error.value = ''
  
  try {
    await legalResourceStore.deleteResource(deleteTargetId.value)
    successMessage.value = 'تم حذف المورد بنجاح'
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
    
  } catch (err) {
    error.value = 'فشل في حذف المورد'
    console.error('Failed to delete resource:', err)
  } finally {
    loading.value = false
    showDeleteConfirm.value = false
    deleteTargetId.value = null
  }
}

const handleSave = async () => {
  error.value = ''
  successMessage.value = 'تم حفظ المورد بنجاح'
  
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
  
  await fetchResources()
  handleCancelForm()
}

const handleCancelForm = () => {
  showCreateForm.value = false
  editingResource.value = null
}

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  legalResourceStore.setPage(page)
  fetchResources()
}

const formatDate = (dateString) => {
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

// عند التحميل
onMounted(() => {
  fetchResources()
  fetchCategories()
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

/* تحسين التمرير للأزرار في الجوال */
.max-w-\[200px\] {
  max-width: 200px;
}
</style>