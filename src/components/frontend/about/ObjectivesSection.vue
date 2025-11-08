<template>
  <section class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-fade-in">
          {{ translate('about.objectives.title') }} <span class="text-primary-green">{{ translate('about.objectives.highlight') }}</span>
        </h2>

        <p class="text-lg text-gray-600 max-w-3xl mx-auto animate-fade-in-delay">
          {{ translate('about.objectives.subtitle') }}
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
          <div class="w-12 h-12 bg-primary-pink rounded-xl flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300 group-hover:scale-110">
            <span class="text-white font-bold text-base">{{ index + 1 }}</span>
          </div>
          
          <!-- النص -->
          <p class="text-gray-700 text-base leading-relaxed flex-1">
            {{ currentLanguage === 'ar' ? objective.ar : objective.en }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useTranslations } from '@/composables/useTranslations'

const { currentLanguage, translate } = useTranslations()

const objectives = [
  {
    ar: 'المساهمة في تعزيز الوعي المجتمعي حول قضايا المرأة والطفل في اليمن من خلال البرامج والأنشطة واللقاءات والمطبوعات الموجهة',
    en: 'Contribute to enhancing community awareness about women and children issues in Yemen through targeted programs, activities, meetings, and publications'
  },
  {
    ar: 'المساهمة في دعم المشاركة السياسية والاقتصادية والاجتماعية والثقافية للنساء',
    en: 'Contribute to supporting political, economic, social and cultural participation of women'
  },
  {
    ar: 'العمل على تعزيز طرق الحماية للنساء والاطفال من خلال دعم مراكز الرعاية والحماية للنساء المعنفات والاطفال الجانحين',
    en: 'Work to enhance protection methods for women and children by supporting care and protection centers for abused women and delinquent children'
  },
  {
    ar: 'المساهمة في وضع رؤى واستراتيجيات متخصصة تساهم في معالجة التحديات التي تعيق تمكين النساء والأطفال من المشاركة الفعالة وترتقي بوضعهم للأفضل',
    en: 'Contribute to developing specialized visions and strategies that help address challenges hindering the empowerment of women and children for effective participation and improve their situation'
  },
  {
    ar: 'العمل على تعزيز قدرات ومهارات النساء من خلال برامج تدريبية نوعية تمكنها من الانخراط في عملية التنمية والسلام والأمن بفاعلية',
    en: 'Work to enhance the capacities and skills of women through quality training programs that enable them to effectively engage in development, peace and security processes'
  },
  {
    ar: 'المساهمة في تطوير استراتيجيات مواجهة الازمات التي تؤثر على النساء والأطفال من خلال الدراسات والأبحاث والبرامج التي ينفذها المركز',
    en: 'Contribute to developing strategies to confront crises affecting women and children through studies, research and programs implemented by the center'
  },
  {
    ar: 'تعزيز مبادئ وقيم حقوق الإنسان والعدالة والحكم الرشيد من خلال التقارير المتخصصة والبرامج والفعاليات الموجهة لمراقبة ومتابعة حالة حقوق الانسان واليات الحماية المحلية والعدالة الانتقالية والحكم الرشيد',
    en: 'Promote the principles and values of human rights, justice and good governance through specialized reports, programs and events aimed at monitoring and following up on the human rights situation, local protection mechanisms, transitional justice and good governance'
  },
  {
    ar: 'العمل على تفعيل وتطوير اليات الشراكة والتنسيق مع الجهات الرسمية والمجتمع المدني المحلى والإقليمي والدولي والاعلام والمانحين بما لا يتعارض مع أهداف المركز والقوانين النافذة',
    en: 'Work to activate and develop partnership and coordination mechanisms with official authorities, local, regional and international civil society, media and donors in a way that does not conflict with the centers objectives and applicable laws'
  }
]
</script>

<style scoped>
/* نفس الأنيميشنز السابقة */
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