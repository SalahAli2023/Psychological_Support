<template>
    <div class="space-y-6">
        <!-- Header Section -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
                <h1 class="text-3xl font-bold text-primary">{{ t('library.title') }}</h1>
                <p class="text-secondary mt-2">{{ t('library.subtitle') }}</p>
            </div>
            <Button 
                v-if="hasAuth"
                variant="primary" 
                size="lg" 
                class="flex items-center gap-2"
                @click="upload"
            >
                <CloudArrowUpIcon class="h-5 w-5" />
                {{ t('library.upload.upload') }}
            </Button>
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
                        @input="handleSearch"
                    />
                </div>

                <!-- Filter Buttons -->
                <div class="flex flex-wrap gap-2">
                    <select 
                        v-model="selectedCategory"
                        class="px-4 py-3 rounded-lg border border-primary bg-primary text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
                        @change="fetchItems"
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
                        @change="fetchItems"
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

        <!-- Management Table for Admin -->
        <Card v-if="hasAuth" class="p-6">
            <template #header>
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div class="text-base sm:text-lg">إدارة محتويات المكتبة</div>
                    <div class="text-sm text-secondary">
                        إجمالي العناصر: {{ items.length }}
                    </div>
                </div>
            </template>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                {{ error }}
            </div>

            <!-- Success Message -->
            <div v-else-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
                {{ successMessage }}
            </div>

            <!-- Table -->
            <div v-if="!loading && items.length > 0" class="overflow-x-auto">
                <table class="min-w-full text-sm">
                    <thead>
                        <tr class="text-start text-secondary bg-secondary">
                            <th class="px-4 py-3 text-start font-medium">#</th>
                            <th class="px-4 py-3 text-start font-medium">العنوان</th>
                            <th class="px-4 py-3 text-start font-medium">النوع</th>
                            <th class="px-4 py-3 text-start font-medium">التصنيف</th>
                            <th class="px-4 py-3 text-start font-medium">المشاهدات</th>
                            <th class="px-4 py-3 text-start font-medium">التنزيلات</th>
                            <th class="px-4 py-3 text-start font-medium">التقييم</th>
                            <th class="px-4 py-3 text-start font-medium">الحالة</th>
                            <th class="px-4 py-3 text-start font-medium">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr 
                            v-for="(item, index) in items" 
                            :key="item.id" 
                            class="border-t border-primary hover:bg-secondary transition-colors"
                        >
                            <td class="px-4 py-3 text-primary font-medium text-center">
                                {{ index + 1 }}
                            </td>
                            
                            <td class="px-4 py-3 text-primary">
                                <div class="flex items-center gap-3">
                                    <img 
                                        v-if="item.cover_image" 
                                        :src="item.cover_image" 
                                        :alt="item.title_ar"
                                        class="w-10 h-10 rounded-lg object-cover"
                                    >
                                    <div v-else class="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                        <DocumentTextIcon class="h-5 w-5 text-gray-500" />
                                    </div>
                                    <div class="flex flex-col">
                                        <span class="font-medium text-primary">{{ item.title_ar }}</span>
                                        <span class="text-xs text-secondary">{{ item.author_ar }}</span>
                                    </div>
                                </div>
                            </td>
                            
                            <td class="px-4 py-3 text-primary">
                                <span class="badge badge-neutral">
                                    {{ getTypeLabel(item.type) }}
                                </span>
                            </td>
                            
                            <td class="px-4 py-3 text-primary">
                                <span class="badge badge-brand">
                                    {{ locale === 'ar' ? item.category?.name_ar : item.category?.name_en }}
                                </span>
                            </td>
                            
                            <td class="px-4 py-3 text-primary">
                                <div class="flex items-center gap-1">
                                    <EyeIcon class="h-4 w-4 text-secondary" />
                                    {{ item.views }}
                                </div>
                            </td>
                            
                            <td class="px-4 py-3 text-primary">
                                <div class="flex items-center gap-1">
                                    <ArrowDownTrayIcon class="h-4 w-4 text-secondary" />
                                    {{ item.downloads }}
                                </div>
                            </td>
                            
                            <td class="px-4 py-3 text-primary">
                                <div class="flex items-center gap-1">
                                    <StarIcon class="h-4 w-4 text-yellow-500" />
                                    {{ item.rating }} ({{ item.rating_count }})
                                </div>
                            </td>
                            
                            <td class="px-4 py-3">
                                <span :class="['badge', item.is_published ? 'badge-brand' : 'badge-neutral']">
                                    {{ item.is_published ? 'منشور' : 'مسودة' }}
                                </span>
                                <span v-if="item.is_new" class="badge badge-green ml-1">
                                    جديد
                                </span>
                            </td>
                            
                            <td class="px-4 py-3">
                                <div class="flex gap-2">
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        @click="handleEdit(item)"
                                        class="text-xs"
                                    >
                                        تعديل
                                    </Button>
                                    <button 
                                        @click="handleTogglePublish(item)" 
                                        class="p-1 text-secondary hover:text-primary"
                                        :title="item.is_published ? 'إلغاء النشر' : 'نشر'"
                                    >
                                        <EyeIcon v-if="item.is_published" class="h-4 w-4" />
                                        <EyeSlashIcon v-else class="h-4 w-4" />
                                    </button>
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        @click="handleDelete(item.id)" 
                                        class="text-xs text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                                    >
                                        حذف
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Empty State -->
            <div v-else-if="!loading && items.length === 0" class="text-center py-8 text-secondary">
                <FolderOpenIcon class="h-16 w-16 mx-auto mb-4 text-secondary" />
                <h3 class="text-lg font-medium text-primary mb-2">لا توجد محتويات</h3>
                <p class="text-secondary mb-4">لم يتم إضافة أي محتوى للمكتبة بعد</p>
                <Button @click="upload" variant="outline">
                    إضافة محتوى جديد
                </Button>
            </div>
        </Card>

        <!-- Content Layout Toggle (for non-admin users) -->
        <div v-else class="flex items-center justify-between">
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

        <!-- Library Content (for non-admin users) -->
        <div v-if="!hasAuth">
            <div v-if="loading" class="flex justify-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
            </div>

            <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                {{ error }}
            </div>

            <div v-else-if="filteredItems.length > 0">
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
        </div>

        <!-- Upload Modal -->
        <UploadModal 
            v-if="showUploadModal"
            :categories="categories"
            :editing-item="editingItem"
            @close="showUploadModal = false"
            @uploaded="handleUpload"
        />

        <!-- Delete Confirmation Modal -->
        <DeleteConfirmModal
            :show="showDeleteConfirm"
            @confirm="confirmDelete"
            @cancel="showDeleteConfirm = false"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { useLibraryStore, type LibraryItem } from '@/stores/library';
import Button from '@/components/dashboard/component/ui/Button.vue';
import Card from '@/components/dashboard/component/ui/Card.vue';
import LibraryCard from './LibraryCard.vue';
import LibraryListItem from './LibraryListItem.vue';
import UploadModal from './UploadModal.vue';
import DeleteConfirmModal from '@/components/dashboard/events/DeleteConfirmModal.vue';
import {
    FolderIcon,
    ArrowDownTrayIcon,
    MagnifyingGlassIcon,
    BarsArrowUpIcon,
    XMarkIcon,
    Squares2X2Icon,
    Bars3Icon,
    FolderOpenIcon,
    CloudArrowUpIcon,
    DocumentTextIcon,
    EyeIcon,
    EyeSlashIcon,
    StarIcon
} from '@heroicons/vue/24/outline';

const { t, locale } = useI18n();
const authStore = useAuthStore();
const libraryStore = useLibraryStore();

// Data
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedType = ref('');
const sortBy = ref('newest');
const viewMode = ref<'grid' | 'list'>('grid');
const showUploadModal = ref(false);
const showDeleteConfirm = ref(false);
const editingItem = ref<LibraryItem | null>(null);
const deleteTargetId = ref<number | null>(null);
const successMessage = ref('');

// Computed
const hasAuth = computed(() => authStore.isAuthenticated);
const loading = computed(() => libraryStore.loading);
const error = computed(() => libraryStore.error);
const items = computed(() => libraryStore.items);
const categories = computed(() => libraryStore.categories);

const filteredItems = computed(() => {
    let filtered = [...items.value];
    
    // Client-side filtering for search
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(item => 
            item.title_ar.toLowerCase().includes(query) ||
            item.title_en.toLowerCase().includes(query) ||
            item.description_ar?.toLowerCase().includes(query) ||
            item.description_en?.toLowerCase().includes(query)
        );
    }
    
    // Client-side filtering for category and type
    if (selectedCategory.value) {
        filtered = filtered.filter(item => item.category_id.toString() === selectedCategory.value);
    }
    
    if (selectedType.value) {
        filtered = filtered.filter(item => item.type === selectedType.value);
    }
    
    // Client-side sorting
    switch (sortBy.value) {
        case 'newest':
            filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            break;
        case 'popular':
            filtered.sort((a, b) => b.downloads - a.downloads);
            break;
        case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        case 'title':
            filtered.sort((a, b) => a.title_en.localeCompare(b.title_en));
            break;
    }
    
    return filtered;
});

const totalItems = computed(() => items.value.length);

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
const fetchItems = async () => {
    const params: any = {};
    
    if (selectedCategory.value) params.category_id = selectedCategory.value;
    if (selectedType.value) params.type = selectedType.value;
    if (searchQuery.value) params.search = searchQuery.value;
    
    await libraryStore.fetchItems(params);
};

const fetchCategories = async () => {
    await libraryStore.fetchCategories();
};

const upload = () => {
    editingItem.value = null;
    showUploadModal.value = true;
};

const handleEdit = (item: LibraryItem) => {
    editingItem.value = item;
    showUploadModal.value = true;
};

const handleDelete = async (itemId: number) => {
    deleteTargetId.value = itemId;
    showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
    if (!deleteTargetId.value) return;

    try {
        await libraryStore.deleteItem(deleteTargetId.value);
        successMessage.value = 'تم حذف العنصر بنجاح';
        
        setTimeout(() => {
            successMessage.value = '';
        }, 3000);
        
    } catch (err: any) {
        error.value = err.response?.data?.message || 'فشل في حذف العنصر';
        console.error('Failed to delete item:', err);
    } finally {
        showDeleteConfirm.value = false;
        deleteTargetId.value = null;
    }
};

const handleTogglePublish = async (item: LibraryItem) => {
    try {
        const formData = new FormData();
        formData.append('is_published', item.is_published ? '0' : '1');
        formData.append('_method', 'PUT');

        await libraryStore.updateItem(item.id, formData);
        
        successMessage.value = item.is_published ? 'تم إلغاء نشر العنصر' : 'تم نشر العنصر';
        
        setTimeout(() => {
            successMessage.value = '';
        }, 3000);
        
    } catch (err: any) {
        error.value = err.response?.data?.message || 'فشل في تحديث حالة العنصر';
        console.error('Failed to toggle publish:', err);
    }
};

const getTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
        book: 'كتاب',
        research: 'بحث',
        guide: 'دليل',
        article: 'مقال'
    };
    return types[type] || type;
};

const toggleSort = () => {
    const currentIndex = sortOptions.findIndex(opt => opt.value === sortBy.value);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    sortBy.value = sortOptions[nextIndex].value;
};

const removeFilter = (filterKey: string) => {
    if (filterKey === 'category') {
        selectedCategory.value = '';
    } else if (filterKey === 'type') {
        selectedType.value = '';
    }
    fetchItems();
};

const clearFilters = () => {
    searchQuery.value = '';
    selectedCategory.value = '';
    selectedType.value = '';
    fetchItems();
};

const handleSearch = () => {
    clearTimeout((window as any).searchTimeout);
    (window as any).searchTimeout = setTimeout(() => {
        fetchItems();
    }, 500);
};

const handleDownload = async (item: LibraryItem) => {
    try {
        if (item.file_path) {
            window.open(item.file_path, '_blank');
        }
    } catch (err) {
        console.error('Download failed:', err);
    }
};

const handleView = async (item: LibraryItem) => {
    try {
        await libraryStore.incrementViews(item.id);
    } catch (err) {
        console.error('Failed to view item:', err);
    }
};

const handleUpload = async () => {
    try {
        await fetchItems();
        showUploadModal.value = false;
        editingItem.value = null;
    } catch (err) {
        console.error('Failed to refresh after upload:', err);
    }
};

// Lifecycle
onMounted(async () => {
    await Promise.all([fetchItems(), fetchCategories()]);
});

// Watchers
watch([selectedCategory, selectedType], () => {
    fetchItems();
});
</script>

<style scoped>
.badge {
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
}

.badge-brand {
    background-color: rgb(220 252 231);
    color: rgb(22 101 52);
}

.badge-neutral {
    background-color: rgb(254 249 195);
    color: rgb(113 63 18);
}

.badge-green {
    background-color: rgb(220 252 231);
    color: rgb(22 101 52);
}

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