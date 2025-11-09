<template>
  <div class="space-y-4 p-3 sm:p-4">
    <!-- عنوان + زر -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h1 class="text-lg font-semibold text-primary sm:text-2xl">Appointments</h1>
      <Button
        variant="primary"
        class="w-full sm:w-auto"
        @click="openCreate"
      >
        Book Session
      </Button>
    </div>

    <!-- الفلاتر -->
    <div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <select
        v-model="status"
        class="w-full sm:w-48 rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
      >
        <option value="">All statuses</option>
        <option value="scheduled">Scheduled</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      <input
        v-model="therapist"
        placeholder="Therapist"
        class="w-full sm:w-48 rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
      />

      <input
        v-model="date"
        type="date"
        class="w-full sm:w-48 rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary"
      />
    </div>

    <!-- جدول المواعيد -->
    <Card>
      <template #header>List</template>
      <div class="overflow-x-auto -mx-1 sm:mx-0">
        <!-- عرض الجدول للشاشات المتوسطة والكبيرة -->
        <table class="min-w-full text-sm hidden sm:table">
          <thead>
            <tr class="text-start text-secondary">
              <th class="px-2 py-2 min-w-[100px] sm:px-3 sm:py-3">Client</th>
              <th class="px-2 py-2 min-w-[100px] sm:px-3 sm:py-3">Therapist</th>
              <th class="px-2 py-2 min-w-[130px] sm:px-3 sm:py-3">Date</th>
              <th class="px-2 py-2 min-w-[80px] sm:px-3 sm:py-3">Status</th>
              <th class="px-2 py-2 min-w-[80px] sm:px-3 sm:py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in filtered" :key="a.id" class="border-t border-primary">
              <td class="px-2 py-2 text-primary whitespace-nowrap sm:px-3 sm:py-3">{{ a.clientName }}</td>
              <td class="px-2 py-2 text-primary whitespace-nowrap sm:px-3 sm:py-3">{{ a.therapist }}</td>
              <td class="px-2 py-2 text-primary whitespace-nowrap text-xs sm:px-3 sm:py-3 sm:text-sm">{{ formatDate(a.startsAt) }}</td>
              <td class="px-2 py-2 sm:px-3 sm:py-3">
                <span
                  class="badge border text-primary text-xs whitespace-nowrap"
                  :class="{
                    'border-emerald-300 text-emerald-700': a.status==='scheduled',
                    'border-gray-300 text-gray-700': a.status==='completed',
                    'border-rose-300 text-rose-700': a.status==='cancelled',
                  }"
                >
                  {{ a.status }}
                </span>
              </td>
              <td class="px-2 py-2 sm:px-3 sm:py-3">
                <Button size="sm" variant="outline" class="w-full sm:w-auto" @click="edit(a)">Edit</Button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- عرض البطاقات للشاشات الصغيرة -->
        <div class="space-y-3 sm:hidden">
          <div 
            v-for="a in filtered" 
            :key="a.id" 
            class="bg-primary rounded-lg border border-primary p-3 space-y-2"
          >
            <div class="flex justify-between items-start">
              <div class="font-medium text-primary">{{ a.clientName }}</div>
              <span
                class="badge border text-primary text-xs whitespace-nowrap"
                :class="{
                  'border-emerald-300 text-emerald-700': a.status==='scheduled',
                  'border-gray-300 text-gray-700': a.status==='completed',
                  'border-rose-300 text-rose-700': a.status==='cancelled',
                }"
              >
                {{ a.status }}
              </span>
            </div>
            <div class="text-sm text-secondary">{{ a.therapist }}</div>
            <div class="text-sm text-secondary">{{ formatDate(a.startsAt) }}</div>
            <div class="pt-2">
              <Button size="sm" variant="outline" class="w-full" @click="edit(a)">Edit</Button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="filtered.length === 0" class="text-center py-8 text-secondary">
        No appointments found
      </div>
    </Card>

    <!-- Modal -->
    <div v-if="modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      <div class="w-full max-w-md rounded-xl border border-primary bg-primary p-4 shadow-lg max-h-[90vh] overflow-y-auto">
        <div class="mb-4 flex items-center justify-between">
          <div class="text-lg font-semibold text-primary">{{ current?.id ? 'Edit Session' : 'Book Session' }}</div>
          <button class="inline-grid h-8 w-8 place-items-center rounded-lg hover:bg-tertiary text-primary" @click="close">✕</button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm text-primary mb-2">Client Name</label>
            <input v-model="form.clientName" placeholder="Enter client name" class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary" />
          </div>
          <div>
            <label class="block text-sm text-primary mb-2">Therapist</label>
            <input v-model="form.therapist" placeholder="Enter therapist name" class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary" />
          </div>
          <div>
            <label class="block text-sm text-primary mb-2">Date & Time</label>
            <input v-model="form.startsAt" type="datetime-local" class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary" />
          </div>
          <div>
            <label class="block text-sm text-primary mb-2">Status</label>
            <select v-model="form.status" class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary">
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" class="w-full sm:w-auto" @click="close">Cancel</Button>
          <Button variant="primary" class="w-full sm:w-auto" @click="save">Save</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Button from '@/components/dashboard/component/ui/Button.vue';
import Card from '@/components/dashboard/component/ui/Card.vue';

interface Appointment { id: string; clientName: string; therapist: string; startsAt: string; status: 'scheduled'|'completed'|'cancelled' }
const items = ref<Appointment[]>([
  { id: 'a1', clientName: 'Aisha', therapist: 'Dr. Omar', startsAt: new Date().toISOString(), status: 'scheduled' },
  { id: 'a2', clientName: 'Khaled', therapist: 'Dr. Lina', startsAt: new Date(Date.now()+86400000).toISOString(), status: 'scheduled' },
  { id: 'a3', clientName: 'Sara', therapist: 'Dr. Omar', startsAt: new Date(Date.now()+2*86400000).toISOString(), status: 'completed' },
]);

const status = ref('');
const therapist = ref('');
const date = ref('');

const filtered = computed(() => items.value.filter(a =>
  (!status.value || a.status === status.value) &&
  (!therapist.value || a.therapist.toLowerCase().includes(therapist.value.toLowerCase())) &&
  (!date.value || a.startsAt.startsWith(date.value))
));

const modal = ref(false);
const current = ref<Appointment | null>(null);
const form = ref<Appointment>({ id: '', clientName: '', therapist: '', startsAt: '', status: 'scheduled' });

function openCreate() { current.value = null; form.value = { id: '', clientName: '', therapist: '', startsAt: '', status: 'scheduled' }; modal.value = true; }
function edit(a: Appointment) { current.value = a; form.value = { ...a }; modal.value = true; }
function close() { modal.value = false; }
function save() {
  if (current.value) {
    Object.assign(current.value, form.value);
  } else {
    items.value.unshift({ ...form.value, id: Date.now().toString() });
  }
  modal.value = false;
}

// دالة لتهيئة التاريخ بشكل مناسب للجوال
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
</script>