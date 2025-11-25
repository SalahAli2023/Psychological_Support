<!-- [file name]: ArticleForm.vue -->
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3" @click.self="$emit('cancel')">
    <div class="w-full max-w-4xl rounded-xl border border-primary bg-primary p-4 shadow-lg flex flex-col max-h-[90vh]">
      <div class="mb-3 flex items-center justify-between shrink-0">
        <div class="text-lg font-semibold text-primary">{{ article ? 'تعديل المقال' : 'إضافة مقال' }}</div>
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

          <!-- المقدمة -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <textarea
                v-model="formData.introduction_ar"
                rows="3"
                placeholder="المقدمة بالعربية"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
              />
            </div>
            <div>
              <textarea
                v-model="formData.introduction_en"
                rows="3"
                placeholder="المقدمة بالإنجليزية"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
              />
            </div>
          </div>

          <!-- الملخص -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <textarea
                v-model="formData.excerpt_ar"
                rows="3"
                required
                placeholder="الملخص بالعربية"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
              />
            </div>
            <div>
              <textarea
                v-model="formData.excerpt_en"
                rows="3"
                required
                placeholder="الملخص بالإنجليزية"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
              />
            </div>
          </div>

          <!-- التصنيف وتاريخ النشر -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-primary mb-1">تصنيف المقال</label>
              <select
                v-model="formData.category_id"
                required
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
              >
                <option value="">اختر تصنيف المقال</option>
                <option v-for="category in articleCategories" :key="category.id" :value="category.id">
                  {{ category.name_ar }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-primary mb-1">نوع المقياس</label>
              <select
                v-model="formData.scale_category_id"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
              >
                <option value="">اختر نوع المقياس</option>
                <option v-for="scaleCategory in scaleCategories" :key="scaleCategory.id" :value="scaleCategory.id">
                  {{ scaleCategory.name_ar }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-primary mb-1">تاريخ النشر</label>
              <input
                v-model="formData.published_at"
                type="datetime-local"
                required
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
              />
            </div>
          </div>

          <!-- المحتوى بالعربية -->
          <div>
            <label class="block text-sm font-medium text-primary mb-1">المحتوى بالعربية</label>
            <div class="rounded-lg border border-primary overflow-hidden">
              <QuillEditor 
                theme="snow" 
                v-model:content="formData.content_ar" 
                contentType="html" 
                class="h-64 bg-primary text-primary" 
              />
            </div>
          </div>

          <!-- المحتوى بالإنجليزية -->
          <div>
            <label class="block text-sm font-medium text-primary mb-1">المحتوى بالإنجليزية</label>
            <div class="rounded-lg border border-primary overflow-hidden">
              <QuillEditor 
                theme="snow" 
                v-model:content="formData.content_en" 
                contentType="html" 
                class="h-64 bg-primary text-primary" 
              />
            </div>
          </div>

          <!-- الصورة -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-primary mb-1">صورة المقال</label>
              <input
                type="file"
                @change="handleImageUpload"
                accept="image/*"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
                @error="handleImageError"
              />
              <p class="text-xs text-secondary mt-1">الحجم الأقصى: 2MB</p>
            </div>
            <div v-if="imagePreview" class="mt-6">
              <img :src="imagePreview" alt="Preview" class="w-20 h-20 rounded-lg object-cover" />
            </div>
          </div>

          <!-- ✅ قسم المرفقات -->
          <div class="border-t border-primary pt-4">
            <div class="flex items-center justify-between mb-3">
              <label class="block text-sm font-medium text-primary">مرفقات المقال</label>
              <Button type="button" variant="outline" size="sm" @click="addAttachment">
                <PlusIcon class="h-4 w-4 mr-1" />
                إضافة مرفق
              </Button>
            </div>

            <!-- قائمة المرفقات -->
            <div v-if="formData.attachments.length > 0" class="space-y-3">
              <div v-for="(attachment, index) in formData.attachments" :key="attachment.id || index" 
                   class="flex items-center gap-3 p-3 border border-primary rounded-lg">
                <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div>
                    <label class="text-xs text-secondary mb-1">نوع المرفق</label>
                    <select v-model="attachment.type" class="w-full rounded border border-primary px-2 py-1 text-sm">
                      <option value="file">ملف</option>
                      <option value="image">صورة</option>
                      <option value="video">فيديو</option>
                      <option value="audio">صوت</option>
                      <option value="document">وثيقة</option>
                      <option value="link">رابط</option>
                    </select>
                  </div>
                  <div class="md:col-span-2">
                    <label class="text-xs text-secondary mb-1">الرابط</label>
                    <input
                      v-model="attachment.url"
                      type="url"
                      required
                      placeholder="https://example.com/file.pdf"
                      class="w-full rounded border border-primary px-2 py-1 text-sm"
                    />
                  </div>
                  <div class="md:col-span-3">
                    <label class="text-xs text-secondary mb-1">اسم المرفق (اختياري)</label>
                    <input
                      v-model="attachment.name"
                      type="text"
                      placeholder="اسم المرفق"
                      class="w-full rounded border border-primary px-2 py-1 text-sm"
                      
                    />
                  </div>
                </div>
                <button
                  type="button"
                  @click="removeAttachment(index)"
                  class="text-red-500 hover:text-red-700 p-1"
                  title="حذف المرفق"
                >
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div v-else class="text-center py-4 text-secondary border border-dashed border-primary rounded-lg">
              <DocumentIcon class="h-8 w-8 mx-auto mb-2" />
              <p class="text-sm">لا توجد مرفقات</p>
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
              {{ article ? 'تحديث' : 'حفظ' }}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import { PlusIcon, TrashIcon, DocumentIcon } from '@heroicons/vue/24/outline'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import Button from '@/components/dashboard/component/ui/Button.vue'
import { useArticleStore } from '@/stores/articles'
import type { Article } from '@/types/article'
import api from '@/utils/api'

interface Props {
  article?: Article | null
}

interface Attachment {
  id?: string;
  url: string;
  type: string;
  name?: string;
}

const props = defineProps<Props>()
const emit = defineEmits<{
  save: []
  cancel: []
}>()

const articleStore = useArticleStore()
const loading = ref(false)
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const scaleCategories = ref<any[]>([])
const deletedAttachments = ref<string[]>([]) // المرفقات المحذوفة

const articleCategories = computed(() => articleStore.categories)

const formData = ref({
  title_ar: '',
  title_en: '',
  introduction_ar: '',
  introduction_en: '',
  excerpt_ar: '',
  excerpt_en: '',
  content_ar: '',
  content_en: '',
  category_id: '',
  scale_category_id: '',
  published_at: '',
  is_published: false,
  attachments: [] as Attachment[]
})

// ✅ دالة إضافة مرفق جديد
const addAttachment = () => {
  formData.value.attachments.push({
    url: '',
    type: 'file',
    name: ''
  })
}

// ✅ دالة حذف مرفق
const removeAttachment = (index: number) => {
  const attachment = formData.value.attachments[index]
  
  // إذا كان المرفق موجود في قاعدة البيانات (له id)، نضيفه للمرفقات المحذوفة
  if (attachment.id) {
    deletedAttachments.value.push(attachment.id)
  }
  
  formData.value.attachments.splice(index, 1)
}



const getImageUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  if (path.startsWith('storage/')) return `/${path}`
  return `/storage/${path}`
}

const handleImageError = (event) => {
  console.error('خطأ في تحميل صورة المقال:', event.target.src)
  event.target.style.display = 'none'
}






// ✅ دالة لجلب أنواع المقاييس
const fetchScaleCategories = async () => {
  try {
    console.log('🔄 جلب تصنيفات المقاييس...')
    const response = await api.get('/categories')
    
    if (response.data && response.data.data) {
      scaleCategories.value = response.data.data
    } else if (Array.isArray(response.data)) {
      scaleCategories.value = response.data
    } else {
      scaleCategories.value = []
    }
    
    console.log(`📂 تم تحميل ${scaleCategories.value.length} تصنيف مقياس`)
  } catch (error: any) {
    console.error('❌ فشل في جلب تصنيفات المقاييس:', error)
  }
}

const formatDateTimeLocal = (dateString: string) => {
  const date = new Date(dateString)
  return date.toISOString().slice(0, 16)
}

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    
    if (file.size > 2 * 1024 * 1024) {
      alert('حجم الصورة يجب أن يكون أقل من 2MB')
      return
    }
    
    imageFile.value = file
    
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

// تعبئة البيانات إذا كان تعديل
watch(() => props.article, (article) => {
  if (article) {
     console.log('📦 بيانات المقال المستلمة:', article)
    console.log('📎 المرفقات المستلمة:', article.attachments) 
    formData.value = {
      title_ar: article.title_ar || '',
      title_en: article.title_en || '',
      introduction_ar: article.introduction_ar || '',
      introduction_en: article.introduction_en || '',
      excerpt_ar: article.excerpt_ar || '',
      excerpt_en: article.excerpt_en || '',
      content_ar: article.content_ar || '',
      content_en: article.content_en || '',
      category_id: article.category_id || '',
      scale_category_id: article.scale_category_id || '',
      published_at: article.published_at ? formatDateTimeLocal(article.published_at) : '',
      is_published: article.is_published || false,
      attachments: article.attachments?.map((att: any) => ({
        id: att.id,
        url: att.url,
        type: att.type,
        name: att.name
      })) || []
    }
    
    // إعادة تعيين المرفقات المحذوفة
    deletedAttachments.value = []
    
   if (article.image) {
  imagePreview.value = getImageUrl(article.image)
 }
  } else {
    // إعادة تعيين النموذج
    formData.value = {
      title_ar: '',
      title_en: '',
      introduction_ar: '',
      introduction_en: '',
      excerpt_ar: '',
      excerpt_en: '',
      content_ar: '',
      content_en: '',
      category_id: '',
      scale_category_id: '',
      published_at: formatDateTimeLocal(new Date().toISOString()),
      is_published: false,
      attachments: []
    }
    imageFile.value = null
    imagePreview.value = null
    deletedAttachments.value = []
  }
}, { immediate: true, deep: true})

const handleSave = async () => {
  // التحقق من الحقول المطلوبة
  if (!formData.value.title_ar || !formData.value.title_en || 
      !formData.value.excerpt_ar || !formData.value.excerpt_en || 
      !formData.value.content_ar || !formData.value.content_en || 
      !formData.value.category_id || !formData.value.published_at) {
    alert('يرجى ملء جميع الحقول المطلوبة')
    return
  }

  loading.value = true
  
  try {
    console.log('🔄 بدء حفظ المقال...')

    const submitData = new FormData()
    
    // إضافة الحقول النصية
    submitData.append('title_ar', formData.value.title_ar)
    submitData.append('title_en', formData.value.title_en)
    submitData.append('introduction_ar', formData.value.introduction_ar)
    submitData.append('introduction_en', formData.value.introduction_en)
    submitData.append('excerpt_ar', formData.value.excerpt_ar)
    submitData.append('excerpt_en', formData.value.excerpt_en)
    submitData.append('content_ar', formData.value.content_ar)
    submitData.append('content_en', formData.value.content_en)
    submitData.append('category_id', formData.value.category_id)
    submitData.append('scale_category_id', formData.value.scale_category_id)
    submitData.append('published_at', formData.value.published_at)
    submitData.append('is_published', formData.value.is_published ? '1' : '0')

    // ✅ إصلاح: إضافة المرفقات كـ array وليس JSON string
    if (formData.value.attachments.length > 0) {
      formData.value.attachments.forEach((attachment, index) => {
        submitData.append(`attachments[${index}][url]`, attachment.url)
        submitData.append(`attachments[${index}][type]`, attachment.type)
        if (attachment.name) {
          submitData.append(`attachments[${index}][name]`, attachment.name)
        }
        if (attachment.id) {
          submitData.append(`attachments[${index}][id]`, attachment.id)
        }
      })
    }

    // ✅ إصلاح: إضافة المرفقات المحذوفة كـ array
    if (deletedAttachments.value.length > 0) {
      deletedAttachments.value.forEach((attachmentId, index) => {
        submitData.append(`deleted_attachments[${index}]`, attachmentId)
      })
    }

    // إضافة الصورة إذا كانت موجودة
    if (imageFile.value) {
      submitData.append('image', imageFile.value)
    }

    // إذا كان تعديلاً، أضف طريقة PUT
    if (props.article) {
      submitData.append('_method', 'PUT')
    }

    console.log('📤 إرسال البيانات إلى API...')
    console.log('المرفقات المرسلة:', formData.value.attachments)
    console.log('المرفقات المحذوفة:', deletedAttachments.value)

    let result
    if (props.article) {
      console.log('✏️ تحديث المقال:', props.article.id)
      result = await articleStore.updateArticle(props.article.id, submitData)
    } else {
      console.log('🆕 إنشاء مقال جديد')
      result = await articleStore.createArticle(submitData)
    }

    console.log('✅ تم الحفظ بنجاح:', result)
    
    emit('save')
    
  } catch (error: any) {
    console.error('❌ فشل في حفظ المقال:', error)
    
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

onMounted(() => {
  fetchScaleCategories()
})
</script>

<style scoped>
/* الأنماط تبقى كما هي */
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
  min-height: 200px;
  padding: 12px;
}

:deep(.ql-editor.ql-blank::before) {
  font-style: normal;
  color: #9ca3af;
}

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

:deep(.ql-editor) {
  max-height: 200px;
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