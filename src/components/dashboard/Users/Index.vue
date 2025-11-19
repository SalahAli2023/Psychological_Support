<template>
  <div class="space-y-4 p-2 sm:p-4">
    <!-- عنوان + أدوات البحث -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <h1 class="text-xl sm:text-2xl font-semibold text-primary">Users</h1>
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
        <input 
          v-model="q" 
          placeholder="Search users" 
          class="w-full sm:w-auto rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary" 
          @input="handleSearch"
        />
        <select 
          v-model="role" 
          class="w-full sm:w-auto rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
          @change="handleFilter"
        >
          <option value="">All</option>
          <option>Admin</option>
          <option>Therapist</option>
          <option>Client</option>
        </select>
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
    <div v-else class="overflow-x-auto">
      <table class="min-w-full text-sm border-collapse border border-primary">
        <thead>
          <tr class="text-start text-secondary bg-primary">
            <th class="px-3 py-2 border-b border-primary text-start">Name</th>
            <th class="px-3 py-2 border-b border-primary text-start">Email</th>
            <th class="px-3 py-2 border-b border-primary text-start">Role</th>
            <th class="px-3 py-2 border-b border-primary text-start">Phone</th>
            <th class="px-3 py-2 border-b border-primary text-start">Joined At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in userStore.items" :key="u.id" class="border-t border-primary">
            <td class="px-3 py-2 text-primary">{{ u.name }}</td>
            <td class="px-3 py-2 text-primary break-words">{{ u.email }}</td>
            <td class="px-3 py-2">
              <span :class="roleBadgeClass(u.role)">{{ u.role }}</span>
            </td>
            <td class="px-3 py-2 text-primary">{{ u.phone || 'N/A' }}</td>
            <td class="px-3 py-2 text-primary">{{ formatDate(u.joined_at) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- حالة عدم وجود بيانات -->
      <div v-if="userStore.items.length === 0" class="text-center py-8 text-primary">
        No users found
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '../../../stores/users';
import type { UserRole } from '../../../types/user';

const userStore = useUserStore();

const q = ref('');
const role = ref('');
let searchTimeout: ReturnType<typeof setTimeout>;

// دالة البحث مع debounce
const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    userStore.fetchUsers(q.value, role.value);
  }, 500);
};

const handleFilter = () => {
  userStore.fetchUsers(q.value, role.value);
};

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? 'N/A' 
      : date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
  } catch {
    return 'N/A';
  }
};

const roleBadgeClass = (role: UserRole) => {
  const baseClasses = 'badge text-primary';
  switch (role) {
    case 'Admin':
      return `${baseClasses} bg-red-100 border-red-200`;
    case 'Therapist':
      return `${baseClasses} bg-blue-100 border-blue-200`;
    case 'Client':
      return `${baseClasses} bg-green-100 border-green-200`;
    default:
      return baseClasses;
  }
};

onUnmounted(() => {
  if (searchTimeout) clearTimeout(searchTimeout);
});

onMounted(() => {
  userStore.fetchUsers();
});

</script>
