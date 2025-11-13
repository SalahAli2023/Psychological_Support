[file name]: EventsTable.vue
[file content begin]
<template>
  <Card>
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">{{ $t('events.table.title') }}</h3>
        <div class="text-sm text-secondary">
          {{ $t('events.table.showing', { start: startIndex + 1, end: endIndex, total: filteredEvents.length }) }}
        </div>
      </div>
    </template>

    <div class="overflow-x-auto">
      <table class="min-w-full text-sm">
        <thead>
          <tr class="text-start text-secondary border-b">
            <th class="px-4 py-3 text-start font-medium">#</th>
            <th class="px-4 py-3 text-start font-medium">{{ $t('events.table.headers.event') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ $t('events.table.headers.type') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ $t('events.table.headers.date') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ $t('events.table.headers.location') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ $t('events.table.headers.status') }}</th>
            <th class="px-4 py-3 text-start font-medium">{{ $t('events.table.headers.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(event, index) in events" :key="event.id" class="border-b hover:bg-gray-50">
            <td class="px-4 py-3 text-primary font-medium">
              {{ startIndex + index + 1 }}
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <img 
                  v-if="event.image" 
                  :src="event.image" 
                  :alt="event.title_ar"
                  class="w-10 h-10 rounded-lg object-cover"
                >
                <div v-else class="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                  <CalendarIcon class="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <div class="font-medium text-primary">{{ event.title_ar }}</div>
                  <div class="text-xs text-secondary">{{ event.title_en }}</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-primary">
              <span class="badge bg-blue-100 text-blue-800">
                {{ getTypeLabel(event.type) }}
              </span>
            </td>
            <td class="px-4 py-3 text-primary">
              <div>{{ formatDate(event.date) }}</div>
              <div v-if="event.time" class="text-xs text-secondary">{{ event.time }}</div>
            </td>
            <td class="px-4 py-3 text-primary">{{ event.location_ar }}</td>
            <td class="px-4 py-3">
              <span :class="[
                'badge text-xs',
                event.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              ]">
                {{ event.is_published ? $t('events.status.published') : $t('events.status.draft') }}
              </span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <Button size="sm" variant="outline" @click="$emit('preview', event)">
                  {{ $t('common.preview') }}
                </Button>
                <Button size="sm" variant="outline" @click="$emit('edit', event)">
                  {{ $t('common.edit') }}
                </Button>
                <button 
                  @click="$emit('toggle-publish', event)" 
                  class="p-1 text-secondary hover:text-primary"
                  :title="event.is_published ? $t('events.actions.unpublish') : $t('events.actions.publish')"
                >
                  <EyeIcon v-if="event.is_published" class="h-4 w-4" />
                  <EyeSlashIcon v-else class="h-4 w-4" />
                </button>
                <button 
                  @click="$emit('delete', event.id)" 
                  class="p-1 text-red-600 hover:text-red-800"
                  :title="$t('common.delete')"
                >
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- لا توجد فعاليات -->
    <div 
      v-if="events.length === 0" 
      class="text-center py-8 text-secondary"
    >
      <CalendarIcon class="h-16 w-16 mx-auto mb-4 text-secondary" />
      <p class="text-lg text-secondary">{{ $t('events.table.noEvents') }}</p>
    </div>

    <!-- الترحيم -->
    <div v-if="events.length > 0" class="flex items-center justify-between px-4 py-3 border-t">
      <div class="flex items-center gap-4">
        <span class="text-sm text-secondary">{{ $t('common.itemsPerPage') }}:</span>
        <select 
          :value="itemsPerPage" 
          @change="$emit('update:itemsPerPage', parseInt(($event.target as HTMLSelectElement).value))"
          class="border rounded px-2 py-1 text-sm"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>

      <div class="flex items-center gap-2">
        <Button 
          @click="$emit('prev-page')" 
          :disabled="currentPage === 1"
          variant="outline"
          size="sm"
        >
          {{ $t('common.previous') }}
        </Button>
        
        <div class="flex gap-1">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="typeof page === 'number' && $emit('page-change', page)"
            :class="[
              'px-3 py-1 rounded text-sm',
              page === currentPage 
                ? 'bg-primary text-white' 
                : 'text-secondary hover:bg-gray-100',
              typeof page !== 'number' && 'cursor-default'
            ]"
            :disabled="typeof page !== 'number'"
          >
            {{ page }}
          </button>
        </div>

        <Button 
          @click="$emit('next-page')" 
          :disabled="currentPage === totalPages"
          variant="outline"
          size="sm"
        >
          {{ $t('common.next') }}
        </Button>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { CalendarIcon, EyeIcon, EyeSlashIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { useI18n } from 'vue-i18n';
import Button from '@/components/dashboard/component/ui/Button.vue';
import Card from '@/components/dashboard/component/ui/Card.vue';
import type { Event } from '@/types/event';

const { t } = useI18n();

defineProps<{
  events: Event[];
  filteredEvents: Event[];
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  itemsPerPage: number;
  visiblePages: (number | string)[];
}>();

defineEmits<{
  edit: [event: Event];
  preview: [event: Event];
  delete: [id: string];
  'toggle-publish': [event: Event];
  'page-change': [page: number];
  'prev-page': [];
  'next-page': [];
  'update:itemsPerPage': [value: number];
}>();

const getTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    'أمسيات': t('events.types.evenings'),
    'ورش عمل': t('events.types.workshops'), 
    'فعاليات': t('events.types.events')
  };
  return typeMap[type] || type;
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};
</script>

<style scoped>
.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.bg-green-100 {
  background-color: rgb(220 252 231);
}

.text-green-800 {
  color: rgb(22 101 52);
}

.bg-yellow-100 {
  background-color: rgb(254 249 195);
}

.text-yellow-800 {
  color: rgb(113 63 18);
}

.bg-blue-100 {
  background-color: rgb(219 234 254);
}

.text-blue-800 {
  color: rgb(30 64 175);
}
</style>
[file content end]