<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold text-primary">الفعاليات</h1>
      <Button variant="primary" @click="showCreateForm = true">إضافة فعالية</Button>
    </div>
    
    <!-- رسائل الخطأ -->
    <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ error }}
    </div>

    <!-- رسائل النجاح -->
    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
      {{ successMessage }}
    </div>
    
    <Card>
      <template #header>الفعاليات</template>
      <div class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="text-start sm:text-start text-secondary">
              <th class="px-3 py-2 text-start">#</th>
              <th class="px-3 py-2 text-start">العنوان</th>
              <th class="px-3 py-2 text-start">النوع</th>
              <th class="px-3 py-2 text-start">التاريخ</th>
              <th class="px-3 py-2 text-start">الحالة</th>
              <th class="px-3 py-2 text-start">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(event, index) in events" :key="event.id" class="border-t border-primary">
              <!-- ترقيم الفعاليات -->
              <td class="px-3 py-2 text-primary font-medium text-center">
                {{ index + 1 }}
              </td>
              <td class="px-3 py-2 text-primary">{{ event.title_ar }}</td>
              <td class="px-3 py-2 text-primary">{{ getTypeLabel(event.type) }}</td>
              <td class="px-3 py-2 text-primary">{{ formatDate(event.date) }}</td>
              <td class="px-3 py-2">
                <span :class="[
                  'badge text-xs',
                  event.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                ]">
                  {{ event.is_published ? 'منشور' : 'مسودة' }}
                </span>
              </td>
              <td class="px-3 py-2">
                <div class="flex items-center gap-2">
                  <Button size="sm" variant="outline" @click="handleEdit(event)">تعديل</Button>
                  <button 
                    @click="handleTogglePublish(event)" 
                    class="p-1 text-secondary hover:text-primary"
                    :title="event.is_published ? 'إلغاء النشر' : 'نشر'"
                  >
                    <EyeIcon v-if="event.is_published" class="h-4 w-4" />
                    <EyeSlashIcon v-else class="h-4 w-4" />
                  </button>
                  <button 
                    @click="handleDelete(event.id)" 
                    class="p-1 text-red-600 hover:text-red-800"
                    title="حذف"
                  >
                    <TrashIcon class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- لا توجد فعاليات -->
      <div 
        v-if="!loading && events.length === 0" 
        class="text-center py-8 text-secondary"
      >
        <CalendarIcon class="h-16 w-16 mx-auto mb-4 text-secondary" />
        <p class="text-lg text-secondary">لا توجد فعاليات</p>
        <Button @click="showCreateForm = true" variant="primary" class="mt-4">
          إضافة فعالية جديدة
        </Button>
      </div>
    </Card>

    <!-- الترحيم -->
    <div v-if="!loading && events.length > 0" class="flex justify-center">
      <div class="flex gap-2">
        <Button 
          @click="changePage(currentPage - 1)" 
          :disabled="currentPage === 1"
          variant="outline"
        >
          السابق
        </Button>
        <span class="px-4 py-2 text-sm text-secondary">
          الصفحة {{ currentPage }} من {{ totalPages }}
        </span>
        <Button 
          @click="changePage(currentPage + 1)" 
          :disabled="currentPage === totalPages"
          variant="outline"
        >
          التالي
        </Button>
      </div>
    </div>

    <!-- حالة التحميل -->
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
    </div>

    <!-- نموذج إنشاء/تعديل الفعالية -->
    <EventForm
      v-if="showCreateForm || editingEvent"
      :event="editingEvent"
      @save="handleSave"
      @cancel="handleCancelForm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { EyeIcon, EyeSlashIcon, TrashIcon, CalendarIcon } from '@heroicons/vue/24/outline'
import Button from '@/components/dashboard/component/ui/Button.vue'
import Card from '@/components/dashboard/component/ui/Card.vue'
import EventForm from './EventForm.vue'
import { useEventStore } from '@/stores/events'
import type { Event } from '@/types/event'

const eventStore = useEventStore()

// البيانات التفاعلية
const loading = ref(false)
const showCreateForm = ref(false)
const editingEvent = ref<Event | null>(null)
const error = ref('')
const successMessage = ref('')

// استخدام ref منفصل لتتبع حالة النشر
const publishStates = ref<Record<string, boolean>>({})

// الحوسبة
const events = computed(() => {
  return eventStore.events.map(event => ({
    ...event,
    // استخدام الحالة المحلية إذا كانت موجودة، وإلا استخدام الحالة الأصلية
    is_published: publishStates.value[event.id] ?? event.is_published
  }))
})

const currentPage = computed(() => eventStore.currentPage)
const totalPages = computed(() => eventStore.totalPages)

// الدوال
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
  if (!confirm('هل أنت متأكد من حذف هذه الفعالية؟')) return

  loading.value = true
  error.value = ''
  
  try {
    await eventStore.deleteEvent(eventId)
    // إزالة الحالة المحلية إذا كانت موجودة
    delete publishStates.value[eventId]
    successMessage.value = 'تم حذف الفعالية بنجاح'
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
    
  } catch (err: any) {
    error.value = err.response?.data?.message || 'فشل في حذف الفعالية'
    console.error('Failed to delete event:', err)
  } finally {
    loading.value = false
  }
}

const handleTogglePublish = async (event: Event) => {
  loading.value = true
  error.value = ''
  
  const currentState = publishStates.value[event.id] ?? event.is_published
  const newState = !currentState
  
  try {
    // تحديث الحالة المحلية فوراً
    publishStates.value[event.id] = newState
    
    // إرسال الطلب إلى الخادم
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
    
    // في حالة الخطأ، نرجع الحالة إلى الأصلية
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
  eventStore.setPage(page)
  fetchEvents()
}

const getTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    'أمسيات': 'أمسيات',
    'ورش عمل': 'ورش عمل', 
    'فعاليات': 'فعاليات'
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

.bg-green-100 {
  background-color: rgb(220 252 231);
}

.text-green-800 {
  color: rgb(22 101 52);
}

.bg-yellow-100 {
  background-color: rgb(254 249 195);
}

.text-yellow-800 {
  color: rgb(113 63 18);
}

/* تحسين مظهر الأرقام في الجدول */
td:first-child {
  font-weight: 600;
  color: #4b5563;
}
</style>