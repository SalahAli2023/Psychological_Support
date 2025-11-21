<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
      <!-- Header -->
      <div class="flex justify-between items-center p-6 border-b">
        <h2 class="text-xl font-bold text-gray-800">تحديث حالة الرسالة</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-times text-xl"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <div class="mb-4">
          <p class="text-gray-600 mb-2">المرسل: <span class="font-semibold">{{ contact.name }}</span></p>
          <p class="text-gray-600">الموضوع: <span class="font-semibold">{{ contact.subject }}</span></p>
        </div>

        <form @submit.prevent="updateStatus">
          <!-- Status -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
            <select
              v-model="form.status"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="new">جديد</option>
              <option value="in_progress">قيد المعالجة</option>
              <option value="resolved">تم الحل</option>
              <option value="closed">مغلق</option>
            </select>
          </div>

          <!-- Admin Notes -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">ملاحظات المسؤول (اختياري)</label>
            <textarea
              v-model="form.admin_notes"
              rows="4"
              placeholder="أضف ملاحظات حول متابعة هذه الرسالة..."
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <!-- Current Status -->
          <div class="bg-gray-50 p-3 rounded-lg mb-4">
            <p class="text-sm text-gray-600">الحالة الحالية:</p>
            <span :class="currentStatusBadgeClass" class="inline-block mt-1 px-3 py-1 text-sm font-medium rounded-full">
              {{ getStatusLabel(contact.status) }}
            </span>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <span v-if="loading">
                <i class="fas fa-spinner fa-spin mr-2"></i>
                جاري الحفظ...
              </span>
              <span v-else>
                <i class="fas fa-save mr-2"></i>
                حفظ التغييرات
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useContactStore } from '@/stores/contact'
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

const contactStore = useContactStore()
const loading = ref(false)

const form = reactive({
  status: props.contact.status,
  admin_notes: props.contact.admin_notes || ''
})

const currentStatusBadgeClass = computed(() => {
  const classes = {
    new: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  }
  return classes[props.contact.status] || classes.new
})

const updateStatus = async () => {
  loading.value = true

  try {
    await contactStore.updateContactStatus(props.contact.id, form.status, form.admin_notes)
    emit('status-updated')
    emit('close')
  } catch (error) {
    console.error('Error updating contact status:', error)
  } finally {
    loading.value = false
  }
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
</script>