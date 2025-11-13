[file name]: DeleteConfirmModal.vue
[file content begin]
<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3" @click.self="$emit('cancel')">
    <div class="w-full max-w-md rounded-xl border border-primary bg-primary p-4 shadow-lg">
      <div class="mb-4">
        <h3 class="text-lg font-semibold text-primary">{{ $t('events.delete.title') }}</h3>
        <p class="text-sm text-secondary mt-1">{{ $t('events.delete.message') }}</p>
      </div>
      
      <div class="flex justify-end gap-2">
        <Button variant="outline" @click="$emit('cancel')" type="button">{{ $t('common.cancel') }}</Button>
        <Button variant="primary" @click="$emit('confirm')" type="button" class="bg-red-600 hover:bg-red-700">
          {{ $t('common.delete') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import Button from '@/components/dashboard/component/ui/Button.vue';

const { t } = useI18n();

defineProps<{
  show: boolean;
}>();

defineEmits<{
  confirm: [];
  cancel: [];
}>();
</script>
[file content end]