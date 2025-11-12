<template>
  <Card>
    <template #header>
      معلومات المقياس
    </template>
    <div class="space-y-3">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <PreviewField label="الاسم:" :value="previewData?.name.ar" />
        <PreviewField label="الفئة:" :value="previewData?.category" />
        <PreviewField label="عدد الأسئلة:" :value="previewData?.questions.length.toString()" />
        <PreviewField label="الدرجة القصوى:" :value="previewData?.maxScore.toString()" />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '@/components/dashboard/component/ui/Card.vue';
import PreviewField from './PreviewField.vue';

import type { Scale } from './types';

defineProps<{
  previewData: Scale | null;
}>();
</script>