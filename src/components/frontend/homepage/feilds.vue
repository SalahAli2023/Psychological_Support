<template>
  <!-- قسم مجالات التخصص -->
  <section class="relative py-16 bg-white font-almarai" dir="rtl">
    <div class="max-w-6xl mx-auto px-6">
      <!-- العنوان الرئيسي -->
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          <span class="text-[#9EBF3B]">مجالات </span>
          <span class="text-gray-800">  </span>
          <span class="text-[#D6A29A]">تخصصنا </span>
        </h2>
        <p class="text-gray-600 max-w-xl mx-auto">
          نقدم خدمات متخصصة في مختلف مجالات الصحة النفسية
        </p>
      </div>

      <!-- مجالات التخصص -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="(specialty, index) in specialties" :key="index" 
             class="group relative bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-500 overflow-hidden">
          
          <!-- تأثير اللون المتحرك -->
          <div class="absolute inset-0 bg-gradient-to-l from-[#9EBF3B] to-[#D6A29A] opacity-0 group-hover:opacity-5 transform translate-x-full group-hover:translate-x-0 transition-all duration-700 ease-out"></div>
          
          <!-- أيقونة المجال -->
          <div class="relative z-10 w-12 h-12 bg-[#9EBF3B] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#D6A29A] transition-all duration-500">
            <i :class="specialty.icon" class="text-white group-hover:scale-110 transition-transform duration-300"></i>
          </div>

          <!-- محتوى المجال -->
          <div class="relative z-10">
            <h3 class="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#9EBF3B] transition-colors duration-500">
              {{ specialty.title }}
            </h3>
            <p class="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-500">
              {{ specialty.description }}
            </p>
          </div>

          <!-- خط سفلي متحرك -->
          <div class="absolute bottom-0 right-0 w-0 h-1 bg-gradient-to-l from-[#9EBF3B] to-[#D6A29A] group-hover:w-full transition-all duration-700 ease-out"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const specialties = [
  {
    icon: 'fas fa-sad-tear',
    title: 'القلق والاكتئاب',
    description: 'علاج اضطرابات القلق والاكتئاب بمختلف درجاتها باستخدام أحدث الأساليب العلاجية.'
  },
  {
    icon: 'fas fa-family',
    title: 'الاستشارات الأسرية',
    description: 'تحسين العلاقات الأسرية وحل النزاعات وتعزيز التواصل الفعال بين أفراد الأسرة.'
  },
  {
    icon: 'fas fa-user-graduate',
    title: 'صحة الأطفال والمراهقين',
    description: 'دعم الصحة النفسية للأطفال والمراهقين وعلاج المشكلات السلوكية والنفسية.'
  },
  {
    icon: 'fas fa-briefcase',
    title: 'الإرشاد المهني',
    description: 'مساعدة الأفراد في التغلب على ضغوط العمل وتحقيق التوازن بين الحياة الشخصية والمهنية.'
  },
  {
    icon: 'fas fa-trauma',
    title: 'الصدمات النفسية',
    description: 'علاج آثار الصدمات النفسية واضطراب ما بعد الصدمة باستخدام أساليب علاجية متخصصة.'
  },
  {
    icon: 'fas fa-brain',
    title: 'تعزيز الصحة النفسية',
    description: 'برامج وقائية وتنموية لتعزيز الصحة النفسية والمرونة النفسية لدى الأفراد.'
  }
]
</script>