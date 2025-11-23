<template>
    <div class="space-y-4 md:space-y-6">
        <!-- Header Section -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div class="text-center sm:text-start">
                <h1 class="text-2xl sm:text-3xl font-bold text-primary">{{ t('library.title') }}</h1>
                <p class="text-sm sm:text-base text-secondary mt-1 sm:mt-2">{{ t('library.subtitle') }}</p>
            </div>
            <Button 
                v-if="hasAuth"
                variant="primary" 
                size="sm md:size-lg"
                class="flex items-center gap-1 md:gap-2 w-full sm:w-auto justify-center"
                @click="upload"
            >
                <CloudArrowUpIcon class="h-4 w-4 md:h-5 md:w-5" />
                <span class="text-sm md:text-base">{{ t('library.upload.upload') }}</span>
            </Button>
        </div>

        <!-- Search and Filters -->
        <Card class="p-4 md:p-6">
            <div class="flex flex-col lg:flex-row gap-3 md:gap-4 items-start lg:items-center justify-between">
                <!-- Search Input - Left Side -->
                <div class="w-full lg:w-64 order-2 lg:order-1">
                    <div class="relative">
                        <input
                            v-model="searchQuery"
                            :placeholder="t('library.search_placeholder')"
                            class="w-full pr-10 pl-4 py-2 md:py-3 rounded-lg border border-primary bg-primary text-primary placeholder-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm md:text-base"
                            @input="handleSearch"
                        />
                        <MagnifyingGlassIcon class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-tertiary" />
                    </div>
                </div>

                <!-- Filter Buttons - Right Side -->
                <div class="flex flex-col sm:flex-row gap-2 w-full lg:w-auto order-1 lg:order-2">
                    <select 
                        v-model="selectedCategory"
                        class="flex-1 px-3 py-2 md:px-4 md:py-3 rounded-lg border border-primary bg-primary text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm md:text-base"
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
                        class="flex-1 px-3 py-2 md:px-4 md:py-3 rounded-lg border border-primary bg-primary text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm md:text-base"
                        @change="fetchItems"
                    >
                        <option value="">{{ t('library.all_types') }}</option>
                        <option value="book">{{ t('library.books') }}</option>
                        <option value="research">{{ t('library.research') }}</option>
                        <option value="guide">{{ t('library.guides') }}</option>
                        <option value="article">{{ t('library.articles') }}</option>
                    </select>


                    <select 
                        v-model="sortBy"
                        class="px-4 py-3 rounded-lg border border-primary bg-primary text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
                        @change="fetchItems"
                    >
                        <option value="newest">{{ t('library.sort.newest') }}</option>
                        <option value="oldest">{{ t('library.sort.oldest') }}</option>
                        <option value="title">{{ t('library.sort.title') }}</option>
                        <option value="popular">{{ t('library.sort.popular') }}</option>
                        <option value="rating">{{ t('library.sort.rating') }}</option>
                    </select>

                    <Button 
                        variant="outline" 
                        @click="toggleSort"
                        class="flex items-center gap-1 md:gap-2 justify-center text-sm md:text-base"
                    >
                        <BarsArrowUpIcon class="h-3 w-3 md:h-4 md:w-4" />
                        <span class="truncate">{{ sortOptions.find(opt => opt.value === sortBy)?.label }}</span>
                    </Button>

                    <Button 
                        @click="clearFilters"
                        variant="outline"
                        class="flex items-center gap-1 md:gap-2 justify-center text-sm md:text-base text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                    >
                        <XMarkIcon class="h-3 w-3 md:h-4 md:w-4" />
                        إعادة تعيين
                    </Button>

                </div>
            </div>

            <!-- Active Filters -->
            <div v-if="activeFilters.length > 0" class="flex flex-wrap items-center gap-2 mt-3 md:mt-4">
                <span 
                    v-for="filter in activeFilters" 
                    :key="filter.key"
                    class="inline-flex items-center gap-1 px-2 py-1 md:px-3 md:py-1 rounded-full bg-brand-500/20 text-brand-500 text-xs md:text-sm"
                >
                    <span class="truncate max-w-[80px] md:max-w-none">{{ filter.label }}</span>
                    <button @click="removeFilter(filter.key)" class="flex-shrink-0">
                        <XMarkIcon class="h-3 w-3" />
                    </button>
                </span>
            </div>
        </Card>

        <!-- Management Table for Admin -->
        <Card v-if="hasAuth" class="p-4 md:p-6">
            <template #header>
                <div class="flex flex-col gap-2">
                    <div class="text-sm md:text-base font-medium">إدارة محتويات المكتبة</div>
                    <div class="text-xs md:text-sm text-secondary">
                        إجمالي العناصر: {{ libraryStore.pagination.total }}
                    </div>
                </div>
            </template>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center py-6 md:py-8">
                <div class="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-brand-500"></div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-3 py-2 md:px-4 md:py-3 rounded-lg mb-3 md:mb-4 text-sm md:text-base">
                {{ error }}
            </div>

            <!-- Success Message -->
            <div v-else-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-3 py-2 md:px-4 md:py-3 rounded-lg mb-3 md:mb-4 text-sm md:text-base">
                {{ successMessage }}
            </div>

            <!-- Table for Desktop -->
            <div v-if="!loading && items.length > 0" class="hidden lg:block overflow-x-auto">
                <table class="min-w-full text-sm">
                    <thead>
                        <tr class="text-start text-secondary bg-secondary">
                            <th class="px-3 py-2 md:px-4 md:py-3 text-start font-medium text-xs md:text-sm">#</th>
                            <th class="px-3 py-2 md:px-4 md:py-3 text-start font-medium text-xs md:text-sm">العنوان</th>
                            <th class="px-3 py-2 md:px-4 md:py-3 text-start font-medium text-xs md:text-sm">النوع</th>
                            <th class="px-3 py-2 md:px-4 md:py-3 text-start font-medium text-xs md:text-sm">التصنيف</th>
                            <th class="px-3 py-2 md:px-4 md:py-3 text-start font-medium text-xs md:text-sm">المشاهدات</th>
                            <th class="px-3 py-2 md:px-4 md:py-3 text-start font-medium text-xs md:text-sm">التنزيلات</th>
                            <th class="px-3 py-2 md:px-4 md:py-3 text-start font-medium text-xs md:text-sm">التقييم</th>
                            <th class="px-3 py-2 md:px-4 md:py-3 text-start font-medium text-xs md:text-sm">الحالة</th>
                            <th class="px-3 py-2 md:px-4 md:py-3 text-start font-medium text-xs md:text-sm">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr 
                            v-for="(item, index) in items" 
                            :key="item.id" 
                            class="border-t border-primary hover:bg-secondary transition-colors"
                        >
                            <td class="px-3 py-2 md:px-4 md:py-3 text-primary font-medium text-center text-xs md:text-sm">
                                {{ (libraryStore.pagination.current_page - 1) * libraryStore.pagination.per_page + index + 1 }}
                            </td>
                            
                            <td class="px-3 py-2 md:px-4 md:py-3 text-primary">
                                <div class="flex items-center gap-2 md:gap-3">
                                    <img 
                                        v-if="item.cover_image" 
                                        :src="item.cover_image" 
                                        :alt="item.title_ar"
                                        class="w-8 h-8 md:w-10 md:h-10 rounded-lg object-cover"
                                    >
                                    <div v-else class="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                        <DocumentTextIcon class="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
                                    </div>
                                    <div class="flex flex-col min-w-0">
                                        <span class="font-medium text-primary text-xs md:text-sm truncate">{{ item.title_ar }}</span>
                                        <span class="text-xs text-secondary truncate">{{ item.author_ar }}</span>
                                    </div>
                                </div>
                            </td>
                            
                            <td class="px-3 py-2 md:px-4 md:py-3 text-primary">
                                <span class="badge badge-neutral text-xs">
                                    {{ getTypeLabel(item.type) }}
                                </span>
                            </td>
                            
                            <td class="px-3 py-2 md:px-4 md:py-3 text-primary">
                                <span class="badge badge-brand text-xs">
                                    {{ locale === 'ar' ? item.category?.name_ar : item.category?.name_en }}
                                </span>
                            </td>
                            
                            <td class="px-3 py-2 md:px-4 md:py-3 text-primary">
                                <div class="flex items-center gap-1 text-xs md:text-sm">
                                    <EyeIcon class="h-3 w-3 md:h-4 md:w-4 text-secondary" />
                                    {{ item.views }}
                                </div>
                            </td>
                            
                            <td class="px-3 py-2 md:px-4 md:py-3 text-primary">
                                <div class="flex items-center gap-1 text-xs md:text-sm">
                                    <ArrowDownTrayIcon class="h-3 w-3 md:h-4 md:w-4 text-secondary" />
                                    {{ item.downloads }}
                                </div>
                            </td>
                            
                            <td class="px-3 py-2 md:px-4 md:py-3 text-primary">
                                <div class="flex items-center gap-1 text-xs md:text-sm">
                                    <StarIcon class="h-3 w-3 md:h-4 md:w-4 text-yellow-500" />
                                    {{ item.rating }} ({{ item.rating_count }})
                                </div>
                            </td>
                            
                            <td class="px-3 py-2 md:px-4 md:py-3">
                                <div class="flex flex-wrap gap-1">
                                    <span :class="['badge text-xs', item.is_published ? 'badge-brand' : 'badge-neutral']">
                                        {{ item.is_published ? 'منشور' : 'مسودة' }}
                                    </span>
                                    <span v-if="item.is_new" class="badge badge-green text-xs">
                                        جديد
                                    </span>
                                </div>
                            </td>
                            
                            <td class="px-3 py-2 md:px-4 md:py-3">
                                <div class="flex gap-1 md:gap-2 flex-wrap">
                                    <Button 
                                        size="xs md:size-sm"
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
                                        <EyeIcon v-if="item.is_published" class="h-3 w-3 md:h-4 md:w-4" />
                                        <EyeSlashIcon v-else class="h-3 w-3 md:h-4 md:w-4" />
                                    </button>
                                    <Button 
                                        size="xs md:size-sm"
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

            <!-- Cards for Mobile Admin View -->
            <div v-if="!loading && items.length > 0" class="lg:hidden space-y-3">
                <div 
                    v-for="(item, index) in items" 
                    :key="item.id"
                    class="bg-white border border-primary rounded-lg p-3 shadow-sm"
                >
                    <!-- Header -->
                    <div class="flex items-start justify-between mb-2">
                        <div class="flex items-center gap-2 flex-1 min-w-0">
                            <img 
                                v-if="item.cover_image" 
                                :src="item.cover_image" 
                                :alt="item.title_ar"
                                class="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                            >
                            <div v-else class="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                                <DocumentTextIcon class="h-5 w-5 text-gray-500" />
                            </div>
                            <div class="flex flex-col min-w-0 flex-1">
                                <span class="font-medium text-primary text-sm truncate">{{ item.title_ar }}</span>
                                <span class="text-xs text-secondary truncate">{{ item.author_ar }}</span>
                            </div>
                        </div>
                        <div class="text-xs text-primary font-medium flex-shrink-0">
                            #{{ (libraryStore.pagination.current_page - 1) * libraryStore.pagination.per_page + index + 1 }}
                        </div>
                    </div>

                    <!-- Details -->
                    <div class="grid grid-cols-2 gap-2 mb-3 text-xs">
                        <div class="flex items-center gap-1">
                            <span class="text-secondary">النوع:</span>
                            <span class="badge badge-neutral">{{ getTypeLabel(item.type) }}</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <span class="text-secondary">التصنيف:</span>
                            <span class="badge badge-brand truncate">{{ locale === 'ar' ? item.category?.name_ar : item.category?.name_en }}</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <EyeIcon class="h-3 w-3 text-secondary" />
                            <span>{{ item.views }} مشاهدات</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <ArrowDownTrayIcon class="h-3 w-3 text-secondary" />
                            <span>{{ item.downloads }} تنزيلات</span>
                        </div>
                    </div>

                    <!-- Status and Rating -->
                    <div class="flex flex-wrap items-center gap-2 mb-3">
                        <span :class="['badge text-xs', item.is_published ? 'badge-brand' : 'badge-neutral']">
                            {{ item.is_published ? 'منشور' : 'مسودة' }}
                        </span>
                        <span v-if="item.is_new" class="badge badge-green text-xs">
                            جديد
                        </span>
                        <div class="flex items-center gap-1 text-xs">
                            <StarIcon class="h-3 w-3 text-yellow-500" />
                            <span>{{ item.rating }} ({{ item.rating_count }})</span>
                        </div>
                    </div>

                    <!-- Actions -->
                    <div class="flex gap-2 border-t border-primary pt-2">
                        <Button 
                            size="xs"
                            variant="outline" 
                            @click="handleEdit(item)"
                            class="flex-1 text-xs"
                        >
                            تعديل
                        </Button>
                        <button 
                            @click="handleTogglePublish(item)" 
                            class="p-2 text-secondary hover:text-primary border border-primary rounded-lg"
                            :title="item.is_published ? 'إلغاء النشر' : 'نشر'"
                        >
                            <EyeIcon v-if="item.is_published" class="h-4 w-4" />
                            <EyeSlashIcon v-else class="h-4 w-4" />
                        </button>
                        <Button 
                            size="xs"
                            variant="outline" 
                            @click="handleDelete(item.id)" 
                            class="flex-1 text-xs text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                        >
                            حذف
                        </Button>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!loading && items.length === 0" class="text-center py-6 md:py-8 text-secondary">
                <FolderOpenIcon class="h-12 w-12 md:h-16 md:w-16 mx-auto mb-3 md:mb-4 text-secondary" />
                <h3 class="text-base md:text-lg font-medium text-primary mb-1 md:mb-2">لا توجد محتويات</h3>
                <p class="text-secondary mb-3 md:mb-4 text-sm md:text-base">لم يتم إضافة أي محتوى للمكتبة بعد</p>
                <Button @click="upload" variant="outline" size="sm">
                    إضافة محتوى جديد
                </Button>
            </div>

            <!-- Pagination for Admin -->
            <Pagination 
                v-if="!loading && items.length > 0"
                :pagination="libraryStore.pagination"
                @page-change="handlePageChange"
                @per-page-change="handlePerPageChange"
                class="mt-4 md:mt-6"
            />
        </Card>

        <!-- Content for non-admin users -->
        <div v-if="!hasAuth">
            <div v-if="loading" class="flex justify-center py-8 md:py-12">
                <div class="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-b-2 border-brand-500"></div>
            </div>

            <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-3 py-2 md:px-4 md:py-3 rounded-lg text-sm md:text-base">
                {{ error }}
            </div>

            <div v-else-if="items.length > 0">
                <!-- Grid View Only (removed list view toggle) -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    <LibraryCard 
                        v-for="item in items"
                        :key="item.id"
                        :item="item"
                        :locale="locale"
                        @download="handleDownload"
                        @view="handleView"
                    />
                </div>

                <!-- Pagination for non-admin users -->
                <Pagination 
                    :pagination="libraryStore.pagination"
                    @page-change="handlePageChange"
                    @per-page-change="handlePerPageChange"
                    class="mt-6 md:mt-8"
                />
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-8 md:py-12">
                <FolderOpenIcon class="mx-auto h-12 w-12 md:h-16 md:w-16 text-tertiary" />
                <h3 class="mt-3 md:mt-4 text-base md:text-lg font-medium text-primary">{{ t('library.no_results') }}</h3>
                <p class="mt-1 md:mt-2 text-secondary text-sm md:text-base">{{ t('library.no_results_desc') }}</p>
                <Button 
                    variant="primary" 
                    class="mt-3 md:mt-4 text-sm md:text-base"
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
import UploadModal from './UploadModal.vue';
import Pagination from './Pagination.vue';
import DeleteConfirmModal from '@/components/dashboard/events/DeleteConfirmModal.vue';
import {
    FolderIcon,
    ArrowDownTrayIcon,
    MagnifyingGlassIcon,
    BarsArrowUpIcon,
    XMarkIcon,
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
const showUploadModal = ref(false);
const showDeleteConfirm = ref(false);
const editingItem = ref<LibraryItem | null>(null);
const deleteTargetId = ref<number | null>(null);
const successMessage = ref('');
const localError = ref('');

// Computed
const hasAuth = computed(() => authStore.isAuthenticated);
const loading = computed(() => libraryStore.loading);
const error = computed(() => localError.value || libraryStore.error);
const items = computed(() => libraryStore.items);
const categories = computed(() => libraryStore.categories);

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

// Methods
const fetchItems = async () => {
    localError.value = '';
    const params: any = {};
    
    if (selectedCategory.value) params.category_id = selectedCategory.value;
    if (selectedType.value) params.type = selectedType.value;
    if (searchQuery.value) params.search = searchQuery.value;
    if (sortBy.value) params.sort = sortBy.value;
    
    // إضافة معلمات الترقيم
    params.page = libraryStore.pagination.current_page;
    params.per_page = libraryStore.pagination.per_page;
    
    try {
        await libraryStore.fetchItems(params);
    } catch (err: any) {
        localError.value = 'فشل في تحميل العناصر';
        console.error('Failed to fetch items:', err);
    }
};

const fetchCategories = async () => {
    try {
        await libraryStore.fetchCategories();
        console.log('Categories loaded successfully:', libraryStore.categories.length);
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        localError.value = 'فشل في تحميل التصنيفات';
    }
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
        localError.value = err.response?.data?.message || 'فشل في حذف العنصر';
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
        localError.value = err.response?.data?.message || 'فشل في تحديث حالة العنصر';
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

const removeFilter = (filterKey: string) => {
    if (filterKey === 'category') {
        selectedCategory.value = '';
    } else if (filterKey === 'type') {
        selectedType.value = '';
    }
    fetchItems();
};

const clearFilters = async () => {
    searchQuery.value = '';
    selectedCategory.value = '';
    selectedType.value = '';
    sortBy.value = 'newest';
    
    // إعادة تعيين الصفحة إلى الأولى عند مسح الفلاتر
    await libraryStore.changePage(1);
    await fetchItems();
};

const handleSearch = () => {
    clearTimeout((window as any).searchTimeout);
    (window as any).searchTimeout = setTimeout(async () => {
        // العودة للصفحة الأولى عند البحث
        await libraryStore.changePage(1);
        await fetchItems();
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

// دوال الترقيم
const handlePageChange = async (page: number) => {
  await libraryStore.changePage(page);
  await fetchItems();
};

const handlePerPageChange = async (perPage: number) => {
  await libraryStore.changePerPage(perPage);
  await fetchItems();
};

// Lifecycle
onMounted(async () => {
    try {
        await Promise.all([fetchItems(), fetchCategories()]);
    } catch (error) {
        console.error('Initialization failed:', error);
        localError.value = 'فشل في تحميل البيانات الأولية';
    }
});

// Watchers
watch([selectedCategory, selectedType, sortBy], () => {
    fetchItems();
});
</script>

<style scoped>
.badge {
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-size: 0.7rem;
    font-weight: 500;
    display: inline-block;
}

@media (min-width: 768px) {
    .badge {
        padding: 0.25rem 0.5rem;
        border-radius: 0.375rem;
        font-size: 0.75rem;
    }
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
    width: 4px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}

/* تحسينات للعرض على الجوال */
@media (max-width: 640px) {
    .text-xs-mobile {
        font-size: 0.7rem;
    }
    
    .p-mobile {
        padding: 0.75rem;
    }
}

/* منع التكسر في النصوص الطويلة */
.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.min-w-0 {
    min-width: 0;
}
</style>