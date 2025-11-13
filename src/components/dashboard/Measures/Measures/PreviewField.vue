<template>
  <div>
    <label class="text-sm font-medium text-primary">{{ label }}</label>
    <p class="text-primary text-sm sm:text-base">{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value?: string;
}>();
</script>