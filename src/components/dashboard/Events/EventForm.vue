<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3" @click.self="$emit('cancel')">
    <div class="w-full max-w-3xl rounded-xl border border-primary bg-primary p-4 shadow-lg flex flex-col max-h-[90vh]">
      <div class="mb-3 flex items-center justify-between shrink-0">
        <div class="text-lg font-semibold text-primary">{{ event ? 'تعديل الفعالية' : 'إضافة فعالية' }}</div>
        <button class="inline-grid h-9 w-9 place-items-center rounded-lg hover:bg-tertiary text-primary" @click="$emit('cancel')">✕</button>
      </div>
      
      <div class="overflow-y-auto flex-1 custom-scrollbar">
        <form @submit.prevent="handleSave" class="grid gap-3 pr-2">
          <!-- العنوان -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <input
                v-model="formData.title_ar"
                type="text"
                required
                placeholder="العنوان بالعربية"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
              />
            </div>
            <div>
              <input
                v-model="formData.title_en"
                type="text"
                required
                placeholder="العنوان بالإنجليزية"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
              />
            </div>
          </div>

          <!-- النوع والتاريخ -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <select
                v-model="formData.type"
                required
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
              >
                <option value="">اختر النوع</option>
                <option value="أمسيات">أمسيات</option>
                <option value="ورش عمل">ورش عمل</option>
                <option value="فعاليات">فعاليات</option>
              </select>
            </div>
            <div>
              <input
                v-model="formData.date"
                type="date"
                required
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
              />
            </div>
          </div>

          <!-- الوصف بالعربية -->
          <div>
            <label class="block text-sm font-medium text-primary mb-1">الوصف بالعربية</label>
            <div class="rounded-lg border border-primary overflow-hidden">
              <QuillEditor 
                theme="snow" 
                v-model:content="formData.description_ar" 
                contentType="html" 
                class="h-40 bg-primary text-primary" 
              />
            </div>
          </div>

          <!-- الوصف بالإنجليزية -->
          <div>
            <label class="block text-sm font-medium text-primary mb-1">الوصف بالإنجليزية</label>
            <div class="rounded-lg border border-primary overflow-hidden">
              <QuillEditor 
                theme="snow" 
                v-model:content="formData.description_en" 
                contentType="html" 
                class="h-40 bg-primary text-primary" 
              />
            </div>
          </div>

          <!-- المتحدث (واحد فقط) -->
          <div>
            <label class="block text-sm font-medium text-primary mb-1">المتحدث</label>
            <div class="border rounded-lg p-3 space-y-2">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  v-model="formData.speaker.name_ar"
                  type="text"
                  class="rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
                  placeholder="اسم المتحدث (عربي)"
                />
                <input
                  v-model="formData.speaker.name_en"
                  type="text"
                  class="rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
                  placeholder="Speaker Name (English)"
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  v-model="formData.speaker.title_ar"
                  type="text"
                  class="rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
                  placeholder="المسمى الوظيفي (عربي)"
                />
                <input
                  v-model="formData.speaker.title_en"
                  type="text"
                  class="rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
                  placeholder="Job Title (English)"
                />
              </div>
              <textarea
                v-model="formData.speaker.bio_ar"
                rows="2"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
                placeholder="نبذة عن المتحدث (عربي)"
              />
              <textarea
                v-model="formData.speaker.bio_en"
                rows="2"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
                placeholder="Speaker Bio (English)"
              />
            </div>
          </div>

          <!-- الموقع والمدة -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <input
                v-model="formData.location_ar"
                type="text"
                placeholder="الموقع بالعربية"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
              />
            </div>
            <div>
              <input
                v-model="formData.duration"
                type="text"
                placeholder="المدة"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
              />
            </div>
          </div>

          <!-- نوع الوسائط -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <select
                v-model="formData.media_type"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
              >
                <option value="image">صورة</option>
                <option value="video">فيديو</option>
              </select>
            </div>
            <div>
              <input
                type="file"
                @change="handleMediaUpload"
                accept="image/*,video/*"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
              />
            </div>
          </div>

          <!-- حالة النشر -->
          <div class="flex items-center gap-2">
            <input
              v-model="formData.is_published"
              type="checkbox"
              id="is_published"
              class="rounded border-primary text-brand-500"
            />
            <label for="is_published" class="text-sm text-primary">
              نشر مباشرة
            </label>
          </div>

          <!-- الأزرار -->
          <div class="mt-4 flex justify-end gap-2 pt-4 border-t border-primary shrink-0">
            <Button variant="outline" @click="$emit('cancel')" type="button">إلغاء</Button>
            <Button variant="primary" type="submit" :disabled="loading">
              <span v-if="loading" class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
              {{ event ? 'تحديث' : 'حفظ' }}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, watch } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import Button from '@/components/dashboard/component/ui/Button.vue'
import { useEventStore } from '@/stores/events'
import type { Event } from '@/types/event'

interface Speaker {
  name_ar: string
  name_en: string
  title_ar: string
  title_en: string
  bio_ar: string
  bio_en: string
}

interface Props {
  event?: Event | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  save: []
  cancel: []
}>()

const eventStore = useEventStore()
const loading = ref(false)
const mediaFile = ref<File | null>(null)

const formData = ref({
  title_ar: '',
  title_en: '',
  type: '',
  description_ar: '',
  description_en: '',
  date: '',
  duration: '',
  location_ar: '',
  location_en: '',
  speaker: {
    name_ar: '',
    name_en: '',
    title_ar: '',
    title_en: '',
    bio_ar: '',
    bio_en: ''
  } as Speaker,
  media_type: 'image',
  is_published: false
})

// تعبئة البيانات إذا كان تعديل
watch(() => props.event, (event) => {
  if (event) {
    // تحويل المتحدثين من array إلى object
    const speakerData = event.speakers && event.speakers.length > 0 
      ? event.speakers[0] 
      : { name_ar: '', name_en: '', title_ar: '', title_en: '', bio_ar: '', bio_en: '' }

    formData.value = {
      title_ar: event.title_ar || '',
      title_en: event.title_en || '',
      type: event.type || '',
      description_ar: event.description_ar || '',
      description_en: event.description_en || '',
      date: event.date ? event.date.split('T')[0] : '',
      duration: event.duration || '',
      location_ar: event.location_ar || '',
      location_en: event.location_en || '',
      speaker: speakerData,
      media_type: event.media_type || 'image',
      is_published: event.is_published || false
    }
  } else {
    // إعادة تعيين النموذج
    formData.value = {
      title_ar: '',
      title_en: '',
      type: '',
      description_ar: '',
      description_en: '',
      date: '',
      duration: '',
      location_ar: '',
      location_en: '',
      speaker: {
        name_ar: '',
        name_en: '',
        title_ar: '',
        title_en: '',
        bio_ar: '',
        bio_en: ''
      },
      media_type: 'image',
      is_published: false
    }
    mediaFile.value = null
  }
}, { immediate: true })

const handleMediaUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    mediaFile.value = target.files[0]
  }
}

const handleSave = async () => {
  // التحقق من الحقول المطلوبة
  if (!formData.value.title_ar || !formData.value.title_en || !formData.value.type || 
      !formData.value.description_ar || !formData.value.description_en || !formData.value.date) {
    alert('يرجى ملء جميع الحقول المطلوبة')
    return
  }

  loading.value = true
  
  try {
    console.log('🔄 بدء حفظ الفعالية...')

    // إعداد البيانات للإرسال - استخدام كائن عادي بدلاً من FormData
    const submitData: any = {
      title_ar: formData.value.title_ar,
      title_en: formData.value.title_en,
      type: formData.value.type,
      description_ar: formData.value.description_ar,
      description_en: formData.value.description_en,
      date: formData.value.date,
      duration: formData.value.duration,
      location_ar: formData.value.location_ar,
      location_en: formData.value.location_en,
      media_type: formData.value.media_type,
      is_published: formData.value.is_published
    }

    // إضافة بيانات المتحدث إذا كانت موجودة
    if (formData.value.speaker && formData.value.speaker.name_ar) {
      submitData.speakers = [formData.value.speaker]
    }

    // إضافة الملف إذا كان موجوداً
    if (mediaFile.value) {
      submitData.media_file = mediaFile.value
    }

    console.log('📤 إرسال البيانات إلى API...', submitData)

    let result
    if (props.event) {
      console.log('✏️ تحديث الفعالية:', props.event.id)
      result = await eventStore.updateEvent(props.event.id, submitData)
    } else {
      console.log('🆕 إنشاء فعالية جديدة')
      result = await eventStore.createEvent(submitData)
    }

    console.log('✅ تم الحفظ بنجاح:', result)
    
    // إعادة تحميل الفعاليات
    await eventStore.fetchEvents()
    
    emit('save')
    
  } catch (error: any) {
    console.error('❌ فشل في حفظ الفعالية:', error)
    
    if (error.response) {
      console.error('تفاصيل الخطأ من الخادم:', error.response.data)
      alert(`خطأ في الحفظ: ${error.response.data?.message || 'يرجى المحاولة مرة أخرى'}`)
    } else if (error.request) {
      console.error('لا يوجد اتصال بالخادم')
      alert('لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.')
    } else {
      console.error('خطأ غير متوقع:', error.message)
      alert('حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.')
    }
  } finally {
    loading.value = false
  }
}
</script>


<style scoped>
/* تخصيص مظهر محرر النصوص */
:deep(.ql-toolbar) {
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
  border-bottom: 1px solid #e5e7eb !important;
}

:deep(.ql-container) {
  border: none !important;
  font-size: 14px;
}

:deep(.ql-editor) {
  min-height: 100px;
  padding: 12px;
}

:deep(.ql-editor.ql-blank::before) {
  font-style: normal;
  color: #9ca3af;
}

/* تخصيص شريط التمرير */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* التمرير السلس */
.custom-scrollbar {
  scroll-behavior: smooth;
}

/* التأكد من أن المحتوى لا يتجاوز الارتفاع */
:deep(.ql-editor) {
  max-height: 120px;
  overflow-y: auto;
}

:deep(.ql-editor)::-webkit-scrollbar {
  width: 4px;
}

:deep(.ql-editor)::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}
</style>