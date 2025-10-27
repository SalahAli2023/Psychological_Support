<template>
  <section class="relative py-16 bg-white font-almarai" >
    <div class="max-w-6xl mx-auto px-6 text-gray-700">
   <div class="inline-block relative text-center w-full">
  <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
    لماذا <span class="text-[#9EBF3B]">تختار منصتنا</span>
  </h2>
  <div
    class="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#9EBF3B] to-[#D6A29A] rounded-full"
  ></div>
</div>


      <!-- التقسيم إلى قسمين -->
      <div class="flex flex-col md:flex-row items-center md:items-start gap-12">
        <!-- القسم الأيمن (المحتوى) -->
        <div class="flex-1 order-2 md:order-1 flex flex-col justify-between">
          <div class="flex flex-col gap-12">

            <!-- معالجون معتمدون -->
            <div class="flex flex-row items-center justify-start gap-6">
              <img
                src="http://localhost:5173/images/معالجون.svg"
                alt="معالجون معتمدون"
                class="w-20 h-20"
              />
              <div class="text-right">
                <h3 class="text-xl font-semibold text-primary-green">
                  معالجون معتمدون
                </h3>
                <p class="text-gray-600 leading-relaxed">
                  نخبة من الأخصائيين والمعالجين النفسيين الحاصلين على درجات علمية متقدمة وخبرة في مجالات متعددة.
                </p>
              </div>
            </div>

            <!-- سرية تامة -->
            <div class="flex flex-row items-center justify-start gap-6">
              <img
                src="http://localhost:5173/images/سرية تامة.svg"
                alt="سرية تامة"
                class="w-20 h-20"
              />
              <div class="text-right">
                <h3 class="text-xl font-semibold text-primary-green">سرية تامة</h3>
                <p class="text-gray-600 leading-relaxed">
                  نحافظ على خصوصيتك. جميع الجلسات والمعلومات الشخصية محمية ولا يمكن لأي جهة الاطلاع عليها.
                </p>
              </div>
            </div>

            <!-- سهولة الاستخدام -->
            <div class="flex flex-row items-center justify-start gap-6">
              <img
                src="http://localhost:5173/images/سهولة الاستخدام.svg"
                alt="سهولة الاستخدام"
                class="w-20 h-20"
              />
              <div class="text-right">
                <h3 class="text-xl font-semibold text-primary-green">
                  سهولة الاستخدام
                </h3>
                <p class="text-gray-600 leading-relaxed">
                  تجربة استخدام مريحة عبر تطبيقنا. ابدأ بالتسجيل وحجز الجلسات الفردية والجماعية وخاصية إرسال الرسائل.
                </p>
              </div>
            </div>

            <!-- مرونة في المواعيد -->
            <div class="flex flex-row items-center justify-start gap-6">
              <img
                src="http://localhost:5173/images/مرونة في المواعيد.svg"
                alt="مرونة في المواعيد"
                class="w-20 h-20"
              />
              <div class="text-right">
                <h3 class="text-xl font-semibold text-primary-green">
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
      <div class="flex-1 order-1 md:order-2 flex justify-center md:justify-end items-start"> <img src="http://localhost:5173/images/تنزيل.jpg" alt="صورة الدكتور" class="w-80 md:w-[420px] h-auto max-h-[500px] object-contain " /> </div>
      </div>

      <!-- الزر خارج القسمين -->
      <div class="mt-20 text-center">
        <button
          class="bg-primary-green hover:bg-primary-pink text-white font-semibold px-10 py-4 rounded-md transition"
        >
          إنشاء حساب
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
// لا حاجة لجافاسكربت هنا
</script>
