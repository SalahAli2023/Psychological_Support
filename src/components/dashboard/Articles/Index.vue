<template>
	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold text-primary">{{ t('nav.articles') }}</h1>
			<Button variant="primary" @click="openCreate">{{ creating ? t('dashboard.create_article') : t('dashboard.create_article') }}</Button>
		</div>
		<Card>
			<template #header>Articles</template>
			<div class="overflow-x-auto">
				<table class="min-w-full text-sm">
					<thead>
						<tr class="text-start text-secondary">
							<th class="px-3 py-2 text-start">Title</th>
							<th class="px-3 py-2 text-start">Author</th>
							<th class="px-3 py-2 text-start">Updated</th>
							<th class="px-3 py-2 text-start"></th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="a in articles" :key="a.id" class="border-t border-primary">
							<td class="px-3 py-2 text-primary">{{ a.title }}</td>
							<td class="px-3 py-2 text-primary">{{ a.author }}</td>
							<td class="px-3 py-2 text-primary">{{ new Date(a.updatedAt).toLocaleDateString() }}</td>
							<td class="px-3 py-2">
								<Button size="sm" variant="outline" @click="edit(a)">Edit</Button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</Card>

		<!-- Modal -->
		<div v-if="modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3" @click.self="close">
			<div class="w-full max-w-3xl rounded-xl border border-primary bg-primary p-4 shadow-lg">
				<div class="mb-3 flex items-center justify-between">
					<div class="text-lg font-semibold text-primary">{{ current?.id ? 'Edit Article' : 'Create Article' }}</div>
					<button class="inline-grid h-9 w-9 place-items-center rounded-lg hover:bg-tertiary text-primary" @click="close">✕</button>
				</div>
				<div class="grid gap-3">
					<input 
						v-model="form.title" 
						placeholder="Title" 
						class="rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary" 
					/>
					<input 
						v-model="form.author" 
						placeholder="Author" 
						class="rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary" 
					/>
					<QuillEditor 
						theme="snow" 
						v-model:content="form.content" 
						contentType="html" 
						class="h-64 rounded-lg bg-primary text-primary" 
					/>
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

interface Article { id: string; title: string; author: string; content: string; updatedAt: string }

const { t } = useI18n();
const articles = ref<Article[]>([
	{ id: '1', title: 'Mindfulness Basics', author: 'Dr. Lina', content: '<p>...</p>', updatedAt: new Date().toISOString() },
]);

const modal = ref(false);
const current = ref<Article | null>(null);
const form = ref({ title: '', author: '', content: '' });

function openCreate() {
	current.value = null;
	form.value = { title: '', author: '', content: '' };
	modal.value = true;
}
function edit(a: Article) {
	current.value = a;
	form.value = { title: a.title, author: a.author, content: a.content };
	modal.value = true;
}
function close() { modal.value = false; }
function save() {
	if (current.value) {
		current.value.title = form.value.title;
		current.value.author = form.value.author;
		current.value.content = form.value.content;
		current.value.updatedAt = new Date().toISOString();
	} else {
		articles.value.unshift({ id: Date.now().toString(), title: form.value.title, author: form.value.author, content: form.value.content, updatedAt: new Date().toISOString() });
	}
	modal.value = false;
}
</script>