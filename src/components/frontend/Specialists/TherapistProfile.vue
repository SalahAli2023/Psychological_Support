<template>
  <div class="font-almarai">
    <!-- Header -->
    <Header />

    <!-- Hero Section -->
    <Hero 
      :title="therapist.name"
      subtitle="احجز جلستك مع خبير الصحة النفسية المعتمد"
      :buttons="[
        { text: 'احجز جلستك الآن', icon: 'fas fa-calendar-check', primary: true },
        { text: 'عودة للمعالجين', icon: 'fas fa-arrow-right', primary: false }
      ]"
    />

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Breadcrumbs -->
      <nav class="mb-6">
        <ol class="flex items-center space-x-2 space-x-reverse text-sm">
          <li><router-link to="/" class="text-[#065f46] hover:text-[#047857]">الرئيسية</router-link></li>
          <li><i class="fas fa-chevron-left text-gray-400"></i></li>
          <li><router-link to="/therapists" class="text-[#065f46] hover:text-[#047857]">المعالجين</router-link></li>
          <li><i class="fas fa-chevron-left text-gray-400"></i></li>
          <li class="text-gray-600">{{ therapist.name }}</li>
        </ol>
      </nav>

      <div class="flex gap-8">
        <!-- Main Content -->
        <div class="flex-1">
          <!-- Therapist Profile -->
          <div class="p-6 bg-white rounded-xl shadow-md mb-8">
            <div class="flex gap-6">
              <!-- Profile Image -->
              <div class="relative">
                <img 
                  :src="therapist.image" 
                  :alt="therapist.name"
                  class="w-32 h-32 rounded-lg object-cover ring-4 ring-[#9EBF3B]"
                >
              </div>

              <!-- Therapist Info -->
              <div class="flex-1">
                <h1 class="text-3xl font-bold text-[#065f46] mb-2">
                  {{ therapist.name }}
                </h1>
                <p class="text-xl text-[#047857] font-semibold mb-4">
                  {{ therapist.title }}
                </p>

                <!-- Rating -->
                <div class="flex items-center gap-3 mb-4">
                  <div class="flex">
                    <i v-for="i in 5" :key="i" class="fas fa-star text-[#D6A29A] text-lg"></i>
                  </div>
                  <span class="text-[#059669] font-bold text-lg">
                    {{ therapist.rating }} / {{ therapist.totalSessions }} جلسة
                  </span>
                </div>

                <!-- Affiliation -->
                <p class="text-[#065f46] font-semibold mb-2">
                  معتمد من التحالف العربي لخبراء العلاج النفسي
                </p>

                <!-- Session Duration -->
                <p class="text-[#059669] font-medium mb-4">
                  مدة الجلسة : 45 دقيقة
                </p>

                <!-- Biography -->
                <p class="text-gray-700 leading-relaxed">
                  {{ therapist.biography }}
                </p>
              </div>
            </div>
          </div>

          <!-- About the Expert -->
          <div class="p-6 bg-white rounded-xl shadow-md mb-8">
            <div class="flex items-center gap-3 mb-4">
              <i class="fas fa-info-circle text-[#9EBF3B] text-xl"></i>
              <h2 class="text-2xl font-bold text-[#065f46]">عن الخبير</h2>
            </div>

            <div class="mb-6">
              <h3 class="text-lg font-semibold text-[#047857] mb-3">المؤهلات العلمية</h3>
              <ul class="space-y-2">
                <li v-for="qualification in visibleQualifications" :key="qualification" class="flex items-start gap-3">
                  <i class="fas fa-check-circle text-[#9EBF3B] mt-1"></i>
                  <span class="text-gray-700">{{ qualification }}</span>
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

          <!-- Testimonials -->
          <div class="p-6 bg-white rounded-xl shadow-md">
            <div class="flex items-center gap-3 mb-6">
              <i class="fas fa-star text-[#D6A29A] text-xl"></i>
              <h2 class="text-2xl font-bold text-[#065f46]">التقييمات</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div v-for="testimonial in therapist.testimonials" :key="testimonial.id" class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex items-center gap-2 mb-3">
                  <span class="text-[#065f46] font-semibold">{{ testimonial.user }}</span>
                  <span class="text-gray-500 text-sm">- {{ testimonial.location }}</span>
                </div>
                
                <div class="flex mb-3">
                  <i v-for="i in 5" :key="i" class="fas fa-star text-[#D6A29A]"></i>
                </div>

                <p class="text-gray-700 mb-3 italic">
                  "{{ testimonial.comment }}"
                </p>

                <div class="flex gap-1">
                  <i class="fas fa-quote-right text-[#9EBF3B]"></i>
                  <i class="fas fa-quote-right text-[#9EBF3B]"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Booking Sidebar - الألوان المحسنة فقط -->
        <div class="w-80">
          <div class="sticky top-8 p-6 bg-gradient-to-br from-white to-[#f8faf7] rounded-xl shadow-xl border border-[#9EBF3B]/30">
            <div class="mb-4">
              <h2 class="text-2xl font-bold text-[#065f46] bg-gradient-to-r from-[#9EBF3B]/10 to-[#D6A29A]/10 p-3 rounded-lg">احجز جلستك</h2>
              <p class="text-sm text-[#047857] mt-2 bg-white/50 p-2 rounded-lg">اختر التاريخ والوقت المناسبين لك</p>
            </div>

            <!-- Calendar -->
            <div class="mb-6 bg-white/80 rounded-lg p-3 border border-[#9EBF3B]/20">
              <div class="flex items-center justify-between mb-4">
                <button @click="previousMonth" class="p-2 rounded-lg hover:bg-[#9EBF3B]/20 text-[#065f46] transition-colors">
                  <i class="fas fa-chevron-right"></i>
                </button>
                <div class="text-center bg-[#9EBF3B]/10 rounded-lg px-4 py-2">
                  <div class="text-lg font-bold text-[#065f46]">{{ currentMonthName }}</div>
                  <div class="text-sm text-[#047857] font-medium">{{ currentYear }}</div>
                </div>
                <button @click="nextMonth" class="p-2 rounded-lg hover:bg-[#9EBF3B]/20 text-[#065f46] transition-colors">
                  <i class="fas fa-chevron-left"></i>
                </button>
              </div>

              <!-- Days of week -->
              <div class="grid grid-cols-7 gap-1 mb-2">
                <div v-for="day in daysOfWeek" :key="day" class="py-2 text-sm text-center text-[#047857] font-bold bg-[#9EBF3B]/10 rounded-lg">
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
                    'p-2 text-sm rounded-lg transition-all font-medium',
                    day.isCurrentMonth 
                      ? day.isSelected 
                        ? 'bg-gradient-to-br from-[#9EBF3B] to-[#D6A29A] text-white shadow-lg' 
                        : day.isToday
                          ? 'bg-[#D6A29A] text-white'
                          : 'text-[#065f46] hover:bg-[#9EBF3B]/20'
                      : 'text-gray-300',
                    day.isSelected ? 'ring-2 ring-[#9EBF3B]' : ''
                  ]"
                >
                  {{ day.day }}
                </button>
              </div>
            </div>

            <!-- Time Slots -->
            <div v-if="selectedDate" class="bg-white/80 rounded-lg p-3 border border-[#9EBF3B]/20">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-[#065f46]">اختر الموعد</h3>
                <span class="text-sm text-[#047857] bg-[#9EBF3B]/10 px-2 py-1 rounded-full">45 دقيقة</span>
              </div>
              <div class="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                <button 
                  v-for="slot in timeSlots" 
                  :key="slot.time"
                  @click="selectTimeSlot(slot)"
                  :class="[
                    'p-3 border rounded-lg transition-all flex items-center justify-between',
                    slot === selectedTimeSlot 
                      ? 'border-[#9EBF3B] bg-gradient-to-r from-[#9EBF3B]/10 to-[#D6A29A]/10 shadow-md' 
                      : 'border-gray-200 hover:border-[#9EBF3B] hover:bg-white'
                  ]"
                >
                  <div class="flex items-center gap-2">
                    <i class="far fa-clock text-[#047857]"></i>
                    <span class="font-semibold text-[#065f46]">{{ slot.time }}</span>
                  </div>
                  <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{{ slot.duration }}</span>
                </button>
              </div>

              <!-- Book Button -->
              <button 
                v-if="selectedTimeSlot"
                @click="bookAppointment"
                class="w-full mt-4 bg-gradient-to-r from-[#9EBF3B] to-[#D6A29A] hover:from-[#8cad35] hover:to-[#c9928a] text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                <div class="flex items-center justify-center gap-2">
                  <i class="fas fa-calendar-check"></i>
                  <span>تأكيد الحجز</span>
                  <i class="fas fa-arrow-left text-sm"></i>
                </div>
              </button>
            </div>

            <!-- No Selection Message -->
            <div v-if="!selectedDate" class="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
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
            comment: 'بجد كنت محتاج حد يسمعني من غير ما يلومني. د. عمرو خلاني أتكلم براحة وحسيت إن فيه أمل إني أغير.'
          },
          {
            id: 2,
            user: 'مستخدم وثق في منصتنا',
            location: 'الرياض',
            comment: 'تجربة مختلفة بصراحة. أسلوب د. عمرو واقعي وعملي، عطاني خطوات واضحة حسيت معها بتحسن حقيقي.'
          },
          {
            id: 3,
            user: 'مستخدم',
            location: 'دبي',
            comment: 'كنت مضطر أتعامل مع قلق شديد، د. عمرو حط لي خطة علاج منظمة وواضحة، الحمد لله النتائج ممتازة.'
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
    }
  },
  mounted() {
    // Auto-select today's date on page load
    const today = new Date().toISOString().split('T')[0];
    this.selectDate(today);
  }
}
</script>