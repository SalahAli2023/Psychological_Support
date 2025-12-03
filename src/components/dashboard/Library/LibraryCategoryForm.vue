<template>
    <div class="space-y-6">
        <!-- Header Section -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
                <h1 class="text-3xl font-bold text-primary">إدارة تصنيفات المكتبة</h1>
                <p class="text-secondary mt-2">إدارة وتنظيم تصنيفات محتوى المكتبة</p>
            </div>
            <Button 
                variant="primary" 
                size="lg" 
                class="flex items-center gap-2"
                @click="showAddModal"
            >
                <PlusIcon class="h-5 w-5" />
                إضافة تصنيف جديد
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
                        placeholder="ابحث في التصنيفات..."
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
                        <option value="name_asc">الاسم (أ-ي)</option>
                        <option value="name_desc">الاسم (ي-أ)</option>
                        <option value="newest">الأحدث</option>
                        <option value="oldest">الأقدم</option>
                        <option value="items_count">عدد العناصر</option>
                    </select>

                    <Button 
                        variant="outline" 
                        @click="exportCategories"
                        class="flex items-center gap-2"
                    >
                        <ArrowDownTrayIcon class="h-4 w-4" />
                        تصدير
                    </Button>
                </div>
            </div>
        </Card>

        <!-- Categories Table -->
        <Card class="p-6">
            <template #header>
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div class="text-base sm:text-lg">قائمة التصنيفات</div>
                    <div class="text-sm text-secondary" v-if="!loading">
                        عرض {{ categoriesStore.pagination.from }}-{{ categoriesStore.pagination.to }} 
                        من أصل {{ categoriesStore.pagination.total }}
                    </div>
                </div>
            </template>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
                <span class="mr-2 text-secondary">جاري تحميل التصنيفات...</span>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                <div class="flex items-center justify-between">
                    <div>
                        <strong class="font-bold">خطأ!</strong>
                        <span class="block sm:inline"> {{ error }}</span>
                    </div>
                    <button @click="fetchCategories" class="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                        إعادة المحاولة
                    </button>
                </div>
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
                            <th class="px-4 py-3 text-start font-medium">الاسم</th>
                            <th class="px-4 py-3 text-start font-medium">المفتاح</th>
                            <th class="px-4 py-3 text-start font-medium">اللون</th>
                            <th class="px-4 py-3 text-start font-medium">عدد العناصر</th>
                            <th class="px-4 py-3 text-start font-medium">تاريخ الإضافة</th>
                            <th class="px-4 py-3 text-start font-medium">الإجراءات</th>
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
                                        تعديل
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        @click="handleDelete(category.id)" 
                                        class="text-xs text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
                                        :disabled="(category.items_count || 0) > 0"
                                    >
                                        <TrashIcon class="h-3 w-3 mr-1" />
                                        حذف
                                    </Button>
                                </div>
                                <div v-if="(category.items_count || 0) > 0" class="text-xs text-red-500 mt-1">
                                    لا يمكن الحذف - يحتوي على عناصر
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Empty State -->
            <div v-else-if="!loading && categories.length === 0" class="text-center py-8 text-secondary">
                <FolderOpenIcon class="h-16 w-16 mx-auto mb-4 text-secondary" />
                <h3 class="text-lg font-medium text-primary mb-2">لا توجد تصنيفات</h3>
                <p class="text-secondary mb-4">لم يتم إضافة أي تصنيفات للمكتبة بعد</p>
                <Button @click="showAddModal" variant="outline">
                    إضافة أول تصنيف
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
                        {{ editingCategory ? 'تعديل التصنيف' : 'إضافة تصنيف جديد' }}
                    </h3>
                </div>
                
                <form @submit.prevent="submitForm" class="p-6 space-y-4">
                    <!-- Arabic Name -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            الاسم بالعربية *
                        </label>
                        <input
                            v-model="form.name_ar"
                            type="text"
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            placeholder="أدخل الاسم بالعربية"
                        />
                    </div>

                    <!-- English Name -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            الاسم بالإنجليزية *
                        </label>
                        <input
                            v-model="form.name_en"
                            type="text"
                            required
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            placeholder="أدخل الاسم بالإنجليزية"
                        />
                    </div>

                    <!-- Key -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            المفتاح *
                        </label>
                        <input
                            v-model="form.key"
                            type="text"
                            required
                            pattern="[a-z0-9_]+"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            placeholder="مثال: books_research"
                            title="يجب أن يحتوي على أحرف صغيرة وأرقام وشرطة سفلية فقط"
                        />
                        <p class="text-xs text-gray-500 mt-1">يجب أن يحتوي على أحرف صغيرة وأرقام وشرطة سفلية فقط</p>
                    </div>

                    <!-- Color -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            اللون *
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
                                title="كود اللون السداسي (مثال: #3B82F6)"
                            />
                        </div>
                        <p class="text-xs text-gray-500 mt-1">اختر لوناً يمثل هذا التصنيف</p>
                    </div>

                    <!-- Preview -->
                    <div class="p-4 border border-gray-200 rounded-md bg-gray-50">
                        <p class="text-sm font-medium text-gray-700 mb-2">معاينة التصنيف</p>
                        <div class="flex items-center gap-3">
                            <div 
                                class="w-12 h-12 rounded-lg flex items-center justify-center text-white font-medium"
                                :style="{ backgroundColor: form.color }"
                            >
                                {{ getInitials(form.name_ar) }}
                            </div>
                            <div>
                                <p class="font-medium text-gray-900">{{ form.name_ar || 'اسم التصنيف' }}</p>
                                <p class="text-sm text-gray-600">{{ form.name_en || 'Category Name' }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Form Error -->
                    <div v-if="localError" class="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
                        {{ localError }}
                    </div>

                    <!-- Form Actions -->
                    <div class="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            @click="closeModal"
                            class="flex-1"
                        >
                            إلغاء
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            :loading="submitting"
                            class="flex-1"
                        >
                            {{ editingCategory ? 'تحديث' : 'إنشاء' }}
                        </Button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <DeleteConfirmModal
            :show="showDeleteConfirm"
            title="تأكيد الحذف"
            message="هل أنت متأكد من رغبتك في حذف هذا التصنيف؟"
            @confirm="confirmDelete"
            @cancel="showDeleteConfirm = false"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useLibraryCategoriesStore, type LibraryCategory } from '@/stores/libraryCategories';
import Button from '@/components/dashboard/component/ui/Button.vue';
import Card from '@/components/dashboard/component/ui/Card.vue';
import Pagination from './Pagination.vue';
import DeleteConfirmModal from '@/components/dashboard/events/DeleteConfirmModal.vue';
import {
    MagnifyingGlassIcon,
    ArrowDownTrayIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    FolderOpenIcon
} from '@heroicons/vue/24/outline';

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
const localError = ref('');

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

// Methods
const fetchCategories = async () => {
    localError.value = '';
    try {
        const params: any = {};
        
        if (searchQuery.value) params.search = searchQuery.value;
        if (sortBy.value) params.sort = sortBy.value;
        
        params.page = categoriesStore.pagination.current_page;
        params.per_page = categoriesStore.pagination.per_page;
        
        await categoriesStore.fetchCategories(params);
        console.log('Categories loaded successfully:', categoriesStore.categories.length);
    } catch (err: any) {
        localError.value = 'فشل في تحميل التصنيفات. تأكد من اتصال الشبكة وحاول مرة أخرى.';
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
    const category = categories.value.find(c => c.id === categoryId);
    if (category && (category.items_count || 0) > 0) {
        localError.value = 'لا يمكن حذف التصنيف لأنه يحتوي على عناصر';
        return;
    }
    deleteTargetId.value = categoryId;
    showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
    if (!deleteTargetId.value) return;

    try {
        await categoriesStore.deleteCategory(deleteTargetId.value);
        successMessage.value = 'تم حذف التصنيف بنجاح';
        
        setTimeout(() => {
            successMessage.value = '';
        }, 3000);
        
    } catch (err: any) {
        localError.value = err.response?.data?.message || 'فشل في حذف التصنيف';
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
            successMessage.value = 'تم تحديث التصنيف بنجاح';
        } else {
            await categoriesStore.createCategory(form);
            successMessage.value = 'تم إنشاء التصنيف بنجاح';
        }
        
        setTimeout(() => {
            successMessage.value = '';
        }, 3000);
        
        closeModal();
        await fetchCategories();
        
    } catch (err: any) {
        localError.value = err.response?.data?.message || 
            (editingCategory.value ? 'فشل في تحديث التصنيف' : 'فشل في إنشاء التصنيف');
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
    return new Date(dateString).toLocaleDateString('ar-SA');
};

const handleSearch = () => {
    clearTimeout((window as any).searchTimeout);
    (window as any).searchTimeout = setTimeout(async () => {
        await categoriesStore.changePage(1);
        await fetchCategories();
    }, 500);
};

const exportCategories = () => {
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