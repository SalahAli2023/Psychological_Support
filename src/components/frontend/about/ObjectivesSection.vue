
<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
          أهدافنا <span class="text-[#9EBF3B]">وغاياتنا</span>
        </h2>

        <p class="text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in-delay">

          نسعى لتحقيق أهداف طموحة تساهم في دعم وحماية المرأة والطفل والفئات المهمشة في اليمن
        </p>
      </div>

      <!-- الأهداف الفرعية -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div 
          v-for="(objective, index) in objectives" 
          :key="index"
          class="flex items-start gap-4 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 animate-slide-up"
          :style="`animation-delay: ${index * 0.1}s`"
        >
          <!-- الرقم الدائري -->
          <div class="w-12 h-12 bg-[#D6A29A] rounded-xl flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300 group-hover:scale-110">

            <span class="text-white font-bold text-base">{{ index + 1 }}</span>
          </div>
          
          <!-- النص -->
          <p class="text-gray-700 text-base leading-relaxed flex-1">

            {{ objective }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const objectives = [
  'المساهمة في تعزيز الوعي المجتمعي حول قضايا المرأة والطفل في اليمن من خلال البرامج والأنشطة واللقاءات والمطبوعات الموجهة',
  'المساهمة في دعم المشاركة السياسية والاقتصادية والاجتماعية والثقافية للنساء',
  'العمل على تعزيز طرق الحماية للنساء والاطفال من خلال دعم مراكز الرعاية والحماية للنساء المعنفات والاطفال الجانحين',
  'المساهمة في وضع رؤى واستراتيجيات متخصصة تساهم في معالجة التحديات التي تعيق تمكين النساء والأطفال من المشاركة الفعالة وترتقي بوضعهم للأفضل',
  'العمل على تعزيز قدرات ومهارات النساء من خلال برامج تدريبية نوعية تمكنها من الانخراط في عملية التنمية والسلام والأمن بفاعلية',
  'المساهمة في تطوير استراتيجيات مواجهة الازمات التي تؤثر على النساء والأطفال من خلال الدراسات والأبحاث والبرامج التي ينفذها المركز',
  'تعزيز مبادئ وقيم حقوق الإنسان والعدالة والحكم الرشيد من خلال التقارير المتخصصة والبرامج والفعاليات الموجهة لمراقبة ومتابعة حالة حقوق الانسان واليات الحماية المحلية والعدالة الانتقالية والحكم الرشيد',
  'العمل على تفعيل وتطوير اليات الشراكة والتنسيق مع الجهات الرسمية والمجتمع المدني المحلى والإقليمي والدولي والاعلام والمانحين بما لا يتعارض مع أهداف المركز والقوانين النافذة'
]
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-fade-in-delay {
  animation: fadeIn 0.8s ease-out 0.3s forwards;
  opacity: 0;
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out forwards;
  opacity: 0;
}

</style>
