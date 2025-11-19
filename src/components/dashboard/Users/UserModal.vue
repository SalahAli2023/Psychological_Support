<template>
  <div 
    v-if="open" 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4"
  >
    <div class="w-full max-w-2xl max-h-[95vh] overflow-y-auto bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-lg">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg sm:text-xl font-semibold text-gray-900">
          {{ user ? 'تعديل بيانات المستخدم' : 'إضافة مستخدم جديد' }}
        </h2>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 rounded-lg flex items-center justify-center"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- المعلومات الأساسية -->
        <div class="space-y-4">
          <h3 class="text-md font-semibold text-gray-900 border-b pb-2">المعلومات الأساسية</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل *</label>
              <input 
                v-model="form.name"
                type="text"
                required
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="أدخل الاسم الكامل"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني *</label>
              <input 
                v-model="form.email"
                type="email"
                required
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent direction-ltr"
                placeholder="example@email.com"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">الدور *</label>
              <select 
                v-model="form.role"
                required
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                <option value="">اختر الدور</option>
                <option value="Admin">مدير</option>
                <option value="Therapist">معالج</option>
                <option value="Client">عميل</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
              <input 
                v-model="form.phone"
                type="tel"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent direction-ltr"
                placeholder="+966 5X XXX XXXX"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">كلمة المرور {{ user ? '(اتركه فارغاً للحفاظ على كلمة المرور الحالية)' : '*' }}</label>
              <input 
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                :required="!user"
                class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent direction-ltr"
                placeholder="أدخل كلمة المرور"
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="mt-1 text-xs text-gray-600 hover:text-gray-800"
              >
                {{ showPassword ? 'إخفاء' : 'إظهار' }} كلمة المرور
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">السيرة الذاتية</label>
            <textarea 
              v-model="form.bio"
              rows="3"
              class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="أدخل وصفاً عن المستخدم..."
            />
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button 
            type="button"
            @click="$emit('close')"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            إلغاء
          </button>
          <button 
            type="submit"
            class="bg-brand-500 hover:bg-[#8FAE2F] text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {{ user ? 'تحديث' : 'إضافة' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import type { User } from '../../../types/user'

interface Props {
  open: boolean
  user?: User | null
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'save'])

const showPassword = ref(false)

const form = reactive({
  name: '',
  email: '',
  role: '',
  phone: '',
  password: '',
  bio: ''
})

// تحديث النموذج عند تغيير المستخدم
watch(() => props.user, (user) => {
  if (user) {
    Object.assign(form, {
      name: user.name || '',
      email: user.email || '',
      role: user.role || '',
      phone: user.phone || '',
      password: '', // لا نعرض كلمة المرور الحالية
      bio: user.bio || ''
    })
  } else {
    // إعادة التعيين للنموذج الجديد
    Object.assign(form, {
      name: '',
      email: '',
      role: '',
      phone: '',
      password: '',
      bio: ''
    })
  }
}, { immediate: true })

const handleSubmit = () => {
  // تحقق من صحة البيانات
  if (!form.name || !form.email || !form.role) {
    alert('يرجى ملء جميع الحقول المطلوبة')
    return
  }

  if (!props.user && !form.password) {
    alert('كلمة المرور مطلوبة للمستخدمين الجدد')
    return
  }

  // إرسال البيانات
  emit('save', { ...form })
}
</script>

<style scoped>
.direction-ltr {
  direction: ltr;
  text-align: left;
}
</style>