<template>
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 p-4 bg-primary rounded-lg border border-primary">
        <!-- معلومات الصفحة -->
        <div class="text-sm text-secondary">
            {{ t('library.pagination.showing_items', {
                from: pagination.from,
                to: pagination.to,
                total: pagination.total
            }) }}
        </div>

        <!-- عناصر الترقيم -->
        <div class="flex items-center gap-2" :dir="isRTL ? 'rtl' : 'ltr'">
            <!-- زر الصفحة السابقة -->
            <button
                @click="goToPage(pagination.current_page - 1)"
                :disabled="pagination.current_page === 1"
                :aria-label="t('library.pagination.previous')"
                class="p-2 rounded-lg border border-primary text-primary hover:bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <component :is="isRTL ? ChevronRightIcon : ChevronLeftIcon" class="h-4 w-4" />
            </button>

            <!-- أرقام الصفحات -->
            <div class="flex items-center gap-1">
                <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="goToPage(page)"
                    :disabled="page === '...'"
                    :aria-label="page !== '...' ? t('library.pagination.go_to_page', { page }) : ''"
                    :class="[
                        'px-3 py-1 text-sm rounded-lg border transition-colors min-w-[40px]',
                        page === pagination.current_page
                            ? 'bg-brand-500 border-brand-500 text-white'
                            : page === '...'
                                ? 'border-transparent text-primary cursor-default'
                                : 'border-primary text-primary hover:bg-tertiary'
                    ]"
                >
                    {{ page }}
                </button>
            </div>

            <!-- زر الصفحة التالية -->
            <button
                @click="goToPage(pagination.current_page + 1)"
                :disabled="pagination.current_page === pagination.last_page"
                :aria-label="t('library.pagination.next')"
                class="p-2 rounded-lg border border-primary text-primary hover:bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <component :is="isRTL ? ChevronLeftIcon : ChevronRightIcon" class="h-4 w-4" />
            </button>
        </div>

        <!-- اختيار عدد العناصر -->
        <div class="flex items-center gap-2">
            <span class="text-sm text-secondary">{{ t('library.pagination.items_per_page') }}:</span>
            <select
                :value="pagination.per_page"
                @change="changePerPage(Number($event.target.value))"
                class="px-3 py-1 text-sm border border-primary rounded-lg bg-primary text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="48">48</option>
                <option value="96">96</option>
            </select>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline';

const { t, locale } = useI18n();

interface PaginationInfo {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface Props {
    pagination: PaginationInfo;
}

const props = defineProps<Props>();
const emit = defineEmits(['page-change', 'per-page-change']);

// تحديد إذا كانت اللغة من اليمين لليسار
const isRTL = computed(() => {
    return locale.value === 'ar';
});

// حساب الصفحات المرئية
const visiblePages = computed(() => {
    const current = props.pagination.current_page;
    const last = props.pagination.last_page;
    
    if (last <= 7) {
        return Array.from({ length: last }, (_, i) => i + 1);
    }
    
    const pages: (number | string)[] = [1];
    
    let start = Math.max(2, current - 1);
    let end = Math.min(last - 1, current + 1);
    
    if (start > 2) {
        pages.push('...');
    }
    
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    
    if (end < last - 1) {
        pages.push('...');
    }
    
    if (last > 1) {
        pages.push(last);
    }
    
    return pages;
});

// التنقل بين الصفحات
const goToPage = (page: number | string) => {
    if (typeof page === 'number' && page >= 1 && page <= props.pagination.last_page && page !== props.pagination.current_page) {
        emit('page-change', page);
    }
};

// تغيير عدد العناصر في الصفحة
const changePerPage = (perPage: number) => {
    emit('per-page-change', perPage);
};
</script>