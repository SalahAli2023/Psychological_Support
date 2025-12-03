<template>
  <div>
    <!-- Header -->
    <Header />

    <!-- Hero -->
    <Hero
      :title="translate('contact.hero.title')"
      :highlight="translate('contact.hero.highlight')"
      :subtitle="translate('contact.hero.subtitle')"
      :buttons="heroButtons"
    />

    <!-- Contact Section -->
    <section class="py-16 bg-white font-almarai">
      <div class="max-w-6xl mx-auto px-6">
        <!-- Contact Information Cards -->
        <div class="grid md:grid-cols-3 gap-6 mb-12">
          <!-- Phone Card -->
          <div
            class="flex items-center gap-4 p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div
              class="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-tr from-primary-green to-secondary-green text-white text-2xl"
            >
              <i class="fa-solid fa-phone"></i>
            </div>
            <div>
              <h4 class="font-semibold text-gray-800">{{ translate('contact.section.phone') }}</h4>
              <p class="text-gray-500 text-sm">+967 777777777</p>
            </div>
          </div>

          <!-- Email Card -->
          <div
            class="flex items-center gap-4 p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div
              class="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-tr from-primary-green to-secondary-green text-white text-2xl"
            >
              <i class="fa-solid fa-envelope"></i>
            </div>
            <div>
              <h4 class="font-semibold text-gray-800">{{ translate('contact.section.email') }}</h4>
              <p class="text-gray-500 text-sm">farhm@example.com</p>
            </div>
          </div>

          <!-- Location Card -->
          <div
            class="flex items-center gap-4 p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div
              class="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-tr from-primary-green to-secondary-green text-white text-2xl"
            >
              <i class="fa-solid fa-map-location-dot"></i>
            </div>
            <div>
              <h4 class="font-semibold text-gray-800">{{ translate('contact.section.location') }}</h4>
              <p class="text-gray-500 text-sm">{{ currentLanguage === 'ar' ? 'اليمن - تعز' : 'Yemen - Taiz' }}</p>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ translate('contact.section.title') }}</h2>
          <div class="w-10 h-[2px] bg-primary-green mb-6 rounded-full"></div>

          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                v-model="formData.name"
                :placeholder="translate('contact.form.fullName')"
                :class="inputClasses('name')"
                :dir="currentLanguage === 'ar' ? 'rtl' : 'ltr'"
              />
              <div v-if="errors.name" class="text-red-500 text-sm mt-1 col-span-2 md:col-span-1">
                {{ errors.name }}
              </div>

              <input
                type="email"
                v-model="formData.email"
                :placeholder="translate('contact.form.email')"
                :class="inputClasses('email')"
                :dir="currentLanguage === 'ar' ? 'rtl' : 'ltr'"
              />
              <div v-if="errors.email" class="text-red-500 text-sm mt-1 col-span-2 md:col-span-1">
                {{ errors.email }}
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                v-model="formData.subject"
                :placeholder="translate('contact.form.subject')"
                :class="inputClasses('subject')"
                :dir="currentLanguage === 'ar' ? 'rtl' : 'ltr'"
              />
              <div v-if="errors.subject" class="text-red-500 text-sm mt-1 col-span-2 md:col-span-1">
                {{ errors.subject }}
              </div>

              <select
                v-model="formData.message_type"
                :class="inputClasses('message_type')"
                :dir="currentLanguage === 'ar' ? 'rtl' : 'ltr'"
              >
                <option value="">{{ translate('contact.form.messageType') }}</option>
                <option value="inquiry">استفسار</option>
                <option value="complaint">شكوى</option>
                <option value="suggestion">اقتراح</option>
                <option value="support">دعم فني</option>
                <option value="other">أخرى</option>
              </select>
              <div v-if="errors.message_type" class="text-red-500 text-sm mt-1 col-span-2 md:col-span-1">
                {{ errors.message_type }}
              </div>
            </div>

            <textarea
              rows="5"
              v-model="formData.message"
              :placeholder="translate('contact.form.message')"
              :class="textareaClasses('message')"
              :dir="currentLanguage === 'ar' ? 'rtl' : 'ltr'"
            ></textarea>
            <div v-if="errors.message" class="text-red-500 text-sm mt-1">
              {{ errors.message }}
            </div>

            <div class="flex justify-start">
              <button
                type="submit"
                :disabled="contactStore.loading"
                class="px-8 py-3 rounded-2xl bg-gradient-to-tr from-primary-green to-secondary-green text-white font-semibold hover:opacity-90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="contactStore.loading">
                  <i class="fas fa-spinner fa-spin mr-2"></i>
                  جاري الإرسال...
                </span>
                <span v-else>
                  {{ translate('contact.form.send') }}
                </span>
              </button>
            </div>
          </form>

          <!-- Success Message -->
          <div v-if="contactStore.successMessage" class="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl">
            <i class="fas fa-check-circle mr-2"></i>
            {{ contactStore.successMessage }}
          </div>

          <!-- Error Message -->
          <div v-if="contactStore.error" class="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
            <i class="fas fa-exclamation-circle mr-2"></i>
            {{ contactStore.error }}
            <button @click="contactStore.clearMessages()" class="float-left ml-2 text-red-700 hover:text-red-900">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import Header from '@/components/frontend/layouts/header.vue';
import Footer from '@/components/frontend/layouts/footer.vue';
import Hero from '@/components/frontend/layouts/hero.vue';
import { useTranslations } from '@/composables/useTranslations';
import { useContactStore } from '@/stores/contact';
import type { ContactFormData } from '@/types/contact';

const { translate, currentLanguage } = useTranslations();
const contactStore = useContactStore();

// Reactive form data
const formData = reactive<ContactFormData>({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message_type: '',
  message: ''
});

// Local validation errors
const errors = ref<Record<string, string>>({});

// Computed
const heroButtons = computed(() => [
  { 
    text: translate('buttons.startJourney'), 
    icon: 'fas fa-play-circle', 
    primary: true 
  },
  { 
    text: translate('buttons.learnMore'), 
    icon: 'fas fa-info-circle', 
    primary: false 
  }
]);

// Methods
const inputClasses = (field: string) => {
  const baseClasses = 'w-full border border-gray-200 rounded-full px-5 py-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all';
  return errors.value[field] 
    ? `${baseClasses} border-red-500` 
    : baseClasses;
};

const textareaClasses = (field: string) => {
  const baseClasses = 'w-full border border-gray-200 rounded-xl px-5 py-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all';
  return errors.value[field] 
    ? `${baseClasses} border-red-500` 
    : baseClasses;
};

const validateForm = (): boolean => {
  errors.value = {};

  if (!formData.name.trim()) {
    errors.value.name = 'الاسم مطلوب';
  }

  if (!formData.email.trim()) {
    errors.value.email = 'البريد الإلكتروني مطلوب';
  } else if (!isValidEmail(formData.email)) {
    errors.value.email = 'صيغة البريد الإلكتروني غير صحيحة';
  }

  if (!formData.subject.trim()) {
    errors.value.subject = 'الموضوع مطلوب';
  }

  if (!formData.message_type) {
    errors.value.message_type = 'نوع الرسالة مطلوب';
  }

  if (!formData.message.trim()) {
    errors.value.message = 'الرسالة مطلوبة';
  } else if (formData.message.trim().length < 10) {
    errors.value.message = 'الرسالة يجب أن تكون على الأقل 10 أحرف';
  }

  return Object.keys(errors.value).length === 0;
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const submitForm = async () => {
  if (!validateForm()) {
    return;
  }

  try {
    await contactStore.submitContact(formData);
    
    // Reset form on success
    if (contactStore.successMessage) {
      Object.keys(formData).forEach(key => {
        formData[key as keyof ContactFormData] = '';
      });
      showSuccessNotification('تم الإرسال بنجاح')
      errors.value = {};
    }
  } catch (error) {
      showErrorNotification('فشل في الإرسال')
    // Error is already handled in the store
    console.error('Contact form submission error:', error);
  }
};

// Clear errors when user starts typing
watch(formData, (newVal) => {
  Object.keys(newVal).forEach(key => {
    if (newVal[key as keyof ContactFormData] && errors.value[key]) {
      delete errors.value[key];
    }
  });
}, { deep: true });

// دوال مساعدة للإشعارات
function showErrorNotification(message: string) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
  errorDiv.innerHTML = `❌ ${message}`;
  document.body.appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 5000);
}

function showSuccessNotification(message: string) {
  const successDiv = document.createElement('div');
  successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
  successDiv.innerHTML = `✅ ${message}`;
  document.body.appendChild(successDiv);
  setTimeout(() => successDiv.remove(), 3000);
}

</script>

<style>
/* يمكن إضافة أي تخصيص عام هنا */
</style>