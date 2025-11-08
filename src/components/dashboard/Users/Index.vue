<template>
	<div class="space-y-4">
		<div class="flex flex-wrap items-center justify-between gap-2">
			<h1 class="text-2xl font-semibold">Users</h1>
			<div class="flex items-center gap-2">
				<input v-model="q" placeholder="Search users" class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" />
				<select v-model="role" class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">
					<option value="">All</option>
					<option>Admin</option>
					<option>Therapist</option>
					<option>Client</option>
				</select>
			</div>
		</div>
		<Card>
			<template #header>Users</template>
			<table class="min-w-full text-sm">
				<thead>
					<tr class="text-start text-gray-500">
						<th class="px-3 py-2 text-start">Name</th>
						<th class="px-3 py-2 text-start">Email</th>
						<th class="px-3 py-2 text-start">Role</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="u in filtered" :key="u.id" class="border-t border-gray-200 dark:border-gray-800">
						<td class="px-3 py-2">{{ u.name }}</td>
						<td class="px-3 py-2">{{ u.email }}</td>
						<td class="px-3 py-2"><span class="badge">{{ u.role }}</span></td>
					</tr>
				</tbody>
			</table>
		</Card>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Card from '@/components/dashboard/component/ui/Card.vue';

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
