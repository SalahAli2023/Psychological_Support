<template>
  <!-- قسم الأسئلة الشائعة -->
  <section 
    ref="sectionRef"
    class="relative py-20 bg-white font-almarai overflow-hidden transition-all duration-1000"
    :class="sectionClass"
  >
    <!-- أشكال زخرفية في الخلفية -->
    <div 
      class="absolute top-10 left-10 w-32 h-32 bg-[#D6A29A] opacity-5 rounded-full blur-2xl transition-all duration-1000 delay-300"
      :class="decorativeClass"
    ></div>
    <div 
      class="absolute bottom-10 right-10 w-40 h-40 bg-[#9EBF3B] opacity-5 rounded-full blur-2xl transition-all duration-1000 delay-500"
      :class="decorativeClass"
    ></div>
    <!-- شكل زخرفي إضافي -->
    <div 
      class="absolute top-1/2 left-1/4 w-24 h-24 bg-[#D6A29A] opacity-3 rounded-full blur-xl transition-all duration-1000 delay-700"
      :class="decorativeClass"
    ></div>

    <div class="relative z-10 max-w-6xl mx-auto px-6">
      <!-- العنوان الرئيسي -->
      <header class="text-center mb-16">
        <div class="inline-block relative">
          <h2 
            class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 transition-all duration-700"
            :class="titleClass"
          >
            الأسئلة <span class="text-[#D6A29A]">الشائعة</span>
          </h2>
          <!-- الخط الزخرفي تحت العنوان -->
          <div 
            class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-[#D6A29A] rounded-full transition-all duration-700"
            :class="lineClass"
          ></div>
        </div>
        <p 
          class="text-lg text-gray-600 max-w-2xl mx-auto mt-4 transition-all duration-700"
          :class="contentItemClass"
        >
          إليك إجابات للأسئلة التي يطرحها عملاؤنا بشكل متكرر. إذا لم تجد إجابة لسؤالك، لا تتردد في التواصل معنا.
        </p>
      </header>

      <!-- شبكة الأسئلة - 4 يمين و 4 يسار -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <!-- العمود الأيمن - 4 أسئلة -->
        <div class="space-y-4">
          <article 
            v-for="(faq, index) in leftFaqs" 
            :key="faq.id"
            class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden border border-gray-100"
            :class="{ 
              'ring-2 ring-[#D6A29A] ring-opacity-50 shadow-lg': openQuestionId === faq.id,
              'opacity-0 translate-y-8': !isVisible,
              'opacity-100 translate-y-0': isVisible
            }"
            :style="{ 
              transitionDelay: `${index * 100 + 300}ms`
            }"
          >
            <!-- زر السؤال -->
            <button 
              @click="toggleQuestion(faq.id)"
              class="w-full px-6 py-5 text-right flex items-center justify-between text-gray-800 font-semibold hover:text-[#D6A29A] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D6A29A] focus:ring-opacity-50"
              :class="{ 'text-[#D6A29A]': openQuestionId === faq.id }"
            >
              <span class="flex items-center gap-3 text-right">
                <!-- رقم السؤال -->
                <span 
                  class="flex-shrink-0 w-8 h-8 rounded-full bg-[#D6A29A] text-white text-sm flex items-center justify-center font-bold transition-all duration-300 transform hover:scale-110"
                  :class="{ 'scale-0': !isVisible, 'scale-100': isVisible }"
                  :style="{ transitionDelay: `${index * 100 + 500}ms` }"
                >
                  {{ faq.id }}
                </span>
                <span class="text-base font-semibold">{{ faq.question }}</span>
              </span>
              
              <!-- أيقونة السهم للتوسيع/الطي -->
              <div class="flex items-center gap-2">
                <svg 
                  class="w-5 h-5 transition-transform duration-300" 
                  :class="{ 'rotate-180 text-[#D6A29A]': openQuestionId === faq.id, 'text-gray-400': openQuestionId !== faq.id }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            <!-- الإجابة (تظهر فقط عند النقر) -->
            <div 
              v-show="openQuestionId === faq.id"
              class="overflow-hidden transition-all duration-500 ease-in-out"
            >
              <div class="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100">
                <p class="text-base">{{ faq.answer }}</p>
              </div>
            </div>
          </article>
        </div>

        <!-- العمود الأيسر - 4 أسئلة -->
        <div class="space-y-4">
          <article 
            v-for="(faq, index) in rightFaqs" 
            :key="faq.id"
            class="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-500 overflow-hidden border border-gray-100"
            :class="{ 
              'ring-2 ring-[#D6A29A] ring-opacity-50 shadow-lg': openQuestionId === faq.id,
              'opacity-0 translate-y-8': !isVisible,
              'opacity-100 translate-y-0': isVisible
            }"
            :style="{ 
              transitionDelay: `${(index + 4) * 100 + 300}ms`
            }"
          >
            <!-- زر السؤال -->
            <button 
              @click="toggleQuestion(faq.id)"
              class="w-full px-6 py-5 text-right flex items-center justify-between text-gray-800 font-semibold hover:text-[#D6A29A] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D6A29A] focus:ring-opacity-50"
              :class="{ 'text-[#D6A29A]': openQuestionId === faq.id }"
            >
              <span class="flex items-center gap-3 text-right">
                <!-- رقم السؤال -->
                <span 
                  class="flex-shrink-0 w-8 h-8 rounded-full bg-[#D6A29A] text-white text-sm flex items-center justify-center font-bold transition-all duration-300 transform hover:scale-110"
                  :class="{ 'scale-0': !isVisible, 'scale-100': isVisible }"
                  :style="{ transitionDelay: `${(index + 4) * 100 + 500}ms` }"
                >
                  {{ faq.id }}
                </span>
                <span class="text-base font-semibold">{{ faq.question }}</span>
              </span>
              
              <!-- أيقونة السهم للتوسيع/الطي -->
              <div class="flex items-center gap-2">
                <svg 
                  class="w-5 h-5 transition-transform duration-300" 
                  :class="{ 'rotate-180 text-[#D6A29A]': openQuestionId === faq.id, 'text-gray-400': openQuestionId !== faq.id }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            
            <!-- الإجابة (تظهر فقط عند النقر) -->
            <div 
              v-show="openQuestionId === faq.id"
              class="overflow-hidden transition-all duration-500 ease-in-out"
            >
              <div class="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100">
                <p class="text-base">{{ faq.answer }}</p>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- قسم الاتصال الإضافي مع خلفية -->
      <div 
        class="relative rounded-3xl overflow-hidden"
        :class="buttonClass"
      >
        <!-- خلفية متصلة -->
        <div class="absolute inset-0 bg-[#9EBF3B]"></div>
        
        <!-- أشكال زخرفية في الخلفية -->
        <div class="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div class="absolute bottom-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        
        <!-- المحتوى -->
        <div class="relative z-10 text-center text-white p-12">
          <h3 class="text-2xl md:text-3xl font-bold mb-4">لم تجد إجابة لسؤالك؟</h3>
          <p class="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            فريقنا مستعد للإجابة على جميع استفساراتك
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              class="bg-white text-[#9EBF3B] font-bold py-4 px-8 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform"
              :class="{ 'opacity-0 translate-y-4': !isVisible, 'opacity-100 translate-y-0 hover:scale-105': isVisible }"
              style="transition-delay: 1100ms"
            >
              <span class="flex items-center gap-2">
                اتصل بنا الآن
                <i class="fas fa-phone"></i>
              </span>
            </button>
            <button 
              class="bg-transparent text-white font-bold py-4 px-8 rounded-xl border-2 border-white hover:bg-white hover:text-[#9EBF3B] transition-all duration-300 shadow-lg hover:shadow-xl transform"
              :class="{ 'opacity-0 translate-y-4': !isVisible, 'opacity-100 translate-y-0 hover:scale-105': isVisible }"
              style="transition-delay: 1200ms"
            >
              <span class="flex items-center gap-2">
                راسلنا على الواتساب
                <i class="fab fa-whatsapp"></i>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { useScrollAnimation } from '@/assets/js/animations.js'

export default {
  name: "FAQSection",
  mixins: [useScrollAnimation],
  data() {
    return {
      // بيانات الأسئلة الشائعة
      faqs: [
        {
          id: 1,
          question: "ما هي مدة الجلسة العلاجية؟",
          answer: "مدة الجلسة العلاجية النموذجية هي 50 دقيقة. نوصي بالحضور بانتظام لتحقيق أفضل النتائج، ولكن يمكننا مناقشة وتعديل التكرار بناءً على احتياجاتك وأهدافك الشخصية."
        },
        {
          id: 2,
          question: "هل الاستشارات العلاجية سرية تمامًا؟",
          answer: "نعم، تمامًا. جميع المعلومات التي تشاركها خلال الجلسات محمية بموجب قوانين السرية الصارمة. لا يمكن مشاركة أي معلومات مع أي طرف ثالث دون موافقتك الخطية، باستثناء الحالات التي ينص فيها القانون على خلاف ذلك."
        },
        {
          id: 3,
          question: "كيف يمكنني حجز موعد؟",
          answer: "يمكنك حجز موعد بسهولة من خلال ملء نموذج الاتصال بموقعنا، أو الاتصال بنا مباشرة على الأرقام المدرجة. سيقوم فريقنا بالرد عليك لتأكيد الموعد والمناسب لك."
        },
        {
          id: 4,
          question: "ما هو الفرق بين الطبيب النفسي والمعالج النفسي؟",
          answer: "الطبيب النفسي هو طبيب يمكنه تشخيص الحالات النفسية ووصف الأدوية، بينما يركز المعالج النفسي على تقديم العلاج بالكلام واستراتيجيات المواجهة. في كثير من الحالات، قد يكون التعاون بين الاثنين هو الأكثر فائدة."
        },
        {
          id: 5,
          question: "هل يمكنني الحصول على استشارة أونلاين؟",
          answer: "نعم، نوفر جلسات استشارية أونلاين عبر منصات آمنة ومشفرة. يمكنك اختيار النمط الذي يناسبك سواء كان وجهاً لوجه في العيادة أو عبر الإنترنت مع الحفاظ على نفس مستوى الجودة والسرية."
        },
        {
          id: 6,
          question: "كم تكلفة الجلسة العلاجية؟",
          answer: "تختلف تكلفة الجلسات حسب نوع الخدمة والأخصائي. نقدم خطط أسعار متنوعة تناسب مختلف الميزانيات، ويمكنك الاطلاع على الأسعار من خلال صفحة الخدمات."
        },
        {
          id: 7,
          question: "هل يمكنني تغيير الأخصائي؟",
          answer: "نعم، يمكنك تغيير الأخصائي في أي وقت إذا شعرت أن هناك عدم توافق. فريقنا سيساعدك في العثور على الأخصائي المناسب لاحتياجاتك."
        },
        {
          id: 8,
          question: "ما هي طرق الدفع المتاحة؟",
          answer: "نقبل多种 طرق الدفع including البطاقات الائتمانية, التحويل البنكي, ومدفوعات عبر الإنترنت. جميع المعاملات آمنة ومشفرة."
        }
      ],
      // لتتبع السؤال المفتوح حاليًا
      openQuestionId: null
    }
  },
  computed: {
    decorativeClass() {
      return {
        'opacity-5 scale-100': this.isVisible,
        'opacity-0 scale-50': !this.isVisible
      }
    },
    // تقسيم الأسئلة إلى عمودين
    leftFaqs() {
      return this.faqs.slice(0, 4)
    },
    rightFaqs() {
      return this.faqs.slice(4, 8)
    }
  },
  mounted() {
    // فتح أول سؤال تلقائياً عند تحميل الصفحة
    this.openQuestionId = 1
  },
  methods: {
    // دالة لفتح أو إغلاق الإجابة
    toggleQuestion(id) {
      this.openQuestionId = this.openQuestionId === id ? null : id
    }
  }
}
</script>

<style scoped>
/* تحسين الانتقالات */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* تأثير انتقالي سلس للإجابات */
.overflow-hidden {
  transition: max-height 0.5s ease-in-out;
}

/* تحسين التجاوب */
@media (max-width: 768px) {
  .text-3xl {
    font-size: 2rem;
  }
  
  .text-lg {
    font-size: 1rem;
  }
}

/* تأثيرات إضافية للأسئلة */
article {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

article:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* تأثير على الأرقام الدائرية */
.w-8.h-8 {
  transition: all 0.3s ease;
}

.w-8.h-8:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(214, 162, 154, 0.3);
}
</style>