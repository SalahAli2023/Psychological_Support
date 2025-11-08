<template>
	<div class="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
		<div class="h-full bg-indigo-600 dark:bg-indigo-500" :style="{ width: pct + '%' }"></div>
	</div>
</template>
<script setup lang="ts">
interface Props { value: number; max?: number }
const props = withDefaults(defineProps<Props>(), { max: 100 });
const pct = computed(() => Math.min(100, Math.round((props.value / props.max) * 100)));
</script>
