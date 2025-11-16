<template>
  <div 
    v-if="open" 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4"
  >
    <div class="w-full max-w-4xl max-h-[95vh] overflow-y-auto bg-primary rounded-xl border border-primary p-4 sm:p-6 shadow-lg">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg sm:text-2xl font-semibold text-primary">الملف الشخصي - {{ viewingTherapist.name.ar }}</h2>
        <button 
          @click="$emit('close')"
          class="bg-tertiary hover:bg-secondary text-primary w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-colors"
        >
          ✕
        </button>
      </div>

      <!-- شبكة مكونة من عمودين -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        <!-- العمود الأيسر -->
        <div class="space-y-4">
          <!-- بطاقة الملف الشخصي -->
          <div class="bg-secondary rounded-xl border border-primary p-4">
            <div class="text-center">
              <img 
                :src="viewingTherapist.avatar" 
                :alt="viewingTherapist.name.ar"
                class="w-16 h-16 sm:w-24 sm:h-24 rounded-full mx-auto mb-3 border-4 border-brand-500"
              />
              <h2 class="text-lg sm:text-xl font-semibold text-primary">{{ viewingTherapist.name.ar }}</h2>
              <p class="text-secondary mt-1 text-sm">{{ viewingTherapist.title.ar }}</p>
              
              <!-- التقييم -->
              <div class="flex items-center justify-center gap-2 mt-2">
                <div class="flex items-center gap-1">
                  <span class="text-yellow-400 text-sm">★</span>
                  <span class="text-primary font-medium text-sm">5.0</span>
                </div>
                <span class="text-secondary text-xs">•</span>
                <span class="text-secondary text-xs">35 جلسة</span>
              </div>

              <!-- الشارة -->
              <div class="mt-2">
                <span class="inline-flex items-center px-2 py-1 rounded-full bg-accent-500 text-white text-xs font-medium">
                  <span class="ml-1">✓</span>
                  {{ viewingTherapist.certifications[0]?.name || 'معتمد' }}
                </span>
              </div>

              <!-- مدة الجلسة -->
              <div class="mt-3 p-2 bg-primary rounded-lg border border-primary">
                <div class="text-xs text-secondary">مدة الجلسة</div>
                <div class="text-base font-semibold text-primary">{{ viewingTherapist.sessionDuration }} دقيقة</div>
              </div>
            </div>
          </div>

          <!-- قسم عن الخبير -->
          <div class="bg-secondary rounded-xl border border-primary p-4">
            <h3 class="text-base sm:text-lg font-semibold text-primary mb-2">عن الخبير</h3>
            <p class="text-secondary leading-relaxed text-sm">
              {{ viewingTherapist.bio.ar }}
            </p>
          </div>

          <!-- المؤهلات العلمية -->
          <div class="bg-secondary rounded-xl border border-primary p-4">
            <h3 class="text-base sm:text-lg font-semibold text-primary mb-2">المؤهلات العلمية</h3>
            <div class="space-y-3">
              <div 
                v-for="(qualification, index) in viewingTherapist.qualifications" 
                :key="index"
                class="border border-primary rounded-lg p-3 bg-primary"
              >
                <div class="space-y-2">
                  <div>
                    <h4 class="text-sm font-medium text-primary mb-1">اسم المؤهل:</h4>
                    <p class="text-primary text-sm">{{ qualification.name.ar }}</p>
                  </div>
                  <div>
                    <h4 class="text-sm font-medium text-primary mb-1">المؤسسة:</h4>
                    <p class="text-primary text-sm">{{ qualification.institution.ar }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- العمود الأيمن -->
        <div class="space-y-4">
          <!-- المنهجيات المتبعة -->
          <div class="bg-primary rounded-xl border border-primary p-4">
            <h3 class="text-base sm:text-lg font-semibold text-primary mb-2">المنهجيات المتبعة</h3>
            <p class="text-secondary leading-relaxed text-sm">
              {{ viewingTherapist.methodologies.ar }}
            </p>
          </div>

          <!-- الخبرة العملية -->
          <div class="bg-primary rounded-xl border border-primary p-4">
            <h3 class="text-base sm:text-lg font-semibold text-primary mb-2">الخبرة العملية</h3>
            <div class="flex items-center justify-between gap-3">
              <div class="text-center flex-1">
                <div class="text-lg sm:text-2xl font-bold text-brand-500">{{ viewingTherapist.experience }}+</div>
                <div class="text-xs text-secondary">سنوات خبرة</div>
              </div>
              <div class="text-center flex-1">
                <div class="text-lg sm:text-2xl font-bold text-brand-500">500+</div>
                <div class="text-xs text-secondary">جلسة مكتملة</div>
              </div>
              <div class="text-center flex-1">
                <div class="text-lg sm:text-2xl font-bold text-brand-500">98%</div>
                <div class="text-xs text-secondary">رضا العملاء</div>
              </div>
            </div>
          </div>

          <!-- الجدول الأسبوعي -->
          <div class="bg-primary rounded-xl border border-primary p-4">
            <h3 class="text-base sm:text-lg font-semibold text-primary mb-2">الجدول الأسبوعي</h3>
            <div class="grid grid-cols-7 gap-1">
              <div 
                v-for="day in weekDays" 
                :key="day.key"
                class="text-center"
              >
                <div class="text-xs font-medium text-primary mb-1">{{ day.label }}</div>
                <div 
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors',
                    getDaySchedule(viewingTherapist.schedule, day.key).hasSlots ? 
                    'bg-brand-500 text-white' : 'bg-tertiary text-secondary'
                  ]"
                >
                  {{ getDaySchedule(viewingTherapist.schedule, day.key).hasSlots ? '✓' : '✗' }}
                </div>
              </div>
            </div>
          </div>

          <!-- معلومات الاتصال -->
          <div class="bg-primary rounded-xl border border-primary p-4">
            <h3 class="text-base sm:text-lg font-semibold text-primary mb-2">معلومات الاتصال</h3>
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-secondary text-sm">📧</span>
                <span class="text-secondary text-sm">{{ viewingTherapist.email }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-secondary text-sm">📞</span>
                <span class="text-secondary text-sm">{{ viewingTherapist.phone }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-secondary text-sm">⏰</span>
                <span class="text-secondary text-sm">الرد خلال ٢٤ ساعة</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  viewingTherapist: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const weekDays = [
  { key: 'saturday', label: 'السبت' },
  { key: 'sunday', label: 'الأحد' },
  { key: 'monday', label: 'الاثنين' },
  { key: 'tuesday', label: 'الثلاثاء' },
  { key: 'wednesday', label: 'الأربعاء' },
  { key: 'thursday', label: 'الخميس' },
  { key: 'friday', label: 'الجمعة' }
]

const getDaySchedule = (schedule, dayKey) => {
  return {
    hasSlots: schedule[dayKey]?.enabled && schedule[dayKey]?.slots?.length > 0
  }
}
</script>