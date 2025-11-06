<template>
  <!-- Footer احترافي -->
  <footer class="bg-gradient-to-br from-slate-900 to-gray-900 text-white relative overflow-hidden">
    <!-- شكل زخرفي -->
    <div class="absolute top-0 left-0 w-72 h-72 bg-primary-green opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-primary-pink opacity-5 rounded-full translate-x-1/3 translate-y-1/3"></div>
    
    <div class="relative z-10">
      <!-- قسم النشرة الإخبارية -->
      <div class="border-b border-gray-700/50">
        <div class="max-w-7xl mx-auto px-6 py-16">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="">
              <h2 class="text-3xl font-bold mb-4">
                <span class="text-white">{{ $t('footer.stayInTouch') }}</span>
                <span class="text-primary-green">{{ $t('footer.contact') }}</span>
              </h2>
              <p class="text-gray-300 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                {{ $t('footer.newsletterDescription') }}
              </p>
            </div>
            
            <div class="flex justify-center lg:justify-start">
              <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl w-full max-w-md">
                <form class="space-y-4">
                  <div>
                    <label class="block text-gray-300 text-sm font-medium mb-2 ">{{ $t('footer.emailLabel') }}</label>
                    <input 
                      type="email" 
                      :placeholder="$t('footer.emailPlaceholder')"
                      class="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green focus:ring-opacity-20 transition-all duration-300"
                      required
                    >
                  </div>
                  <button 
                    type="submit"
                    class="w-full bg-gradient-to-r from-primary-green to-emerald-500 hover:from-emerald-500 hover:to-primary-green text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md"
                  >
                    <span class="flex items-center justify-center gap-2">
                      <i class="fas fa-paper-plane"></i>
                      {{ $t('footer.subscribeButton') }}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- المحتوى الرئيسي -->
      <div class="max-w-7xl mx-auto px-6 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <!-- معلومات الشركة -->
          <div class="lg:col-span-2">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-14 h-14 bg-gradient-to-br from-primary-green to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <i class="fas fa-heart text-white text-xl"></i>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-white">نفسي</h3>
                <p class="text-primary-green text-sm font-medium">{{ $t('footer.platformText') }}</p>
              </div>
            </div>
            <p class="text-gray-300 mb-6 leading-relaxed text-lg">
              {{ $t('footer.companyDescription') }}
            </p>
            <div class="flex gap-3">
              <a href="#" class="group w-12 h-12 bg-white/5 hover:bg-primary-green rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg border border-white/10">
                <i class="fab fa-facebook-f text-gray-400 group-hover:text-white"></i>
              </a>
              <a href="#" class="group w-12 h-12 bg-white/5 hover:bg-primary-green rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg border border-white/10">
                <i class="fab fa-twitter text-gray-400 group-hover:text-white"></i>
              </a>
              <a href="#" class="group w-12 h-12 bg-white/5 hover:bg-primary-green rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg border border-white/10">
                <i class="fab fa-instagram text-gray-400 group-hover:text-white"></i>
              </a>
              <a href="#" class="group w-12 h-12 bg-white/5 hover:bg-primary-green rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg border border-white/10">
                <i class="fab fa-linkedin-in text-gray-400 group-hover:text-white"></i>
              </a>
              <a href="#" class="group w-12 h-12 bg-white/5 hover:bg-primary-green rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg border border-white/10">
                <i class="fab fa-youtube text-gray-400 group-hover:text-white"></i>
              </a>
            </div>
          </div>

          <!-- روابط سريعة -->
          <div>
            <h4 class="text-lg font-bold text-white mb-6 pb-3 border-b-2 border-primary-green inline-block">{{ $t('footer.linksText') }}</h4>
            <ul class="space-y-3">
              <li>
                <a href="#" class="text-gray-300 hover:text-primary-green transition-all duration-300 flex items-center gap-3 group">
                  <i :class="currentLanguage === 'ar' ? 'fas fa-chevron-left' : 'fas fa-chevron-right'" class="text-primary-green text-xs group-hover:translate-x-1 transition-transform"></i>
                  {{ $t('menuItems.Home') }}
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-primary-green transition-all duration-300 flex items-center gap-3 group">
                  <i :class="currentLanguage === 'ar' ? 'fas fa-chevron-left' : 'fas fa-chevron-right'" class="text-primary-green text-xs group-hover:translate-x-1 transition-transform"></i>
                  {{ $t('menuItems.about') }}
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-primary-green transition-all duration-300 flex items-center gap-3 group">
                  <i :class="currentLanguage === 'ar' ? 'fas fa-chevron-left' : 'fas fa-chevron-right'" class="text-primary-green text-xs group-hover:translate-x-1 transition-transform"></i>
                  {{ $t('menuItems.services') }}
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-primary-green transition-all duration-300 flex items-center gap-3 group">
                  <i :class="currentLanguage === 'ar' ? 'fas fa-chevron-left' : 'fas fa-chevron-right'" class="text-primary-green text-xs group-hover:translate-x-1 transition-transform"></i>
                  {{ $t('menuItems.articles') }}
                </a>
              </li>
            </ul>
          </div>

          <!-- الخدمات -->
          <div>
            <h4 class="text-lg font-bold text-white mb-6 pb-3 border-b-2 border-primary-pink inline-block">{{ $t('footer.servicesText') }}</h4>
            <ul class="space-y-3">
              <li>
                <a href="#" class="text-gray-300 hover:text-primary-pink transition-all duration-300 flex items-center gap-3 group">
                  <i class="fas fa-comments text-primary-pink text-sm"></i>
                  {{ $t('footer.supportSessions') }}
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-primary-pink transition-all duration-300 flex items-center gap-3 group">
                  <i class="fas fa-user-md text-primary-pink text-sm"></i>
                  {{ $t('footer.consultations') }}
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-primary-pink transition-all duration-300 flex items-center gap-3 group">
                  <i class="fas fa-users text-primary-pink text-sm"></i>
                  {{ $t('footer.trainingWorkshops') }}
                </a>
              </li>
              <li>
                <a href="/legal" class="text-gray-300 hover:text-primary-pink transition-all duration-300 flex items-center gap-3 group">
                  <i class="fas fa-book text-primary-pink text-sm"></i>
                  {{ $t('footer.resources') }}
                </a>
              </li>
            </ul>
          </div>

          <!-- اتصل بنا -->
          <div>
            <h4 class="text-lg font-bold text-white mb-6 pb-3 border-b-2 border-primary-green inline-block">{{ $t('footer.contactUsText') }}</h4>
            <div class="space-y-4">
              <div class="flex items-center gap-3 text-gray-300">
                <div class="w-10 h-10 bg-primary-green rounded-lg flex items-center justify-center">
                  <i class="fas fa-phone text-white text-sm"></i>
                </div>
                <div>
                  <p class="text-sm text-gray-400">{{ $t('footer.phoneText') }}</p>
                  <p class="font-medium">+966 123 456 789</p>
                </div>
              </div>
              <div class="flex items-center gap-3 text-gray-300">
                <div class="w-10 h-10 bg-primary-pink rounded-lg flex items-center justify-center">
                  <i class="fas fa-envelope text-white text-sm"></i>
                </div>
                <div>
                  <p class="text-sm text-gray-400">{{ $t('footer.emailText') }}</p>
                  <p class="font-medium">info@nafsy.com</p>
                </div>
              </div>
              <div class="flex items-center gap-3 text-gray-300">
                <div class="w-10 h-10 bg-primary-green rounded-lg flex items-center justify-center">
                  <i class="fas fa-map-marker-alt text-white text-sm"></i>
                </div>
                <div>
                  <p class="text-sm text-gray-400">{{ $t('footer.addressText') }}</p>
                  <p class="font-medium">{{ $t('footer.locationText') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- القسم السفلي -->
      <div class="border-t border-gray-700/50 bg-black/20">
        <div class="max-w-7xl mx-auto px-6 py-8">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="text-center md:text-right">
              <p class="text-gray-400">
                &copy; 2024 <span class="text-primary-green">{{ $t('footer.copyrightText') }}</span>. {{ $t('footer.allRightsText') }}
              </p>
            </div>
            <div class="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#" class="text-gray-400 hover:text-primary-green transition-colors">{{ $t('footer.termsText') }}</a>
              <a href="#" class="text-gray-400 hover:text-primary-green transition-colors">{{ $t('footer.privacyText') }}</a>
              <a href="#" class="text-gray-400 hover:text-primary-green transition-colors">{{ $t('footer.faqText') }}</a>
              <a href="#" class="text-gray-400 hover:text-primary-green transition-colors">{{ $t('footer.contactUsText') }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { inject } from 'vue'

// الحصول على حالة اللغة من provide
const languageState = inject('languageState')

// استخدام دالة الترجمة واللغة الحالية
const $t = languageState?.translate || ((key) => key)
const currentLanguage = languageState?.currentLanguage || 'ar'
</script>