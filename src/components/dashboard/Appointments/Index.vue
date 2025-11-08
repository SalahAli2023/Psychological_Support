<template>
	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold">Appointments</h1>
			<Button variant="primary" @click="openCreate">Book Session</Button>
		</div>
		<div class="flex flex-wrap items-center gap-2">
			<select v-model="status" class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">
				<option value="">All statuses</option>
				<option value="scheduled">Scheduled</option>
				<option value="completed">Completed</option>
				<option value="cancelled">Cancelled</option>
			</select>
			<input v-model="therapist" placeholder="Therapist" class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" />
			<input v-model="date" type="date" class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" />
		</div>
		<Card>
			<template #header>List</template>
			<table class="min-w-full text-sm">
				<thead>
					<tr class="text-start text-gray-500">
						<th class="px-3 py-2 text-start">Client</th>
						<th class="px-3 py-2 text-start">Therapist</th>
						<th class="px-3 py-2 text-start">Date</th>
						<th class="px-3 py-2 text-start">Status</th>
						<th class="px-3 py-2 text-start"></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="a in filtered" :key="a.id" class="border-t border-gray-200 dark:border-gray-800">
						<td class="px-3 py-2">{{ a.clientName }}</td>
						<td class="px-3 py-2">{{ a.therapist }}</td>
						<td class="px-3 py-2">{{ new Date(a.startsAt).toLocaleString() }}</td>
						<td class="px-3 py-2">
							<span class="badge" :class="{
								'border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300': a.status==='scheduled',
								'border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300': a.status==='completed',
								'border-rose-300 text-rose-700 dark:border-rose-700 dark:text-rose-300': a.status==='cancelled',
							}">{{ a.status }}</span>
						</td>
						<td class="px-3 py-2">
							<Button size="sm" variant="outline" @click="edit(a)">Edit</Button>
						</td>
					</tr>
				</tbody>
			</table>
		</Card>

		<!-- Modal -->
		<div v-if="modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3" @click.self="close">
			<div class="w-full max-w-xl rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900">
				<div class="mb-3 flex items-center justify-between">
					<div class="text-lg font-semibold">{{ current?.id ? 'Edit Session' : 'Book Session' }}</div>
					<button class="inline-grid h-9 w-9 place-items-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" @click="close">✕</button>
				</div>
				<div class="grid gap-3">
					<input v-model="form.clientName" placeholder="Client" class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" />
					<input v-model="form.therapist" placeholder="Therapist" class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" />
					<input v-model="form.startsAt" type="datetime-local" class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" />
					<select v-model="form.status" class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">
						<option value="scheduled">Scheduled</option>
						<option value="completed">Completed</option>
						<option value="cancelled">Cancelled</option>
					</select>
				</div>
				<div class="mt-4 flex justify-end gap-2">
					<Button variant="outline" @click="close">Cancel</Button>
					<Button variant="primary" @click="save">Save</Button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Button from '@/components/dashboard/component/ui/Button.vue';
import Card from '@/components/dashboard/component/ui/Card.vue';

interface Appointment { id: string; clientName: string; therapist: string; startsAt: string; status: 'scheduled'|'completed'|'cancelled' }
const items = ref<Appointment[]>([
	{ id: 'a1', clientName: 'Aisha', therapist: 'Dr. Omar', startsAt: new Date().toISOString(), status: 'scheduled' },
	{ id: 'a2', clientName: 'Khaled', therapist: 'Dr. Lina', startsAt: new Date(Date.now()+86400000).toISOString(), status: 'scheduled' },
	{ id: 'a3', clientName: 'Sara', therapist: 'Dr. Omar', startsAt: new Date(Date.now()+2*86400000).toISOString(), status: 'completed' },
]);

const status = ref('');
const therapist = ref('');
const date = ref('');

const filtered = computed(() => items.value.filter(a =>
	(!status.value || a.status === status.value) &&
	(!therapist.value || a.therapist.toLowerCase().includes(therapist.value.toLowerCase())) &&
	(!date.value || a.startsAt.startsWith(date.value))
));

const modal = ref(false);
const current = ref<Appointment | null>(null);
const form = ref<Appointment>({ id: '', clientName: '', therapist: '', startsAt: '', status: 'scheduled' });

function openCreate() { current.value = null; form.value = { id: '', clientName: '', therapist: '', startsAt: '', status: 'scheduled' }; modal.value = true; }
function edit(a: Appointment) { current.value = a; form.value = { ...a }; modal.value = true; }
function close() { modal.value = false; }
function save() {
	if (current.value) {
		Object.assign(current.value, form.value);
	} else {
		items.value.unshift({ ...form.value, id: Date.now().toString() });
	}
	modal.value = false;
}
</script>
