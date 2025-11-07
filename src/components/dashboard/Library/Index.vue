<template>
	<div class="space-y-4">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-semibold">Library</h1>
			<Button variant="secondary" @click="upload">Upload</Button>
		</div>
		<Card>
			<template #header>Resources</template>
			<ul class="divide-y divide-gray-200 dark:divide-gray-800">
				<li v-for="r in resources" :key="r.id" class="flex items-center justify-between px-2 py-3">
					<div>
						<div class="font-medium">{{ r.name }}</div>
						<div class="text-sm text-gray-500">{{ r.type }} • {{ r.size }}</div>
					</div>
					<Button size="sm" variant="outline">Download</Button>
				</li>
			</ul>
		</Card>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from '@/components/dashboard/component/ui/Button.vue';
import Card from '@/components/dashboard/component/ui/Card.vue';
interface Res { id: string; name: string; type: string; size: string }
const resources = ref<Res[]>([
	{ id: 'r1', name: 'Cognitive Therapy Basics.pdf', type: 'PDF', size: '1.2MB' },
	{ id: 'r2', name: 'Breathing Techniques.mp4', type: 'Video', size: '24MB' },
]);

function upload() {
	alert('Mock upload UI only');
}
</script>
