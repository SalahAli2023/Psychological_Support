<template>
  <section class="relative py-16 bg-gradient-to-br from-[#9EBF3B]/10 via-[#D6A29A]/10 to-white font-almarai text-gray-800 overflow-hidden">
    <div class="absolute top-0 left-0 w-72 h-72 bg-[#9EBF3B] opacity-10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-0 w-80 h-80 bg-[#D6A29A] opacity-10 rounded-full blur-3xl"></div>

    <div class="max-w-6xl mx-auto px-4 text-center relative z-10">
      <!-- العنوان -->
      <h2 class="text-3xl md:text-4xl font-bold mb-12">الأرقام</h2>

      <!-- الأرقام -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <!-- الرقم 1 -->
        <div class="flex flex-col items-center">
          <img src="/images/دولة.png" alt="خريطة" class="w-20 mb-4">
          <span class="text-3xl font-bold">12</span>
          <p class="mt-2 text-gray-600">دولة نغطيها حالياً</p>
        </div>

        <!-- الرقم 2 -->
        <div class="flex flex-col items-center">
          <img src="/images/سؤال.png" alt="سؤال" class="w-20 mb-4">
          <span class="text-3xl font-bold">4,500+</span>
          <p class="mt-2 text-gray-600">سؤال تمت الإجابة عليه من خبراء</p>
        </div>

        <!-- الرقم 3 -->
        <div class="flex flex-col items-center">
          <img src="/images/جلسات.png" alt="جلسة" class="w-20 mb-4">
          <span class="text-3xl font-bold">2,105+</span>
          <p class="mt-2 text-gray-600">جلسات أونلاين علاجية ناجحة</p>
        </div>

        <!-- الرقم 4 -->
        <div class="flex flex-col items-center">
          <img src="/images/مستخدمون.png" alt="مستخدمين" class="w-20 mb-4">
          <span class="text-3xl font-bold">3,320+</span>
          <p class="mt-2 text-gray-600">مستخدم وثق في منصتنا</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "StatsSection",
};
</script>

