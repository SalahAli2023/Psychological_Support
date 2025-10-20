<template>
  <header 
    :class="[ 
      'fixed top-0 left-0 right-0 z-[100] w-full font-almarai transition-colors duration-500',
      scrolled ? 'bg-white shadow-lg' : 'bg-transparent'
    ]" 
    dir="rtl"
  >
    <!-- الشعار والأزرار -->
    <div class="flex justify-between items-center px-4 sm:px-8 py-3 relative z-10">
      <!-- الشعار -->
      <div class="flex-shrink-0">
        <img 
          src="/images/flogcs.png" 
          alt="شعار منصة الدعم النفسي" 
          class="h-10 sm:h-[60px] w-auto" 
        />
      </div>

      <!-- زر الانضمام وزر فتح القائمة -->
      <div class="flex flex-row items-center gap-3 md:gap-6 sm:gap-4 relative">
        <!-- زر الانضمام -->
        <a
          href="#"
          class="bg-[#9EBF3B] text-white font-semibold h-12 w-[130px] sm:w-[180px] md:w-[200px] rounded-2xl flex items-center justify-center gap-2 hover:bg-[#8aab34] transition-all duration-300 shadow-md hover:shadow-lg text-base sm:text-lg"
        >
          <img
            src="https://injazalarab.org/_nuxt/img/compus-arrow.7f03aae.svg"
            alt="سهم"
            class="w-5 sm:w-7"
          />
          <span>انضم إلينا</span>
        </a>

        <!-- زر فتح القائمة -->
        <button
          @click="toggleMenu"
          class="w-12 h-12 bg-[#9EBF3B] text-white text-2xl font-bold rounded-2xl flex items-center justify-center shadow-md hover:bg-[#8aab34] hover:shadow-lg transition-all duration-300"
          aria-label="فتح القائمة"
        >
          &#9776;
        </button>
      </div>
    </div>

    <!-- القائمة المنبثقة -->
    <transition name="fade">
      <div
        v-if="menuVisible"
        class="fixed inset-0 bg-[#D6A29A]/50 backdrop-blur-md z-[999] flex flex-col justify-center items-center text-white text-2xl space-y-6"
      >
        <!-- زر الإغلاق أعلى يسار القائمة -->
        <button
          @click="toggleMenu"
          class="absolute md:top-5  top-3 md:left-8 left-4 w-12 h-12 bg-[#9EBF3B] text-white text-2xl font-bold rounded-2xl flex items-center justify-center shadow-md hover:bg-[#8aab34] transition-all duration-300"
          aria-label="إغلاق القائمة"
        >
          &times;
        </button>

        <!-- عناصر القائمة -->
        <div class="flex flex-col text-center space-y-4 mt-20 text-xl max-w-xs sm:max-w-md">
          <p
            v-for="item in menuItems"
            :key="item.name"
            class="hover:text-[#9EBF3B] hover:scale-110 transition-all duration-300 cursor-pointer py-2"
            @click="handleMenuClick(item)"
          >
            {{ item.name }}
          </p>
        </div>

        <SocialLinks />
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SocialLinks from '../layouts/SocialLinks.vue'

const menuVisible = ref(false)
const toggleMenu = () => (menuVisible.value = !menuVisible.value)

// تحديث menuItems لتشمل actions
const menuItems = [
  { name: 'من نحن', action: 'about' },
  { name: 'خدماتنا', action: 'services' },
  { name: 'الأخصائيون', action: 'specialists' },
  { name: 'جلسات الدعم', action: 'sessions' },
  { name: 'الفعاليات والورش', action: 'events' },
  { name: 'شهادات المستفيدين', action: 'testimonials' },
  { name: 'الأسئلة الشائعة', action: 'faq' },
  { name: 'اتصل بنا', action: 'contact' }
]

const handleMenuClick = (item) => {
  toggleMenu()
  
  if (item.action === 'events') {
    // إرسال حدث لتغيير الصفحة
    window.dispatchEvent(new CustomEvent('change-page', {
      detail: { page: 'events' }
    }))
  }
}

const scrolled = ref(false)
const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
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
</style>