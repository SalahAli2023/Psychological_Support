<template>
	<div class="min-h-screen bg-primary flex">
		<!-- Floating settings button -->
		<RouterLink
			:to="{ name: 'settings' }"
			class="fixed end-3 bottom-4 z-50 inline-grid h-11 w-11 place-items-center rounded-full bg-brand-500 text-white shadow-lg hover:bg-[#8FAE2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
			aria-label="Open settings"
		>
			<Cog6ToothIcon class="h-6 w-6" />
		</RouterLink>

		<!-- Desktop Sidebar -->
		<aside :class="['hidden md:flex shrink-0 flex-col border-r border-primary transition-all duration-300 bg-secondary', collapsed ? 'w-20' : 'w-72']">
			<div class="flex h-16 items-center justify-center px-4">
				<img src="@/assets/images/dashboard/TqUYX8k9ugYomJilTLVf.png" :alt="t('app.title')" :class="[collapsed ? 'w-10' : 'w-44', 'h-auto']" />
			</div>
			<nav class="flex-1 px-2 py-2 space-y-1">
				<!-- Dashboard مع قائمة فرعية -->
				<NavDropdown 
					:label="t('nav.dashboard')" 
					icon="home" 
					:show-label="!collapsed"
					:items="dashboardItems"
					:collapsed="collapsed"
				/>
				
				<!-- Appointments مع قائمة فرعية -->
				<NavDropdown 
					:label="t('nav.appointments')" 
					icon="calendar" 
					:show-label="!collapsed"
					:items="appointmentItems"
					:collapsed="collapsed"
				/>
				
				<!-- Users مع قائمة فرعية -->
				<NavDropdown 
					:label="t('nav.users')" 
					icon="users" 
					:show-label="!collapsed"
					:items="userItems"
					:collapsed="collapsed"
				/>
				
				<!-- Articles مع قائمة فرعية -->
				<NavDropdown 
					:label="t('nav.articles')" 
					icon="document" 
					:show-label="!collapsed"
					:items="articleItems"
					:collapsed="collapsed"
				/>
				
				<!-- Programs مع قائمة فرعية -->
				<NavDropdown 
					:label="t('nav.programs')" 
					icon="academic" 
					:show-label="!collapsed"
					:items="programItems"
					:collapsed="collapsed"
				/>
				
				<!-- Library مع قائمة فرعية -->
				<NavDropdown 
					:label="t('nav.library')" 
					icon="folder" 
					:show-label="!collapsed"
					:items="libraryItems"
					:collapsed="collapsed"
				/>
				
				<!-- Assessments مع قائمة فرعية -->
				<NavDropdown 
					:label="t('nav.assessments')" 
					icon="chart" 
					:show-label="!collapsed"
					:items="assessmentItems"
					:collapsed="collapsed"
				/>
				
				<!-- Settings مع قائمة فرعية -->
				<NavDropdown 
					:label="t('nav.settings')" 
					icon="cog" 
					:show-label="!collapsed"
					:items="settingItems"
					:collapsed="collapsed"
				/>
			</nav>
		</aside>

		<!-- Mobile Drawer -->
		<transition name="slide">
			<div v-if="drawer" class="fixed inset-0 z-[9999] flex md:hidden">
				<!-- الخلفية الداكنة -->
				<div class="absolute inset-0 bg-black/40" @click="drawer = false"></div>

				<!-- القائمة -->
				<aside class="relative h-full w-72 bg-secondary border-e border-primary shadow-xl p-3 transform transition-transform duration-300 ease-in-out">
					<div class="mb-2 flex items-center justify-between">
						<div class="flex items-center gap-3">
							<img src='@/assets/images/dashboard/TqUYX8k9ugYomJilTLVf.png' :alt="t('app.title')" class="h-10 w-auto" />
						</div>
						<button class="inline-grid h-9 w-9 place-items-center rounded-lg hover:bg-tertiary text-primary" @click="drawer = false">
							<XMarkIcon class="h-5 w-5" />
						</button>
					</div>

					<nav class="space-y-1">
						<!-- Dashboard مع قائمة فرعية -->
						<NavDropdown 
							:label="t('nav.dashboard')" 
							icon="home" 
							:show-label="true"
							:items="dashboardItems"
							:collapsed="false"
						/>
						
						<!-- Appointments مع قائمة فرعية -->
						<NavDropdown 
							:label="t('nav.appointments')" 
							icon="calendar" 
							:show-label="true"
							:items="appointmentItems"
							:collapsed="false"
						/>
						
						<!-- Users مع قائمة فرعية -->
						<NavDropdown 
							:label="t('nav.users')" 
							icon="users" 
							:show-label="true"
							:items="userItems"
							:collapsed="false"
						/>
						
						<!-- Articles مع قائمة فرعية -->
						<NavDropdown 
							:label="t('nav.articles')" 
							icon="document" 
							:show-label="true"
							:items="articleItems"
							:collapsed="false"
						/>
						
						<!-- Programs مع قائمة فرعية -->
						<NavDropdown 
							:label="t('nav.programs')" 
							icon="academic" 
							:show-label="true"
							:items="programItems"
							:collapsed="false"
						/>
						
						<!-- Library مع قائمة فرعية -->
						<NavDropdown 
							:label="t('nav.library')" 
							icon="folder" 
							:show-label="true"
							:items="libraryItems"
							:collapsed="false"
						/>
						
						<!-- Assessments مع قائمة فرعية -->
						<NavDropdown 
							:label="t('nav.assessments')" 
							icon="chart" 
							:show-label="true"
							:items="assessmentItems"
							:collapsed="false"
						/>
						
						<!-- Settings مع قائمة فرعية -->
						<NavDropdown 
							:label="t('nav.settings')" 
							icon="cog" 
							:show-label="true"
							:items="settingItems"
							:collapsed="false"
						/>
					</nav>
				</aside>
			</div>
		</transition>

		<!-- Content -->
		<div class="flex-1 flex flex-col">
			<header class="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-primary px-3 md:px-4 py-3 backdrop-blur bg-secondary">
				<div class="flex items-center gap-2">
					<button class="inline-grid h-9 w-9 place-items-center rounded-lg text-primary hover:bg-tertiary md:hidden" @click="drawer = true" aria-label="Open menu">
						<Bars3Icon class="h-5 w-5" />
					</button>
					<button class="hidden md:inline-grid h-9 w-9 place-items-center rounded-lg text-primary hover:bg-tertiary" @click="collapsed = !collapsed" aria-label="Toggle sidebar">
						<ChevronDoubleLeftIcon v-if="!collapsed" class="h-5 w-5" />
						<ChevronDoubleRightIcon v-else class="h-5 w-5" />
					</button>
					<div class="relative w-full max-w-full md:max-w-2xl">
						<MagnifyingGlassIcon class="pointer-events-none absolute inset-y-0 start-3 my-auto h-5 w-5 text-tertiary" />
						<input :placeholder="t('app.search')" class="w-full rounded-lg border border-transparent bg-tertiary ps-10 pe-3 py-2 text-sm text-primary outline-none ring-1 ring-transparent transition focus:bg-primary focus:ring-2 focus:ring-brand-500" />
					</div>
				</div>
				<div class="flex items-center gap-1.5">
					<button class="inline-grid h-9 w-9 place-items-center rounded-lg text-primary hover:bg-tertiary" @click="toggleTheme" :title="themeLabel">
						<MoonIcon v-if="isDark" class="h-5 w-5" />
						<SunIcon v-else class="h-5 w-5" />
					</button>
					<button class="inline-grid h-9 w-9 place-items-center rounded-lg text-primary hover:bg-tertiary" @click="toggleLocale" :title="nextLocaleLabel">
						<LanguageIcon class="h-5 w-5" />
					</button>
					<div class="relative">
						<button class="inline-flex items-center gap-2" @click="avatarOpen = !avatarOpen" aria-label="User menu">
							<img src="@/assets/images/dashboard/images.jpg" alt="avatar" class="h-9 w-9 rounded-full object-cover" />
						</button>
						<div v-if="avatarOpen" class="user-menu absolute end-0 mt-2 w-44 overflow-hidden rounded-lg border border-primary bg-primary text-sm shadow-lg">
							<div class="px-3 py-2 font-medium text-primary">Dalal</div>
							<hr class="border-primary" />
							<RouterLink :to="{ name: 'settings' }" class="block px-3 py-2 text-primary hover:bg-secondary">Settings</RouterLink>
							<button class="block w-full text-start px-3 py-2 text-primary hover:bg-secondary">Logout</button>
						</div>
					</div>
				</div>
			</header>
			<main class="p-3 md:p-4 bg-primary">
				<RouterView />
			</main>
		</div>
	</div>
</template>

<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router';
import { computed, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import NavDropdown from './NavItem.vue';
import { 
	SunIcon, 
	MoonIcon, 
	LanguageIcon, 
	Cog6ToothIcon, 
	Bars3Icon, 
	XMarkIcon, 
	ChevronDoubleLeftIcon, 
	ChevronDoubleRightIcon, 
	MagnifyingGlassIcon
} from '@heroicons/vue/24/outline';

const { t, locale } = useI18n();

const drawer = ref(false);
const collapsed = ref(false);
const avatarOpen = ref(false);

// تعريف العناصر الفرعية لكل قائمة
const dashboardItems = [
	{ toName: 'Dashboard', label: 'لوحة التحكم الرئيسية', icon: 'home' },
	{ toName: 'dashboard-stats', label: 'الإحصائيات', icon: 'chartBar' },
	{ toName: 'dashboard-reports', label: 'التقارير', icon: 'document' }
];

const appointmentItems = [
	{ toName: 'appointments', label: 'جميع المواعيد', icon: 'calendar' },
	{ toName: 'appointments-upcoming', label: 'المواعيد القادمة', icon: 'clock' },
	{ toName: 'appointments-history', label: 'سجل المواعيد', icon: 'folder' }
];

const userItems = [
	{ toName: 'users', label: 'جميع المستخدمين', icon: 'users' },
	{ toName: 'users-clients', label: 'العملاء', icon: 'user' },
	{ toName: 'users-therapists', label: 'المعالجين', icon: 'academic' },
	{ toName: 'users-admins', label: 'المشرفين', icon: 'shield' }
];

const articleItems = [
	{ toName: 'articles', label: 'جميع المقالات', icon: 'document' },
	{ toName: 'articles-categories', label: 'تصنيفات المقالات', icon: 'folder' },
	{ toName: 'articles-new', label: 'مقال جديد', icon: 'plus' }
];

const programItems = [
	{ toName: 'programs', label: 'جميع البرامج', icon: 'academic' },
	{ toName: 'programs-therapy', label: 'برامج العلاج', icon: 'heart' },
	{ toName: 'programs-workshops', label: 'ورش العمل', icon: 'users' }
];

const libraryItems = [
	{ toName: 'library', label: 'المكتبة الرئيسية', icon: 'folder' },
	{ toName: 'library-books', label: 'الكتب', icon: 'book' },
	{ toName: 'library-resources', label: 'المصادر', icon: 'document' },
	{ toName: 'library-media', label: 'الوسائط', icon: 'video' }
];

const assessmentItems = [
	{ toName: 'assessments', label: 'جميع المقاييس', icon: 'chart' },
	{ toName: 'assessments-categories', label: 'تصنيفات المقاييس', icon: 'folder' },
	{ toName: 'assessments-results', label: 'نتائج المقاييس', icon: 'chartBar' }
];

const settingItems = [
	{ toName: 'settings', label: 'الإعدادات العامة', icon: 'cog' },
	{ toName: 'settings-profile', label: 'الملف الشخصي', icon: 'user' },
	{ toName: 'settings-security', label: 'الأمان', icon: 'shield' },
	{ toName: 'settings-notifications', label: 'الإشعارات', icon: 'bell' }
];

const toggleLocale = () => {
	const next = locale.value === 'en' ? 'ar' : 'en';
	locale.value = next;
	localStorage.setItem('locale', next);
	document.documentElement.lang = next === 'ar' ? 'ar' : 'en';
	document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
};

const isDark = computed(() => document.documentElement.classList.contains('dark'));
const themeLabel = computed(() => (isDark.value ? t('app.light') : t('app.dark')));
const nextLocaleLabel = computed(() => (locale.value === 'en' ? 'AR' : 'EN'));

const toggleTheme = () => {
	document.documentElement.classList.toggle('dark');
	localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
};

onMounted(() => {
	window.addEventListener('click', (e) => {
		const target = e.target as HTMLElement;
		if (!target.closest('[aria-label="User menu"]') && !target.closest('.user-menu')) {
			avatarOpen.value = false;
		}
	});
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
	document.documentElement.classList.add('dark');
} else if (savedTheme === 'light') {
	document.documentElement.classList.remove('dark');
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>