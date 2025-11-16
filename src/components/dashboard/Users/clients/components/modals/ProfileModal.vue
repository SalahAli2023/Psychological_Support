<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-primary rounded-2xl shadow-xl border border-primary">
      <!-- الرأس -->
      <div class="flex items-center justify-between p-6 border-b border-primary">
        <div class="flex items-center gap-4">
          <img 
            :src="patient.avatar" 
            :alt="patient.name"
            class="w-16 h-16 rounded-full border-4 border-brand-500"
          />
          <div>
            <h2 class="text-xl font-bold text-primary">{{ patient.name }}</h2>
            <p class="text-secondary">{{ patient.email }} • {{ patient.phone }}</p>
          </div>
        </div>
        <button @click="$emit('close')" class="p-2 hover:bg-tertiary rounded-lg text-primary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- المحتوى -->
      <div class="p-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- العمود الأيسر - المعلومات الشخصية -->
          <div class="lg:col-span-1 space-y-6">
            <!-- المعلومات الأساسية -->
            <div class="bg-secondary rounded-xl p-4">
              <h3 class="font-semibold text-primary mb-4">المعلومات الشخصية</h3>
              <div class="space-y-3">
                <div>
                  <p class="text-xs text-secondary">العمر</p>
                  <p class="text-sm font-medium text-primary">{{ patient.age }} سنة</p>
                </div>
                <div>
                  <p class="text-xs text-secondary">الجنس</p>
                  <p class="text-sm font-medium text-primary">{{ patient.gender === 'male' ? 'ذكر' : 'أنثى' }}</p>
                </div>
                <div>
                  <p class="text-xs text-secondary">تاريخ الميلاد</p>
                  <p class="text-sm font-medium text-primary">{{ patient.dateOfBirth }}</p>
                </div>
                <div>
                  <p class="text-xs text-secondary">تاريخ التسجيل</p>
                  <p class="text-sm font-medium text-primary">{{ patient.createdAt }}</p>
                </div>
              </div>
            </div>

            <!-- معلومات الاتصال -->
            <div class="bg-secondary rounded-xl p-4">
              <h3 class="font-semibold text-primary mb-4">معلومات الاتصال</h3>
              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <span class="text-secondary">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </span>
                  <span class="text-sm text-primary">{{ patient.email }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-secondary">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </span>
                  <span class="text-sm text-primary">{{ patient.phone }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-secondary">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </span>
                  <span class="text-sm text-primary">{{ patient.address }}</span>
                </div>
              </div>
            </div>

            <!-- إحصائيات -->
            <div class="bg-secondary rounded-xl p-4">
              <h3 class="font-semibold text-primary mb-4">الإحصائيات</h3>
              <div class="space-y-3">
                <div>
                  <p class="text-xs text-secondary">إجمالي الجلسات</p>
                  <p class="text-sm font-medium text-primary">{{ patient.totalSessions }} جلسة</p>
                </div>
                <div>
                  <p class="text-xs text-secondary">آخر جلسة</p>
                  <p class="text-sm font-medium text-primary">{{ patient.lastSession || 'لا توجد' }}</p>
                </div>
                <div>
                  <p class="text-xs text-secondary">حالة المريض</p>
                  <span :class="[
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1',
                    patient.status === 'active' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  ]">
                    {{ patient.status === 'active' ? 'نشط' : 'غير نشط' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- العمود الأيمن - المعلومات الطبية -->
          <div class="lg:col-span-2 space-y-6">
            <!-- الحالة الصحية -->
            <div class="bg-primary border border-primary rounded-xl p-4">
              <h3 class="font-semibold text-primary mb-4">الحالة الصحية</h3>
              <div class="flex flex-wrap gap-2">
                <span 
                  v-for="condition in patient.conditions" 
                  :key="condition"
                  class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {{ condition }}
                </span>
              </div>
            </div>

            <!-- أهداف العلاج -->
            <div class="bg-primary border border-primary rounded-xl p-4">
              <h3 class="font-semibold text-primary mb-4">أهداف العلاج</h3>
              <p class="text-primary leading-relaxed">{{ patient.therapyGoals }}</p>
            </div>

            <!-- التقدم العلاجي -->
            <div class="bg-primary border border-primary rounded-xl p-4">
              <h3 class="font-semibold text-primary mb-4">التقدم العلاجي</h3>
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between text-sm text-primary mb-1">
                    <span>التقدم العام</span>
                    <span>65%</span>
                  </div>
                  <div class="w-full bg-secondary rounded-full h-2">
                    <div class="bg-brand-500 h-2 rounded-full" style="width: 65%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm text-primary mb-1">
                    <span>الالتزام بالجلسات</span>
                    <span>80%</span>
                  </div>
                  <div class="w-full bg-secondary rounded-full h-2">
                    <div class="bg-green-500 h-2 rounded-full" style="width: 80%"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- الجلسات القادمة -->
            <div class="bg-primary border border-primary rounded-xl p-4">
              <h3 class="font-semibold text-primary mb-4">الجلسات القادمة</h3>
              <div class="space-y-3">
                <div v-if="patient.nextSession" class="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div>
                    <p class="font-medium text-primary">جلسة متابعة</p>
                    <p class="text-sm text-secondary">{{ patient.nextSession }} - 02:00 م</p>
                    <p class="text-xs text-secondary">المعالج: د. أحمد محمد</p>
                  </div>
                  <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    مؤكدة
                  </span>
                </div>
                <div v-else class="text-center py-4 text-secondary">
                  <p>لا توجد جلسات قادمة</p>
                </div>
              </div>
            </div>

            <!-- الملاحظات الأخيرة -->
            <div class="bg-primary border border-primary rounded-xl p-4">
              <h3 class="font-semibold text-primary mb-4">آخر الملاحظات</h3>
              <div class="space-y-3">
                <div class="p-3 bg-secondary rounded-lg">
                  <p class="text-sm text-primary">تحسن ملحوظ في إدارة نوبات القلق. المريض يطبق تقنيات التنفس بشكل منتظم.</p>
                  <p class="text-xs text-secondary mt-2">د. أحمد محمد - 2024-01-15</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  open: {
    type: Boolean,
    required: true
  },
  patient: {
    type: Object,
    default: () => ({})
  }
})

defineEmits(['close'])
</script>