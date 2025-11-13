<template>
<Card>
<div class="flex flex-col md:flex-row gap-4 items-end">
<div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
<!-- بحث بالعنوان -->
<div>
<label class="block text-sm font-medium text-secondary mb-1">
البحث بالعنوان
</label>
<div class="relative">
<MagnifyingGlassIcon class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary" />
<input
v-model="filters.search"
type="text"
placeholder="ابحث بالعنوان..."
class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-brand-500"
@input="handleFilterChange"
/>
</div>
</div>
    <!-- تصفية بالتصنيف -->
    <div>
      <label class="block text-sm font-medium text-secondary mb-1">
        تصفية بالتصنيف
      </label>
      <select 
        v-model="filters.category_id"
        class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        @change="handleFilterChange"
      >
        <option value="">جميع التصنيفات</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name_ar }}
        </option>
      </select>
    </div>

    <!-- تصفية بالحالة -->
    <div>
      <label class="block text-sm font-medium text-secondary mb-1">
        تصفية بالحالة
      </label>
      <select 
        v-model="filters.is_published"
        class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        @change="handleFilterChange"
      >
        <option value="">جميع الحالات</option>
        <option value="true">منشور</option>
        <option value="false">مسودة</option>
      </select>
    </div>
  </div>

  <!-- أزرار الإجراءات -->
  <div class="flex gap-2 shrink-0">
    <Button @click="handleReset" variant="outline" class="whitespace-nowrap">
      <ArrowPathIcon class="h-4 w-4 mr-2" />
      إعادة تعيين
    </Button>
    <Button @click="handleApply" variant="primary" class="whitespace-nowrap">
      <MagnifyingGlassIcon class="h-4 w-4 mr-2" />
      تطبيق الفلترة
    </Button>
  </div>
</div>
</Card>
 </template>
 <script setup lang="ts"> 
 import { ref, onMounted, watch } from 'vue'
import { MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/vue/24/outline' 
import Button from '@/components/dashboard/component/ui/Button.vue' 
import Card from '@/components/dashboard/component/ui/Card.vue' 
import { useArticleStore } from '@/stores/articles' 
import type { ArticleCategory } from '@/types/article' 
interface Filters { search: string category_id: string is_published: string } 
interface Props { modelValue?: Filters } 
interface Emits { (e: 'update:modelValue', value: Filters): void (e: 'filter', value: Filters): void (e: 'reset'): void } 
const props = withDefaults(defineProps<Props>(), { modelValue: undefined }) 
const emit = defineEmits<Emits>() 
const articleStore = useArticleStore()
const filters = ref<Filters>({ search: '', category_id: '', is_published: '' }) 
const categories = ref<ArticleCategory[]>([])
props watch(() => props.modelValue, (newValue) => { if (newValue) { filters.value = { ...newValue } } }, { immediate: true })
watch(filters, (newFilters) => { emit('update:modelValue', newFilters) }, { deep: true })
const fetchCategories = async () => { try { await articleStore.fetchCategories() 
    categories.value = articleStore.categories } catch (error)
     { console.error('Failed to fetch categories:', error) } } 
     const handleFilterChange = () => { emit('filter', filters.value) } 
     const handleApply = () => { emit('filter', filters.value) } 
     const handleReset = () => { filters.value = { search: '', category_id: '', is_published: '' } 
     emit('reset') 
     emit('filter', filters.value) }
     onMounted(() => { fetchCategories() }) 
     </script>
     <style scoped>
     input:focus, select:focus { outline: none; ring: 2px; } </style>