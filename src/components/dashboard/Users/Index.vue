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
        />
        <select 
          v-model="role" 
          class="w-full sm:w-auto rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
        >
          <option value="">All</option>
          <option>Admin</option>
          <option>Therapist</option>
          <option>Client</option>
        </select>
      </div>
    </div>

    <!-- الجدول مع scroll أفقي على الجوال -->
    <div class="overflow-x-auto">
      <table class="min-w-full text-sm border-collapse border border-primary">
        <thead>
          <tr class="text-start text-secondary bg-primary">
            <th class="px-3 py-2 border-b border-primary text-start">Name</th>
            <th class="px-3 py-2 border-b border-primary text-start">Email</th>
            <th class="px-3 py-2 border-b border-primary text-start">Role</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in filtered" :key="u.id" class="border-t border-primary">
            <td class="px-3 py-2 text-primary">{{ u.name }}</td>
            <td class="px-3 py-2 text-primary break-words">{{ u.email }}</td>
            <td class="px-3 py-2"><span class="badge text-primary">{{ u.role }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface User { id: string; name: string; email: string; role: 'Admin'|'Therapist'|'Client' }
const users = ref<User[]>([
  { id: 'u1', name: 'Aisha', email: 'aisha@example.com', role: 'Client' },
  { id: 'u2', name: 'Omar', email: 'omar@example.com', role: 'Therapist' },
  { id: 'u3', name: 'Lina', email: 'lina@example.com', role: 'Admin' },
  { id: 'u4', name: 'Khaled', email: 'khaled@example.com', role: 'Client' },
]);

const q = ref('');
const role = ref('');
const filtered = computed(() => users.value.filter(u =>
  (!q.value || u.name.toLowerCase().includes(q.value.toLowerCase()) || u.email.toLowerCase().includes(q.value.toLowerCase())) &&
  (!role.value || u.role === role.value as any)
));
</script>
