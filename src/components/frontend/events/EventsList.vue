<!-- EventsList.vue -->
<template>
  <div>
    <!-- شبكة الفعاليات -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
      <ArticleCard 
        v-for="event in paginatedEvents" 
        :key="event.id"
        :article="formatEventForArticleCard(event)"
        @click="handleEventClick(event)"
      />
    </div>

    <!-- رسالة عدم وجود نتائج -->
    <div v-if="filteredEvents.length === 0" class="text-center py-12">
      <i class="fas fa-search text-5xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-bold text-gray-700 mb-2">لا توجد نتائج</h3>
      <p class="text-gray-500">لم نتمكن من العثور على فعاليات تطابق بحثك</p>
    </div>

    <!-- Pagination -->
    <div v-if="filteredEvents.length > 0" class="flex justify-center items-center gap-4 py-8">
      <!-- زر الصفحة السابقة -->
      <button
        @click="previousPage"
        :disabled="currentPage === 1"
        class="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        <i class="fas fa-chevron-right"></i>
        <span>السابق</span>
      </button>

      <!-- أرقام الصفحات -->
      <div class="flex gap-2">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
          :class="page === currentPage 
            ? 'bg-[#9EBF3B] text-white shadow-lg' 
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'"
        >
          {{ page }}
        </button>

        <!-- نقاط ... عندما تكون هناك صفحات مخفية -->
        <span v-if="showStartEllipsis" class="flex items-center justify-center text-gray-500">
          ...
        </span>
        
        <span v-if="showEndEllipsis" class="flex items-center justify-center text-gray-500">
          ...
        </span>
      </div>

      <!-- زر الصفحة التالية -->
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
      >
        <span>التالي</span>
        <i class="fas fa-chevron-left"></i>
      </button>
    </div>

    <!-- معلومات الصفحة -->
    <div v-if="filteredEvents.length > 0" class="text-center text-gray-600 text-sm">
      عرض {{ startIndex + 1 }} - {{ endIndex }} من أصل {{ filteredEvents.length }} فعالية
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import ArticleCard from '@/components/frontend/layouts/ArticleCard.vue'

// تعريف الأحداث
const emit = defineEmits(['event-selected'])

// بيانات الفعاليات
const events = ref([])

// إعدادات التقسيم
const itemsPerPage = ref(6) // عدد الفعاليات في كل صفحة
const currentPage = ref(1)

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
  currentPage.value = 1 // العودة للصفحة الأولى عند التصفية
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

// الفعاليات المعروضة في الصفحة الحالية
const paginatedEvents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredEvents.value.slice(start, end)
})

// إحصائيات التقسيم
const totalPages = computed(() => Math.ceil(filteredEvents.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredEvents.value.length))

// الصفحات المرئية في الـ Pagination
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  const delta = 2 // عدد الصفحات المرئية على كل جانب

  for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
    pages.push(i)
  }

  return pages
})

// التحكم في عرض نقاط ...
const showStartEllipsis = computed(() => visiblePages.value[0] > 1)
const showEndEllipsis = computed(() => visiblePages.value[visiblePages.value.length - 1] < totalPages.value)

// دوال التنقل بين الصفحات
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    scrollToTop()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    scrollToTop()
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    scrollToTop()
  }
}

// التمرير للأعلى عند تغيير الصفحة
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// تحويل بيانات الفعالية لتتناسب مع ArticleCard
const formatEventForArticleCard = (event) => {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    image: event.media,
    category: event.type,
    author: event.speakers && event.speakers.length > 0 ? event.speakers[0].name : 'فريق الدعم النفسي',
    date: event.date,
    duration: event.duration,
    location: event.location,
    speakers: event.speakers
  }
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