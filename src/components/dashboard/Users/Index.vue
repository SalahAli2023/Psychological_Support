<template>
  <div class="space-y-4 p-2 sm:p-4">
    <!-- عنوان + أدوات البحث + زر الإضافة -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <h1 class="text-xl sm:text-2xl font-semibold text-primary">إدارة المستخدمين</h1>
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
        <input 
          v-model="q" 
          placeholder="ابحث بالمستخدمين..." 
          class="w-full sm:w-auto rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary" 
          @input="handleSearch"
        />
        <select 
          v-model="role" 
          class="w-full sm:w-auto rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
          @change="handleFilter"
        >
          <option value="">جميع المستخدمين</option>
          <option>Admin</option>
          <option>Therapist</option>
          <option>Client</option>
        </select>
        <button 
          @click="showAddModal = true"
          class="bg-brand-500 hover:bg-[#8FAE2F] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          إضافة مستخدم
        </button>
      </div>
    </div>

    <!-- حالة التحميل -->
    <div v-if="userStore.loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <!-- رسالة الخطأ -->
    <div v-else-if="userStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ userStore.error }}
      <button @click="userStore.clearError()" class="float-right font-bold">×</button>
    </div>

    <!-- الجدول -->
    <div v-else class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full text-sm">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المستخدم</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">البريد الإلكتروني</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الدور</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الهاتف</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الانضمام</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in userStore.items" :key="user.id" class="hover:bg-gray-50">
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 bg-brand-100 rounded-full flex items-center justify-center">
                  <span class="text-brand-600 font-medium text-sm">
                    {{ getUserInitials(user.name) }}
                  </span>
                </div>
                <div class="mr-4">
                  <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                  <div class="text-sm text-gray-500">ID: {{ user.id }}</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 direction-ltr text-left">{{ user.email }}</td>
            <td class="px-4 py-4 whitespace-nowrap">
              <span :class="roleBadgeClass(user.role)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                {{ getRoleText(user.role) }}
              </span>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.phone || 'غير محدد' }}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(user.joined_at) }}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex items-center gap-2 justify-end">
                <button 
                  @click="viewUser(user)"
                  class="text-blue-600 hover:text-blue-900 transition-colors"
                  title="عرض"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
                <button 
                  @click="editUser(user)"
                  class="text-green-600 hover:text-green-900 transition-colors"
                  title="تعديل"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </button>
                <button 
                  @click="deleteUser(user)"
                  class="text-red-600 hover:text-red-900 transition-colors"
                  title="حذف"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- حالة عدم وجود بيانات -->
      <div v-if="userStore.items.length === 0" class="text-center py-8 text-gray-500">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">لا يوجد مستخدمين</h3>
        <p class="mt-1 text-sm text-gray-500">ابدأ بإضافة مستخدم جديد.</p>
      </div>
    </div>

    <!-- مودال إضافة/تعديل المستخدم -->
    <UserModal 
      :open="showAddModal || showEditModal"
      :user="selectedUser"
      @close="closeModal"
      @save="handleSaveUser"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../../stores/users';
import UserModal from './UserModal.vue';
import type { User } from '../../../types/user';

const router = useRouter()
const userStore = useUserStore();

const q = ref('');
const role = ref('');
const showAddModal = ref(false);
const showEditModal = ref(false);
const selectedUser = ref<User | null>(null);
let searchTimeout: ReturnType<typeof setTimeout>;

// دالة البحث مع debounce
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    userStore.fetchUsers(q.value, role.value);
  }, 500);
};

// دالة التصفية
const handleFilter = () => {
  userStore.fetchUsers(q.value, role.value);
};

// تنسيق التاريخ
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'غير محدد';
    }
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'غير محدد';
  }
};

// ألوان البادجات حسب الدور
const roleBadgeClass = (role: string) => {
  switch (role) {
    case 'Admin':
      return 'bg-red-100 text-red-800';
    case 'Therapist':
      return 'bg-blue-100 text-blue-800';
    case 'Client':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// نص الدور بالعربية
const getRoleText = (role: string) => {
  const roles: { [key: string]: string } = {
    'Admin': 'مدير',
    'Therapist': 'معالج',
    'Client': 'عميل'
  };
  return roles[role] || role;
};

// الحروف الأولى من الاسم
const getUserInitials = (name: string) => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// الإجراءات
const viewUser = (user: User) => {
  selectedUser.value = user;
  // هنا يمكنك فتح صفحة التفاصيل أو عرض بيانات المستخدم
  router.push(`/dashboard/users/${user.id}`);
  console.log('View user:', user);
};

const editUser = (user: User) => {
  selectedUser.value = user;
  showEditModal.value = true;
};

const deleteUser = async (user: User) => {
  if (confirm(`هل أنت متأكد من حذف المستخدم "${user.name}"؟`)) {
    try {
      await userStore.deleteUser(user.id);
      await userStore.fetchUsers(); // إعادة تحميل البيانات
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }
};

const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  selectedUser.value = null;
};

const handleSaveUser = async (userData: any) => {
  try {
    if (selectedUser.value) {
      // تحديث مستخدم موجود
      await userStore.updateUser(selectedUser.value.id, userData);
    } else {
      // إضافة مستخدم جديد
      await userStore.createUser(userData);
    }
    closeModal();
    await userStore.fetchUsers(); // إعادة تحميل البيانات
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

// تنظيف الـ timeout عند إلغاء تحميل الكومبوننت
onUnmounted(() => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
});

// جلب البيانات عند تحميل الكومبوننت
onMounted(() => {
  userStore.fetchUsers();
});
</script>

<style scoped>
.direction-ltr {
  direction: ltr;
  text-align: left;
}
</style>