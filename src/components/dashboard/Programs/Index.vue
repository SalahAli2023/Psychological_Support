<template>
	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold">{{ t('nav.programs') }}</h1>
			<Button variant="primary" @click="openCreate">Add Program</Button>
		</div>
		<Card>
			<template #header>Programs</template>
			<ul class="divide-y divide-gray-200 dark:divide-gray-800">
				<li v-for="p in programs" :key="p.id" class="flex items-center justify-between px-2 py-3">
					<div>
						<div class="font-medium">{{ p.title }}</div>
						<div class="text-sm text-gray-500">{{ p.sessions.length }} sessions</div>
					</div>
					<div class="flex items-center gap-2">
						<Button size="sm" variant="outline" @click="edit(p)">Edit</Button>
					</div>
				</li>
			</ul>
		</Card>

		<!-- Modal -->
		<div v-if="modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3" @click.self="close">
			<div class="w-full max-w-3xl rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900">
				<div class="mb-3 flex items-center justify-between">
					<div class="text-lg font-semibold">{{ current?.id ? 'Edit Program' : 'Add Program' }}</div>
					<button class="inline-grid h-9 w-9 place-items-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" @click="close">✕</button>
				</div>
				<div class="grid gap-3">
					<input v-model="form.title" placeholder="Title" class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" />
					<QuillEditor theme="snow" v-model:content="form.description" contentType="html" class="h-64 rounded-lg bg-white dark:bg-gray-900" />
					<label class="text-sm">Sessions</label>
					<div class="space-y-2">
						<div v-for="(s,idx) in form.sessions" :key="idx" class="flex items-center gap-2">
							<input v-model="form.sessions[idx]" class="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" placeholder="Session title" />
							<Button size="sm" variant="outline" @click="form.sessions.splice(idx,1)">Remove</Button>
						</div>
						<Button size="sm" variant="secondary" @click="form.sessions.push('')">Add Session</Button>
					</div>
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
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@/components/dashboard/component/ui/Button.vue';
import Card from '@/components/dashboard/component/ui/Card.vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

interface Program { id: string; title: string; description: string; sessions: string[] }

const { t } = useI18n();
const programs = ref<Program[]>([
	{ id: 'p1', title: 'Anxiety Relief Program', description: '<p>...</p>', sessions: ['Intro', 'Breathing', 'CBT Basics'] },
]);

const modal = ref(false);
const current = ref<Program | null>(null);
const form = ref<Program>({ id: '', title: '', description: '', sessions: [] });

function openCreate() {
	current.value = null;
	form.value = { id: '', title: '', description: '', sessions: [] };
	modal.value = true;
}
function edit(p: Program) {
	current.value = p;
	form.value = { id: p.id, title: p.title, description: p.description, sessions: [...p.sessions] };
	modal.value = true;
}
function close() { modal.value = false; }
function save() {
	if (current.value) {
		current.value.title = form.value.title;
		current.value.description = form.value.description;
		current.value.sessions = [...form.value.sessions];
	} else {
		programs.value.unshift({ id: Date.now().toString(), title: form.value.title, description: form.value.description, sessions: [...form.value.sessions] });
	}
	modal.value = false;
}
</script>
