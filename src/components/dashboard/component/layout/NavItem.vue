<template>
    <RouterLink
        :to="{ name: toName as any }"
        :class="[
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-200',
            isActive 
                ? 'bg-brand-500 text-white' 
                : subItem 
                    ? 'text-primary hover:bg-tertiary ms-2'
                    : 'text-primary hover:bg-tertiary'
        ]"
    >
        <component :is="IconComp" class="h-5 w-5 text-inherit" />
        <span v-if="showLabel" class="truncate">{{ label }}</span>
    </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import {CalendarDaysIcon} from '@heroicons/vue/24/outline';
import { 
    HomeIcon, 
    CalendarIcon, 
    UsersIcon, 
    DocumentTextIcon, 
    AcademicCapIcon, 
    FolderIcon, 
    ChartBarIcon, 
    Cog6ToothIcon,
    CogIcon,
    ShieldCheckIcon,
    BuildingOfficeIcon,
    BellIcon,
    CloudIcon,
    ChartBarSquareIcon
} from '@heroicons/vue/24/outline';

interface Props { 
    toName: string; 
    label: string; 
    icon?: string; 
    showLabel?: boolean;
    subItem?: boolean;
}
const props = withDefaults(defineProps<Props>(), { 
    icon: 'home', 
    showLabel: true,
    subItem: false 
});

const route = useRoute();
const isActive = computed(() => route.name === (props.toName as any));

const icons: Record<string, any> = {
	home: HomeIcon,
	calendar: CalendarIcon,
	events: CalendarDaysIcon,
	users: UsersIcon,
	document: DocumentTextIcon,
	academic: AcademicCapIcon,
	folder: FolderIcon,
	chart: ChartBarIcon,
	cog: Cog6ToothIcon,
    home: HomeIcon,
    calendar: CalendarIcon,
    users: UsersIcon,
    document: DocumentTextIcon,
    academic: AcademicCapIcon,
    folder: FolderIcon,
    chart: ChartBarIcon,
    chartBar: ChartBarSquareIcon,
    cog: Cog6ToothIcon,
    cogSmall: CogIcon,
    shield: ShieldCheckIcon,
    building: BuildingOfficeIcon,
    bell: BellIcon,
    cloud: CloudIcon,
};
const IconComp = computed(() => icons[props.icon] || HomeIcon);
</script>