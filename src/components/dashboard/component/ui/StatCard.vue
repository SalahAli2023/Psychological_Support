<template>
	<div class="card flex items-center gap-4">
		<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300">
			<slot name="icon" />
		</div>
		<div class="min-w-0">
			<div class="text-xs text-gray-500">{{ label }}</div>
			<div class="truncate text-2xl font-semibold">{{ value }}</div>
		</div>
		<div class="ms-auto text-xs" :class="deltaClass">{{ delta }}</div>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props { label: string; value: string | number; delta?: string; positive?: boolean }
const props = withDefaults(defineProps<Props>(), { delta: '', positive: true });
const deltaClass = computed(() => props.positive ? 'text-emerald-600' : 'text-rose-600');
</script>
