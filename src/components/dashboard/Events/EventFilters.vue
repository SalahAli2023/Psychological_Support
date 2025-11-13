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

        <!-- تصفية بالنوع -->
        <div>
          <label class="block text-sm font-medium text-secondary mb-1">
            تصفية بالنوع
          </label>
          <select 
            v-model="filters.type"
            class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            @change="handleFilterChange"
          >
            <option value="">جميع الأنواع</option>
            <option value="أمسيات">أمسيات</option>
            <option value="ورش عمل">ورش عمل</option>
            <option value="فعاليات">فعاليات</option>
          </select>
        </div>

        <!-- تصفية بالحالة -->
        <div>
          <label class="block text-sm font-medium text-secondary mb-1">
            تصفية بالحالة
          </label>
          <select 
            v-model="filters.status"
            class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            @change="handleFilterChange"
          >
            <option value="">جميع الحالات</option>
            <option value="published">منشور</option>
            <option value="draft">مسودة</option>
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
import { ref, watch } from 'vue'
import { MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'
import Button from '@/components/dashboard/component/ui/Button.vue'
import Card from '@/components/dashboard/component/ui/Card.vue'

interface Filters {
  search: string
  type: string
  status: string
}

interface Props {
  modelValue?: Filters
}

interface Emits {
  (e: 'update:modelValue', value: Filters): void
  (e: 'filter', value: Filters): void
  (e: 'reset'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined
})

const emit = defineEmits<Emits>()

// البيانات التفاعلية
const filters = ref<Filters>({
  search: '',
  type: '',
  status: ''
})

// تعقب التغييرات في الـ props
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    filters.value = { ...newValue }
  }
}, { immediate: true })

// تعقب التغييرات في الفلاتر
watch(filters, (newFilters) => {
  emit('update:modelValue', newFilters)
}, { deep: true })

// الدوال
const handleFilterChange = () => {
  // يمكن إضافة debounce هنا إذا أردت
  emit('filter', filters.value)
}

const handleApply = () => {
  emit('filter', filters.value)
}

const handleReset = () => {
  filters.value = {
    search: '',
    type: '',
    status: ''
  }
  emit('reset')
  emit('filter', filters.value)
}
</script>

<style scoped>
/* تحسين مظهر العناصر */
input:focus, select:focus {
  outline: none;
  ring: 2px;
}
</style>