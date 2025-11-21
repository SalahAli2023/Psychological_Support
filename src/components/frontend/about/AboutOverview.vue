<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        <!-- الصورة -->
        <div class="order-2 lg:order-2">
          <div class="relative rounded-2xl overflow-hidden animate-float">
            <img 
              src="@/assets/images/Statistics/جلسات.png" 
              alt="جلسات"
              class="w-full h-auto"
            />
            <div class="absolute inset-0 bg-gradient-to-br from-primary-green/10 to-primary-pink/10 transition-opacity duration-500 hover:opacity-0"></div>
          </div>
        </div>

        <!-- المحتوى -->
        <div class="order-1 lg:order-1 text-start" :dir="currentLanguage === 'ar' ? 'rtl' : 'ltr'">

          <!-- عنوان كلمتين -->
<TitleSection
  :mainText="translate('about.overview.mainTitle')"
  :highlightText="translate('about.overview.highlightTitle')"
  textColor="text-gray-900"
  highlightColor="text-primary-green"
  gradientClass="bg-primary-green"
/>

          <div class="space-y-4 text-gray-600 leading-relaxed">
            <p class="animate-fade-in-up" style="animation-delay: 0.1s">
              {{ translate('about.overview.description1') }}
            </p>
            <p class="animate-fade-in-up" style="animation-delay: 0.2s">
              {{ translate('about.overview.description2') }}
            </p>
            <p class="animate-fade-in-up" style="animation-delay: 0.3s">
              {{ translate('about.overview.description3') }}
            </p>
            <p class="animate-fade-in-up" style="animation-delay: 0.4s">
              {{ translate('about.overview.description4') }}
            </p>
          </div>

          <div class="mt-8 flex flex-wrap gap-4">
            <div class="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 hover:shadow-md transition-all duration-300 animate-bounce-in" style="animation-delay: 0.5s">
              <div class="w-3 h-3 bg-primary-green rounded-full"></div>
              <span class="text-gray-700 font-medium text-sm">{{ translate('about.overview.badges.independent') }}</span>
            </div>
            <div class="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 hover:shadow-md transition-all duration-300 animate-bounce-in" style="animation-delay: 0.6s">
              <div class="w-3 h-3 bg-primary-pink rounded-full"></div>
              <span class="text-gray-700 font-medium text-sm">{{ translate('about.overview.badges.nonprofit') }}</span>
            </div>
            <div class="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-2 hover:shadow-md transition-all duration-300 animate-bounce-in" style="animation-delay: 0.7s">
              <div class="w-3 h-3 bg-primary-green rounded-full"></div>
              <span class="text-gray-700 font-medium text-sm">{{ translate('about.overview.badges.licensed') }}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useTranslations } from '@/composables/useTranslations'
// استبدل المسار النسبي حسب موقعك الفعلي
import TitleSection from '../layouts/TitleSection.vue'

const { currentLanguage, translate } = useTranslations()
</script>
