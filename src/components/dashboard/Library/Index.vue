<template>
    <div class="space-y-6">
        <!-- Header Section -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
                <h1 class="text-3xl font-bold text-primary">{{ t('library.title') }}</h1>
                <p class="text-secondary mt-2">{{ t('library.subtitle') }}</p>
            </div>
             <Button 
                variant="primary" 
                size="lg" 
                class="flex items-center gap-2"
                @click="upload"
            >
                <CloudArrowUpIcon class="h-5 w-5" />
                {{ t('library.upload.upload') }}
            </Button>
        </div>

        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
                :label="t('library.total_items')" 
                :value="totalItems" 
                delta="+12%"
                :positive="true"
            >
                <template #icon>
                    <FolderIcon class="h-6 w-6" />
                </template>
            </StatCard>
            <StatCard 
                :label="t('library.total_downloads')" 
                :value="totalDownloads" 
                delta="+8%"
                :positive="true"
            >
                <template #icon>
                    <ArrowDownTrayIcon class="h-6 w-6" />
                </template>
            </StatCard>
            <StatCard 
                :label="t('library.new_this_week')" 
                :value="newItems" 
                delta="+5"
                :positive="true"
            >
                <template #icon>
                    <SparklesIcon class="h-6 w-6" />
                </template>
            </StatCard>
            <StatCard 
                :label="t('library.avg_rating')" 
                :value="averageRating" 
                delta="+0.2"
                :positive="true"
            >
                <template #icon>
                    <StarIcon class="h-6 w-6" />
                </template>
            </StatCard>
        </div>

        <!-- Search and Filters -->
        <Card class="p-6">
            <div class="flex flex-col lg:flex-row gap-4">
                <!-- Search Input -->
                <div class="flex-1 relative">
                    <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-tertiary" />
                    <input
                        v-model="searchQuery"
                        :placeholder="t('library.search_placeholder')"
                        class="w-full pl-10 pr-4 py-3 rounded-lg border border-primary bg-primary text-primary placeholder-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    />
                </div>

                <!-- Filter Buttons -->
                <div class="flex flex-wrap gap-2">
                    <select 
                        v-model="selectedCategory"
                        class="px-4 py-3 rounded-lg border border-primary bg-primary text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="">{{ t('library.all_categories') }}</option>
                        <option 
                            v-for="category in categories" 
                            :key="category.id" 
                            :value="category.id"
                        >
                            {{ locale === 'ar' ? category.name_ar : category.name_en }}
                        </option>
                    </select>

                    <select 
                        v-model="selectedType"
                        class="px-4 py-3 rounded-lg border border-primary bg-primary text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="">{{ t('library.all_types') }}</option>
                        <option value="book">{{ t('library.books') }}</option>
                        <option value="research">{{ t('library.research') }}</option>
                        <option value="guide">{{ t('library.guides') }}</option>
                        <option value="article">{{ t('library.articles') }}</option>
                    </select>

                    <Button 
                        variant="outline" 
                        @click="toggleSort"
                        class="flex items-center gap-2"
                    >
                        <BarsArrowUpIcon class="h-4 w-4" />
                        {{ sortOptions.find(opt => opt.value === sortBy)?.label }}
                    </Button>
                </div>
            </div>

            <!-- Active Filters -->
            <div v-if="activeFilters.length > 0" class="flex flex-wrap gap-2 mt-4">
                <span 
                    v-for="filter in activeFilters" 
                    :key="filter.key"
                    class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-500/20 text-brand-500 text-sm"
                >
                    {{ filter.label }}
                    <button @click="removeFilter(filter.key)">
                        <XMarkIcon class="h-3 w-3" />
                    </button>
                </span>
                <button 
                    @click="clearFilters"
                    class="text-sm text-secondary hover:text-primary"
                >
                    {{ t('library.clear_all') }}
                </button>
            </div>
        </Card>

        <!-- Content Layout Toggle -->
        <div class="flex items-center justify-between">
            <div class="text-secondary">
                {{ t('library.showing') }} {{ filteredItems.length }} {{ t('library.of') }} {{ totalItems }}
            </div>
            <div class="flex items-center gap-2">
                <button 
                    @click="viewMode = 'grid'"
                    :class="[
                        'p-2 rounded-lg transition-colors',
                        viewMode === 'grid' ? 'bg-brand-500 text-white' : 'bg-tertiary text-primary hover:bg-primary'
                    ]"
                >
                    <Squares2X2Icon class="h-5 w-5" />
                </button>
                <button 
                    @click="viewMode = 'list'"
                    :class="[
                        'p-2 rounded-lg transition-colors',
                        viewMode === 'list' ? 'bg-brand-500 text-white' : 'bg-tertiary text-primary hover:bg-primary'
                    ]"
                >
                    <Bars3Icon class="h-5 w-5" />
                </button>
            </div>
        </div>

        <!-- Library Content -->
        <div v-if="filteredItems.length > 0">
            <!-- Grid View -->
            <div 
                v-if="viewMode === 'grid'" 
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
                <LibraryCard 
                    v-for="item in filteredItems"
                    :key="item.id"
                    :item="item"
                    :locale="locale"
                    @download="handleDownload"
                    @view="handleView"
                />
            </div>

            <!-- List View -->
            <div v-else class="space-y-4">
                <LibraryListItem 
                    v-for="item in filteredItems"
                    :key="item.id"
                    :item="item"
                    :locale="locale"
                    @download="handleDownload"
                    @view="handleView"
                />
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
            <FolderOpenIcon class="mx-auto h-16 w-16 text-tertiary" />
            <h3 class="mt-4 text-lg font-medium text-primary">{{ t('library.no_results') }}</h3>
            <p class="mt-2 text-secondary">{{ t('library.no_results_desc') }}</p>
            <Button 
                variant="primary" 
                class="mt-4"
                @click="clearFilters"
            >
                {{ t('library.clear_filters') }}
            </Button>
        </div>

        <!-- Upload Modal -->
       <UploadModal 
		v-if="showUploadModal"
		:categories="categories"
		@close="showUploadModal = false"
		@uploaded="handleUpload"
	/>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@/components/dashboard/component/ui/Button.vue';
import Card from '@/components/dashboard/component/ui/Card.vue';
import StatCard from '@/components/dashboard/component/ui/StatCard.vue';
import LibraryCard from './LibraryCard.vue';
import LibraryListItem from './LibraryListItem.vue';
import UploadModal from './UploadModal.vue';
import {
    FolderIcon,
    ArrowDownTrayIcon,
    SparklesIcon,
    StarIcon,
    MagnifyingGlassIcon,
    BarsArrowUpIcon,
    XMarkIcon,
    Squares2X2Icon,
    Bars3Icon,
    FolderOpenIcon,
    CloudArrowUpIcon
} from '@heroicons/vue/24/outline';

const { t, locale } = useI18n();

// Data
const resources = ref<any[]>([]);
const categories = ref<any[]>([]);
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedType = ref('');
const sortBy = ref('newest');
const viewMode = ref<'grid' | 'list'>('grid');
const showUploadModal = ref(false);

// Mock data - replace with actual API calls
const mockData = {
    categories: [
        { id: 1, key: 'therapy', name_ar: 'العلاج النفسي', name_en: 'Psychotherapy', color: '#8FAE2F' },
        { id: 2, key: 'assessment', name_ar: 'التقييم', name_en: 'Assessment', color: '#C28E86' },
        { id: 3, key: 'research', name_ar: 'الأبحاث', name_en: 'Research', color: '#4F86C6' },
    ],
    items: [
        {
            id: 1,
            title_ar: 'أساسيات العلاج المعرفي السلوكي',
            title_en: 'Cognitive Behavioral Therapy Basics',
            description_ar: 'دليل شامل لأساسيات العلاج المعرفي السلوكي',
            description_en: 'Comprehensive guide to CBT basics',
            author_ar: 'د. أحمد محمد',
            author_en: 'Dr. Ahmed Mohamed',
            type: 'book',
            category_id: 1,
            cover_image: '/images/cbt-book.jpg',
            file_path: '/files/cbt-basics.pdf',
            file_size: '2.4MB',
            pages: 156,
            publish_date: '2023-01-15',
            downloads: 245,
            views: 567,
            rating: 4.5,
            rating_count: 34,
            is_new: true,
            is_published: true
        },
        {
            id: 2,
            title_ar: 'دليل تقييم الاكتئاب',
            title_en: 'Depression Assessment Guide',
            description_ar: 'أداة شاملة لتقييم حالات الاكتئاب',
            description_en: 'Comprehensive tool for depression assessment',
            author_ar: 'د. سارة الخالد',
            author_en: 'Dr. Sara Al Khalid',
            type: 'guide',
            category_id: 2,
            cover_image: '/images/depression-guide.jpg',
            file_path: '/files/depression-assessment.pdf',
            file_size: '1.8MB',
            pages: 89,
            publish_date: '2023-03-20',
            downloads: 189,
            views: 423,
            rating: 4.2,
            rating_count: 28,
            is_new: false,
            is_published: true
        },
        {
            id: 3,
            title_ar: 'دراسة عن فعالية العلاج الجماعي',
            title_en: 'Study on Group Therapy Effectiveness',
            description_ar: 'بحث علمي حول فعالية العلاج النفسي الجماعي',
            description_en: 'Scientific research on group therapy effectiveness',
            author_ar: 'د. محمد العلي',
            author_en: 'Dr. Mohammed Al Ali',
            type: 'research',
            category_id: 3,
            cover_image: '/images/group-therapy-research.jpg',
            file_path: '/files/group-therapy-study.pdf',
            file_size: '3.2MB',
            pages: 234,
            publish_date: '2023-02-10',
            downloads: 156,
            views: 289,
            rating: 4.7,
            rating_count: 19,
            is_new: true,
            is_published: true
        },
        {
            id: 4,
            title_ar: 'تقنيات إدارة القلق',
            title_en: 'Anxiety Management Techniques',
            description_ar: 'مقال شامل عن تقنيات إدارة القلق والتوتر',
            description_en: 'Comprehensive article on anxiety management techniques',
            author_ar: 'د. فاطمة القاسم',
            author_en: 'Dr. Fatima Al Qasim',
            type: 'article',
            category_id: 1,
            cover_image: '/images/anxiety-article.jpg',
            file_path: '/files/anxiety-techniques.pdf',
            file_size: '1.1MB',
            pages: 45,
            publish_date: '2023-04-05',
            downloads: 278,
            views: 512,
            rating: 4.3,
            rating_count: 42,
            is_new: false,
            is_published: true
        }
    ]
};

// Computed
const filteredItems = computed(() => {
    let items = [...resources.value];
    
    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        items = items.filter(item => 
            item.title_ar.toLowerCase().includes(query) ||
            item.title_en.toLowerCase().includes(query) ||
            item.description_ar?.toLowerCase().includes(query) ||
            item.description_en?.toLowerCase().includes(query)
        );
    }
    
    // Category filter
    if (selectedCategory.value) {
        items = items.filter(item => item.category_id.toString() === selectedCategory.value);
    }
    
    // Type filter
    if (selectedType.value) {
        items = items.filter(item => item.type === selectedType.value);
    }
    
    // Sorting
    switch (sortBy.value) {
        case 'newest':
            items.sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime());
            break;
        case 'popular':
            items.sort((a, b) => b.downloads - a.downloads);
            break;
        case 'rating':
            items.sort((a, b) => b.rating - a.rating);
            break;
        case 'title':
            items.sort((a, b) => a.title_en.localeCompare(b.title_en));
            break;
    }
    
    return items;
});

const totalItems = computed(() => resources.value.length);
const totalDownloads = computed(() => resources.value.reduce((sum, item) => sum + item.downloads, 0));
const newItems = computed(() => resources.value.filter(item => item.is_new).length);
const averageRating = computed(() => {
    const ratedItems = resources.value.filter(item => item.rating_count > 0);
    return ratedItems.length > 0 
        ? (ratedItems.reduce((sum, item) => sum + item.rating, 0) / ratedItems.length).toFixed(1)
        : '0.0';
});

const activeFilters = computed(() => {
    const filters = [];
    if (selectedCategory.value) {
        const category = categories.value.find(cat => cat.id.toString() === selectedCategory.value);
        if (category) {
            filters.push({
                key: 'category',
                label: locale.value === 'ar' ? category.name_ar : category.name_en
            });
        }
    }
    if (selectedType.value) {
        filters.push({
            key: 'type',
            label: t(`library.types.${selectedType.value}`)
        });
    }
    return filters;
});

const sortOptions = [
    { value: 'newest', label: t('library.sort.newest') },
    { value: 'popular', label: t('library.sort.popular') },
    { value: 'rating', label: t('library.sort.rating') },
    { value: 'title', label: t('library.sort.title') },
];

// Methods
const upload = () => {
    showUploadModal.value = true;
};

const toggleSort = () => {
    const currentIndex = sortOptions.findIndex(opt => opt.value === sortBy.value);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    sortBy.value = sortOptions[nextIndex].value;
};

const removeFilter = (filterKey: string) => {
    if (filterKey === 'category') selectedCategory.value = '';
    if (filterKey === 'type') selectedType.value = '';
};

const clearFilters = () => {
    searchQuery.value = '';
    selectedCategory.value = '';
    selectedType.value = '';
};

const handleDownload = (item: any) => {
    // Implement download logic
    console.log('Downloading:', item);
    item.downloads++;
};

const handleView = (item: any) => {
    // Implement view logic
    console.log('Viewing:', item);
    item.views++;
};

const handleUpload = (newItem: any) => {
    resources.value.unshift(newItem);
    showUploadModal.value = false;
};

// Lifecycle
onMounted(() => {
    categories.value = mockData.categories;
    resources.value = mockData.items;
    console.log('Data loaded:', resources.value.length, 'items');
});
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}
</style>