<template>
  <div class="space-y-4 p-2 sm:p-4">
    <!-- العنوان والأزرار -->
    <ScaleHeader @create="openCreate" />
    
    <!-- أدوات البحث والتصفية -->
    <SearchFilters
      :search-query="searchQuery"
      :category-filter="categoryFilter"
      :status-filter="statusFilter"
      @update:searchQuery="searchQuery = $event"
      @update:categoryFilter="categoryFilter = $event"
      @update:statusFilter="statusFilter = $event"
      @clear="clearFilters"
    />

    <!-- جدول المقاييس -->
    <ScalesTable
      :scales="paginatedScales"
      :filtered-scales="filteredScales"
      :current-page="currentPage"
      :total-pages="totalPages"
      :start-index="startIndex"
      :end-index="endIndex"
      :items-per-page="itemsPerPage"
      :visible-pages="visiblePages"
      @edit="edit"
      @preview="openPreview"
      @delete="deleteScale"
      @page-change="goToPage"
      @prev-page="prevPage"
      @next-page="nextPage"
      @update:itemsPerPage="itemsPerPage = $event"
    />

    <!-- Modal إنشاء/تعديل المقياس -->
    <ScaleModal
      :show="modal"
      :current="current"
      :current-step="currentStep"
      :form="form"
      @close="close"
      @prev-step="prevStep"
      @next-step="nextStep"
      @save="save"
      @add-question="addQuestion"
      @remove-question="removeQuestion"
      @add-option="addOption"
      @remove-option="removeOption"
      @add-interpretation="addInterpretation"
      @remove-interpretation="removeInterpretation"
      @image-upload="handleImageUpload"
      @image-remove="removeImage"
    />

    <!-- Modal معاينة المقياس -->
    <PreviewModal
      :show="previewModal"
      :preview-data="previewData"
      @close="closePreview"
    />

    <!-- تأكيد الحذف -->
    <DeleteConfirmModal
      :show="showDeleteConfirm"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import ScaleHeader from './ScaleHeader.vue';
import SearchFilters from './SearchFilters.vue';
import ScalesTable from './ScalesTable.vue';
import ScaleModal from './ScaleModal.vue';
import PreviewModal from './PreviewModal.vue';
import DeleteConfirmModal from './DeleteConfirmModal.vue';

import type { Scale, Question, Interpretation } from '.assets/css/types.css';

// البيانات الأولية
const scales = ref<Scale[]>([
  {
    id: '1',
    name: {
      ar: 'مقياس بيك للقلق',
      en: 'Beck Anxiety Inventory'
    },
    description: {
      ar: 'استبيان ذاتي متعدد الخيارات مكون من 21 سؤالاً',
      en: 'A 21-question multiple-choice self-report inventory'
    },
    category: 'القلق',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=150&h=150&fit=crop',
    questions: [
      {
        text: {
          ar: 'أشعر بالتوتر',
          en: 'I feel nervous'
        },
        options: [
          { 
            text: {
              ar: 'لا على الإطلاق',
              en: 'Not at all'
            }, 
            score: 0 
          },
          { 
            text: {
              ar: 'بشكل طفيف',
              en: 'Mildly'
            }, 
            score: 1 
          }
        ]
      }
    ],
    interpretations: [
      {
        minScore: 0,
        maxScore: 7,
        label: 'منخفض',
        description: 'مستوى قلق منخفض، لا يحتاج إلى تدخل',
        color: 'green'
      }
    ],
    maxScore: 63,
    active: true,
    updatedAt: new Date().toISOString()
  }
]);

// Refs
const modal = ref(false);
const previewModal = ref(false);
const showDeleteConfirm = ref(false);
const current = ref<Scale | null>(null);
const previewData = ref<Scale | null>(null);
const deleteTargetId = ref<string | null>(null);
const currentStep = ref(1);

const searchQuery = ref('');
const categoryFilter = ref('');
const statusFilter = ref('');

const currentPage = ref(1);
const itemsPerPage = ref(10);

// Form
const form = reactive({
  name: {
    ar: '',
    en: ''
  },
  description: {
    ar: '',
    en: ''
  },
  category: '',
  image: '',
  questions: [{
    text: {
      ar: '',
      en: ''
    },
    options: [{ 
      text: {
        ar: '',
        en: ''
      }, 
      score: 0 
    }]
  }],
  interpretations: [{
    minScore: 0,
    maxScore: 10,
    label: 'منخفض',
    description: '',
    color: 'green' as 'green'
  }],
  maxScore: 100,
  active: true
});

// Computed
const filteredScales = computed(() => {
  return scales.value.filter(scale => {
    const matchesSearch = !searchQuery.value || 
      scale.name.ar.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      scale.name.en.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      scale.description.ar.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      scale.description.en.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    const matchesCategory = !categoryFilter.value || scale.category === categoryFilter.value;
    
    const matchesStatus = !statusFilter.value || 
      (statusFilter.value === 'active' && scale.active) ||
      (statusFilter.value === 'inactive' && !scale.active);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
});

const totalPages = computed(() => Math.ceil(filteredScales.value.length / itemsPerPage.value));

const paginatedScales = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredScales.value.slice(start, end);
});

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredScales.value.length));

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    }
  }
  return pages;
});

// Watchers
watch([searchQuery, categoryFilter, statusFilter], () => {
  currentPage.value = 1;
});

watch(itemsPerPage, () => {
  currentPage.value = 1;
});

// Methods
function clearFilters() {
  searchQuery.value = '';
  categoryFilter.value = '';
  statusFilter.value = '';
}

function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      form.image = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

function removeImage() {
  form.image = '';
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--;
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++;
}

function goToPage(page: number | string) {
  if (typeof page === 'number') {
    currentPage.value = page;
  }
}

function openCreate() {
  current.value = null;
  resetForm();
  currentStep.value = 1;
  modal.value = true;
}

function edit(scale: Scale) {
  current.value = scale;
  form.name.ar = scale.name.ar;
  form.name.en = scale.name.en;
  form.description.ar = scale.description.ar;
  form.description.en = scale.description.en;
  form.category = scale.category;
  form.image = scale.image;
  form.questions = JSON.parse(JSON.stringify(scale.questions));
  form.interpretations = JSON.parse(JSON.stringify(scale.interpretations));
  form.maxScore = scale.maxScore;
  form.active = scale.active;
  currentStep.value = 1;
  modal.value = true;
}

function openPreview(scale: Scale) {
  previewData.value = scale;
  previewModal.value = true;
}

function closePreview() {
  previewModal.value = false;
  previewData.value = null;
}

function close() { 
  modal.value = false;
  resetForm();
  currentStep.value = 1;
}

function resetForm() {
  form.name.ar = '';
  form.name.en = '';
  form.description.ar = '';
  form.description.en = '';
  form.category = '';
  form.image = '';
  form.questions = [{
    text: {
      ar: '',
      en: ''
    },
    options: [{ 
      text: {
        ar: '',
        en: ''
      }, 
      score: 0 
    }]
  }];
  form.interpretations = [{
    minScore: 0,
    maxScore: 10,
    label: 'منخفض',
    description: '',
    color: 'green'
  }];
  form.maxScore = 100;
  form.active = true;
}

function nextStep() {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

function addQuestion() {
  form.questions.push({
    text: {
      ar: '',
      en: ''
    },
    options: [{ 
      text: {
        ar: '',
        en: ''
      }, 
      score: 0 
    }]
  });
}

function removeQuestion(index: number) {
  if (form.questions.length > 1) {
    form.questions.splice(index, 1);
  }
}

function addOption(questionIndex: number) {
  form.questions[questionIndex].options.push({ 
    text: {
      ar: '',
      en: ''
    }, 
    score: 0 
  });
}

function removeOption(questionIndex: number, optionIndex: number) {
  if (form.questions[questionIndex].options.length > 1) {
    form.questions[questionIndex].options.splice(optionIndex, 1);
  }
}

function addInterpretation() {
  const lastInterpretation = form.interpretations[form.interpretations.length - 1];
  form.interpretations.push({
    minScore: lastInterpretation ? lastInterpretation.maxScore + 1 : 0,
    maxScore: lastInterpretation ? lastInterpretation.maxScore + 10 : 10,
    label: 'متوسط',
    description: '',
    color: 'yellow'
  });
}

function removeInterpretation(index: number) {
  if (form.interpretations.length > 1) {
    form.interpretations.splice(index, 1);
  }
}

function save() {
  if (current.value) {
    const index = scales.value.findIndex(s => s.id === current.value!.id);
    if (index !== -1) {
      scales.value[index] = {
        ...scales.value[index],
        ...form,
        updatedAt: new Date().toISOString()
      };
    }
  } else {
    scales.value.unshift({
      id: Date.now().toString(),
      ...form,
      updatedAt: new Date().toISOString()
    });
  }
  modal.value = false;
}

function deleteScale(id: string) {
  deleteTargetId.value = id;
  showDeleteConfirm.value = true;
}

function confirmDelete() {
  if (deleteTargetId.value) {
    scales.value = scales.value.filter(s => s.id !== deleteTargetId.value);
  }
  showDeleteConfirm.value = false;
  deleteTargetId.value = null;
}
</script>