<template>
  <div >
    <!-- الهيدر -->
    <Header />

    <!-- Hero -->
    <Hero
      title="تواصــل معنا"
      highlight="وسنسعد بخدمتك"
      subtitle="نحن هنا للإجابة عن استفساراتك ومساعدتك في أي وقت"

           :buttons="[
        { text: 'ابدأ الرحلة', icon: 'fas fa-play-circle', primary: true },
        { text: 'المزيد عنا', icon: 'fas fa-info-circle', primary: false }

      ]"
    />

    <!-- قسم التواصل -->
    <section class="py-16 bg-white font-almarai">
      <div class="max-w-6xl mx-auto px-6">
        <!-- معلومات التواصل -->
        <div class="grid md:grid-cols-3 gap-6 mb-12">
          <!-- بطاقة الهاتف -->
          <div
            class="flex items-center gap-4 p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div
              class="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-tr from-primary-green to-secondary-green text-white text-2xl"
            >
              <i class="fa-solid fa-phone"></i>
            </div>
            <div>
              <h4 class="font-semibold text-gray-800">الهاتف</h4>
              <p class="text-gray-500 text-sm">+967 777777777</p>
            </div>
          </div>

          <!-- بطاقة البريد -->
          <div
            class="flex items-center gap-4 p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div
              class="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-tr from-primary-green to-secondary-green text-white text-2xl"
            >
              <i class="fa-solid fa-envelope"></i>
            </div>
            <div>
              <h4 class="font-semibold text-gray-800">البريد الإلكتروني</h4>
              <p class="text-gray-500 text-sm">farhm@example.com</p>
            </div>
          </div>

          <!-- بطاقة الموقع -->
          <div
            class="flex items-center gap-4 p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div
              class="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-tr from-primary-green to-secondary-green text-white text-2xl"
            >
              <i class="fa-solid fa-map-location-dot"></i>
            </div>
            <div>
              <h4 class="font-semibold text-gray-800">الموقع</h4>
              <p class="text-gray-500 text-sm">اليمن - تعز</p>
            </div>
          </div>
        </div>

        <!-- نموذج الإرسال -->
        <div>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">أرسل رسالة</h2>
          <div class="w-10 h-[2px] bg-primary-green mb-6 rounded-full"></div>

          <form class="space-y-6">
            <div class="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="الاسم الكامل"
                class="w-full border border-gray-200 rounded-full px-5 py-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all"
              />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                class="w-full border border-gray-200 rounded-full px-5 py-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all"
              />
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="الموضوع"
                class="w-full border border-gray-200 rounded-full px-5 py-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all"
              />
              <input
                type="text"
                placeholder="نوع الرسالة"
                class="w-full border border-gray-200 rounded-full px-5 py-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all"
              />
            </div>

            <textarea
              rows="5"
              placeholder="اكتب رسالتك هنا..."
              class="w-full border border-gray-200 rounded-xl px-5 py-3 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition-all"
            ></textarea>

          <div class="flex justify-start">
  <button
    type="submit"
    class="px-8 py-3 rounded-2xl bg-gradient-to-tr from-primary-green to-secondary-green text-white font-semibold hover:opacity-90 transition-all shadow-md"
  >
    إرسال الرسالة
  </button>
</div>

          </form>
        </div>
      </div>
    </section>

    <!-- الفوتر -->
    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/frontend/layouts/header.vue'
import Footer from '@/components/frontend/layouts/footer.vue'
import Hero from '@/components/frontend/layouts/hero.vue'
</script>

<!-- لا تستخدم scoped -->
<style>
/* يمكن إضافة أي تخصيص عام هنا */
</style>