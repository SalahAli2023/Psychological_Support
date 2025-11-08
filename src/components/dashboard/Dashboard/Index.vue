<template>
	 <div class="space-y-6 p-6  bg-primary min-h-screen">
		<h1 class="text-2xl font-semibold">{{ t('nav.dashboard') }}</h1>

		<!-- Top hero + side cards -->
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
			<!-- Hero analytics card -->
			<div class="relative overflow-hidden rounded-2xl border border-gray-200 bg-[#7F9D2F] 
			p-6 text-white shadow dark:border-gray-800 dark:from-brand-500 dark:to-[#6D8B28] lg:col-span-2">
				<div class="flex items-start justify-between">
					<div>
						<div class="text-lg font-semibold">Website Analytics</div>
						<div class="mt-1 text-sm/6 text-white/80">Total 28.5% Conversion Rate</div>
					</div>
					<div class="flex gap-2">
						<span class="h-2 w-2 rounded-full bg-white/60"></span>
						<span class="h-2 w-2 rounded-full bg-white/60"></span>
						<span class="h-2 w-2 rounded-full bg-white"></span>
					</div>
				</div>
				<div class="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
					<div>
						<div class="text-sm/6 text-white/80">Traffic</div>
						<div class="mt-1 text-3xl font-semibold">28%</div>
					</div>
					<div>
						<div class="text-sm/6 text-white/80">Sessions</div>
						<div class="mt-1 text-3xl font-semibold">3.1k</div>
					</div>
					<div>
						<div class="text-sm/6 text-white/80">Leads</div>
						<div class="mt-1 text-3xl font-semibold">1.2k</div>
					</div>
					<div>
						<div class="text-sm/6 text-white/80">Conversions</div>
						<div class="mt-1 text-3xl font-semibold">12%</div>
					</div>
				</div>
			</div>

			<!-- Visitors Statistics -->
			<Card>
				<template #header>Visitors Statistics</template>
				<div class="grid grid-cols-2 gap-3 text-sm">
					<div>
						<div class="text-gray-500">Today</div>
						<div class="mt-1 text-xl font-semibold text-brand-500">1,264</div>
					</div>
					<div>
						<div class="text-gray-500">This Week</div>
						<div class="mt-1 text-xl font-semibold">8,943</div>
					</div>
					<div class="col-span-2 mt-2">
						<svg viewBox="0 0 200 60" class="h-16 w-full text-accent-500">
							<polyline fill="none" stroke="currentColor" stroke-width="3" points="0,40 20,35 40,38 60,28 80,32 100,20 120,26 140,24 160,18 180,22 200,20" />
						</svg>
						<div class="mt-1 text-xs text-gray-500">Visitors trend</div>
					</div>
				</div>
			</Card>
		</div>

		<!-- KPIs row -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
			<StatCard :label="t('dashboard.kpi_upcoming')" :value="appointments.upcomingCount" delta="+5%" :positive="true">
				<template #icon><CalendarIcon class="h-5 w-5 text-brand-500"/></template>
			</StatCard>
			<StatCard :label="t('dashboard.kpi_clients')" :value="users.totalClients" delta="+2%" :positive="true">
				<template #icon><UsersIcon class="h-5 w-5 text-brand-500"/></template>
			</StatCard>
			<StatCard :label="t('dashboard.kpi_new_users')" :value="users.newUsers" delta="-1%" :positive="false">
				<template #icon><UserPlusIcon class="h-5 w-5 text-accent-500"/></template>
			</StatCard>
			<StatCard label="NPS" value="72" delta="+3" :positive="true">
				<template #icon><ChartBarIcon class="h-5 w-5 text-brand-500"/></template>
			</StatCard>
		</div>

		<!-- Second row: Upcoming + Quick actions -->
		<div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
			<Card class="xl:col-span-2">
				<template #header>Upcoming Appointments</template>
				<ul class="space-y-2">
					<li v-for="item in appointments.items.slice(0,6)" :key="item.id" class="flex items-center justify-between rounded-md border border-gray-200 p-3 dark:border-gray-800">
						<div class="font-medium">{{ item.clientName }}</div>
						<div class="text-sm text-gray-500">{{ new Date(item.startsAt).toLocaleString() }}</div>
					</li>
				</ul>
			</Card>
			<Card>
				<template #header>{{ t('dashboard.quick_actions') }}</template>
				<div class="flex flex-col gap-2">
					<Button variant="primary">{{ t('dashboard.book_session') }}</Button>
					<Button variant="secondary">{{ t('dashboard.create_article') }}</Button>
					<Button variant="outline">{{ t('dashboard.add_user') }}</Button>
				</div>
			</Card>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Card from '@/components/dashboard/component/ui/Card.vue';
import StatCard from '@/components/dashboard/component/ui/StatCard.vue';
import Button from '@/components/dashboard/component/ui/Button.vue';
import { CalendarIcon, UsersIcon, UserPlusIcon, ChartBarIcon } from '@heroicons/vue/24/outline';
import { useAppointmentStore } from '@/stores/appointments';
import { useUserStore } from '@/stores/users';

const { t } = useI18n();
const appointments = useAppointmentStore();
const users = useUserStore();
</script>
