<template>
  <div class="font-almarai">
    <!-- Header -->
    <Header />

    <!-- Hero Section -->
    <Hero 
      :title="therapist.name"
      subtitle="احجز جلستك مع خبير الصحة النفسية المعتمد"
      :buttons="[
        { text: 'ابدأ الرحلة', icon: 'fas fa-play-circle', primary: true },
        { text: 'المزيد عنا', icon: 'fas fa-info-circle', primary: false }
      ]"
    />

    <div class="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <!-- Breadcrumbs -->
      <nav class="mb-4 sm:mb-6">
        <ol class="flex items-center space-x-1 sm:space-x-2 space-x-reverse text-xs sm:text-sm">
          <li><router-link to="/" class="text-[#065f46] hover:text-[#047857]">الرئيسية</router-link></li>
          <li><i class="fas fa-chevron-left text-gray-400 text-xs"></i></li>
          <li><router-link to="/therapists" class="text-[#065f46] hover:text-[#047857]">المعالجين</router-link></li>
          <li><i class="fas fa-chevron-left text-gray-400 text-xs"></i></li>
          <li class="text-gray-600">{{ therapist.name }}</li>
        </ol>
      </nav>

      <div class="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <!-- Main Content -->
        <div class="flex-1">
          <!-- Therapist Profile -->
          <div class="p-4 sm:p-6 bg-white rounded-xl shadow-sm mb-6 sm:mb-8">
            <div class="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <!-- Profile Image -->
              <div class="flex justify-center sm:justify-start">
                <img 
                  :src="therapist.image" 
                  :alt="therapist.name"
                  class="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover ring-4 ring-[#9EBF3B]"
                >
              </div>

              <!-- Therapist Info -->
              <div class="flex-1 ">
                <h1 class="text-2xl sm:text-3xl font-bold text-[#065f46] mb-2">
                  {{ therapist.name }}
                </h1>
                <p class="text-lg sm:text-xl text-[#047857] font-semibold mb-3 sm:mb-4">
                  {{ therapist.title }}
                </p>

                <!-- Rating -->
                <div class="flex items-center sm:justify-start gap-3 mb-3 sm:mb-4">
                  <div class="flex">
                    <i v-for="i in 5" :key="i" class="fas fa-star text-[#D6A29A] text-sm sm:text-lg"></i>
                  </div>
                  <span class="text-[#059669] font-bold text-sm sm:text-lg">
                    {{ therapist.rating }} / {{ therapist.totalSessions }} جلسة
                  </span>
                </div>

                <!-- Affiliation -->
                <p class="text-[#065f46] font-semibold mb-2 text-sm sm:text-base">
                  معتمد من التحالف العربي لخبراء العلاج النفسي
                </p>

                <!-- Session Duration -->
                <p class="text-[#059669] font-medium mb-3 sm:mb-4 text-sm sm:text-base">
                  مدة الجلسة : 45 دقيقة
                </p>

                <!-- Biography -->
                <p class="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {{ therapist.biography }}
                </p>
              </div>
            </div>
          </div>

          <!-- About the Expert -->
          <div class="p-4 sm:p-6 bg-white rounded-xl shadow-sm mb-6 sm:mb-8">
            <div class="flex items-center gap-3 mb-4">
              <i class="fas fa-info-circle text-[#9EBF3B] text-xl"></i>
              <h2 class="text-xl sm:text-2xl font-bold text-[#065f46]">عن الخبير</h2>
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold text-[#047857] mb-3">المؤهلات العلمية</h3>
              <ul class="space-y-2">
                <li v-for="qualification in visibleQualifications" :key="qualification" class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-[#9EBF3B] mt-1"></i>
                  <span class="text-gray-700 text-sm sm:text-base">{{ qualification }}</span>
                </li>
              </ul>
            </div>

            <div v-if="therapist.qualifications.length > maxVisibleQualifications">
              <a 
                href="#" 
                @click.prevent="toggleAboutMore"
                class="inline-flex items-center gap-2 font-semibold text-[#047857] hover:text-[#065f46]"
              >
                {{ showMoreAbout ? 'إظهار أقل' : 'قراءة المزيد' }}
                <i :class="['fas', showMoreAbout ? 'fa-chevron-up' : 'fa-chevron-left', 'text-sm']"></i>
              </a>
            </div>
          </div>

          <!-- Testimonials with Responsive Scroll -->
          <div class="p-4 sm:p-6 bg-white rounded-xl shadow-sm">
            <div class="flex items-center justify-between mb-4 sm:mb-6">
              <div class="flex items-center gap-3">
                <i class="fas fa-star text-[#D6A29A] text-xl"></i>
                <h2 class="text-xl sm:text-2xl font-bold text-[#065f46]">التقييمات</h2>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-500 sm:hidden">
                <i class="fas fa-arrows-left-right text-xs"></i>
                <span>اسحب للتجول</span>
              </div>
              <div class="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                <i class="fas fa-mouse text-xs"></i>
                <span>استخدم عجلة الماوس للتمرير</span>
              </div>
            </div>

            <!-- Responsive Scroll Container -->
            <div class="relative">
              <!-- Mobile: Horizontal Scroll -->
              <div class="sm:hidden overflow-x-auto pb-6 scrollbar-hide">
                <div class="flex gap-4 min-w-max">
                  <div 
                    v-for="testimonial in therapist.testimonials" 
                    :key="testimonial.id" 
                    class="rounded-lg p-4 hover:shadow-sm transition-shadow w-80 flex-shrink-0 bg-gray-50"
                  >
                    <div class="flex items-center gap-2 mb-3">
                      <div class="w-8 h-8 bg-[#9EBF3B] rounded-full flex items-center justify-center">
                        <i class="fas fa-user text-white text-xs"></i>
                      </div>
                      <div>
                        <span class="text-[#065f46] font-semibold text-sm block">{{ testimonial.user }}</span>
                        <span class="text-gray-500 text-xs">{{ testimonial.location }}</span>
                      </div>
                    </div>
                    
                    <div class="flex mb-3">
                      <i v-for="i in 5" :key="i" class="fas fa-star text-[#D6A29A] text-xs"></i>
                    </div>

                    <p class="text-gray-700 mb-3 text-sm leading-relaxed line-clamp-3">
                      "{{ testimonial.comment }}"
                    </p>

                    <div class="flex justify-between items-center">
                      <div class="flex gap-1">
                        <i class="fas fa-quote-right text-[#9EBF3B] text-xs"></i>
                        <i class="fas fa-quote-right text-[#9EBF3B] text-xs"></i>
                      </div>
                      <span class="text-xs text-gray-400">{{ testimonial.date }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Desktop: Vertical Scroll Layout -->
              <div class="hidden sm:block max-h-96 overflow-y-auto pr-2 scrollbar-custom">
                <div class="space-y-4">
                  <div 
                    v-for="testimonial in therapist.testimonials" 
                    :key="testimonial.id" 
                    class="rounded-lg p-4 hover:shadow-sm transition-shadow bg-gray-50"
                  >
                    <div class="flex items-center gap-2 mb-3">
                      <div class="w-8 h-8 bg-[#9EBF3B] rounded-full flex items-center justify-center">
                        <i class="fas fa-user text-white text-xs"></i>
                      </div>
                      <div>
                        <span class="text-[#065f46] font-semibold text-sm block">{{ testimonial.user }}</span>
                        <span class="text-gray-500 text-xs">{{ testimonial.location }}</span>
                      </div>
                    </div>
                    
                    <div class="flex mb-3">
                      <i v-for="i in 5" :key="i" class="fas fa-star text-[#D6A29A] text-xs"></i>
                    </div>

                    <p class="text-gray-700 mb-3 text-sm leading-relaxed">
                      "{{ testimonial.comment }}"
                    </p>

                    <div class="flex justify-between items-center">
                      <div class="flex gap-1">
                        <i class="fas fa-quote-right text-[#9EBF3B] text-xs"></i>
                        <i class="fas fa-quote-right text-[#9EBF3B] text-xs"></i>
                      </div>
                      <span class="text-xs text-gray-400">{{ testimonial.date }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Scroll Indicators (Mobile Only) -->
              <div class="flex justify-center gap-1 mt-4 sm:hidden">
                <div 
                  v-for="n in Math.ceil(therapist.testimonials.length / 2)" 
                  :key="n"
                  class="w-2 h-2 rounded-full bg-gray-300 transition-all duration-300"
                  :class="{ 'bg-[#9EBF3B] w-4': currentTestimonialPage === n }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking Sidebar - Mobile Optimized -->
        <div class="w-full lg:w-80">
          <div class="sticky top-4 lg:top-8 p-4 sm:p-6 bg-white rounded-xl shadow-sm">
            <div class="mb-4">
              <h2 class="text-xl text-center sm:text-2xl font-bold text-[#065f46] bg-[#9EBF3B] text-white p-3 rounded-lg">احجز جلستك</h2>
              <p class="text-xs sm:text-sm text-[#047857] mt-2 bg-gray-50 p-2 rounded-lg">اختر التاريخ والوقت المناسبين لك</p>
            </div>

            <!-- Calendar - بدون حدود -->
            <div class="mb-6 bg-gray-50 rounded-lg p-3">
              <div class="flex   items-center justify-between mb-4">
                <button @click="previousMonth" class="p-2 rounded-lg hover:bg-[#9EBF3B] hover:text-white text-[#065f46] transition-colors">
                  <i class="fas fa-chevron-right"></i>
                </button>
                <div class="text-center bg-white rounded-lg px-2 sm:px-4 py-2">
                  <div class="text-sm sm:text-lg font-bold text-gray-800">{{ currentMonthName }}</div>
                  <div class="text-xs sm:text-sm font-medium text-gray-600">{{ currentYear }}</div>
                </div>
                <button @click="nextMonth" class="p-2 rounded-lg hover:bg-[#9EBF3B] hover:text-white text-[#065f46] transition-colors">
                  <i class="fas fa-chevron-left"></i>
                </button>
              </div>

              <!-- Days of week -->
              <div class="grid grid-cols-7 gap-1 mb-2">
                <div v-for="day in daysOfWeek" :key="day" class="py-1 sm:py-2 text-xs sm:text-sm text-center text-gray-600 font-bold">
                  {{ day }}
                </div>
              </div>

              <!-- Calendar days -->
              <div class="grid grid-cols-7 gap-1">
                <button 
                  v-for="day in calendarDays" 
                  :key="day.date"
                  @click="selectDate(day.date)"
                  :class="[
                    'p-1 sm:p-2 text-xs sm:text-sm rounded-lg   transition-all font-medium',
                    day.isCurrentMonth 
                      ? day.isSelected 
                        ? 'bg-[#9EBF3B] text-white shadow-sm' 
                        : day.isToday
                          ? 'bg-gray-300 text-gray-800'
                          : 'text-gray-700 hover:bg-gray-200'
                      : 'text-gray-300',
                    day.isSelected ? 'ring-2 ring-[#9EBF3B]' : ''
                  ]"
                >
                  {{ day.day }}
                </button>
              </div>
            </div>

            <!-- Time Slots - بدون حدود -->
            <div v-if="selectedDate" class="bg-gray-50 rounded-lg p-3 transition-all duration-300">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-[#065f46]">اختر الموعد</h3>
                <span class="text-xs sm:text-sm text-gray-600 bg-gray-200 px-2 py-1 rounded-full">45 دقيقة</span>
              </div>
              <div class="grid grid-cols-1 gap-2 max-h-40 sm:max-h-60 overflow-y-auto">
                <button 
                  v-for="slot in timeSlots" 
                  :key="slot.time"
                  @click="selectTimeSlot(slot)"
                  :class="[
                    'p-2 sm:p-3 rounded-lg transition-all flex items-center justify-between',
                    slot === selectedTimeSlot 
                      ? 'bg-[#9EBF3B] text-white shadow-sm' 
                      : 'bg-white hover:bg-gray-100'
                  ]"
                >
                  <div class="flex items-center gap-2">
                    <i class="far fa-clock text-gray-600 text-xs sm:text-sm"></i>
                    <span class="font-semibold text-gray-800 text-xs sm:text-sm">{{ slot.time }}</span>
                  </div>
                  <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{{ slot.duration }}</span>
                </button>
              </div>

              <!-- Book Button -->
              <button 
                v-if="selectedTimeSlot"
                @click="bookAppointment"
                class="w-full mt-4 bg-[#9EBF3B] hover:bg-[#8cad35] text-white py-3 rounded-xl font-bold shadow-sm hover:shadow transition-all"
              >
                <div class="flex items-center justify-center gap-2">
                  <i class="fas fa-calendar-check"></i>
                  <span>تأكيد الحجز</span>
                  <i class="fas fa-arrow-left text-sm"></i>
                </div>
              </button>
            </div>

            <!-- No Selection Message -->
            <div v-if="!selectedDate" class="text-center p-4 bg-gray-50 rounded-lg">
              <i class="fas fa-calendar-day text-2xl text-gray-400 mb-2"></i>
              <p class="text-gray-600 text-sm">اختر تاريخاً لرؤية الأوقات المتاحة</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/frontend/layouts/header.vue'
import Footer from '@/components/frontend/layouts/footer.vue'
import Hero from '@/components/frontend/layouts/hero.vue'

export default {
  name: 'TherapistProfile',
  components: {
    Header,
    Footer,
    Hero
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showMoreAbout: false,
      maxVisibleQualifications: 2,
      selectedDate: null,
      selectedTimeSlot: null,
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      currentTestimonialPage: 1,
      daysOfWeek: ['جمعة', 'خميس', 'أربعاء', 'ثلاثاء', 'اثنين', 'أحد', 'سبت'],
      timeSlots: [
        { time: '12:00 م - 12:45 م', duration: '45 دقيقة' },
        { time: '12:45 م - 1:30 م', duration: '45 دقيقة' },
        { time: '1:30 م - 2:15 م', duration: '45 دقيقة' },
        { time: '2:15 م - 3:00 م', duration: '45 دقيقة' },
        { time: '3:00 م - 3:45 م', duration: '45 دقيقة' },
        { time: '3:45 م - 4:30 م', duration: '45 دقيقة' },
        { time: '4:30 م - 5:15 م', duration: '45 دقيقة' },
        { time: '5:15 م - 6:00 م', duration: '45 دقيقة' },
        { time: '6:00 م - 6:45 م', duration: '45 دقيقة' },
        { time: '6:45 م - 7:30 م', duration: '45 دقيقة' },
        { time: '7:30 م - 8:15 م', duration: '45 دقيقة' }
      ],
      therapist: {
        id: 2,
        name: 'عمرو عادل',
        title: 'استشاري الصحة النفسية ونفسي اكلينيكي',
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=320&h=320&fit=facearea&facepad=2&crop=faces&auto=format&q=80',
        rating: 5.0,
        totalSessions: 35,
        biography: 'أكثر من 15 عاماً من الخبرة في العلاج النفسي، أتبع منهجاً متكاملاً يجمع بين العلاج المعرفي السلوكي والعلاج الجدلي السلوكي والعلاج بالقبول والالتزام والتحليل النفسي. متخصص في الإرشاد الأسري والزوجي وعلاج اضطرابات القلق والاكتئاب.',
        qualifications: [
          'دكتوراه في الصحة النفسية والإرشاد الأسري - الجامعة الأمريكية للعلوم والتعليم المستمر',
          'دكتوراه في استراتيجيات التدريب وتطوير الممارسة - جامعة ستانفورد'
        ],
        testimonials: [
          {
            id: 1,
            user: 'مستخدم وثق في منصتنا',
            location: 'القاهرة',
            comment: 'بجد كنت محتاج حد يسمعني من غير ما يلومني. د. عمرو خلاني أتكلم براحة وحسيت إن فيه أمل إني أغير.',
            date: 'منذ أسبوع'
          },
          {
            id: 2,
            user: 'مستخدم وثق في منصتنا',
            location: 'الرياض',
            comment: 'تجربة مختلفة بصراحة. أسلوب د. عمرو واقعي وعملي، عطاني خطوات واضحة حسيت معها بتحسن حقيقي.',
            date: 'منذ 3 أيام'
          },
          {
            id: 3,
            user: 'مستخدم',
            location: 'دبي',
            comment: 'كنت مضطر أتعامل مع قلق شديد، د. عمرو حط لي خطة علاج منظمة وواضحة، الحمد لله النتائج ممتازة.',
            date: 'منذ أسبوعين'
          },
          {
            id: 4,
            user: 'مستخدم وثق في منصتنا',
            location: 'جدة',
            comment: 'د. عمرو ساعدني في تجاوز أزمة نفسية صعبة، تعامله محترف ومشاعرته عالية جداً.',
            date: 'منذ شهر'
          },
          {
            id: 5,
            user: 'مستخدم',
            location: 'المنصورة',
            comment: 'من أفضل المعالجين اللي قابلتهم، بيفهم مشاعرك من غير ما تتكلم كتير.',
            date: 'منذ 5 أيام'
          },
          {
            id: 6,
            user: 'مستخدم وثق في منصتنا',
            location: 'الإسكندرية',
            comment: 'جلسات مع د. عمرو غيرت حياتي للأفضل، شكراً لكل الدعم النفسي اللي قدمه لي.',
            date: 'منذ 10 أيام'
          },
          {
            id: 7,
            user: 'مستخدم',
            location: 'الخبر',
            comment: 'محترف جداً في التعامل مع حالات الاكتئاب، خطط العلاج فعالة ومنظمة.',
            date: 'منذ 3 أسابيع'
          },
          {
            id: 8,
            user: 'مستخدم وثق في منصتنا',
            location: 'الدوحة',
            comment: 'أنصح أي حد يمر بأزمة نفسية يتواصل مع د. عمرو، خبرته كبيرة وأسلوبه راقي.',
            date: 'منذ شهرين'
          }
        ]
      }
    }
  },
  computed: {
    visibleQualifications() {
      if (this.showMoreAbout) return this.therapist.qualifications;
      return this.therapist.qualifications.slice(0, this.maxVisibleQualifications);
    },
    currentMonthName() {
      const months = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
      ];
      return months[this.currentMonth];
    },
    calendarDays() {
      const year = this.currentYear;
      const month = this.currentMonth;
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - (firstDay.getDay() + 2) % 7);

      const days = [];
      const today = new Date();
      
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        
        days.push({
          date: date.toISOString().split('T')[0],
          day: date.getDate(),
          isCurrentMonth: date.getMonth() === month,
          isToday: date.toDateString() === today.toDateString(),
          isSelected: this.selectedDate === date.toISOString().split('T')[0]
        });
      }
      
      return days;
    }
  },
  methods: {
    toggleAboutMore() {
      this.showMoreAbout = !this.showMoreAbout;
    },
    selectDate(date) {
      this.selectedDate = date;
      this.selectedTimeSlot = null;
    },
    selectTimeSlot(slot) {
      this.selectedTimeSlot = slot;
    },
    previousMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    bookAppointment() {
      if (this.selectedDate && this.selectedTimeSlot) {
        const dateObj = new Date(this.selectedDate);
        const formattedDate = dateObj.toLocaleDateString('ar-SA');
        
        alert(`تم حجز الموعد بنجاح!\nالتاريخ: ${formattedDate}\nالوقت: ${this.selectedTimeSlot.time}\nالمدة: ${this.selectedTimeSlot.duration}`);
        
        // Reset selection
        this.selectedDate = null;
        this.selectedTimeSlot = null;
      }
    },
    updateTestimonialPage() {
      const scrollContainer = this.$el.querySelector('.overflow-x-auto');
      if (scrollContainer) {
        const scrollLeft = scrollContainer.scrollLeft;
        const containerWidth = scrollContainer.clientWidth;
        this.currentTestimonialPage = Math.floor(scrollLeft / containerWidth) + 1;
      }
    }
  },
  mounted() {
    // Add scroll event listener for testimonials (mobile only)
    const scrollContainer = this.$el.querySelector('.overflow-x-auto');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', this.updateTestimonialPage);
    }
  },
  beforeUnmount() {
    // Remove event listener
    const scrollContainer = this.$el.querySelector('.overflow-x-auto');
    if (scrollContainer) {
      scrollContainer.removeEventListener('scroll', this.updateTestimonialPage);
    }
  }
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-custom {
  scrollbar-width: thin;
  scrollbar-color: #9EBF3B #f1f1f1;
}

.scrollbar-custom::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-custom::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.scrollbar-custom::-webkit-scrollbar-thumb {
  background: #9EBF3B;
  border-radius: 10px;
}

.scrollbar-custom::-webkit-scrollbar-thumb:hover {
  background: #8cad35;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* تحسينات للشاشات الصغيرة */
@media (max-width: 640px) {
  .min-w-max {
    min-width: max-content;
  }
}
</style>