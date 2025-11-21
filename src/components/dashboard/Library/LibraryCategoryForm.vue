<template>
    <div class="space-y-6">
        <!-- Header Section -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
                <h1 class="text-3xl font-bold text-primary">{{ t('library.categories.title') }}</h1>
                <p class="text-secondary mt-2">{{ t('library.categories.subtitle') }}</p>
            </div>
            <Button 
                variant="primary" 
                size="lg" 
                class="flex items-center gap-2"
                @click="showAddModal"
            >
                <PlusIcon class="h-5 w-5" />
                {{ t('library.categories.add_category') }}
            </Button>
        </div>


        <!-- Search and Actions -->
        <Card class="p-6">
            <div class="flex flex-col lg:flex-row gap-4">
                <!-- Search Input -->
                <div class="flex-1 relative">
                    <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-tertiary" />
                    <input
                        v-model="searchQuery"
                        :placeholder="t('library.categories.search_placeholder')"
                        class="w-full pl-10 pr-4 py-3 rounded-lg border border-primary bg-primary text-primary placeholder-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        @input="handleSearch"
                    />
                </div>

                <!-- Filter and Sort Buttons -->
                <div class="flex gap-2">
                    <select 
                        v-model="sortBy"
                        class="px-4 py-3 rounded-lg border border-primary bg-primary text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
                        @change="fetchCategories"
                    >
                        <option value="name_asc">{{ t('library.categories.sort.name_asc') }}</option>
                        <option value="name_desc">{{ t('library.categories.sort.name_desc') }}</option>
                        <option value="newest">{{ t('library.categories.sort.newest') }}</option>
                        <option value="oldest">{{ t('library.categories.sort.oldest') }}</option>
                        <option value="items_count">{{ t('library.categories.sort.items_count') }}</option>
                    </select>

                    <Button 
                        variant="outline" 
                        @click="exportCategories"
                        class="flex items-center gap-2"
                    >
                        <ArrowDownTrayIcon class="h-4 w-4" />
                        {{ t('library.categories.export') }}
                    </Button>
                </div>
            </div>
        </Card>

        <!-- Categories Table -->
        <Card class="p-6">
            <template #header>
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div class="text-base sm:text-lg">{{ t('library.categories.categories_list') }}</div>
                    <div class="text-sm text-secondary">
                        {{ t('library.categories.showing') }} {{ categoriesStore.pagination.from }}-{{ categoriesStore.pagination.to }} 
                        {{ t('library.categories.of') }} {{ categoriesStore.pagination.total }}
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
            <div v-if="!loading && categories.length > 0" class="overflow-x-auto">
                <table class="min-w-full text-sm">
                    <thead>
                        <tr class="text-start text-secondary bg-secondary">
                            <th class="px-4 py-3 text-start font-medium">#</th>
                            <th class="px-4 py-3 text-start font-medium">{{ t('library.categories.name') }}</th>
                            <th class="px-4 py-3 text-start font-medium">{{ t('library.categories.key') }}</th>
                            <th class="px-4 py-3 text-start font-medium">{{ t('library.categories.color') }}</th>
                            <th class="px-4 py-3 text-start font-medium">{{ t('library.categories.items_count') }}</th>
                            <th class="px-4 py-3 text-start font-medium">{{ t('library.categories.created_at') }}</th>
                            <th class="px-4 py-3 text-start font-medium">{{ t('library.categories.actions') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr 
                            v-for="(category, index) in categories" 
                            :key="category.id" 
                            class="border-t border-primary hover:bg-secondary transition-colors"
                        >
                            <td class="px-4 py-3 text-primary font-medium text-center">
                                {{ (categoriesStore.pagination.current_page - 1) * categoriesStore.pagination.per_page + index + 1 }}
                            </td>
                            
                            <td class="px-4 py-3 text-primary">
                                <div class="flex items-center gap-3">
                                    <div 
                                        class="w-10 h-10 rounded-lg flex items-center justify-center text-white font-medium"
                                        :style="{ backgroundColor: category.color }"
                                    >
                                        {{ getInitials(category.name_ar) }}
                                    </div>
                                    <div class="flex flex-col">
                                        <span class="font-medium text-primary">{{ category.name_ar }}</span>
                                        <span class="text-xs text-secondary">{{ category.name_en }}</span>
                                    </div>
                                </div>
                            </td>
                            
                            <td class="px-4 py-3 text-primary">
                                <code class="px-2 py-1 bg-gray-100 rounded text-sm">{{ category.key }}</code>
                            </td>
                            
                            <td class="px-4 py-3">
                                <div class="flex items-center gap-2">
                                    <div 
                                        class="w-6 h-6 rounded border"
                                        :style="{ backgroundColor: category.color }"
                                    ></div>
                                    <span class="text-primary">{{ category.color }}</span>
                                </div>
                            </td>
                            
                            <td class="px-4 py-3 text-primary">
                                <span class="badge badge-neutral">
                                    {{ category.items_count || 0 }}
                                </span>
                            </td>
                            
                            <td class="px-4 py-3 text-primary">
                                {{ formatDate(category.created_at) }}
                            </td>
                            
                            <td class="px-4 py-3">
                                <div class="flex gap-2">
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        @click="handleEdit(category)"
                                        class="text-xs"
                                    >
                                        <PencilIcon class="h-3 w-3 mr-1" />
                                        {{ t('library.categories.edit') }}
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        @click="handleDelete(category.id)" 
                                        class="text-xs text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                                    >
                                        <TrashIcon class="h-3 w-3 mr-1" />
                                        {{ t('library.categories.delete') }}
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Empty State -->
            <div v-else-if="!loading && categories.length === 0" class="text-center py-8 text-secondary">
                <FolderOpenIcon class="h-16 w-16 mx-auto mb-4 text-secondary" />
                <h3 class="text-lg font-medium text-primary mb-2">{{ t('library.categories.no_categories') }}</h3>
                <p class="text-secondary mb-4">{{ t('library.categories.no_categories_desc') }}</p>
                <Button @click="showAddModal" variant="outline">
                    {{ t('library.categories.add_first_category') }}
                </Button>
            </div>

            <!-- Pagination -->
            <Pagination 
                v-if="!loading && categories.length > 0"
                :pagination="categoriesStore.pagination"
                @page-change="handlePageChange"
                @per-page-change="handlePerPageChange"
                class="mt-6"
            />
        </Card>

        <!-- Add/Edit Category Modal -->
        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6 border-b border-gray-200">
                    <h3 class="text-lg font-medium text-gray-900">
                        {{ editingCategory ? t('library.categories.edit_category') : t('library.categories.add_category') }}
                    </h3>
                </div>
                
                <form @submit.prevent="submitForm" class="p-6 space-y-4">
                    <!-- Arabic Name -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            {{ t('library.categories.name_ar') }} *
                        </label>
                        <input
                            v-model="form.name_ar"
                            type="text"
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            :placeholder="t('library.categories.name_ar_placeholder')"
                        />
                    </div>

                    <!-- English Name -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            {{ t('library.categories.name_en') }} *
                        </label>
                        <input
                            v-model="form.name_en"
                            type="text"
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            :placeholder="t('library.categories.name_en_placeholder')"
                        />
                    </div>

                    <!-- Key -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            {{ t('library.categories.key') }} *
                        </label>
                        <input
                            v-model="form.key"
                            type="text"
                            required
                            pattern="[a-z0-9_]+"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            :placeholder="t('library.categories.key_placeholder')"
                            title="Only lowercase letters, numbers, and underscores allowed"
                        />
                        <p class="text-xs text-gray-500 mt-1">{{ t('library.categories.key_hint') }}</p>
                    </div>

                    <!-- Color -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            {{ t('library.categories.color') }} *
                        </label>
                        <div class="flex gap-2">
                            <input
                                v-model="form.color"
                                type="color"
                                class="w-12 h-12 border border-gray-300 rounded-md cursor-pointer"
                            />
                            <input
                                v-model="form.color"
                                type="text"
                                required
                                pattern="^#[0-9A-Fa-f]{6}$"
                                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                placeholder="#3B82F6"
                                title="Hex color code (e.g., #3B82F6)"
                            />
                        </div>
                        <p class="text-xs text-gray-500 mt-1">{{ t('library.categories.color_hint') }}</p>
                    </div>

                    <!-- Preview -->
                    <div class="p-4 border border-gray-200 rounded-md bg-gray-50">
                        <p class="text-sm font-medium text-gray-700 mb-2">{{ t('library.categories.preview') }}</p>
                        <div class="flex items-center gap-3">
                            <div 
                                class="w-12 h-12 rounded-lg flex items-center justify-center text-white font-medium"
                                :style="{ backgroundColor: form.color }"
                            >
                                {{ getInitials(form.name_ar) }}
                            </div>
                            <div>
                                <p class="font-medium text-gray-900">{{ form.name_ar || t('library.categories.preview_ar') }}</p>
                                <p class="text-sm text-gray-600">{{ form.name_en || t('library.categories.preview_en') }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            @click="closeModal"
                            class="flex-1"
                        >
                            {{ t('library.categories.cancel') }}
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            :loading="submitting"
                            class="flex-1"
                        >
                            {{ editingCategory ? t('library.categories.update') : t('library.categories.create') }}
                        </Button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <DeleteConfirmModal
            :show="showDeleteConfirm"
            :title="t('library.categories.delete_confirm_title')"
            :message="t('library.categories.delete_confirm_message')"
            @confirm="confirmDelete"
            @cancel="showDeleteConfirm = false"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLibraryCategoriesStore, type LibraryCategory } from '@/stores/libraryCategories';
import Button from '@/components/dashboard/component/ui/Button.vue';
import Card from '@/components/dashboard/component/ui/Card.vue';
import Pagination from './Pagination.vue';
import DeleteConfirmModal from '@/components/dashboard/events/DeleteConfirmModal.vue';
import {
    FolderIcon,
    BookOpenIcon,
    EyeIcon,
    ClockIcon,
    MagnifyingGlassIcon,
    ArrowDownTrayIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    FolderOpenIcon
} from '@heroicons/vue/24/outline';

const { t, locale } = useI18n();
const categoriesStore = useLibraryCategoriesStore();

// Data
const searchQuery = ref('');
const sortBy = ref('name_asc');
const showModal = ref(false);
const showDeleteConfirm = ref(false);
const editingCategory = ref<LibraryCategory | null>(null);
const deleteTargetId = ref<number | null>(null);
const successMessage = ref('');
const submitting = ref(false);
const localError = ref(''); // خطأ محلي

const form = reactive({
    name_ar: '',
    name_en: '',
    key: '',
    color: '#3B82F6'
});

// Computed
const loading = computed(() => categoriesStore.loading);
const error = computed(() => localError.value || categoriesStore.error);
const categories = computed(() => categoriesStore.categories);

const totalItems = computed(() => {
    return categories.value.reduce((sum, category) => sum + (category.items_count || 0), 0);
});

const activeCategories = computed(() => {
    return categories.value.filter(category => (category.items_count || 0) > 0).length;
});

const recentlyAdded = computed(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return categories.value.filter(category => new Date(category.created_at) > oneWeekAgo).length;
});

// Methods
const fetchCategories = async () => {
    localError.value = ''; // مسح الأخطاء المحلية
    try {
        const params: any = {};
        
        if (searchQuery.value) params.search = searchQuery.value;
        if (sortBy.value) params.sort = sortBy.value;
        
        params.page = categoriesStore.pagination.current_page;
        params.per_page = categoriesStore.pagination.per_page;
        
        await categoriesStore.fetchCategories(params);
    } catch (err: any) {
        localError.value = t('library.categories.fetch_error');
        console.error('Failed to fetch categories:', err);
    }
};

const showAddModal = () => {
    editingCategory.value = null;
    resetForm();
    showModal.value = true;
};

const handleEdit = (category: LibraryCategory) => {
    editingCategory.value = category;
    form.name_ar = category.name_ar;
    form.name_en = category.name_en;
    form.key = category.key;
    form.color = category.color;
    showModal.value = true;
};

const handleDelete = (categoryId: number) => {
    deleteTargetId.value = categoryId;
    showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
    if (!deleteTargetId.value) return;

    try {
        await categoriesStore.deleteCategory(deleteTargetId.value);
        successMessage.value = t('library.categories.delete_success');
        
        setTimeout(() => {
            successMessage.value = '';
        }, 3000);
        
    } catch (err: any) {
        localError.value = err.response?.data?.message || t('library.categories.delete_error');
        console.error('Failed to delete category:', err);
    } finally {
        showDeleteConfirm.value = false;
        deleteTargetId.value = null;
    }
};

const submitForm = async () => {
    submitting.value = true;
    localError.value = '';
    
    try {
        if (editingCategory.value) {
            await categoriesStore.updateCategory(editingCategory.value.id, form);
            successMessage.value = t('library.categories.update_success');
        } else {
            await categoriesStore.createCategory(form);
            successMessage.value = t('library.categories.create_success');
        }
        
        setTimeout(() => {
            successMessage.value = '';
        }, 3000);
        
        closeModal();
        await fetchCategories();
        
    } catch (err: any) {
        localError.value = err.response?.data?.message || 
            (editingCategory.value ? t('library.categories.update_error') : t('library.categories.create_error'));
        console.error('Form submission failed:', err);
    } finally {
        submitting.value = false;
    }
};

const closeModal = () => {
    showModal.value = false;
    editingCategory.value = null;
    resetForm();
};

const resetForm = () => {
    form.name_ar = '';
    form.name_en = '';
    form.key = '';
    form.color = '#3B82F6';
};

const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'C';
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale.value === 'ar' ? 'ar-SA' : 'en-US');
};

const handleSearch = () => {
    clearTimeout((window as any).searchTimeout);
    (window as any).searchTimeout = setTimeout(async () => {
        await categoriesStore.changePage(1);
        await fetchCategories();
    }, 500);
};

const exportCategories = () => {
    // Implementation for exporting categories
    console.log('Exporting categories...');
};

// Pagination methods
const handlePageChange = async (page: number) => {
    await categoriesStore.changePage(page);
    await fetchCategories();
};

const handlePerPageChange = async (perPage: number) => {
    await categoriesStore.changePerPage(perPage);
    await fetchCategories();
};

// Lifecycle
onMounted(async () => {
    await fetchCategories();
});
</script>

<style scoped>
.badge {
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
}

.badge-neutral {
    background-color: rgb(243 244 246);
    color: rgb(55 65 81);
}

.badge-brand {
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