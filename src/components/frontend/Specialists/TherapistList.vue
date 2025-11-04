<template>
  <div class="font-almarai" :dir="isRTL ? 'rtl' : 'ltr'">
    <Header />
    <Hero 
      :titleKey="'therapists.hero.title'"
      :highlightKey="'therapists.hero.highlight'"
      :subtitleKey="'therapists.hero.subtitle'"
      :buttons="heroButtons"
    />

    <TherapistListContent 
      :therapists="therapists"
      :specializations="specializations"
      :isRTL="isRTL"
      :translate="translate"
    />

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/frontend/layouts/header.vue'
import Footer from '@/components/frontend/layouts/footer.vue'
import Hero from '@/components/frontend/layouts/hero.vue'
import TherapistListContent from '@/components/frontend/Specialists/TherapistListContent.vue'
import { useTranslations } from '@/composables/useTranslations'
import { inject } from 'vue'

export default {
  name: 'TherapistList',
  components: { 
    Header, 
    Footer, 
    Hero,
    TherapistListContent 
  },
  setup() {
    const { translate } = useTranslations()
    const { currentLanguage } = inject('languageState')
    
    const isRTL = currentLanguage.value === 'ar'
    
    const heroButtons = [
      { 
        text: translate('buttons.startJourney'), 
        icon: 'fas fa-play-circle', 
        primary: true 
      },
      { 
        text: translate('buttons.learnMore'), 
        icon: 'fas fa-info-circle', 
        primary: false 
      }
    ]

    return {
      translate,
      isRTL,
      heroButtons
    }
  },
  data() {
    return {
 therapists: [
        { id:1,name:'نسمة عبد الرحمن',title:'استشاري صحة نفسية وتربية خاصة',image:'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=256&h=256&fit=facearea&facepad=2&crop=faces&auto=format&q=80',rating:27,gender:'female',specializations:['anxiety','teenagers'],description:'خبرة تزيد عن 8 سنوات في مجال الصحة النفسية والعلاج السلوكي المعرفي، متخصصة في علاج اضطرابات القلق والاكتئاب لدى المراهقين والشباب.'},
        { id:2,name:'عمرو عادل',title:'استشاري الصحة النفسية ونفسي اكلينيكي',image:'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=256&h=256&fit=facearea&facepad=2&crop=faces&auto=format&q=80',rating:35,gender:'male',specializations:['depression','therapeutic'],description:'أكثر من 15 عاماً من الخبرة في العلاج النفسي، أتبع منهجاً متكاملاً يجمع بين العلاج المعرفي السلوكي والعلاج الجدلي السلوكي والعلاج بالقبول والالتزام.'},
        { id:3,name:'فاطمة محمد',title:'أخصائية نفسية إكلينيكية',image:'https://images.unsplash.com/photo-1594824388852-8a5e4c7b6d7e?w=256&h=256&fit=facearea&facepad=2&crop=faces&auto=format&q=80',rating:42,gender:'female',specializations:['ocd','addiction'],description:'متخصصة في علاج اضطرابات الوسواس القهري والإدمان، حاصلة على شهادات متقدمة في العلاج المعرفي السلوكي.'},
        { id:4,name:'أحمد السيد',title:'استشاري العلاج النفسي والسلوكي',image:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=facearea&facepad=2&crop=faces&auto=format&q=80',rating:31,gender:'male',specializations:['confidence','various'],description:'خبرة واسعة في العلاج النفسي والسلوكي، متخصص في بناء الثقة بالنفس وعلاج المشكلات النفسية المختلفة.'},
        { id:5,name:'مريم حسن',title:'أخصائية الإرشاد الأسري',image:'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=256&h=256&fit=facearea&facepad=2&crop=faces&auto=format&q=80',rating:28,gender:'female',specializations:['specialEducation','teenagers'],description:'متخصصة في الإرشاد الأسري والتربية الخاصة، خبرة في التعامل مع الأطفال والمراهقين ذوي الاحتياجات الخاصة.'},
        { id:6,name:'نسمة عبد الرحمن',title:'استشاري صحة نفسية وتربية خاصة',image:'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=256&h=256&fit=facearea&facepad=2&crop=faces&auto=format&q=80',rating:27,gender:'female',specializations:['anxiety','teenagers'],description:'خبرة تزيد عن 8 سنوات في مجال الصحة النفسية والعلاج السلوكي المعرفي، متخصصة في علاج اضطرابات القلق والاكتئاب لدى المراهقين والشباب.'},
        { id:7,name:'عمرو عادل',title:'استشاري الصحة النفسية ونفسي اكلينيكي',image:'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=256&h=256&fit=facearea&facepad=2&crop=faces&auto=format&q=80',rating:35,gender:'male',specializations:['depression','therapeutic'],description:'أكثر من 15 عاماً من الخبرة في العلاج النفسي، أتبع منهجاً متكاملاً يجمع بين العلاج المعرفي السلوكي والعلاج الجدلي السلوكي والعلاج بالقبول والالتزام.'},
        { id:8,name:'فاطمة محمد',title:'أخصائية نفسية إكلينيكية',image:'https://images.unsplash.com/photo-1594824388852-8a5e4c7b6d7e?w=256&h=256&fit=facearea&facepad=2&crop=faces&auto=format&q=80',rating:42,gender:'female',specializations:['ocd','addiction'],description:'متخصصة في علاج اضطرابات الوسواس القهري والإدمان، حاصلة على شهادات متقدمة في العلاج المعرفي السلوكي.'},
        { id:9,name:'أحمد السيد',title:'استشاري العلاج النفسي والسلوكي',image:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=facearea&facepad=2&crop=faces&auto=format&q=80',rating:31,gender:'male',specializations:['confidence','various'],description:'خبرة واسعة في العلاج النفسي والسلوكي، متخصص في بناء الثقة بالنفس وعلاج المشكلات النفسية المختلفة.'},
        { id:10,name:'مريم حسن',title:'أخصائية الإرشاد الأسري',image:'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=256&h=256&fit=facearea&facepad=2&crop=faces&auto=format&q=80',rating:28,gender:'female',specializations:['specialEducation','teenagers'],description:'متخصصة في الإرشاد الأسري والتربية الخاصة، خبرة في التعامل مع الأطفال والمراهقين ذوي الاحتياجات الخاصة.'}
      ],
      specializations: [
        { key: 'anxiety', ar: 'القلق والتوتر', en: 'Anxiety & Stress' },
        { key: 'depression', ar: 'الاكتئاب', en: 'Depression' },
        { key: 'ocd', ar: 'الوسواس القهري', en: 'OCD' },
        { key: 'addiction', ar: 'الإدمان', en: 'Addiction' },
        { key: 'psychosomatic', ar: 'الأمراض النفسجسمانية', en: 'Psychosomatic Disorders' },
        { key: 'confidence', ar: 'ضعف الثقة بالنفس', en: 'Low Self-Confidence' },
        { key: 'teenagers', ar: 'مشكلات المراهقين', en: 'Teenage Problems' },
        { key: 'specialEducation', ar: 'التربية الخاصة', en: 'Special Education' },
        { key: 'therapeutic', ar: 'العلاجية', en: 'Therapeutic' },
        { key: 'various', ar: 'مشكلات منوعة', en: 'Various Issues' }
      ],
    }
  }
}
</script>