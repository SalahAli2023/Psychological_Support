<template>
  <div class="space-y-4">
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
      <label class="block text-sm font-medium text-primary">الأسئلة</label>
      <Button size="sm" variant="outline" @click="$emit('addQuestion')" class="w-full sm:w-auto">
        + إضافة سؤال
      </Button>
    </div>
    
    <div class="space-y-4">
      <QuestionItem
        v-for="(question, questionIndex) in questions"
        :key="questionIndex"
        :question="question"
        :index="questionIndex"
        :can-remove="questions.length > 1"
        @remove="$emit('removeQuestion', questionIndex)"
        @add-option="$emit('addOption', questionIndex)"
        @remove-option="$emit('removeOption', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/dashboard/component/ui/Button.vue';
import QuestionItem from './QuestionItem.vue';

import type { Question } from './types';

defineProps<{
  questions: Question[];
}>();

defineEmits<{
  addQuestion: [];
  removeQuestion: [index: number];
  addOption: [questionIndex: number];
  removeOption: [payload: { questionIndex: number; optionIndex: number }];
}>();
</script>