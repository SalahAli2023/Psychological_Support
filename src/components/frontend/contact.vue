<template>
  <div>
    <!-- Header -->
    <Header />

    <!-- Hero -->
    <Hero
      :title="translate('contact.hero.title')"
      :highlight="translate('contact.hero.highlight')"
      :subtitle="translate('contact.hero.subtitle')"
      :buttons="[
        { text: translate('buttons.startJourney'), icon: 'fas fa-play-circle', primary: true },
        { text: translate('buttons.learnMore'), icon: 'fas fa-info-circle', primary: false }
      ]"
    />

    <!-- Contact Section -->
    <section class="py-16 bg-primary">
      <div class="max-w-6xl mx-auto px-6">
        <!-- Contact Information -->
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

          <form class="space-y-6">
            <div class="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                :placeholder="translate('contact.form.fullName')"
                class="w-full border border-gray-200 rounded-full px-5 py-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all"
                :dir="currentLanguage === 'ar' ? 'rtl' : 'ltr'"
              />
              <input
                type="email"
                :placeholder="translate('contact.form.email')"
                class="w-full border border-gray-200 rounded-full px-5 py-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all"
                :dir="currentLanguage === 'ar' ? 'rtl' : 'ltr'"
              />
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                :placeholder="translate('contact.form.subject')"
                class="w-full border border-gray-200 rounded-full px-5 py-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all"
                :dir="currentLanguage === 'ar' ? 'rtl' : 'ltr'"
              />
              <input
                type="text"
                :placeholder="translate('contact.form.messageType')"
                class="w-full border border-gray-200 rounded-full px-5 py-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all"
                :dir="currentLanguage === 'ar' ? 'rtl' : 'ltr'"
              />
            </div>

            <textarea
              rows="5"
              :placeholder="translate('contact.form.message')"
              class="w-full border border-gray-200 rounded-xl px-5 py-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all"
              :dir="currentLanguage === 'ar' ? 'rtl' : 'ltr'"
            ></textarea>

            <div class="flex justify-start">
              <button
                type="submit"
                class="px-8 py-3 rounded-2xl bg-gradient-to-tr from-primary-green to-secondary-green text-white font-semibold hover:opacity-90 transition-all shadow-md"
              >
                {{ translate('contact.form.send') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/frontend/layouts/header.vue'
import Footer from '@/components/frontend/layouts/footer.vue'
import Hero from '@/components/frontend/layouts/hero.vue'
import { useTranslations } from '@/composables/useTranslations'

const { translate, currentLanguage } = useTranslations()
</script>

<!-- No scoped style -->
<style>
/* يمكن إضافة أي تخصيص عام هنا */
</style>