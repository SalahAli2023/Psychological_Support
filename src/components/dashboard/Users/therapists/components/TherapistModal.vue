<template>
  <div 
    v-if="open" 
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-4"
  >
    <div class="w-full max-w-2xl max-h-[95vh] overflow-y-auto bg-primary rounded-xl border border-primary p-4 sm:p-6 shadow-lg">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg sm:text-xl font-semibold text-primary">
          {{ editingTherapist ? 'تعديل المعالج' : 'إضافة معالج جديد' }}
        </h2>
        <button 
          @click="$emit('close')"
          class="bg-tertiary hover:bg-secondary text-primary w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-colors text-sm"
        >
          ✕
        </button>
      </div>

      <!-- Step Indicator -->
      <div class="mb-4 sm:mb-6">
        <div class="flex items-center justify-between">
          <div 
            v-for="(step, index) in steps" 
            :key="index"
            class="flex flex-col items-center flex-1"
          >
            <div class="flex items-center w-full">
              <!-- Step Circle -->
              <div 
                :class="[
                  'w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium transition-colors',
                  currentStep > index ? 'bg-brand-500 text-white' :
                  currentStep === index ? 'bg-brand-500 text-white' : 
                  'bg-tertiary text-secondary'
                ]"
              >
                {{ currentStep > index ? '✓' : index + 1 }}
              </div>
              
              <!-- Step Line -->
              <div 
                v-if="index < steps.length - 1"
                :class="[
                  'flex-1 h-1 transition-colors',
                  currentStep > index ? 'bg-brand-500' : 'bg-tertiary'
                ]"
              ></div>
            </div>
            
            <!-- Step Label -->
            <div 
              :class="[
                'text-xs mt-1 transition-colors text-center px-1',
                currentStep >= index ? 'text-brand-500 font-medium' : 'text-secondary'
              ]"
            >
              {{ step.label }}
            </div>
          </div>
        </div>
      </div>

      <form @submit.prevent="$emit('save')" class="space-y-4">
        <!-- Step 1: Basic Information -->
        <div v-if="currentStep === 0" class="space-y-4">
          <h3 class="text-base sm:text-lg font-medium text-primary mb-3">المعلومات الأساسية</h3>
          
          <div class="grid grid-cols-1 gap-3">
            <!-- Name - Arabic & English -->
            <div class="space-y-2">
              <label class="block text-xs sm:text-sm font-medium text-primary">الاسم الكامل</label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <input 
                    v-model="therapistForm.name.ar"
                    type="text"
                    required
                    class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                    placeholder="الاسم بالعربية"
                  />
                  <div class="text-xs text-secondary mt-1 text-right">العربية</div>
                </div>
                <div>
                  <input 
                    v-model="therapistForm.name.en"
                    type="text"
                    required
                    class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                    placeholder="Name in English"
                  />
                  <div class="text-xs text-secondary mt-1 text-left">English</div>
                </div>
              </div>
            </div>

            <!-- Contact Information -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs sm:text-sm font-medium text-primary mb-1">البريد الإلكتروني</label>
                <input 
                  v-model="therapistForm.email"
                  type="email"
                  required
                  class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                  placeholder="أدخل البريد الإلكتروني"
                />
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-medium text-primary mb-1">رقم الهاتف</label>
                <input 
                  v-model="therapistForm.phone"
                  type="tel"
                  required
                  class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                  placeholder="أدخل رقم الهاتف"
                />
              </div>
            </div>

            <!-- Specialty - Arabic & English -->
            <div class="space-y-2">
              <label class="block text-xs sm:text-sm font-medium text-primary">التخصص</label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <input 
                    v-model="therapistForm.specialty.ar"
                    type="text"
                    required
                    class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                    placeholder="التخصص بالعربية"
                  />
                  <div class="text-xs text-secondary mt-1 text-right">العربية</div>
                </div>
                <div>
                  <input 
                    v-model="therapistForm.specialty.en"
                    type="text"
                    required
                    class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                    placeholder="Specialty in English"
                  />
                  <div class="text-xs text-secondary mt-1 text-left">English</div>
                </div>
              </div>
            </div>

            <!-- Login Information -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs sm:text-sm font-medium text-primary mb-1">اسم المستخدم</label>
                <input 
                  v-model="therapistForm.username"
                  type="text"
                  required
                  class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                  placeholder="أدخل اسم المستخدم"
                />
              </div>

              <div>
                <label class="block text-xs sm:text-sm font-medium text-primary mb-1">كلمة المرور</label>
                <input 
                  v-model="therapistForm.password"
                  type="password"
                  required
                  class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                  placeholder="أدخل كلمة المرور"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Professional Information -->
        <div v-if="currentStep === 1" class="space-y-4">
          <h3 class="text-base sm:text-lg font-medium text-primary mb-3">المعلومات المهنية</h3>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs sm:text-sm font-medium text-primary mb-1">الحالة</label>
              <select 
                v-model="therapistForm.status"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
              >
                <option value="active">نشط</option>
                <option value="busy">مشغول</option>
                <option value="inactive">غير نشط</option>
              </select>
            </div>

            <div>
              <label class="block text-xs sm:text-sm font-medium text-primary mb-1">مدة الجلسة (دقيقة)</label>
              <select 
                v-model="therapistForm.sessionDuration"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
              >
                <option value="30">30 دقيقة</option>
                <option value="45">45 دقيقة</option>
                <option value="60">60 دقيقة</option>
              </select>
            </div>

            <div>
              <label class="block text-xs sm:text-sm font-medium text-primary mb-1">سنوات الخبرة</label>
              <input 
                v-model="therapistForm.experience"
                type="number"
                class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                placeholder="عدد سنوات الخبرة"
              />
            </div>

            <!-- Title - Arabic & English -->
            <div class="space-y-2">
              <label class="block text-xs sm:text-sm font-medium text-primary mb-1">الرتبة المهنية</label>
              <div class="grid grid-cols-1 gap-2">
                <div>
                  <input 
                    v-model="therapistForm.title.ar"
                    type="text"
                    class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                    placeholder="الرتبة بالعربية"
                  />
                  <div class="text-xs text-secondary mt-1 text-right">العربية</div>
                </div>
                <div>
                  <input 
                    v-model="therapistForm.title.en"
                    type="text"
                    class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                    placeholder="Title in English"
                  />
                  <div class="text-xs text-secondary mt-1 text-left">English</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Bio - Arabic & English -->
          <div class="space-y-2">
            <label class="block text-xs sm:text-sm font-medium text-primary mb-1">نبذة عن المعالج</label>
            <div class="grid grid-cols-1 gap-2">
              <div>
                <textarea 
                  v-model="therapistForm.bio.ar"
                  rows="2"
                  class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                  placeholder="نبذة مختصرة بالعربية"
                />
                <div class="text-xs text-secondary mt-1 text-right">العربية</div>
              </div>
              <div>
                <textarea 
                  v-model="therapistForm.bio.en"
                  rows="2"
                  class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                  placeholder="Brief bio in English"
                />
                <div class="text-xs text-secondary mt-1 text-left">English</div>
              </div>
            </div>
          </div>

          <!-- Methodologies - Arabic & English -->
          <div class="space-y-2">
            <label class="block text-xs sm:text-sm font-medium text-primary mb-1">المنهجيات المتبعة</label>
            <div class="grid grid-cols-1 gap-2">
              <div>
                <textarea 
                  v-model="therapistForm.methodologies.ar"
                  rows="2"
                  class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                  placeholder="المنهجيات بالعربية"
                />
                <div class="text-xs text-secondary mt-1 text-right">العربية</div>
              </div>
              <div>
                <textarea 
                  v-model="therapistForm.methodologies.en"
                  rows="2"
                  class="w-full rounded-lg border border-primary bg-primary px-3 py-2 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                  placeholder="Methodologies in English"
                />
                <div class="text-xs text-secondary mt-1 text-left">English</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Qualifications -->
        <div v-if="currentStep === 2" class="space-y-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-base sm:text-lg font-medium text-primary">المؤهلات العلمية</h3>
            <button 
              type="button"
              @click="$emit('add-qualification')"
              class="bg-brand-500 hover:bg-brand-600 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs transition-colors"
            >
              <PlusIcon class="h-3 w-3" />
              إضافة مؤهل
            </button>
          </div>

          <div class="space-y-3">
            <div 
              v-for="(qualification, index) in therapistForm.qualifications" 
              :key="index"
              class="border border-primary rounded-lg p-3 bg-secondary"
            >
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-sm font-medium text-primary">المؤهل {{ index + 1 }}</h4>
                <button 
                  type="button"
                  @click="$emit('remove-qualification', index)"
                  class="text-red-500 hover:text-red-700 p-1 transition-colors"
                >
                  <TrashIcon class="h-4 w-4" />
                </button>
              </div>
              
              <!-- Qualification Name - Arabic & English -->
              <div class="space-y-2 mb-3">
                <label class="block text-xs font-medium text-primary">اسم المؤهل</label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <input 
                      v-model="qualification.name.ar"
                      type="text"
                      class="w-full rounded-lg border border-primary bg-primary px-2 py-1 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                      placeholder="اسم المؤهل بالعربية"
                    />
                    <div class="text-xs text-secondary mt-1 text-right">العربية</div>
                  </div>
                  <div>
                    <input 
                      v-model="qualification.name.en"
                      type="text"
                      class="w-full rounded-lg border border-primary bg-primary px-2 py-1 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                      placeholder="Qualification name in English"
                    />
                    <div class="text-xs text-secondary mt-1 text-left">English</div>
                  </div>
                </div>
              </div>

              <!-- Institution - Arabic & English -->
              <div class="space-y-2">
                <label class="block text-xs font-medium text-primary">المؤسسة</label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <input 
                      v-model="qualification.institution.ar"
                      type="text"
                      class="w-full rounded-lg border border-primary bg-primary px-2 py-1 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                      placeholder="المؤسسة بالعربية"
                    />
                    <div class="text-xs text-secondary mt-1 text-right">العربية</div>
                  </div>
                  <div>
                    <input 
                      v-model="qualification.institution.en"
                      type="text"
                      class="w-full rounded-lg border border-primary bg-primary px-2 py-1 text-xs text-primary focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
                      placeholder="Institution in English"
                    />
                    <div class="text-xs text-secondary mt-1 text-left">English</div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="therapistForm.qualifications.length === 0" class="text-center py-4 text-secondary border-2 border-dashed border-primary rounded-lg text-xs">
              لا توجد مؤهلات مضافة
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between gap-2 pt-4 border-t border-primary">
          <button 
            v-if="currentStep > 0"
            type="button"
            @click="$emit('update:step', currentStep - 1)"
            class="bg-tertiary hover:bg-secondary text-primary px-3 py-2 rounded-lg transition-colors text-sm"
          >
            السابق
          </button>
          <div v-else></div>

          <div class="flex gap-2">
            <button 
              type="button"
              @click="$emit('close')"
              class="bg-tertiary hover:bg-secondary text-primary px-3 py-2 rounded-lg transition-colors text-sm"
            >
              إلغاء
            </button>
            <button 
              v-if="currentStep < steps.length - 1"
              type="button"
              @click="$emit('update:step', currentStep + 1)"
              class="bg-brand-500 hover:bg-brand-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
            >
              التالي
            </button>
            <button 
              v-else
              type="submit"
              class="bg-brand-500 hover:bg-brand-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
            >
              {{ editingTherapist ? 'تحديث' : 'إضافة' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { PlusIcon, TrashIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  open: {
    type: Boolean,
    required: true
  },
  editingTherapist: {
    type: Object,
    default: null
  },
  therapistForm: {
    type: Object,
    required: true
  },
  currentStep: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['close', 'save', 'update:step', 'add-qualification', 'remove-qualification'])

const steps = [
  { label: 'المعلومات الأساسية' },
  { label: 'المعلومات المهنية' },
  { label: 'المؤهلات' }
]
</script>