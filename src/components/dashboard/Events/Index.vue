<template>
  <div class="space-y-4 p-2 sm:p-4">
    <!-- العنوان والأزرار -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div>
        <h1 class="text-xl sm:text-2xl font-semibold text-primary">الفعاليات</h1>
      </div>
      <Button variant="primary" @click="showCreateForm = true" class="w-full sm:w-auto">
        إضافة فعالية
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
      :category-filter="categoryFilter"
      :status-filter="statusFilter"
      @update:searchQuery="searchQuery = $event"
      @update:categoryFilter="categoryFilter = $event"
      @update:statusFilter="statusFilter = $event"
      @clear="clearFilters"
    />

    <!-- جدول الفعاليات -->
    <Card>
      <template #header>
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div class="text-base sm:text-lg">قائمة الفعاليات</div>
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
                <th class="px-2 sm:px-4 py-3 text-start font-medium text-xs sm:text-sm">الفعالية</th>
                <th class="px-2 sm:px-4 py-3 text-start font-medium text-xs sm:text-sm hidden sm:table-cell">النوع</th>
                <th class="px-2 sm:px-4 py-3 text-start font-medium text-xs sm:text-sm">التاريخ</th>
                <th class="px-2 sm:px-4 py-3 text-start font-medium text-xs sm:text-sm hidden md:table-cell">الموقع</th>
                <th class="px-2 sm:px-4 py-3 text-start font-medium text-xs sm:text-sm">الحالة</th>
                <th class="px-2 sm:px-4 py-3 text-start font-medium text-xs sm:text-sm">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(event, index) in paginatedEvents" 
                :key="event.id" 
                class="border-t border-primary hover:bg-secondary transition-colors"
              >
                <!-- ترقيم الفعاليات -->
                <td class="px-2 sm:px-4 py-3 text-primary font-medium text-xs sm:text-sm text-center">
                  {{ startIndex + index + 1 }}
                </td>
                
                <!-- معلومات الفعالية -->
                <td class="px-2 sm:px-4 py-3 text-primary">
                  <div class="flex items-center gap-3">
                    <img 
                      v-if="event.image" 
                      :src="event.image" 
                      :alt="event.title_ar"
                      class="w-10 h-10 rounded-lg object-cover"
                    >
                    <div v-else class="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                      <CalendarIcon class="h-5 w-5 text-gray-500" />
                    </div>
                    <div class="flex flex-col">
                      <span class="font-medium text-primary">{{ event.title_ar }}</span>
                      <span class="text-xs text-secondary sm:hidden mt-1">{{ getTypeLabel(event.type) }}</span>
                    </div>
                  </div>
                </td>
                
                <!-- النوع -->
                <td class="px-2 sm:px-4 py-3 text-primary text-xs sm:text-sm hidden sm:table-cell">
                  <span class="badge badge-neutral">{{ getTypeLabel(event.type) }}</span>
                </td>
                
                <!-- التاريخ -->
                <td class="px-2 sm:px-4 py-3 text-primary text-xs sm:text-sm">
                  <div>{{ formatDate(event.date) }}</div>
                  <div v-if="event.time" class="text-xs text-secondary">{{ event.time }}</div>
                </td>
                
                <!-- الموقع -->
                <td class="px-2 sm:px-4 py-3 text-primary text-xs sm:text-sm hidden md:table-cell">
                  {{ event.location_ar }}
                </td>
                
                <!-- الحالة -->
                <td class="px-2 sm:px-4 py-3 text-xs sm:text-sm">
                  <span :class="['badge', event.is_published ? 'badge-brand' : 'badge-neutral']">
                    {{ event.is_published ? 'منشور' : 'مسودة' }}
                  </span>
                </td>
                
                <!-- الإجراءات -->
                <td class="px-2 sm:px-4 py-3">
                  <div class="flex gap-1 sm:gap-2 flex-wrap">
                    <Button size="sm" variant="outline" @click="handleEdit(event)" class="text-xs px-2 py-1">
                      تعديل
                    </Button>
                    <button 
                      @click="handleTogglePublish(event)" 
                      class="p-1 text-secondary hover:text-primary"
                      :title="event.is_published ? 'إلغاء النشر' : 'نشر'"
                    >
                      <EyeIcon v-if="event.is_published" class="h-4 w-4" />
                      <EyeSlashIcon v-else class="h-4 w-4" />
                    </button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      @click="handleDelete(event.id)" 
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

      <!-- لا توجد فعاليات -->
      <div 
        v-if="!loading && paginatedEvents.length === 0" 
        class="text-center py-8 text-secondary"
      >
        <CalendarIcon class="h-16 w-16 mx-auto mb-4 text-secondary" />
        <h3 class="text-base sm:text-lg font-medium text-primary mb-2">لا توجد فعاليات</h3>
        <p class="text-secondary mb-4 text-sm sm:text-base">لم نتمكن من العثور على فعاليات مطابقة لبحثك</p>
        <Button @click="showCreateForm = true" variant="outline" class="text-sm">
          إضافة فعالية جديدة
        </Button>
      </div>

      <!-- الترقيم -->
      <div v-if="!loading && paginatedEvents.length > 0" class="flex flex-col sm:flex-row items-center justify-center sm:justify-between px-4 py-3 border-t gap-3">
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

    <!-- نموذج إنشاء/تعديل الفعالية -->
    <EventForm
      v-if="showCreateForm || editingEvent"
      :event="editingEvent"
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
import { EyeIcon, EyeSlashIcon, TrashIcon, CalendarIcon } from '@heroicons/vue/24/outline'
import Button from '@/components/dashboard/component/ui/Button.vue'
import Card from '@/components/dashboard/component/ui/Card.vue'
import EventForm from './EventForm.vue'
import DeleteConfirmModal from './DeleteConfirmModal.vue'
import SearchFilters from './SearchFilters.vue'
import { useEventStore } from '@/stores/events'
import type { Event } from '@/types/event'

const eventStore = useEventStore()

// البيانات التفاعلية
const loading = ref(false)
const showCreateForm = ref(false)
const editingEvent = ref<Event | null>(null)
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
const events = computed(() => {
  return eventStore.events.map(event => ({
    ...event,
    is_published: publishStates.value[event.id] ?? event.is_published
  }))
})

// تصفية الفعاليات
const filteredEvents = computed(() => {
  return events.value.filter(event => {
    const matchesSearch = !searchQuery.value || 
      event.title_ar.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      event.title_en.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      event.description_ar.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      event.description_en.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesCategory = !categoryFilter.value || event.type === categoryFilter.value
    
    const matchesStatus = !statusFilter.value || 
      (statusFilter.value === 'active' && event.is_published) ||
      (statusFilter.value === 'inactive' && !event.is_published)
    
    return matchesSearch && matchesCategory && matchesStatus
  })
})

const totalPages = computed(() => Math.ceil(filteredEvents.value.length / itemsPerPage.value))

const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredEvents.value.slice(start, end)
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

const fetchEvents = async () => {
  loading.value = true
  error.value = ''
  try {
    await eventStore.fetchEvents()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'فشل في تحميل الفعاليات'
    console.error('Failed to fetch events:', err)
  } finally {
    loading.value = false
  }
}

const handleEdit = (event: Event) => {
  editingEvent.value = { ...event }
}

const handleDelete = async (eventId: string) => {
  deleteTargetId.value = eventId
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!deleteTargetId.value) return

  loading.value = true
  error.value = ''
  
  try {
    await eventStore.deleteEvent(deleteTargetId.value)
    delete publishStates.value[deleteTargetId.value]
    successMessage.value = 'تم حذف الفعالية بنجاح'
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
    
  } catch (err: any) {
    error.value = err.response?.data?.message || 'فشل في حذف الفعالية'
    console.error('Failed to delete event:', err)
  } finally {
    loading.value = false
    showDeleteConfirm.value = false
    deleteTargetId.value = null
  }
}

const handleTogglePublish = async (event: Event) => {
  loading.value = true
  error.value = ''
  
  const currentState = publishStates.value[event.id] ?? event.is_published
  const newState = !currentState
  
  try {
    publishStates.value[event.id] = newState
    
    const formData = new FormData()
    formData.append('is_published', newState ? '1' : '0')
    formData.append('_method', 'PUT')

    await eventStore.updateEvent(event.id, formData)
    
    successMessage.value = newState ? 'تم نشر الفعالية بنجاح' : 'تم إلغاء نشر الفعالية'
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
    
  } catch (err: any) {
    error.value = err.response?.data?.message || 'فشل في تحديث حالة الفعالية'
    console.error('Failed to toggle publish:', err)
    
    delete publishStates.value[event.id]
  } finally {
    loading.value = false
  }
}

const handleSave = async () => {
  error.value = ''
  successMessage.value = 'تم حفظ الفعالية بنجاح'
  
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
  
  await fetchEvents()
  handleCancelForm()
}

const handleCancelForm = () => {
  showCreateForm.value = false
  editingEvent.value = null
}

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

const getTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    'أمسيات': 'أمسيات',
    'ورش عمل': 'ورش عمل', 
    'فعاليات': 'فعاليات',
    'ندوات': 'ندوات'
  }
  return typeMap[type] || type
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

// عند التحميل
onMounted(() => {
  fetchEvents()
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

/* تحسين التمرير للأزرار في الجوال */
.max-w-\[200px\] {
  max-width: 200px;
}
</style>