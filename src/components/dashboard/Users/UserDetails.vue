<template>
  <div class="space-y-6 p-2 sm:p-4">
    <!-- رأس الصفحة -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-4">
        <button 
          @click="$router.back()"
          class="bg-gray-100 hover:bg-gray-200 text-gray-700 w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
        </button>
        <div>
          <h1 class="text-xl sm:text-2xl font-semibold text-gray-900">تفاصيل المستخدم</h1>
          <p class="text-sm text-gray-500">عرض كافة معلومات المستخدم</p>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <button 
          @click="editUser"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          تعديل
        </button>
        <button 
          @click="deleteUser"
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
          حذف
        </button>
      </div>
    </div>

    <!-- حالة التحميل -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <!-- رسالة الخطأ -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex items-center">
        <svg class="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span class="text-red-800">{{ error }}</span>
      </div>
      <button 
        @click="$router.push('/dashboard/users')"
        class="mt-2 text-sm text-red-600 hover:text-red-800 underline"
      >
        العودة لقائمة المستخدمين
      </button>
    </div>

    <!-- محتوى تفاصيل المستخدم -->
    <div v-else-if="user" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- العمود الأول: المعلومات الشخصية -->
      <div class="lg:col-span-2 space-y-6">
        <!-- البطاقة الشخصية -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">المعلومات الشخصية</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">الاسم الكامل</label>
              <p class="text-lg font-medium text-gray-900">{{ user.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">البريد الإلكتروني</label>
              <p class="text-lg text-gray-900 direction-ltr text-left">{{ user.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">رقم الهاتف</label>
              <p class="text-lg text-gray-900">{{ user.phone || 'غير محدد' }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">الدور</label>
              <span :class="roleBadgeClass(user.role)" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                {{ getRoleText(user.role) }}
              </span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">تاريخ الانضمام</label>
              <p class="text-lg text-gray-900">{{ formatDate(user.joined_at) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">تاريخ الإنشاء</label>
              <p class="text-lg text-gray-900">{{ formatDateTime(user.created_at) }}</p>
            </div>
          </div>
        </div>

        <!-- السيرة الذاتية -->
        <div v-if="user.bio" class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">السيرة الذاتية</h2>
          <p class="text-gray-700 leading-relaxed">{{ user.bio }}</p>
        </div>
      </div>

      <!-- العمود الثاني: المعلومات الإضافية -->
      <div class="space-y-6">
        <!-- صورة المستخدم -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm text-center">
          <div class="w-32 h-32 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl font-bold text-brand-600">
              {{ getUserInitials(user.name) }}
            </span>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">{{ user.name }}</h3>
          <p class="text-sm text-gray-500">{{ getRoleText(user.role) }}</p>
          <div class="mt-4 flex justify-center space-x-2 space-x-reverse">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              ID: {{ user.id }}
            </span>
          </div>
        </div>

        <!-- الإحصائيات -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">معلومات إضافية</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">الحالة</span>
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                نشط
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">البريد مفعل</span>
              <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-500">آخر تحديث</span>
              <span class="text-sm text-gray-900">{{ formatDateTime(user.updated_at) }}</span>
            </div>
          </div>
        </div>

        <!-- الإجراءات السريعة -->
        <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">الإجراءات السريعة</h3>
          <div class="space-y-2">
            <button 
              @click="sendMessage"
              class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
              إرسال رسالة
            </button>
            <button 
              @click="resetPassword"
              class="w-full bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
              </svg>
              إعادة تعيين كلمة المرور
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- مودال التعديل -->
    <UserModal 
      :open="showEditModal"
      :user="user"
      @close="showEditModal = false"
      @save="handleUpdateUser"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../../../stores/users'
import UserModal from './UserModal.vue'
import type { User } from '../../../types/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const user = ref<User | null>(null)
const loading = ref(false)
const error = ref('')
const showEditModal = ref(false)

const userId = route.params.id as string

// جلب بيانات المستخدم
const fetchUser = async () => {
  loading.value = true
  error.value = ''
  
  try {
    user.value = await userStore.getUserById(parseInt(userId))
  } catch (err: any) {
    error.value = err.message || 'فشل في تحميل بيانات المستخدم'
    console.error('Error fetching user:', err)
  } finally {
    loading.value = false
  }
}

// تنسيق التاريخ
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'غير محدد'
    }
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    return 'غير محدد'
  }
}

// تنسيق التاريخ والوقت
const formatDateTime = (dateString: string) => {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'غير محدد'
    }
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'غير محدد'
  }
}

// ألوان البادجات حسب الدور
const roleBadgeClass = (role: string) => {
  switch (role) {
    case 'Admin':
      return 'bg-red-100 text-red-800'
    case 'Therapist':
      return 'bg-blue-100 text-blue-800'
    case 'Client':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// نص الدور بالعربية
const getRoleText = (role: string) => {
  const roles: { [key: string]: string } = {
    'Admin': 'مدير',
    'Therapist': 'معالج',
    'Client': 'عميل'
  }
  return roles[role] || role
}

// الحروف الأولى من الاسم
const getUserInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// الإجراءات
const editUser = () => {
  showEditModal.value = true
}

const deleteUser = async () => {
  if (!user.value) return

  if (confirm(`هل أنت متأكد من حذف المستخدم "${user.value.name}"؟`)) {
    try {
      await userStore.deleteUser(user.value.id)
      router.push('/dashboard/users')
    } catch (err: any) {
      alert(err.message || 'فشل في حذف المستخدم')
    }
  }
}

const handleUpdateUser = async (userData: any) => {
  try {
    await userStore.updateUser(user.value!.id, userData)
    await fetchUser() // إعادة تحميل البيانات
    showEditModal.value = false
  } catch (err: any) {
    alert(err.message || 'فشل في تحديث المستخدم')
  }
}

const sendMessage = () => {
  if (user.value) {
    alert(`سيتم إرسال رسالة إلى ${user.value.name}`)
  }
}

const resetPassword = () => {
  if (user.value) {
    if (confirm(`هل تريد إعادة تعيين كلمة المرور للمستخدم "${user.value.name}"؟`)) {
      alert('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريد المستخدم')
    }
  }
}

// جلب البيانات عند تحميل الكومبوننت
onMounted(() => {
  fetchUser()
})
</script>

<style scoped>
.direction-ltr {
  direction: ltr;
  text-align: left;
}
</style>