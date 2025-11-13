<template>
    <div class="relative">
        <!-- الزر الرئيسي -->
        <button
            @click="toggleDropdown"
            :class="[
                'flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-200 w-full',
                isActive 
                    ? 'bg-brand-500 text-white' 
                    : 'text-primary hover:bg-tertiary'
            ]"
        >
            <div class="flex items-center gap-3">
                <component :is="IconComp" class="h-5 w-5 text-inherit" />
                <span v-if="showLabel" class="truncate">{{ label }}</span>
            </div>
            <ChevronDownIcon 
                :class="[
                    'h-4 w-4 transition-transform duration-200',
                    dropdownOpen ? 'rotate-180' : ''
                ]" 
            />
        </button>

        <!-- القائمة المضمّنة (ليست منسدلة خارجية) -->
        <transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="transform opacity-0 max-h-0"
            enter-to-class="transform opacity-100 max-h-96"
            leave-active-class="transition-all duration-150 ease-in"
            leave-from-class="transform opacity-100 max-h-96"
            leave-to-class="transform opacity-0 max-h-0"
        >
            <div
                v-if="dropdownOpen && !collapsed"
                class="overflow-hidden"
            >
                <div class="ml-6 space-y-1 border-s-2 border-tertiary ps-3 py-1">
                    <div 
                        v-for="item in items" 
                        :key="item.toName"
                        @click="selectItem(item)"
                        :class="[
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-200 cursor-pointer',
                            isItemActive(item) 
                                ? 'bg-brand-500 text-white' 
                                : 'text-primary hover:bg-tertiary'
                        ]"
                    >
                        <component :is="getItemIcon(item.icon)" class="h-4 w-4" />
                        <span>{{ item.label }}</span>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, RouterLink } from 'vue-router';
import {CalendarDaysIcon} from '@heroicons/vue/24/outline';
import { 
    ChevronDownIcon,
    HomeIcon,
    CalendarIcon,
    UsersIcon,
    DocumentTextIcon,
    AcademicCapIcon,
    FolderIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    ChartBarSquareIcon,
    ClockIcon,
    UserIcon,
    ShieldCheckIcon,
    PlusIcon,
    HeartIcon,
    BookOpenIcon,
    VideoCameraIcon,
    BellIcon
} from '@heroicons/vue/24/outline';

interface DropdownItem {
    toName: string;
    label: string;
    icon: string;
}

interface Props { 
    label: string; 
    icon?: string; 
    showLabel?: boolean;
    items: DropdownItem[];
    collapsed?: boolean;
}

const props = withDefaults(defineProps<Props>(), { 
    icon: 'home', 
    showLabel: true,
    collapsed: false
});

const route = useRoute();
const router = useRouter();
const dropdownOpen = ref(false);

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
    clock: ClockIcon,
    user: UserIcon,
    shield: ShieldCheckIcon,
    plus: PlusIcon,
    heart: HeartIcon,
    book: BookOpenIcon,
    video: VideoCameraIcon,
    bell: BellIcon
};

const IconComp = computed(() => icons[props.icon] || HomeIcon);

const getItemIcon = (iconName: string) => {
    return icons[iconName] || HomeIcon;
};

// التحقق إذا كان أي من العناصر الفرعية نشط
const isActive = computed(() => {
    return props.items.some(item => route.name === item.toName) || dropdownOpen.value;
});

const isItemActive = (item: DropdownItem) => {
    return route.name === item.toName;
};

const toggleDropdown = () => {
    if (!props.collapsed) {
        dropdownOpen.value = !dropdownOpen.value;
    }
};

const selectItem = (item: DropdownItem) => {
    dropdownOpen.value = false;
    router.push({ name: item.toName });
};

// إغلاق القائمة عند النقر خارجها
const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
        dropdownOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>