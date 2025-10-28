<template>
  <section 
    ref="whySection"
    class="relative py-16 font-almarai transition-all duration-700 bg-gradient-to-br from-white via-gray-50/30 to-gray-100/20"
    :class="sectionClass"
  >
    <!-- خلفية ديكورية خفيفة -->
    <div class="absolute top-0 left-0 w-64 h-64 bg-[#9EBF3B]/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-0 w-72 h-72 bg-[#D6A29A]/5 rounded-full blur-3xl"></div>
    
    <div class="max-w-6xl mx-auto px-6 text-gray-700 relative z-10">
      <!-- العنوان -->
      <div class="inline-block relative text-center w-full mb-16">
        <h2 
          class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 transition-all duration-500 delay-100"
          :class="titleClass"
        >
          لماذا <span class="text-[#9EBF3B]">تختار منصتنا</span>
        </h2>
        <div
          class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#9EBF3B] to-[#D6A29A] rounded-full transition-all duration-500 delay-200"
          :class="lineClass"
        ></div>
      </div>

      <!-- التقسيم إلى قسمين -->
      <div class="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
        <!-- القسم الأيمن (المحتوى) -->
        <div class="flex-1 order-2 md:order-1 flex flex-col justify-between">
          <div class="flex flex-col gap-8 md:gap-12">
            <!-- معالجون معتمدون -->
            <div 
              class="flex flex-row items-center justify-start gap-6 transition-all duration-500 delay-50"
              :class="contentItemClass"
            >
              <div class="flex items-center justify-center">
                <img
                  src="http://localhost:5173/images/معالجون.svg"
                  alt="معالجون معتمدون"
                  class="w-20 h-20 md:w-24 md:h-24 transition-all duration-500"
                />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-semibold text-[#9EBF3B] mb-3">
                  معالجون معتمدون
                </h3>
                <p class="text-gray-600 leading-relaxed">
                  نخبة من الأخصائيين والمعالجين النفسيين الحاصلين على درجات علمية متقدمة وخبرة في مجالات متعددة.
                </p>
              </div>
            </div>

            <!-- سرية تامة -->
            <div 
              class="flex flex-row items-center justify-start gap-6 transition-all duration-500 delay-100"
              :class="contentItemClass"
            >
              <div class="flex items-center justify-center">
                <img
                  src="http://localhost:5173/images/سرية تامة.svg"
                  alt="سرية تامة"
                  class="w-20 h-20 md:w-24 md:h-24 transition-all duration-500"
                />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-semibold text-[#9EBF3B] mb-3">سرية تامة</h3>
                <p class="text-gray-600 leading-relaxed">
                  نحافظ على خصوصيتك. جميع الجلسات والمعلومات الشخصية محمية ولا يمكن لأي جهة الاطلاع عليها.
                </p>
              </div>
            </div>

            <!-- سهولة الاستخدام -->
            <div 
              class="flex flex-row items-center justify-start gap-6 transition-all duration-500 delay-150"
              :class="contentItemClass"
            >
              <div class="flex items-center justify-center">
                <img
                  src="http://localhost:5173/images/سهولة الاستخدام.svg"
                  alt="سهولة الاستخدام"
                  class="w-20 h-20 md:w-24 md:h-24 transition-all duration-500"
                />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-semibold text-[#9EBF3B] mb-3">
                  سهولة الاستخدام
                </h3>
                <p class="text-gray-600 leading-relaxed">
                  تجربة استخدام مريحة عبر تطبيقنا. ابدأ بالتسجيل وحجز الجلسات الفردية والجماعية وخاصية إرسال الرسائل.
                </p>
              </div>
            </div>

            <!-- مرونة في المواعيد -->
            <div 
              class="flex flex-row items-center justify-start gap-6 transition-all duration-500 delay-200"
              :class="contentItemClass"
            >
              <div class="flex items-center justify-center">
                <img
                  src="http://localhost:5173/images/مرونة في المواعيد.svg"
                  alt="مرونة في المواعيد"
                  class="w-20 h-20 md:w-24 md:h-24 transition-all duration-500"
                />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-semibold text-[#9EBF3B] mb-3">
                  مرونة في المواعيد
                </h3>
                <p class="text-gray-600 leading-relaxed">
                  اختر الوقت الذي يناسبك، واحجز جلستك بشكل مرن، وابدأ العلاج من أي مكان يناسبك دون تعارض مع التزاماتك.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- القسم الأيسر (الصورة) -->
        <div 
          class="flex-1 order-1 md:order-2 flex justify-center md:justify-end items-start transition-all duration-500 delay-50"
          :class="imageClass"
        >
          <div class="relative">
            <!-- الصورة بدون خلفية -->
            <img 
              src="http://localhost:5173/images/تنزيل.jpg" 
              alt="صورة الدكتور" 
              class="w-60 h-60 md:w-[400px] md:h-[500px] object-contain relative z-10 " 
            />
          </div>
        </div>
      </div>

      <!-- الزر خارج القسمين -->
      <div 
        class="mt-16 md:mt-20 text-center transition-all duration-500 delay-250"
        :class="buttonClass"
      >
        <button
          class="bg-[#9EBF3B] hover:bg-[#8CAF35] text-white font-semibold px-10 py-4 md:px-12 md:py-5 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-base md:text-lg"
        >
          إنشاء حساب
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import { useScrollAnimation } from '@/assets/js/animations.js'

export default {
  name: "WhyChooseUs",
  mixins: [useScrollAnimation],
  // لا حاجة لـ data() أو methods() لأنها موجودة في الميكسين
}
</script>

<style scoped>
/* تحسين الانتقالات */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* تحسين التجاوب */
@media (max-width: 768px) {
  .text-3xl {
    font-size: 1.75rem;
  }
  
  .text-xl {
    font-size: 1.1rem;
  }
  
  .gap-8 {
    gap: 1.5rem;
  }
  
  /* تصغير الصورة في الجوال */
  .w-60 {
    width: 15rem;
  }
  
  .h-60 {
    height: 15rem;
  }
}

/* تحسين الأداء للحركات المتكررة */
section {
  will-change: transform, opacity;
}

h2, div {
  will-change: transform, opacity;
}

/* تحسين مظهر الأيقونات */

</style>