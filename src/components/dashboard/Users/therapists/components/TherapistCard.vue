<template>
  <div class="border border-primary rounded-lg p-3 bg-secondary hover:bg-tertiary transition-colors">
    <!-- Therapist Header -->
    <div class="flex items-center gap-3 mb-3">
      <img 
        :src="therapist.avatar || '/images/default-avatar.png'" 
        :alt="therapist.name_ar || 'Therapist'"
        class="w-12 h-12 rounded-full object-cover border border-primary"
      />
      <div class="flex-1">
        <div class="text-primary font-medium text-sm">{{ therapist.name_ar }} / {{ therapist.name_en }}</div>
        <div class="text-xs text-secondary">{{ therapist.email }}</div>
        <div class="text-xs text-secondary">{{ therapist.phone }}</div>
      </div>
      <span :class="[
        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
        therapist.status === 'active' ? 'bg-green-100 text-green-800' :
        therapist.status === 'busy' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      ]">
        {{ getStatusText(therapist.status) }}
      </span>
    </div>

    <!-- Specialty -->
    <div class="mb-3">
      <div class="text-xs text-secondary mb-1">التخصص</div>
      <div class="text-primary text-sm">{{ therapist.specialty_ar }} / {{ therapist.specialty_en }}</div>
    </div>

    <!-- Experience & Session Duration -->
    <div class="grid grid-cols-2 gap-2 mb-3">
      <div class="text-center">
        <div class="text-xs text-secondary">الخبرة</div>
        <div class="text-sm font-medium text-primary">{{ therapist.experience || 0 }} سنة</div>
      </div>
      <div class="text-center">
        <div class="text-xs text-secondary">مدة الجلسة</div>
        <div class="text-sm font-medium text-primary">{{ therapist.session_duration || 45 }} دقيقة</div>
      </div>
    </div>

    <!-- Weekly Schedule -->
    <div class="mb-3">
      <div class="text-xs text-secondary mb-2">الجدول الأسبوعي</div>
      <div class="flex justify-between items-center">
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
        <div class="text-xs text-secondary">
          {{ getTotalScheduleSlots(therapist) }} أوقات
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex justify-between gap-2 pt-3 border-t border-primary">
      <button 
        @click="$emit('open-schedule', therapist)"
        class="flex-1 bg-brand-500 hover:bg-brand-600 text-white px-2 py-1 rounded text-xs flex items-center gap-1 justify-center transition-colors"
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
  </div>
</template>

<script setup>
import { CalendarIcon, PencilIcon, EyeIcon, TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  therapist: {
    type: Object,
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
