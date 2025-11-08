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
				<NavItem to-name="Dashboard" :label="t('nav.dashboard')" icon="home" :show-label="!collapsed" />
				<NavItem to-name="appointments" :label="t('nav.appointments')" icon="calendar" :show-label="!collapsed" />
				<NavItem to-name="users" :label="t('nav.users')" icon="users" :show-label="!collapsed" />
				<NavItem to-name="articles" :label="t('nav.articles')" icon="document" :show-label="!collapsed" />
				<NavItem to-name="programs" :label="t('nav.programs')" icon="academic" :show-label="!collapsed" />
				<NavItem to-name="library" :label="t('nav.library')" icon="folder" :show-label="!collapsed" />
				<NavItem to-name="assessments" :label="t('nav.assessments')" icon="chart" :show-label="!collapsed" />
				<NavItem to-name="settings" :label="t('nav.settings')" icon="cog" :show-label="!collapsed" />
			</nav>
		</aside>

		<!-- Mobile Drawer -->
		<div v-if="drawer" class="fixed inset-0 z-40 md:hidden" @click.self="drawer = false">
			<div class="absolute inset-0 bg-black/40"></div>
			<aside class="absolute start-0 top-0 h-full w-72 overflow-y-auto border-e border-primary bg-secondary p-3">
				<div class="mb-2 flex items-center justify-between">
					<div class="flex items-center gap-3">
						<img src="./images/dashboard/logo.png" :alt="t('app.title')" class="h-10 w-auto" />
					</div>
					<button class="inline-grid h-9 w-9 place-items-center rounded-lg hover:bg-tertiary text-primary" @click="drawer=false">
						<XMarkIcon class="h-5 w-5" />
					</button>
				</div>
				<nav class="space-y-1">
					<NavItem to-name="dashboard" :label="t('nav.Dashboard')" icon="home" />
					<NavItem to-name="appointments" :label="t('nav.appointments')" icon="calendar" />
					<NavItem to-name="users" :label="t('nav.users')" icon="users" />
					<NavItem to-name="articles" :label="t('nav.articles')" icon="document" />
					<NavItem to-name="programs" :label="t('nav.programs')" icon="academic" />
					<NavItem to-name="library" :label="t('nav.library')" icon="folder" />
					<NavItem to-name="assessments" :label="t('nav.assessments')" icon="chart" />
					<NavItem to-name="settings" :label="t('nav.settings')" icon="cog" />
				</nav>
			</aside>
		</div>

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
import NavItem from './NavItem.vue';
import { SunIcon, MoonIcon, LanguageIcon, Cog6ToothIcon, Bars3Icon, XMarkIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';

const { t, locale } = useI18n();

const drawer = ref(false);
const collapsed = ref(false);
const avatarOpen = ref(false);

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
</style>