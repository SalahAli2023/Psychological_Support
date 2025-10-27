<template>
  <header class="bg-mental-green-800 text-white">
    <!-- Top strip -->
    <div class="bg-mental-green-900 py-2 px-4">
      <div class="max-w-7xl mx-auto flex justify-between items-center text-sm">
        <div class="flex items-center space-x-4 space-x-reverse">
          <span class="text-white">English</span>
          <div class="flex space-x-2 space-x-reverse">
            <i class="fab fa-linkedin text-white hover:text-mental-green-400 cursor-pointer"></i>
            <i class="fab fa-twitter text-white hover:text-mental-green-400 cursor-pointer"></i>
            <i class="fab fa-facebook text-white hover:text-mental-green-400 cursor-pointer"></i>
            <i class="fab fa-instagram text-white hover:text-mental-green-400 cursor-pointer"></i>
            <i class="fab fa-whatsapp text-white hover:text-mental-green-400 cursor-pointer"></i>
            <i class="fas fa-envelope text-white hover:text-mental-green-400 cursor-pointer"></i>
          </div>
        </div>
        <div class="text-right">
          <span class="text-white">وعي للصحة النفسية | أقوى منصة للعلاج النفسي أونلاين في الوطن العربي - جلسات علاجية بسرية وأمان</span>
        </div>
      </div>
    </div>

    <!-- Main header -->
    <div class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <!-- Logo -->
          <div class="flex items-center">
            <div class="flex items-center space-x-2 space-x-reverse">
              <div class="w-8 h-8 bg-mental-green-800 rounded-lg flex items-center justify-center">
                <i class="fas fa-leaf text-mental-green-400 text-sm"></i>
              </div>
              <span class="text-2xl font-bold text-mental-green-800">وعي</span>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="flex space-x-8 space-x-reverse">
            <router-link 
              to="/" 
              class="text-mental-green-800 hover:text-mental-green-600 font-semibold transition-colors"
              :class="{ 'border-b-2 border-mental-green-500': $route.path === '/' }"
            >
              الرئيسية
            </router-link>
            <a href="#" class="text-gray-600 hover:text-mental-green-600 font-semibold transition-colors">
              التخصصات
            </a>
            <router-link 
              to="/" 
              class="text-mental-green-800 hover:text-mental-green-600 font-semibold transition-colors"
              :class="{ 'border-b-2 border-mental-green-500': $route.path === '/' }"
            >
              المعالجين
            </router-link>
            <a href="#" class="text-gray-600 hover:text-mental-green-600 font-semibold transition-colors">
              المدونة
            </a>
            <a href="#" class="text-gray-600 hover:text-mental-green-600 font-semibold transition-colors">
              أسئلة شائعة
            </a>
            <a href="#" class="text-gray-600 hover:text-mental-green-600 font-semibold transition-colors">
              اجابات الخبراء
            </a>
          </nav>

          <!-- CTA Buttons -->
          <div class="flex space-x-3 space-x-reverse">
            <button class="btn-primary">
              احجز موعد
            </button>
            <button class="btn-secondary">
              انضم كخبير
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

