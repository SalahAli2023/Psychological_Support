<template>
  <table class="min-w-full text-sm">
    <thead>
      <tr class="border-b border-primary bg-secondary">
        <th class="px-3 py-2 text-start font-medium text-primary text-xs">المعالج</th>
        <th class="px-3 py-2 text-start font-medium text-primary text-xs">التخصص</th>
        <th class="px-3 py-2 text-start font-medium text-primary text-xs">الحالة</th>
        <th class="px-3 py-2 text-start font-medium text-primary text-xs">الخبرة</th>
        <th class="px-3 py-2 text-start font-medium text-primary text-xs">الجدول الأسبوعي</th>
        <th class="px-3 py-2 text-start font-medium text-primary text-xs">الإجراءات</th>
      </tr>
    </thead>
    <tbody>
      <tr 
        v-for="therapist in therapists" 
        :key="therapist.id"
        class="border-b border-primary hover:bg-tertiary transition-colors"
      >
        <!-- Therapist Info -->
        <td class="px-3 py-2">
          <div class="flex items-center gap-2">
            <img 
              :src="therapist.avatar || '/images/default-avatar.png'" 
              :alt="therapist.name_ar"
              class="w-8 h-8 rounded-full object-cover border border-primary"
            />
            <div class="min-w-0">
              <div class="text-primary font-medium text-sm truncate">{{ therapist.name_ar }}</div>
              <div class="text-xs text-secondary truncate">{{ therapist.name_en }}</div>
            </div>
          </div>
        </td>

        <!-- Specialty -->
        <td class="px-3 py-2 text-primary text-sm">
          <div>{{ therapist.specialty_ar }}</div>
          <div class="text-xs text-secondary">{{ therapist.specialty_en }}</div>
        </td>

        <!-- Status -->
        <td class="px-3 py-2">
          <span :class="[
            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
            therapist.status === 'active' ? 'bg-green-100 text-green-800' :
            therapist.status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          ]">
            {{ getStatusText(therapist.status) }}
          </span>
        </td>

        <!-- Experience -->
        <td class="px-3 py-2 text-primary text-sm">
          {{ therapist.experience || 0 }} سنة
        </td>

        <!-- Weekly Schedule -->
        <td class="px-3 py-2">
          <div class="flex items-center gap-2">
            <div class="grid grid-cols-7 gap-1">
              <div 
                v-for="day in weekDays" 
                :key="day.key"
                :class="[
                  'w-5 h-5 rounded text-[10px] flex items-center justify-center transition-colors',
                  hasDaySchedule(therapist, day.key) ? 
                  'bg-brand-500 text-white' : 'bg-tertiary text-secondary'
                ]"
                :title="day.label"
              >
                {{ day.label.charAt(0) }}
              </div>
            </div>
            <div class="text-xs text-secondary whitespace-nowrap">
              {{ getTotalScheduleSlots(therapist) }} أوقات
            </div>
          </div>
        </td>

        <!-- Actions -->
        <td class="px-3 py-2">
          <div class="flex items-center gap-1">
            <button 
              @click="$emit('open-schedule', therapist)"
              class="bg-brand-500 hover:bg-brand-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors"
            >
              <CalendarIcon class="h-3 w-3" />
              الجدول
            </button>
            <button 
              @click="$emit('edit-therapist', therapist)"
              class="bg-tertiary hover:bg-secondary text-primary p-1 rounded transition-colors"
            >
              <PencilIcon class="h-3 w-3" />
            </button>
            <button 
              @click="$emit('view-profile', therapist)"
              class="bg-tertiary hover:bg-secondary text-blue-500 p-1 rounded transition-colors"
            >
              <EyeIcon class="h-3 w-3" />
            </button>
            <button 
              @click="$emit('delete-therapist', therapist)"
              class="bg-tertiary hover:bg-secondary text-red-500 p-1 rounded transition-colors"
            >
              <TrashIcon class="h-3 w-3" />
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { CalendarIcon, PencilIcon, EyeIcon, TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  therapists: {
    type: Array,
    required: true
  }
})

defineEmits(['edit-therapist', 'view-profile', 'delete-therapist', 'open-schedule'])

const weekDays = [
  { key: 'saturday', label: 'السبت' },
  { key: 'sunday', label: 'الأحد' },
  { key: 'monday', label: 'الاثنين' },
  { key: 'tuesday', label: 'الثلاثاء' },
  { key: 'wednesday', label: 'الأربعاء' },
  { key: 'thursday', label: 'الخميس' },
  { key: 'friday', label: 'الجمعة' }
]

const getStatusText = (status) => {
  const statusMap = {
    'active': 'نشط',
    'busy': 'مشغول', 
    'inactive': 'غير نشط',
    'away': 'غير متاح'
  }
  return statusMap[status] || status
}

const hasDaySchedule = (therapist, dayKey) => {
  if (!therapist.schedules || !Array.isArray(therapist.schedules)) {
    return false
  }
  
  return therapist.schedules.some(schedule => 
    schedule.day === dayKey && schedule.available
  )
}

const getTotalScheduleSlots = (therapist) => {
  if (!therapist.schedules || !Array.isArray(therapist.schedules)) {
    return 0
  }
  
  return therapist.schedules.filter(schedule => schedule.available).length
}
</script>
