<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-primary rounded-2xl shadow-xl border border-primary">
      <div class="flex items-center justify-between p-6 border-b border-primary sticky top-0 bg-primary z-10">
        <h2 class="text-xl font-semibold text-primary">
          {{ session ? 'تعديل الجلسة / Edit Session' : 'إضافة جلسة جديدة / Add New Session' }}
        </h2>
        <button @click="$emit('close')" class="p-2 hover:bg-tertiary rounded-lg text-primary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- معلومات الجلسة الأساسية -->
        <div class="grid grid-cols-1 gap-4">
          <!-- عنوان الجلسة -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-primary mb-2">عنوان الجلسة (عربي) *</label>
              <input 
                v-model="form.title.ar"
                type="text"
                required
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="أدخل عنوان الجلسة بالعربية"
                dir="rtl"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary mb-2">عنوان الجلسة (إنجليزي) *</label>
              <input 
                v-model="form.title.en"
                type="text"
                required
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Enter session title in English"
                dir="ltr"
              />
            </div>
          </div>

          <!-- التاريخ والوقت -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-primary mb-2">التاريخ *</label>
              <input 
                v-model="form.date"
                type="date"
                required
                @change="loadAvailableSlots"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-primary mb-2">الوقت *</label>
              <select 
                v-model="form.time"
                required
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
                :disabled="!availableSlots.length"
              >
                <option value="">اختر الوقت المناسب</option>
                <option 
                  v-for="slot in availableSlots" 
                  :key="slot.value"
                  :value="slot.value"
                  :disabled="slot.booked"
                >
                  {{ slot.label }} {{ slot.booked ? '(محجوز)' : '' }}
                </option>
              </select>
              <div v-if="form.date && form.therapist" class="mt-2 text-xs">
                <span v-if="availableSlots.length" class="text-green-600">
                  {{ availableSlots.filter(slot => !slot.booked).length }} مواعيد متاحة
                </span>
                <span v-else class="text-red-500">
                  لا توجد مواعيد متاحة في هذا التاريخ
                </span>
              </div>
            </div>
          </div>

          <!-- المعالج وحالة الجلسة -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-primary mb-2">المعالج *</label>
              <select 
                v-model="form.therapist"
                @change="onTherapistChange"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">اختر المعالج</option>
                <option value="د. أحمد محمد">د. أحمد محمد</option>
                <option value="د. فاطمة عبدالله">د. فاطمة عبدالله</option>
                <option value="د. خالد سعيد">د. خالد سعيد</option>
                <option value="د. نورة الرشيد">د. نورة الرشيد</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-primary mb-2">حالة الجلسة *</label>
              <select 
                v-model="form.status"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="scheduled">مجدولة / Scheduled</option>
                <option value="completed">مكتملة / Completed</option>
                <option value="cancelled">ملغاة / Cancelled</option>
              </select>
            </div>
          </div>

          <!-- باقي الحقول تبقى كما هي -->
          <!-- التقدم ونوع الجلسة -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-primary mb-2">التقدم (%)</label>
              <input 
                v-model="form.progress"
                type="number"
                min="0"
                max="100"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 direction-ltr"
                placeholder="0-100"
                dir="ltr"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-primary mb-2">نوع الجلسة *</label>
              <select 
                v-model="form.type"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="individual">فردية / Individual</option>
                <option value="group">جماعية / Group</option>
                <option value="family">عائلية / Family</option>
                <option value="assessment">تقييم / Assessment</option>
                <option value="followup">متابعة / Follow-up</option>
              </select>
            </div>
          </div>

          <!-- المكان -->
          <div>
            <label class="block text-sm font-medium text-primary mb-2">المكان *</label>
            <select 
              v-model="form.location"
              class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="clinic">العيادة / Clinic</option>
              <option value="online">أونلاين / Online</option>
              <option value="home">منزل المريض / Patient's Home</option>
            </select>
          </div>

          <!-- الملاحظات -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-primary mb-2">ملاحظات (عربي)</label>
              <textarea 
                v-model="form.notes.ar"
                rows="3"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="أدخل ملاحظات الجلسة بالعربية..."
                dir="rtl"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary mb-2">ملاحظات (إنجليزي)</label>
              <textarea 
                v-model="form.notes.en"
                rows="3"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Enter session notes in English..."
                dir="ltr"
              />
            </div>
          </div>

          <!-- تقرير الجلسة (يظهر فقط إذا كانت مكتملة) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4" v-if="form.status === 'completed'">
            <div>
              <label class="block text-sm font-medium text-primary mb-2">تقرير الجلسة (عربي)</label>
              <textarea 
                v-model="form.report.ar"
                rows="3"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="أدخل تقرير الجلسة بالعربية..."
                dir="rtl"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary mb-2">تقرير الجلسة (إنجليزي)</label>
              <textarea 
                v-model="form.report.en"
                rows="3"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
                placeholder="Enter session report in English..."
                dir="ltr"
              />
            </div>
          </div>

          <!-- المرفقات -->
          <div>
            <label class="block text-sm font-medium text-primary mb-2">المرفقات</label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input 
                type="file"
                multiple
                @change="handleFileUpload"
                class="hidden"
                id="file-upload"
              />
              <label for="file-upload" class="cursor-pointer">
                <svg class="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p class="text-sm text-gray-600">اسحب الملفات هنا أو انقر للرفع</p>
                <p class="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG (الحد الأقصى 10MB)</p>
              </label>
            </div>
            
            <!-- قائمة الملفات المرفوعة -->
            <div v-if="form.attachments.length > 0" class="mt-3 space-y-2">
              <div v-for="(file, index) in form.attachments" :key="index" class="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                <div class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span class="text-sm text-gray-700">{{ file.name }}</span>
                </div>
                <button 
                  type="button"
                  @click="removeAttachment(index)"
                  class="text-red-500 hover:text-red-700"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-primary sticky bottom-0 bg-primary pb-4">
          <button 
            type="button"
            @click="$emit('close')"
            class="bg-tertiary hover:bg-primary text-primary px-4 py-2 rounded-lg text-sm"
          >
            إلغاء
          </button>
          <button 
            type="submit"
            class="bg-brand-500 hover:bg-[#8FAE2F] text-white px-4 py-2 rounded-lg text-sm"
          >
            {{ session ? 'تحديث' : 'إضافة' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  session: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const form = reactive({
  title: {
    ar: '',
    en: ''
  },
  date: '',
  time: '',
  therapist: '',
  status: 'scheduled',
  progress: 0,
  type: 'individual',
  location: 'clinic',
  notes: {
    ar: '',
    en: ''
  },
  report: {
    ar: '',
    en: ''
  },
  attachments: []
})

// المواعيد المتاحة
const availableSlots = ref([])

// جدول الأطباء
const therapistsSchedule = {
  'د. أحمد محمد': {
    workDays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
    slots: ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00']
  },
  'د. فاطمة عبدالله': {
    workDays: ['sunday', 'monday', 'tuesday', 'wednesday'],
    slots: ['08:00', '09:30', '11:00', '12:30', '15:00', '16:30']
  },
  'د. خالد سعيد': {
    workDays: ['monday', 'tuesday', 'wednesday', 'thursday'],
    slots: ['10:00', '11:00', '12:00', '13:00', '16:00', '17:00', '18:00']
  },
  'د. نورة الرشيد': {
    workDays: ['sunday', 'tuesday', 'wednesday', 'thursday'],
    slots: ['08:30', '10:00', '11:30', '13:00', '14:30', '16:00']
  }
}

// تحميل المواعيد المتاحة
const loadAvailableSlots = () => {
  if (!form.date || !form.therapist) {
    availableSlots.value = []
    return
  }

  const schedule = therapistsSchedule[form.therapist]
  if (!schedule) {
    availableSlots.value = []
    return
  }

  // تحويل التاريخ إلى يوم الأسبوع
  const dateObj = new Date(form.date)
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const dayName = days[dateObj.getDay()]

  // التحقق إذا كان اليوم من أيام العمل
  if (!schedule.workDays.includes(dayName)) {
    availableSlots.value = []
    return
  }

  // توليد المواعيد المتاحة
  availableSlots.value = schedule.slots.map(slot => {
    // محاكاة حالة الحجز (يمكن استبدالها ببيانات حقيقية)
    const isBooked = Math.random() > 0.7
    
    return {
      value: slot,
      label: slot,
      booked: isBooked
    }
  })
}

// عند تغيير المعالج
const onTherapistChange = () => {
  form.time = '' // إعادة تعيين الوقت
  if (form.date) {
    loadAvailableSlots()
  }
}

// تحديث النموذج عند تغيير الجلسة
watch(() => props.session, (session) => {
  if (session) {
    Object.assign(form, {
      title: session.title || { ar: '', en: '' },
      date: session.date || '',
      time: session.time || '',
      therapist: session.therapist || '',
      status: session.status || 'scheduled',
      progress: session.progress || 0,
      type: session.type || 'individual',
      location: session.location || 'clinic',
      notes: session.notes || { ar: '', en: '' },
      report: session.report || { ar: '', en: '' },
      attachments: session.attachments || []
    })
    
    // تحميل المواعيد إذا كان هناك تاريخ ومعالج
    if (form.date && form.therapist) {
      loadAvailableSlots()
    }
  } else {
    Object.assign(form, {
      title: { ar: '', en: '' },
      date: '',
      time: '',
      therapist: '',
      status: 'scheduled',
      progress: 0,
      type: 'individual',
      location: 'clinic',
      notes: { ar: '', en: '' },
      report: { ar: '', en: '' },
      attachments: []
    })
    availableSlots.value = []
  }
}, { immediate: true })

// معالجة رفع الملفات
const handleFileUpload = (event) => {
  const files = Array.from(event.target.files)
  files.forEach(file => {
    if (file.size <= 10 * 1024 * 1024) { // 10MB limit
      form.attachments.push(file)
    } else {
      alert('الملف كبير جداً. الحد الأقصى 10MB')
    }
  })
  event.target.value = '' // Reset file input
}

// إزالة مرفق
const removeAttachment = (index) => {
  form.attachments.splice(index, 1)
}

const handleSubmit = () => {
  if (!form.time) {
    alert('يرجى اختيار الوقت المناسب')
    return
  }
  emit('save', { ...form })
}
</script>

<style scoped>
.direction-ltr {
  direction: ltr;
  text-align: left;
}
</style>