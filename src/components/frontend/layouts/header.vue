<template>
  <header 
    :class="[ 
      'fixed top-0 left-0 right-0 z-[100] w-full font-almarai transition-colors duration-500',
      scrolled ? 'bg-white shadow-lg' : 'bg-transparent'
    ]" 
    :dir="currentLanguage === 'ar' ? 'rtl' : 'ltr'"
  >
    <!-- الشعار والأزرار -->
    <div class="flex justify-between items-center px-4 sm:px-8 py-3 relative z-10">
      <!-- الشعار مع رابط للرئيسية -->
      <div class="flex-shrink-0">
        <router-link to="/">
          <img 
            src="/images/flogcs.png" 
            :alt="t('header.logoAlt')" 
            class="h-10 sm:h-[60px] w-auto" 
          />
        </router-link>
      </div>

      <!-- زر الانضمام وأزرار اللغة والقائمة -->
      <div class="flex flex-row items-center gap-3 md:gap-6 sm:gap-4 relative">
        <!-- زر الانضمام -->
        <router-link
          to="/join"
          class="bg-[#9EBF3B] text-white font-semibold h-12 w-[130px] sm:w-[180px] md:w-[200px] rounded-2xl flex items-center justify-center gap-2 hover:bg-[#8aab34] transition-all duration-300 shadow-md hover:shadow-lg text-base sm:text-lg"
        >
          <img
            src="https://injazalarab.org/_nuxt/img/compus-arrow.7f03aae.svg"
            :alt="t('header.arrowAlt')"
            class="w-5 sm:w-7"
          />
          <span>{{ t('header.joinUs') }}</span>
        </router-link>

        <!-- زر تبديل اللغة -->
        <button
          @click="toggleLanguage"
          class="bg-[#9EBF3B] text-white font-semibold h-12 w-12 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#8aab34] transition-all duration-300 shadow-md hover:shadow-lg"
          :title="t('header.languageToggle')"
        >
          {{ currentLanguage === 'ar' ? 'EN' : 'AR' }}
        </button>

        <!-- زر فتح القائمة -->
        <button
          @click="toggleMenu"
          class="w-12 h-12 bg-[#9EBF3B] text-white text-2xl font-bold rounded-2xl flex items-center justify-center shadow-md hover:bg-[#8aab34] hover:shadow-lg transition-all duration-300"
          :aria-label="t('header.openMenu')"
        >
          &#9776;
        </button>
      </div>
    </div>

    <!-- القائمة المنبثقة -->
    <transition name="fade">
      <div
        v-if="menuVisible"
        class="fixed inset-0 bg-[#000000]/80 backdrop-blur-md z-[999] flex flex-col justify-center items-center text-white text-2xl space-y-6"
      >
        <!-- زر الإغلاق أعلى يسار القائمة -->
        <button
          @click="toggleMenu"
          class="absolute md:top-5 top-3 md:left-8 left-4 w-12 h-12 bg-[#9EBF3B] text-white text-2xl font-bold rounded-2xl flex items-center justify-center shadow-md hover:bg-[#8aab34] transition-all duration-300"
          :aria-label="t('header.closeMenu')"
        >
          &times;
        </button>

        <!-- عناصر القائمة -->
        <div class="flex flex-col text-center space-y-4 mt-20 text-xl max-w-xs sm:max-w-md">
          <router-link
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            @click="toggleMenu"
            class="hover:text-[#9EBF3B] hover:scale-110 transition-all duration-300 cursor-pointer py-2 block"
          >
            {{ item.name[currentLanguage] }}
          </router-link>
        </div>

        <SocialLinks />
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, provide } from 'vue'
import { useRouter } from 'vue-router'
import { translations, t } from '@/locales'  // استيراد من ملف اللغة
import SocialLinks from '../layouts/SocialLinks.vue'

const router = useRouter()
const menuVisible = ref(false)
const currentLanguage = ref('ar') // اللغة الافتراضية هي العربية

// Toggle menu visibility
const toggleMenu = () => (menuVisible.value = !menuVisible.value)

// Toggle language between Arabic and English
const toggleLanguage = () => {
  currentLanguage.value = currentLanguage.value === 'ar' ? 'en' : 'ar'
  // Store language preference in localStorage
  localStorage.setItem('preferredLanguage', currentLanguage.value)
  
  // Update document direction
  document.documentElement.dir = currentLanguage.value === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = currentLanguage.value
  
  // Emit custom event for other components to listen to
  window.dispatchEvent(new CustomEvent('languageChanged', { 
    detail: { language: currentLanguage.value } 
  }))
}

// Translation function
const translate = (key) => t(key, currentLanguage.value)

// Check for saved language preference on component mount
onMounted(() => {
  const savedLanguage = localStorage.getItem('preferredLanguage')
  if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'en')) {
    currentLanguage.value = savedLanguage
  }
  
  // Set initial document direction
  document.documentElement.dir = currentLanguage.value === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = currentLanguage.value
  
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => window.removeEventListener('scroll', handleScroll))

// Provide the language state to child components
provide('languageState', {
  currentLanguage,
  toggleLanguage,
  t: translate
})

// Menu items with translations
const menuItems = [
  { 
    name: { 
      ar: translations.ar.menuItems.about, 
      en: translations.en.menuItems.about
    }, 
    path: '/about' 
  },
  { 
    name: { 
      ar: translations.ar.menuItems.services, 
      en: translations.en.menuItems.services
    }, 
    path: '/services' 
  },
  { 
    name: { 
      ar: translations.ar.menuItems.specialists, 
      en: translations.en.menuItems.specialists
    }, 
    path: '/Specialists' 
  },
  { 
    name: { 
      ar: translations.ar.menuItems.sessions, 
      en: translations.en.menuItems.sessions
    }, 
    path: '/sessions' 
  },
  { 
    name: { 
      ar: translations.ar.menuItems.events, 
      en: translations.en.menuItems.events
    }, 
    path: '/events' 
  },
  { 
    name: { 
      ar: translations.ar.menuItems.measures, 
      en: translations.en.menuItems.measures
    }, 
    path: '/measures' 
  },
  { 
    name: { 
      ar: translations.ar.menuItems.testimonials, 
      en: translations.en.menuItems.testimonials
    }, 
    path: '/testimonials' 
  },
  { 
    name: { 
      ar: translations.ar.menuItems.library, 
      en: translations.en.menuItems.library
    }, 
    path: '/library' 
  },
  { 
    name: { 
      ar: translations.ar.menuItems.articles, 
      en: translations.en.menuItems.articles
    }, 
    path: '/article' 
  },
  { 
    name: { 
      ar: translations.ar.menuItems.faq, 
      en: translations.en.menuItems.faq
    }, 
    path: '/faq' 
  },
  { 
    name: { 
      ar: translations.ar.menuItems.contact, 
      en: translations.en.menuItems.contact
    }, 
    path: '/contact' 
  }
]

const scrolled = ref(false)
const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}
</script>

<style scoped>
/* انتقال القائمة */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.fade-enter-to, .fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* تأثير active للروابط */
.router-link-active {
  color: #9EBF3B;
  font-weight: bold;
}
</style>