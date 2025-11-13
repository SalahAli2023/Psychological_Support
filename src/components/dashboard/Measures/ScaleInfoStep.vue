<template>
  <div class="grid gap-3 sm:gap-4">
    <!-- حقل الصورة -->
    <ImageUpload
      :image="form.image"
      @upload="$emit('imageUpload', $event)"
      @remove="$emit('imageRemove')"
    />

    <!-- اسم المقياس -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      <FormField label="اسم المقياس (العربية)">
        <input 
          v-model="form.name.ar" 
          placeholder="أدخل اسم المقياس بالعربية..." 
          class="input text-sm sm:text-base" 
        />
      </FormField>
      <FormField label="اسم المقياس (الإنجليزية)">
        <input 
          v-model="form.name.en" 
          placeholder="Enter scale name in English..." 
          class="input text-sm sm:text-base" 
        />
      </FormField>
    </div>

    <!-- وصف المقياس -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      <FormField label="وصف المقياس (العربية)">
        <textarea 
          v-model="form.description.ar" 
          placeholder="أدخل وصف المقياس بالعربية..." 
          rows="3"
          class="input text-sm sm:text-base"
        ></textarea>
      </FormField>
      <FormField label="وصف المقياس (الإنجليزية)">
        <textarea 
          v-model="form.description.en" 
          placeholder="Enter scale description in English..." 
          rows="3"
          class="input text-sm sm:text-base"
        ></textarea>
      </FormField>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      <FormField label="الفئة">
        <select v-model="form.category" class="input text-sm sm:text-base">
          <option value="">اختر الفئة</option>
          <option>القلق</option>
          <option>الاكتئاب</option>
          <option>التوتر</option>
          <option>الشخصية</option>
        </select>
      </FormField>
      <FormField label="الدرجة القصوى">
        <input 
          v-model="form.maxScore"
          type="number"
          class="input text-sm sm:text-base"
          placeholder="الدرجة العظمى للمقياس"
        />
      </FormField>
    </div>
    
    <div class="flex items-center gap-2">
      <input 
        v-model="form.active"
        type="checkbox"
        id="active"
        class="rounded border-primary text-brand-500 focus:ring-brand-500"
      />
      <label for="active" class="text-sm text-primary">نشط</label>
    </div>
  </div>
</template>

<script setup lang="ts">
import ImageUpload from './ImageUpload.vue';
import FormField from './FormField.vue';

import type { ScaleForm } from './types';

defineProps<{
  form: ScaleForm;
}>();

defineEmits<{
  imageUpload: [event: Event];
  imageRemove: [];
}>();
</script>