<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex justify-between items-center p-6 border-b">
        <h2 class="text-xl font-bold text-gray-800">تفاصيل الرسالة</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[70vh]">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- Sender Info -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">معلومات المرسل</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-600">الاسم</label>
                <p class="text-gray-900">{{ contact.name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600">البريد الإلكتروني</label>
                <p class="text-gray-900">{{ contact.email }}</p>
              </div>
              <div v-if="contact.phone">
                <label class="block text-sm font-medium text-gray-600">الهاتف</label>
                <p class="text-gray-900">{{ contact.phone }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600">تاريخ الإرسال</label>
                <p class="text-gray-900">{{ formatDate(contact.created_at) }}</p>
              </div>
            </div>
          </div>

          <!-- Message Info -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">معلومات الرسالة</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-gray-600">الموضوع</label>
                <p class="text-gray-900">{{ contact.subject }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600">نوع الرسالة</label>
                <span :class="messageTypeBadgeClass(contact.message_type)" class="inline-block mt-1">
                  {{ getMessageTypeLabel(contact.message_type) }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600">الحالة</label>
                <span :class="statusBadgeClass(contact.status)" class="inline-block mt-1">
                  {{ getStatusLabel(contact.status) }}
                </span>
              </div>
              <div v-if="contact.admin_notes">
                <label class="block text-sm font-medium text-gray-600">ملاحظات المسؤول</label>
                <p class="text-gray-900 bg-yellow-50 p-2 rounded mt-1">{{ contact.admin_notes }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Message Content -->
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-3">محتوى الرسالة</h3>
          <div class="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap min-h-[150px]">
            {{ contact.message }}
          </div>
        </div>

        <!-- Timeline -->
        <div class="mt-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">السجل الزمني</h3>
          <div class="space-y-4">
            <div class="flex items-start">
              <div class="bg-blue-100 p-2 rounded-full mr-4">
                <i class="fas fa-envelope text-blue-600"></i>
              </div>
              <div>
                <p class="text-gray-900 font-medium">تم إرسال الرسالة</p>
                <p class="text-gray-500 text-sm">{{ formatDate(contact.created_at) }}</p>
              </div>
            </div>
            <div class="flex items-start" v-if="contact.updated_at !== contact.created_at">
              <div class="bg-green-100 p-2 rounded-full mr-4">
                <i class="fas fa-edit text-green-600"></i>
              </div>
              <div>
                <p class="text-gray-900 font-medium">تم تحديث الحالة</p>
                <p class="text-gray-500 text-sm">{{ formatDate(contact.updated_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-between items-center p-6 border-t bg-gray-50">
        <div class="flex gap-3">
          <button
            @click="updateStatus"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <i class="fas fa-edit mr-2"></i>
            تغيير الحالة
          </button>
          <button
            @click="replyToContact"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <i class="fas fa-reply mr-2"></i>
            الرد على المرسل
          </button>
        </div>
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
        >
          إغلاق
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Contact } from '@/types/contact'

interface Props {
  contact: Contact
}

interface Emits {
  (e: 'close'): void
  (e: 'status-updated'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const updateStatus = () => {
  emit('status-updated')
  emit('close')
}

const replyToContact = () => {
  window.open(`mailto:${props.contact.email}?subject=رد على: ${props.contact.subject}`, '_blank')
}

const messageTypeBadgeClass = (type: string) => {
  const classes = {
    inquiry: 'bg-blue-100 text-blue-800',
    complaint: 'bg-red-100 text-red-800',
    suggestion: 'bg-green-100 text-green-800',
    support: 'bg-purple-100 text-purple-800',
    other: 'bg-gray-100 text-gray-800'
  }
  return `px-3 py-1 text-sm font-medium rounded-full ${classes[type] || classes.other}`
}

const statusBadgeClass = (status: string) => {
  const classes = {
    new: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  }
  return `px-3 py-1 text-sm font-medium rounded-full ${classes[status] || classes.new}`
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