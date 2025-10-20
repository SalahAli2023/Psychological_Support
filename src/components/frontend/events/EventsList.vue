<template>
  <div>
    <!-- شبكة الفعاليات -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
      <article 
        v-for="event in filteredEvents" 
        :key="event.id"
        class="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
        @click="handleEventClick(event)"
      >
        <!-- صورة/فيديو الفعالية -->
        <div class="relative overflow-hidden h-48">
          <div v-if="event.mediaType === 'image'">
            <img 
              :src="event.media" 
              :alt="event.title" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
          </div>
          <div v-else class="w-full h-full bg-gray-800 flex items-center justify-center">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <i class="fas fa-play text-white text-xl"></i>
              </div>
            </div>
          </div>
          
          <!-- شارة النوع -->
          <div class="absolute top-4 left-4">
            <span 
              :class="`inline-block text-xs font-semibold px-3 py-1 rounded-full ${getCategoryStyle(event.type)}`"
            >
              {{ event.type }}
            </span>
          </div>
          
          <!-- تراكب لوني عند التمرير -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <!-- محتوى الفعالية -->
        <div class="p-6">
          <!-- العنوان -->
          <h3 class="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#D6A29A] transition-colors duration-300">
            {{ event.title }}
          </h3>

          <!-- الوصف -->
          <p class="text-gray-600 text-sm mb-4 line-clamp-3">
            {{ event.description }}
          </p>

          <!-- معلومات إضافية -->
          <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div class="flex items-center gap-2">
              <i class="fas fa-calendar text-[#9EBF3B]"></i>
              <span>{{ event.date }}</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fas fa-clock text-[#D6A29A]"></i>
              <span>{{ event.duration }}</span>
            </div>
          </div>

          <!-- زر عرض المزيد -->
          <button 
            @click.stop="handleEventClick(event)"
            class="w-full bg-[#9EBF3B] hover:bg-gradient-to-r hover:from-[#9EBF3B] hover:to-[#D6A29A] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg group/btn"
          >
            <span class="flex items-center justify-center gap-2">
              عرض المزيد
              <i class="fas fa-arrow-left text-white group-hover/btn:translate-x-1 transition-transform duration-300"></i>
            </span>
          </button>
        </div>
      </article>
    </div>

    <!-- رسالة عدم وجود نتائج -->
    <div v-if="filteredEvents.length === 0" class="text-center py-12">
      <i class="fas fa-search text-5xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-bold text-gray-700 mb-2">لا توجد نتائج</h3>
      <p class="text-gray-500">لم نتمكن من العثور على فعاليات تطابق بحثك</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// تعريف الأحداث
const emit = defineEmits(['event-selected'])

// بيانات الفعاليات
const events = ref([])

// فلترة الفعاليات
const filterCriteria = ref({
  search: '',
  category: 'all'
})

// استلام معايير الفلترة من الوالد
const props = defineProps({
  filter: {
    type: Object,
    default: () => ({ search: '', category: 'all' })
  }
})

// مراقبة تغييرات الفلترة
watch(() => props.filter, (newFilter) => {
  filterCriteria.value = newFilter
}, { deep: true })

// الفعاليات المصفاة
const filteredEvents = computed(() => {
  let result = events.value
  
  // تطبيق البحث
  if (filterCriteria.value.search) {
    const query = filterCriteria.value.search.toLowerCase()
    result = result.filter(event => 
      event.title.toLowerCase().includes(query) || 
      event.description.toLowerCase().includes(query)
    )
  }
  
  // تطبيق التصفية حسب النوع
  if (filterCriteria.value.category !== 'all') {
    result = result.filter(event => event.type === filterCriteria.value.category)
  }
  
  return result
})

// دالة للحصول على نمط التصنيف
const getCategoryStyle = (type) => {
  const styles = {
    'أمسيات': 'bg-blue-100 text-blue-700',
    'فعاليات': 'bg-green-100 text-green-700',
    'ورش عمل': 'bg-pink-100 text-pink-700'
  }
  return styles[type] || 'bg-gray-100 text-gray-700'
}

// معالجة النقر على الفعالية
const handleEventClick = (event) => {
  emit('event-selected', event)
}

// تحميل البيانات
onMounted(() => {
  events.value = [
    {
      id: 1,
      title: 'أمسية التعامل مع التوتر',
      type: 'أمسيات',
      media: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      mediaType: 'image',
      description: 'أمسية تفاعلية للتعرف على طرق فعالة للتعامل مع التوتر والضغوط اليومية.',
      fullDescription: 'في هذه الأمسية التفاعلية، سنتعرف معاً على أحدث الطرق العلمية للتعامل مع التوتر والضغوط اليومية. سنقدم تمارين عملية واستراتيجيات فعالة يمكن تطبيقها في الحياة اليومية لتحسين الصحة النفسية والوصول إلى حياة أكثر توازناً.',
      date: '15 نوفمبر 2023',
      duration: 'ساعتان',
      location: 'قاعة المؤتمرات - المركز الرئيسي',
      topics: [
        'فهم أسباب التوتر',
        'تقنيات التنفس والاسترخاء',
        'إدارة الوقت بفعالية',
        'بناء المرونة النفسية'
      ],
      speakers: [
        {
          id: 1,
          name: 'د. أحمد محمد',
          specialty: 'أخصائي العلاج النفسي',
          image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80'
        }
      ]
    },
    {
      id: 2,
      title: 'ورشة بناء العلاقات الصحية',
      type: 'ورش عمل',
      media: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      mediaType: 'image',
      description: 'ورشة عملية تهدف إلى تعزيز مهارات التواصل وبناء علاقات صحية مع الآخرين.',
      fullDescription: 'ورشة عملية تفاعلية تركز على تطوير مهارات التواصل الفعال وبناء علاقات صحية مع الآخرين. ستتعلم كيفية تحسين مهارات الاستماع والتعبير عن المشاعر بفعالية.',
      date: '22 نوفمبر 2023',
      duration: '3 ساعات',
      location: 'قاعة الورش - المبنى التعليمي',
      topics: [
        'مهارات التواصل الفعال',
        'الاستماع النشط',
        'حل النزاعات',
        'بناء الثقة'
      ],
      speakers: [
        {
          id: 2,
          name: 'د. سارة الخالد',
          specialty: 'استشاري العلاقات الأسرية',
          image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80'
        }
      ]
    },
    {
      id: 3,
      title: 'فعالية الصحة النفسية في العمل',
      type: 'فعاليات',
      media: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      mediaType: 'image',
      description: 'فعالية توعوية حول أهمية الصحة النفسية في بيئة العمل.',
      fullDescription: 'فعالية شاملة تهدف إلى رفع الوعي بأهمية الصحة النفسية في بيئة العمل وتقديم استراتيجيات عملية لتحسين البيئة العملية ودعم الصحة النفسية للموظفين.',
      date: '30 نوفمبر 2023',
      duration: '4 ساعات',
      location: 'المسرح الرئيسي - المركز الثقافي',
      topics: [
        'تحسين بيئة العمل',
        'إدارة ضغوط العمل',
        'التوازن بين الحياة والعمل',
        'دعم الصحة النفسية'
      ],
      speakers: [
        {
          id: 3,
          name: 'د. خالد العلي',
          specialty: 'معالج نفسي إكلينيكي',
          image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80'
        }
      ]
    },
    {
      id: 4,
      title: 'أمسية التفكير الإيجابي',
      type: 'أمسيات',
      media: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      mediaType: 'image',
      description: 'جلسة حوارية حول قوة التفكير الإيجابي وتأثيره على الصحة النفسية.',
      fullDescription: 'أمسية ملهمة تستكشف قوة التفكير الإيجابي وكيف يمكن أن يحول حياتك. سنتعلم معاً تقنيات عملية لتطوير عقلية إيجابية والتغلب على الأفكار السلبية.',
      date: '5 ديسمبر 2023',
      duration: 'ساعة ونصف',
      location: 'قاعة المؤتمرات - المركز الرئيسي',
      topics: [
        'قوة العقلية الإيجابية',
        'التغلب على الأفكار السلبية',
        'تقنيات التفكير الإيجابي',
        'تطوير عادات عقلية صحية'
      ],
      speakers: [
        {
          id: 1,
          name: 'د. أحمد محمد',
          specialty: 'أخصائي العلاج النفسي',
          image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80'
        }
      ]
    },
    {
      id: 5,
      title: 'ورشة إدارة الوقت',
      type: 'ورش عمل',
      media: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      mediaType: 'image',
      description: 'ورشة عملية تقدم استراتيجيات فعالة لإدارة الوقت وتحقيق التوازن.',
      fullDescription: 'ورشة عملية تركز على تطوير مهارات إدارة الوقت بفعالية لتحقيق التوازن بين المسؤوليات المختلفة وتحسين الإنتاجية وجودة الحياة.',
      date: '12 ديسمبر 2023',
      duration: 'ساعتان ونصف',
      location: 'قاعة الورش - المبنى التعليمي',
      topics: [
        'تحديد الأولويات',
        'التخطيط الفعال',
        'تقنيات التركيز',
        'التغلب على التسويف'
      ],
      speakers: [
        {
          id: 2,
          name: 'د. سارة الخالد',
          specialty: 'استشاري العلاقات الأسرية',
          image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80'
        }
      ]
    },
    {
      id: 6,
      title: 'فعالية التوعية بالصحة النفسية',
      type: 'فعاليات',
      media: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      mediaType: 'image',
      description: 'فعالية توعوية شاملة حول أهمية الصحة النفسية وكيفية الحفاظ عليها.',
      fullDescription: 'فعالية توعوية شاملة تجمع بين المحاضرات التوعوية والجلسات التفاعلية وورش العمل لرفع الوعي المجتمعي بأهمية الصحة النفسية وكيفية الحفاظ عليها.',
      date: '18 ديسمبر 2023',
      duration: '5 ساعات',
      location: 'المسرح الرئيسي - المركز الثقافي',
      topics: [
        'أساسيات الصحة النفسية',
        'الوقاية من الاضطرابات',
        'دعم الآخرين',
        'الموارد المتاحة'
      ],
      speakers: [
        {
          id: 1,
          name: 'د. أحمد محمد',
          specialty: 'أخصائي العلاج النفسي',
          image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80'
        },
        {
          id: 2,
          name: 'د. سارة الخالد',
          specialty: 'استشاري العلاقات الأسرية',
          image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80'
        }
      ]
    },
    {
      id: 7,
      title: 'أمسية العلاج بالطاقة',
      type: 'أمسيات',
      media: 'https://images.unsplash.com/photo-1548600916-dc8492f8e845?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      mediaType: 'image',
      description: 'جلسة استكشافية للتعرف على طرق العلاج بالطاقة وتأثيرها على الصحة النفسية.',
      fullDescription: 'أمسية استكشافية تأخذك في رحلة للتعرف على عالم العلاج بالطاقة وكيف يمكن أن يؤثر إيجاباً على صحتك النفسية والجسدية.',
      date: '25 ديسمبر 2023',
      duration: 'ساعتان',
      location: 'قاعة المؤتمرات - المركز الرئيسي',
      topics: [
        'مقدمة في العلاج بالطاقة',
        'مراكز الطاقة في الجسم',
        'تمارين عملية',
        'التأمل والطاقة'
      ],
      speakers: [
        {
          id: 4,
          name: 'د. فاطمة القحطاني',
          specialty: 'اختصاصية العلاج بالطاقة',
          image: 'https://images.unsplash.com/photo-1594824947933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80'
        }
      ]
    },
    {
      id: 8,
      title: 'ورشة التأمل واليقظة',
      type: 'ورش عمل',
      media: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      mediaType: 'image',
      description: 'ورشة عملية لتعلم تقنيات التأمل واليقظة الذهنية لتخفيف التوتر.',
      fullDescription: 'ورشة عملية تفاعلية تركز على تعلم تقنيات التأمل واليقظة الذهنية التي يمكن تطبيقها يومياً لتخفيف التوتر وتحسين جودة الحياة.',
      date: '2 يناير 2024',
      duration: '3 ساعات',
      location: 'قاعة الورش - المبنى التعليمي',
      topics: [
        'أساسيات التأمل',
        'تقنيات التنفس',
        'اليقظة الذهنية',
        'تطبيق عملي'
      ],
      speakers: [
        {
          id: 4,
          name: 'د. فاطمة القحطاني',
          specialty: 'اختصاصية العلاج بالطاقة',
          image: 'https://images.unsplash.com/photo-1594824947933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80'
        }
      ]
    },
    {
      id: 9,
      title: 'فعالية الصحة النفسية للمراهقين',
      type: 'فعاليات',
      media: 'https://images.unsplash.com/photo-1516627145497-ae69578cfc06?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      mediaType: 'image',
      description: 'فعالية متخصصة للتعامل مع الصحة النفسية للمراهقين وتحديات هذه المرحلة.',
      fullDescription: 'فعالية شاملة تركز على فهم تحديات المراهقة وتقديم أدوات عملية للتعامل مع الصحة النفسية في هذه المرحلة الحرجة من العمر.',
      date: '10 يناير 2024',
      duration: '4 ساعات',
      location: 'المسرح الرئيسي - المركز الثقافي',
      topics: [
        'فهم مرحلة المراهقة',
        'التحديات النفسية',
        'دعم الأهل',
        'موارد المساعدة'
      ],
      speakers: [
        {
          id: 3,
          name: 'د. خالد العلي',
          specialty: 'معالج نفسي إكلينيكي',
          image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80'
        },
        {
          id: 2,
          name: 'د. سارة الخالد',
          specialty: 'استشاري العلاقات الأسرية',
          image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80'
        }
      ]
    },
    {
      id: 10,
      title: 'أمسية العلاقات الزوجية',
      type: 'أمسيات',
      media: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      mediaType: 'image',
      description: 'جلسة حوارية حول بناء علاقات زوجية صحية ومستدامة.',
      fullDescription: 'أمسية تفاعلية تناقش أسس بناء العلاقات الزوجية الناجحة وكيفية التغلب على التحديات التي تواجه الأزواج.',
      date: '17 يناير 2024',
      duration: 'ساعتان',
      location: 'قاعة المؤتمرات - المركز الرئيسي',
      topics: [
        'أسس العلاقة الناجحة',
        'فن التواصل الزوجي',
        'حل الخلافات',
        'تجديد العلاقة'
      ],
      speakers: [
        {
          id: 2,
          name: 'د. سارة الخالد',
          specialty: 'استشاري العلاقات الأسرية',
          image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80'
        }
      ]
    },
    {
      id: 11,
      title: 'ورشة الثقة بالنفس',
      type: 'ورش عمل',
      media: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      mediaType: 'image',
      description: 'ورشة عملية لبناء الثقة بالنفس وتطوير المهارات الشخصية.',
      fullDescription: 'ورشة عملية تساعدك على اكتشاف نقاط قوتك وبناء ثقتك بنفسك من خلال تمارين عملية واستراتيجيات فعالة.',
      date: '24 يناير 2024',
      duration: '3 ساعات',
      location: 'قاعة الورش - المبنى التعليمي',
      topics: [
        'اكتشاف الذات',
        'بناء الثقة',
        'التغلب على الخوف',
        'تطوير المهارات'
      ],
      speakers: [
        {
          id: 1,
          name: 'د. أحمد محمد',
          specialty: 'أخصائي العلاج النفسي',
          image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80'
        }
      ]
    },
    {
      id: 12,
      title: 'فعالية التوازن النفسي',
      type: 'فعاليات',
      media: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      mediaType: 'image',
      description: 'فعالية شاملة للوصول إلى التوازن النفسي والاستقرار العاطفي.',
      fullDescription: 'فعالية متكاملة تجمع بين المحاضرات وورش العمل لمساعدتك في الوصول إلى التوازن النفسي والاستقرار العاطفي في حياتك.',
      date: '31 يناير 2024',
      duration: '5 ساعات',
      location: 'المسرح الرئيسي - المركز الثقافي',
      topics: [
        'التوازن النفسي',
        'إدارة المشاعر',
        'الاستقرار العاطفي',
        'نصائح عملية'
      ],
      speakers: [
        {
          id: 1,
          name: 'د. أحمد محمد',
          specialty: 'أخصائي العلاج النفسي',
          image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80'
        },
        {
          id: 3,
          name: 'د. خالد العلي',
          specialty: 'معالج نفسي إكلينيكي',
          image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200&q=80'
        }
      ]
    }
  ]
})
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* تأكيد تأثير التدرج اللوني */
.btn-gradient:hover {
  background: linear-gradient(135deg, #9EBF3B 0%, #D6A29A 100%) !important;
}
</style>