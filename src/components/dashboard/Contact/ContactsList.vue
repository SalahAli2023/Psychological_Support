<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">إدارة رسائل الاتصال</h1>
      <div class="flex gap-4">
        <button 
          @click="exportToCsv"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          <i class="fas fa-download mr-2"></i>
          تصدير CSV
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">بحث</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="ابحث بالاسم، البريد، أو الموضوع..."
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
          <select
            v-model="filters.status"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">جميع الحالات</option>
            <option value="new">جديد</option>
            <option value="in_progress">قيد المعالجة</option>
            <option value="resolved">تم الحل</option>
            <option value="closed">مغلق</option>
          </select>
        </div>

        <!-- Message Type Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">نوع الرسالة</label>
          <select
            v-model="filters.message_type"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">جميع الأنواع</option>
            <option value="inquiry">استفسار</option>
            <option value="complaint">شكوى</option>
            <option value="suggestion">اقتراح</option>
            <option value="support">دعم فني</option>
            <option value="other">أخرى</option>
          </select>
        </div>

        <!-- Actions -->
        <div class="flex items-end">
          <button
            @click="applyFilters"
            class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            تطبيق الفلاتر
          </button>
        </div>
      </div>
    </div>

    <!-- Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 bg-blue-100 rounded-lg">
            <i class="fas fa-envelope text-blue-600 text-xl"></i>
          </div>
          <div class="mr-4">
            <p class="text-gray-600">إجمالي الرسائل</p>
            <p class="text-2xl font-bold">{{ statistics.total }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 bg-yellow-100 rounded-lg">
            <i class="fas fa-clock text-yellow-600 text-xl"></i>
          </div>
          <div class="mr-4">
            <p class="text-gray-600">رسائل جديدة</p>
            <p class="text-2xl font-bold">{{ statistics.new }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 bg-green-100 rounded-lg">
            <i class="fas fa-check-circle text-green-600 text-xl"></i>
          </div>
          <div class="mr-4">
            <p class="text-gray-600">تم الحل</p>
            <p class="text-2xl font-bold">{{ statistics.resolved }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-3 bg-purple-100 rounded-lg">
            <i class="fas fa-comments text-purple-600 text-xl"></i>
          </div>
          <div class="mr-4">
            <p class="text-gray-600">استفسارات</p>
            <p class="text-2xl font-bold">{{ statistics.by_type?.inquiry || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Contacts Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المرسل
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الموضوع
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                النوع
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                التاريخ
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="contact in contacts" :key="contact.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ contact.name }}</p>
                  <p class="text-sm text-gray-500">{{ contact.email }}</p>
                  <p class="text-sm text-gray-400" v-if="contact.phone">{{ contact.phone }}</p>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-gray-900 font-medium">{{ contact.subject }}</p>
                <p class="text-sm text-gray-500 truncate max-w-xs">{{ contact.message }}</p>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="messageTypeBadgeClass(contact.message_type)">
                  {{ getMessageTypeLabel(contact.message_type) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="statusBadgeClass(contact.status)">
                  {{ getStatusLabel(contact.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(contact.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex gap-2">
                  <button
                    @click="viewContact(contact)"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button
                    @click="updateStatus(contact)"
                    class="text-green-600 hover:text-green-900"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click="deleteContact(contact)"
                    class="text-red-600 hover:text-red-900"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex justify-between items-center">
          <div class="text-sm text-gray-700">
            عرض <span class="font-medium">{{ pagination.from }}</span> إلى 
            <span class="font-medium">{{ pagination.to }}</span> من 
            <span class="font-medium">{{ pagination.total }}</span> نتيجة
          </div>
          <div class="flex gap-2">
            <button
              @click="previousPage"
              :disabled="pagination.current_page === 1"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              السابق
            </button>
            <button
              @click="nextPage"
              :disabled="pagination.current_page === pagination.last_page"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              التالي
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- View Contact Modal -->
    <ContactViewModal
      v-if="selectedContact"
      :contact="selectedContact"
      @close="selectedContact = null"
      @status-updated="fetchContacts"
    />

    <!-- Update Status Modal -->
    <ContactStatusModal
      v-if="statusContact"
      :contact="statusContact"
      @close="statusContact = null"
      @status-updated="fetchContacts"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useContactStore } from '../../../stores/contact'
import type { Contact, ContactStats } from '../../../types/contact'
import ContactViewModal from '../Contact/ContactViewModal.vue'
import ContactStatusModal from '../Contact/ContactStatusModal.vue'

const contactStore = useContactStore()

const contacts = ref<Contact[]>([])
const statistics = ref<ContactStats>({
  total: 0,
  new: 0,
  in_progress: 0,
  resolved: 0,
  by_type: {}
})
const selectedContact = ref<Contact | null>(null)
const statusContact = ref<Contact | null>(null)

const filters = reactive({
  search: '',
  status: '',
  message_type: ''
})

const pagination = reactive({
  current_page: 1,
  last_page: 1,
  per_page: 20,
  total: 0,
  from: 0,
  to: 0
})

onMounted(() => {
  fetchContacts()
  fetchStatistics()
})

const fetchContacts = async () => {
  try {
    const params = {
      page: pagination.current_page,
      ...filters
    }
    
    const response = await contactStore.fetchContacts(params)
    contacts.value = response.data
    updatePagination(response.pagination)
  } catch (error) {
    console.error('Error fetching contacts:', error)
  }
}

const fetchStatistics = async () => {
  try {
    statistics.value = await contactStore.fetchContactStats()
  } catch (error) {
    console.error('Error fetching statistics:', error)
  }
}

const updatePagination = (paginationData: any) => {
  Object.assign(pagination, paginationData)
}

const applyFilters = () => {
  pagination.current_page = 1
  fetchContacts()
}

const nextPage = () => {
  if (pagination.current_page < pagination.last_page) {
    pagination.current_page++
    fetchContacts()
  }
}

const previousPage = () => {
  if (pagination.current_page > 1) {
    pagination.current_page--
    fetchContacts()
  }
}

const viewContact = (contact: Contact) => {
  selectedContact.value = contact
}

const updateStatus = (contact: Contact) => {
  statusContact.value = contact
}

const deleteContact = async (contact: Contact) => {
  if (confirm(`هل أنت متأكد من حذف رسالة ${contact.name}؟`)) {
    try {
      await contactStore.deleteContact(contact.id)
      fetchContacts()
      fetchStatistics()
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }
}

const exportToCsv = () => {
  window.open('/admin/contacts/export/csv', '_blank')
}

const messageTypeBadgeClass = (type: string) => {
  const classes = {
    inquiry: 'bg-blue-100 text-blue-800',
    complaint: 'bg-red-100 text-red-800',
    suggestion: 'bg-green-100 text-green-800',
    support: 'bg-purple-100 text-purple-800',
    other: 'bg-gray-100 text-gray-800'
  }
  return `px-2 py-1 text-xs font-medium rounded-full ${classes[type] || classes.other}`
}

const statusBadgeClass = (status: string) => {
  const classes = {
    new: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  }
  return `px-2 py-1 text-xs font-medium rounded-full ${classes[status] || classes.new}`
}

const getMessageTypeLabel = (type: string) => {
  const types: Record<string, string> = {
    inquiry: 'استفسار',
    complaint: 'شكوى',
    suggestion: 'اقتراح',
    support: 'دعم فني',
    other: 'أخرى'
  }
  return types[type] || type
}

const getStatusLabel = (status: string) => {
  const statuses: Record<string, string> = {
    new: 'جديد',
    in_progress: 'قيد المعالجة',
    resolved: 'تم الحل',
    closed: 'مغلق'
  }
  return statuses[status] || status
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>