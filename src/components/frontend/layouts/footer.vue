<template>
  <!-- Footer احترافي -->
  <footer class="bg-gradient-to-br from-slate-900 to-gray-900 text-white relative overflow-hidden">
    <!-- شكل زخرفي -->
    <div class="absolute top-0 left-0 w-72 h-72 bg-[#9EBF3B] opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-[#D6A29A] opacity-5 rounded-full translate-x-1/3 translate-y-1/3"></div>
    
    <div class="relative z-10">
      <!-- قسم النشرة الإخبارية -->
      <div class="border-b border-gray-700/50">
        <div class="max-w-7xl mx-auto px-6 py-16">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="text-center lg:text-right">
              <h2 class="text-3xl font-bold mb-4">
                <span class="text-white">ابقَ على </span>
                <span class="text-[#9EBF3B]">اتصال</span>
              </h2>
              <p class="text-gray-300 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                انضم إلى مجتمعنا واحصل على آخر التحديثات والمقالات الحصرية حول الصحة النفسية والعقلية
              </p>
            </div>
            
            <div class="flex justify-center lg:justify-start">
              <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl w-full max-w-md">
                <form class="space-y-4">
                  <div>
                    <label class="block text-gray-300 text-sm font-medium mb-2 text-right">البريد الإلكتروني</label>
                    <input 
                      type="email" 
                      placeholder="example@email.com"
                      class="w-full px-4 py-3 bg-white/5 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#9EBF3B] focus:ring-2 focus:ring-[#9EBF3B] focus:ring-opacity-20 transition-all duration-300"
                      required
                    >
                  </div>
                  <button 
                    type="submit"
                    class="w-full bg-gradient-to-r from-[#9EBF3B] to-emerald-500 hover:from-emerald-500 hover:to-[#9EBF3B] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-md"
                  >
                    <span class="flex items-center justify-center gap-2">
                      <i class="fas fa-paper-plane"></i>
                      اشترك في النشرة
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
              <div class="w-14 h-14 bg-gradient-to-br from-[#9EBF3B] to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <i class="fas fa-heart text-white text-xl"></i>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-white">نفسي</h3>
                <p class="text-[#9EBF3B] text-sm font-medium">منصة الدعم النفسي</p>
              </div>
            </div>
            <p class="text-gray-300 mb-6 leading-relaxed text-lg">
              منصة رائدة في تقديم خدمات الدعم النفسي والاستشارات المتخصصة. 
              نؤمن بأن الصحة النفسية هي أساس الحياة المتوازنة والمستقرة.
            </p>
            <div class="flex gap-3">
              <a href="#" class="group w-12 h-12 bg-white/5 hover:bg-[#9EBF3B] rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg border border-white/10">
                <i class="fab fa-facebook-f text-gray-400 group-hover:text-white"></i>
              </a>
              <a href="#" class="group w-12 h-12 bg-white/5 hover:bg-[#9EBF3B] rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg border border-white/10">
                <i class="fab fa-twitter text-gray-400 group-hover:text-white"></i>
              </a>
              <a href="#" class="group w-12 h-12 bg-white/5 hover:bg-[#9EBF3B] rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg border border-white/10">
                <i class="fab fa-instagram text-gray-400 group-hover:text-white"></i>
              </a>
              <a href="#" class="group w-12 h-12 bg-white/5 hover:bg-[#9EBF3B] rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg border border-white/10">
                <i class="fab fa-linkedin-in text-gray-400 group-hover:text-white"></i>
              </a>
              <a href="#" class="group w-12 h-12 bg-white/5 hover:bg-[#9EBF3B] rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg border border-white/10">
                <i class="fab fa-youtube text-gray-400 group-hover:text-white"></i>
              </a>
            </div>
          </div>

          <!-- روابط سريعة -->
          <div>
            <h4 class="text-lg font-bold text-white mb-6 pb-3 border-b-2 border-[#9EBF3B] inline-block">الروابط</h4>
            <ul class="space-y-3">
              <li>
                <a href="#" class="text-gray-300 hover:text-[#9EBF3B] transition-all duration-300 flex items-center gap-3 group">
                  <i class="fas fa-chevron-left text-[#9EBF3B] text-xs group-hover:translate-x-1 transition-transform"></i>
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-[#9EBF3B] transition-all duration-300 flex items-center gap-3 group">
                  <i class="fas fa-chevron-left text-[#9EBF3B] text-xs group-hover:translate-x-1 transition-transform"></i>
                  من نحن
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-[#9EBF3B] transition-all duration-300 flex items-center gap-3 group">
                  <i class="fas fa-chevron-left text-[#9EBF3B] text-xs group-hover:translate-x-1 transition-transform"></i>
                  خدماتنا
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-[#9EBF3B] transition-all duration-300 flex items-center gap-3 group">
                  <i class="fas fa-chevron-left text-[#9EBF3B] text-xs group-hover:translate-x-1 transition-transform"></i>
                  المدونة
                </a>
              </li>
            </ul>
          </div>

          <!-- الخدمات -->
          <div>
            <h4 class="text-lg font-bold text-white mb-6 pb-3 border-b-2 border-[#D6A29A] inline-block">خدماتنا</h4>
            <ul class="space-y-3">
              <li>
                <a href="#" class="text-gray-300 hover:text-[#D6A29A] transition-all duration-300 flex items-center gap-3 group">
                  <i class="fas fa-comments text-[#D6A29A] text-sm"></i>
                  جلسات الدعم
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-[#D6A29A] transition-all duration-300 flex items-center gap-3 group">
                  <i class="fas fa-user-md text-[#D6A29A] text-sm"></i>
                  الاستشارات
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-[#D6A29A] transition-all duration-300 flex items-center gap-3 group">
                  <i class="fas fa-users text-[#D6A29A] text-sm"></i>
                  الورش التدريبية
                </a>
              </li>
              <li>
                <a href="#" class="text-gray-300 hover:text-[#D6A29A] transition-all duration-300 flex items-center gap-3 group">
                  <i class="fas fa-book text-[#D6A29A] text-sm"></i>
                  الموارد
                </a>
              </li>
            </ul>
          </div>

          <!-- اتصل بنا -->
          <div>
            <h4 class="text-lg font-bold text-white mb-6 pb-3 border-b-2 border-[#9EBF3B] inline-block">اتصل بنا</h4>
            <div class="space-y-4">
              <div class="flex items-center gap-3 text-gray-300">
                <div class="w-10 h-10 bg-[#9EBF3B] rounded-lg flex items-center justify-center">
                  <i class="fas fa-phone text-white text-sm"></i>
                </div>
                <div>
                  <p class="text-sm text-gray-400">الهاتف</p>
                  <p class="font-medium">+966 123 456 789</p>
                </div>
              </div>
              <div class="flex items-center gap-3 text-gray-300">
                <div class="w-10 h-10 bg-[#D6A29A] rounded-lg flex items-center justify-center">
                  <i class="fas fa-envelope text-white text-sm"></i>
                </div>
                <div>
                  <p class="text-sm text-gray-400">البريد الإلكتروني</p>
                  <p class="font-medium">info@nafsy.com</p>
                </div>
              </div>
              <div class="flex items-center gap-3 text-gray-300">
                <div class="w-10 h-10 bg-[#9EBF3B] rounded-lg flex items-center justify-center">
                  <i class="fas fa-map-marker-alt text-white text-sm"></i>
                </div>
                <div>
                  <p class="text-sm text-gray-400">العنوان</p>
                  <p class="font-medium">الرياض، السعودية</p>
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
                &copy; 2024 <span class="text-[#9EBF3B]">منصة نفسي</span>. جميع الحقوق محفوظة.
              </p>
            </div>
            <div class="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#" class="text-gray-400 hover:text-[#9EBF3B] transition-colors">شروط الاستخدام</a>
              <a href="#" class="text-gray-400 hover:text-[#9EBF3B] transition-colors">سياسة الخصوصية</a>
              <a href="#" class="text-gray-400 hover:text-[#9EBF3B] transition-colors">الأسئلة الشائعة</a>
              <a href="#" class="text-gray-400 hover:text-[#9EBF3B] transition-colors">اتصل بنا</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// يمكن إضافة دوال الاشتراك هنا
</script>