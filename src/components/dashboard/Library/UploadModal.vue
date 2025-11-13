<template>
    <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <!-- محتوى المودال -->
        <div class="relative w-full max-w-2xl bg-primary rounded-xl shadow-2xl border border-primary max-h-[90vh] overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-primary bg-primary rounded-t-xl">
                <div>
                    <h2 class="text-xl font-semibold text-primary">{{ t('library.upload.title') }}</h2>
                    <p class="text-sm text-secondary mt-1">{{ t('library.upload.subtitle') }}</p>
                </div>
                <button 
                    @click="closeModal"
                    class="p-2 rounded-lg hover:bg-tertiary transition-colors"
                >
                    <XMarkIcon class="h-5 w-5 text-primary" />
                </button>
            </div>

            <!-- Progress Bar -->
            <div v-if="uploadProgress > 0" class="px-6 pt-4 bg-primary">
                <div class="w-full bg-tertiary rounded-full h-2">
                    <div 
                        class="bg-brand-500 h-2 rounded-full transition-all duration-300"
                        :style="{ width: uploadProgress + '%' }"
                    ></div>
                </div>
                <div class="text-xs text-secondary mt-1 text-center">
                    {{ uploadProgress }}% {{ t('library.upload.complete') }}
                </div>
            </div>

            <!-- Content مع تمرير -->
            <div class="overflow-y-auto max-h-[60vh] p-6 bg-primary">
                <form @submit.prevent="handleSubmit" class="space-y-6">
                    <!-- Upload Area -->
                    <div 
                        @drop="handleDrop"
                        @dragover="handleDragOver"
                        @dragleave="handleDragLeave"
                        :class="[
                            'border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer',
                            isDragging 
                                ? 'border-brand-500 bg-brand-500/10' 
                                : selectedFile 
                                    ? 'border-green-500 bg-green-500/10'
                                    : 'border-primary hover:border-brand-500 hover:bg-tertiary'
                        ]"
                        @click="triggerFileInput"
                    >
                        <input 
                            ref="fileInput"
                            type="file"
                            @change="handleFileSelect"
                            class="hidden"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mov"
                        />
                        
                        <CloudArrowUpIcon 
                            :class="[
                                'mx-auto h-12 w-12 mb-4 transition-colors',
                                isDragging 
                                    ? 'text-brand-500' 
                                    : selectedFile 
                                        ? 'text-green-500'
                                        : 'text-secondary'
                            ]"
                        />
                        
                        <template v-if="!selectedFile">
                            <p class="text-lg font-medium text-primary mb-2">
                                {{ t('library.upload.dropzone_title') }}
                            </p>
                            <p class="text-sm text-secondary mb-4">
                                {{ t('library.upload.dropzone_subtitle') }}
                            </p>
                            <Button type="button" variant="outline" size="sm">
                                {{ t('library.upload.browse_files') }}
                            </Button>
                        </template>
                        
                        <template v-else>
                            <DocumentIcon class="mx-auto h-12 w-12 text-green-500 mb-4" />
                            <p class="text-lg font-medium text-primary mb-1">{{ selectedFile.name }}</p>
                            <p class="text-sm text-secondary">
                                {{ formatFileSize(selectedFile.size) }} • 
                                {{ getFileType(selectedFile.name) }}
                            </p>
                            <button 
                                type="button"
                                @click.stop="removeFile"
                                class="mt-3 text-sm text-rose-500 hover:text-rose-600"
                            >
                                {{ t('library.upload.remove_file') }}
                            </button>
                        </template>
                    </div>

                    <!-- Form Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Title (Arabic) -->
                        <div>
                            <label class="block text-sm font-medium text-primary mb-2">
                                {{ t('library.upload.title_ar') }} *
                            </label>
                            <input
                                v-model="formData.title_ar"
                                type="text"
                                required
                                class="w-full px-3 py-2 border border-primary rounded-lg bg-primary text-primary placeholder-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                :placeholder="t('library.upload.title_ar_placeholder')"
                                @click.stop
                            />
                        </div>

                        <!-- Title (English) -->
                        <div>
                            <label class="block text-sm font-medium text-primary mb-2">
                                {{ t('library.upload.title_en') }} *
                            </label>
                            <input
                                v-model="formData.title_en"
                                type="text"
                                required
                                class="w-full px-3 py-2 border border-primary rounded-lg bg-primary text-primary placeholder-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                :placeholder="t('library.upload.title_en_placeholder')"
                                @click.stop
                            />
                        </div>

                        <!-- Category -->
                        <div>
                            <label class="block text-sm font-medium text-primary mb-2">
                                {{ t('library.upload.category') }} *
                            </label>
                            <select
                                v-model="formData.category_id"
                                required
                                class="w-full px-3 py-2 border border-primary rounded-lg bg-primary text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                @click.stop
                            >
                                <option value="">{{ t('library.upload.select_category') }}</option>
                                <option 
                                    v-for="category in categories" 
                                    :key="category.id" 
                                    :value="category.id"
                                >
                                    {{ locale === 'ar' ? category.name_ar : category.name_en }}
                                </option>
                            </select>
                        </div>

                        <!-- Type -->
                        <div>
                            <label class="block text-sm font-medium text-primary mb-2">
                                {{ t('library.upload.type') }} *
                            </label>
                            <select
                                v-model="formData.type"
                                required
                                class="w-full px-3 py-2 border border-primary rounded-lg bg-primary text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                @click.stop
                            >
                                <option value="">{{ t('library.upload.select_type') }}</option>
                                <option value="book">{{ t('library.types.book') }}</option>
                                <option value="research">{{ t('library.types.research') }}</option>
                                <option value="guide">{{ t('library.types.guide') }}</option>
                                <option value="article">{{ t('library.types.article') }}</option>
                            </select>
                        </div>

                        <!-- Author (Arabic) -->
                        <div>
                            <label class="block text-sm font-medium text-primary mb-2">
                                {{ t('library.upload.author_ar') }}
                            </label>
                            <input
                                v-model="formData.author_ar"
                                type="text"
                                class="w-full px-3 py-2 border border-primary rounded-lg bg-primary text-primary placeholder-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                :placeholder="t('library.upload.author_ar_placeholder')"
                                @click.stop
                            />
                        </div>

                        <!-- Author (English) -->
                        <div>
                            <label class="block text-sm font-medium text-primary mb-2">
                                {{ t('library.upload.author_en') }}
                            </label>
                            <input
                                v-model="formData.author_en"
                                type="text"
                                class="w-full px-3 py-2 border border-primary rounded-lg bg-primary text-primary placeholder-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                :placeholder="t('library.upload.author_en_placeholder')"
                                @click.stop
                            />
                        </div>

                        <!-- Publish Date -->
                        <div>
                            <label class="block text-sm font-medium text-primary mb-2">
                                {{ t('library.upload.publish_date') }}
                            </label>
                            <input
                                v-model="formData.publish_date"
                                type="date"
                                class="w-full px-3 py-2 border border-primary rounded-lg bg-primary text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                @click.stop
                            />
                        </div>

                        <!-- Pages -->
                        <div>
                            <label class="block text-sm font-medium text-primary mb-2">
                                {{ t('library.upload.pages') }}
                            </label>
                            <input
                                v-model="formData.pages"
                                type="number"
                                min="1"
                                class="w-full px-3 py-2 border border-primary rounded-lg bg-primary text-primary placeholder-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                :placeholder="t('library.upload.pages_placeholder')"
                                @click.stop
                            />
                        </div>
                    </div>

                    <!-- Description (Arabic) -->
                    <div>
                        <label class="block text-sm font-medium text-primary mb-2">
                            {{ t('library.upload.description_ar') }}
                        </label>
                        <textarea
                            v-model="formData.description_ar"
                            rows="3"
                            class="w-full px-3 py-2 border border-primary rounded-lg bg-primary text-primary placeholder-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                            :placeholder="t('library.upload.description_ar_placeholder')"
                            @click.stop
                        ></textarea>
                    </div>

                    <!-- Description (English) -->
                    <div>
                        <label class="block text-sm font-medium text-primary mb-2">
                            {{ t('library.upload.description_en') }}
                        </label>
                        <textarea
                            v-model="formData.description_en"
                            rows="3"
                            class="w-full px-3 py-2 border border-primary rounded-lg bg-primary text-primary placeholder-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
                            :placeholder="t('library.upload.description_en_placeholder')"
                            @click.stop
                        ></textarea>
                    </div>

                    <!-- Cover Image Upload -->
                    <div>
                        <label class="block text-sm font-medium text-primary mb-2">
                            {{ t('library.upload.cover_image') }}
                        </label>
                        <div class="flex items-center gap-4">
                            <div 
                                v-if="coverPreview"
                                class="relative w-24 h-32 rounded-lg overflow-hidden border border-primary"
                            >
                                <img 
                                    :src="coverPreview" 
                                    alt="Cover preview"
                                    class="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    @click="removeCover"
                                    class="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600"
                                >
                                    <XMarkIcon class="h-3 w-3" />
                                </button>
                            </div>
                            
                            <div 
                                @click="triggerCoverInput"
                                class="flex-1 border-2 border-dashed border-primary rounded-lg p-4 text-center cursor-pointer hover:border-brand-500 hover:bg-tertiary transition-colors"
                                @click.stop
                            >
                                <input 
                                    ref="coverInput"
                                    type="file"
                                    @change="handleCoverSelect"
                                    class="hidden"
                                    accept=".jpg,.jpeg,.png,.webp"
                                />
                                <PhotoIcon class="mx-auto h-8 w-8 text-secondary mb-2" />
                                <p class="text-sm text-primary">{{ t('library.upload.cover_upload') }}</p>
                                <p class="text-xs text-secondary">{{ t('library.upload.cover_formats') }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Additional Options -->
                    <div class="flex items-center gap-4">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input
                                v-model="formData.is_new"
                                type="checkbox"
                                class="rounded border-primary text-brand-500 focus:ring-brand-500"
                                @click.stop
                            />
                            <span class="text-sm text-primary">{{ t('library.upload.mark_as_new') }}</span>
                        </label>
                        
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input
                                v-model="formData.is_published"
                                type="checkbox"
                                class="rounded border-primary text-brand-500 focus:ring-brand-500"
                                @click.stop
                            />
                            <span class="text-sm text-primary">{{ t('library.upload.publish_immediately') }}</span>
                        </label>
                    </div>
                </form>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-between p-6 border-t border-primary bg-secondary rounded-b-xl">
                <div class="text-sm text-secondary">
                    {{ t('library.upload.supported_formats') }}
                </div>
                
                <div class="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        @click="closeModal"
                        :disabled="isUploading"
                    >
                        {{ t('library.upload.cancel') }}
                    </Button>
                    
                    <Button
                        type="submit"
                        variant="primary"
                        @click="handleSubmit"
                        :disabled="!selectedFile || isUploading || !formData.title_ar || !formData.title_en"
                        :loading="isUploading"
                        class="flex items-center gap-2"
                    >
                        <CloudArrowUpIcon v-if="!isUploading" class="h-4 w-4" />
                        {{ isUploading ? t('library.upload.uploading') : t('library.upload.upload') }}
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@/components/dashboard/component/ui/Button.vue';
import {
    XMarkIcon,
    CloudArrowUpIcon,
    DocumentIcon,
    PhotoIcon
} from '@heroicons/vue/24/outline';

const { t, locale } = useI18n();

// Emits
const emit = defineEmits(['close', 'uploaded']);

// Refs
const fileInput = ref<HTMLInputElement>();
const coverInput = ref<HTMLInputElement>();
const isDragging = ref(false);
const selectedFile = ref<File | null>(null);
const coverFile = ref<File | null>(null);
const coverPreview = ref<string | null>(null);
const isUploading = ref(false);
const uploadProgress = ref(0);

interface Props {
    categories: any[];
}
const props = defineProps<Props>();

// Form Data
const formData = reactive({
    title_ar: '',
    title_en: '',
    description_ar: '',
    description_en: '',
    author_ar: '',
    author_en: '',
    type: '',
    category_id: '',
    publish_date: '',
    pages: '',
    is_new: true,
    is_published: true
});

// Methods
const closeModal = () => {
    emit('close');
};

const triggerFileInput = () => {
    fileInput.value?.click();
};

const triggerCoverInput = () => {
    coverInput.value?.click();
};

const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        selectedFile.value = target.files[0];
    }
};

const handleCoverSelect = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        coverFile.value = target.files[0];
        coverPreview.value = URL.createObjectURL(coverFile.value);
    }
};

const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    isDragging.value = false;
    
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
        selectedFile.value = event.dataTransfer.files[0];
    }
};

const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    isDragging.value = true;
};

const handleDragLeave = (event: DragEvent) => {
    event.preventDefault();
    isDragging.value = false;
};

const removeFile = () => {
    selectedFile.value = null;
    if (fileInput.value) {
        fileInput.value.value = '';
    }
};

const removeCover = () => {
    coverFile.value = null;
    coverPreview.value = null;
    if (coverInput.value) {
        coverInput.value.value = '';
    }
};

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileType = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    const types: { [key: string]: string } = {
        pdf: 'PDF',
        doc: 'Word',
        docx: 'Word',
        jpg: 'Image',
        jpeg: 'Image',
        png: 'Image',
        mp4: 'Video',
        mov: 'Video'
    };
    return types[extension || ''] || 'File';
};

const simulateUpload = () => {
    return new Promise<void>((resolve) => {
        const interval = setInterval(() => {
            uploadProgress.value += Math.random() * 10;
            if (uploadProgress.value >= 100) {
                uploadProgress.value = 100;
                clearInterval(interval);
                setTimeout(resolve, 500);
            }
        }, 200);
    });
};

const handleSubmit = async () => {
    if (!selectedFile.value || !formData.title_ar || !formData.title_en || !formData.type || !formData.category_id) {
        return;
    }

    isUploading.value = true;
    uploadProgress.value = 0;

    try {
        // Simulate upload progress
        await simulateUpload();

        // Create new item object
        const newItem = {
            id: Date.now().toString(),
            title_ar: formData.title_ar,
            title_en: formData.title_en,
            description_ar: formData.description_ar,
            description_en: formData.description_en,
            author_ar: formData.author_ar,
            author_en: formData.author_en,
            type: formData.type,
            category_id: parseInt(formData.category_id),
            cover_image: coverPreview.value,
            file_path: URL.createObjectURL(selectedFile.value),
            file_size: formatFileSize(selectedFile.value.size),
            pages: formData.pages ? parseInt(formData.pages) : null,
            publish_date: formData.publish_date || new Date().toISOString().split('T')[0],
            downloads: 0,
            views: 0,
            rating: 0,
            rating_count: 0,
            is_new: formData.is_new,
            is_published: formData.is_published,
            created_at: new Date().toISOString()
        };

        emit('uploaded', newItem);
        closeModal();
        
    } catch (error) {
        console.error('Upload failed:', error);
        // Handle error - show notification, etc.
    } finally {
        isUploading.value = false;
        uploadProgress.value = 0;
    }
};

// Event listeners for drag and drop
onMounted(() => {
    document.addEventListener('dragover', handleDragOver);
    document.addEventListener('drop', handleDrop);
});

onUnmounted(() => {
    document.removeEventListener('dragover', handleDragOver);
    document.removeEventListener('drop', handleDrop);
    
    // Clean up preview URL
    if (coverPreview.value) {
        URL.revokeObjectURL(coverPreview.value);
    }
});
</script>

<style scoped>
/* إصلاحات التأكد من ظهور المودال كامل */
.fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.relative {
    position: relative;
}

/* تحسين المظهر على الشاشات الصغيرة */
@media (max-width: 640px) {
    .p-4 {
        padding: 1rem;
    }
    
    .p-6 {
        padding: 1.25rem;
    }
    
    .p-8 {
        padding: 1.5rem;
    }
    
    .max-w-2xl {
        max-width: 95%;
    }
}

/* تحسين التمرير إذا كان المحتوى طويلاً */
.max-w-2xl {
    max-width: 42rem;
}

.max-h-\[90vh\] {
    max-height: 90vh;
}

.max-h-\[60vh\] {
    max-height: 60vh;
}

.overflow-hidden {
    overflow: hidden;
}

.overflow-y-auto {
    overflow-y: auto;
}

/* تحسين الظلال والحدود */
.shadow-2xl {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.rounded-xl {
    border-radius: 0.75rem;
}

/* تحسين transitions */
.transition-colors {
    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}

.transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
}

/* تحسين scrollbar */
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

/* منع انتشار الأحداث */
* {
    box-sizing: border-box;
}
</style>