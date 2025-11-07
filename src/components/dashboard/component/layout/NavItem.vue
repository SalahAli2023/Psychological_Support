<template>
	<RouterLink
		:to="{ name: toName as any }"
		:class="[
			'flex items-center gap-3 rounded-lg px-3 py-2 text-sm',
			isActive ? 'bg-brand-500 text-white' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
		]"
	>
		<component :is="IconComp" class="h-5 w-5" />
		<span v-if="showLabel" class="truncate">{{ label }}</span>
	</RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import { HomeIcon, CalendarIcon, UsersIcon, DocumentTextIcon, AcademicCapIcon, FolderIcon, ChartBarIcon, Cog6ToothIcon } from '@heroicons/vue/24/outline';

interface Props { toName: string; label: string; icon?: string; showLabel?: boolean }
const props = withDefaults(defineProps<Props>(), { icon: 'home', showLabel: true });

const route = useRoute();
const isActive = computed(() => route.name === (props.toName as any));

const icons: Record<string, any> = {
	home: HomeIcon,
	calendar: CalendarIcon,
	users: UsersIcon,
	document: DocumentTextIcon,
	academic: AcademicCapIcon,
	folder: FolderIcon,
	chart: ChartBarIcon,
	cog: Cog6ToothIcon,
};
const IconComp = computed(() => icons[props.icon] || HomeIcon);
</script>
