<template>
  <div class="space-y-4 p-3">
    <!-- Header -->
    <TherapistsHeader @create-therapist="openCreateTherapist" />
    
    <!-- Filters and Search -->
    <TherapistsFilters 
      :filters="filters"
      @update:filters="updateFilters"
      @reset-filters="resetFilters"
    />
    
    <!-- Therapists List -->
    <TherapistsList 
      :therapists="paginatedTherapists"
      :filtered-therapists="filteredTherapists"
      @edit-therapist="editTherapist"
      @view-profile="viewProfile"
      @delete-therapist="deleteTherapist"
      @open-schedule="openSchedule"
    />
    
    <!-- Pagination -->
    <TherapistsPagination 
      :pagination="pagination"
      :filtered-therapists="filteredTherapists"
      @update:pagination="updatePagination"
    />
    
    <!-- Modals -->
    <TherapistModal 
      :open="therapistModalOpen"
      :editing-therapist="editingTherapist"
      :therapist-form="therapistForm"
      :current-step="currentStep"
      @close="closeTherapistModal"
      @save="saveTherapist"
      @update:step="updateStep"
      @add-qualification="addQualification"
      @remove-qualification="removeQualification"
    />
    
    <ScheduleModal 
      :open="scheduleModalOpen"
      :selected-therapist="selectedTherapist"
      :local-schedule="localSchedule"
      @close="closeScheduleModal"
      @save="saveSchedule"
      @add-time-slot="addTimeSlot"
      @remove-time-slot="removeTimeSlot"
    />
    
    <ProfileModal 
      :open="profileModalOpen"
      :viewing-therapist="viewingTherapist"
      @close="closeProfileModal"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import TherapistsHeader from './components/TherapistsHeader.vue'
import TherapistsFilters from './components/TherapistsFilters.vue'
import TherapistsList from './components/TherapistsList.vue'
import TherapistsPagination from './components/TherapistsPagination.vue'
import TherapistModal from './components/TherapistModal.vue'
import ScheduleModal from './components/ScheduleModal.vue'
import ProfileModal from './components/ProfileModal.vue'

// بيانات المثال
const therapists = ref([
  {
    id: '1',
    name: {
      ar: 'د. عمرو عادل',
      en: 'Dr. Amro Adel'
    },
    email: 'amro@clinic.com',
    phone: '+966500000001',
    username: 'amro_adel',
    password: 'password123',
    specialty: {
      ar: 'العلاج النفسي',
      en: 'Psychotherapy'
    },
    title: {
      ar: 'استشاري الصحة النفسية ونفسي اكلينيكي',
      en: 'Mental Health Consultant and Clinical Psychologist'
    },
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face',
    status: 'active',
    sessionDuration: 45,
    experience: 15,
    bio: {
      ar: 'أكثر من 15 عاماً من الخبرة في العلاج النفسي، أتبع منهجاً متكاملاً يجمع بين العلاج المعرفي السلوكي والعلاج الجدلي السلوكي والعلاج بالقبول والالتزام والتحليل النفسي. متخصص في الإرشاد الأسري والزوجي وعلاج اضطرابات القلق والاكتئاب.',
      en: 'Over 15 years of experience in psychotherapy, following an integrated approach combining cognitive behavioral therapy, dialectical behavior therapy, acceptance and commitment therapy, and psychoanalysis. Specialized in family and marital counseling and treatment of anxiety and depression disorders.'
    },
    methodologies: {
      ar: 'العلاج المعرفي السلوكي، العلاج الجدلي السلوكي، العلاج بالقبول والالتزام، التحليل النفسي، الإرشاد الأسري والزوجي',
      en: 'Cognitive Behavioral Therapy, Dialectical Behavior Therapy, Acceptance and Commitment Therapy, Psychoanalysis, Family and Marital Counseling'
    },
    qualifications: [
      {
        name: {
          ar: 'دكتوراه في الصحة النفسية والإرشاد الأسري',
          en: 'PhD in Mental Health and Family Counseling'
        },
        institution: {
          ar: 'الجامعة الأمريكية للعلوم والتعليم المستمر',
          en: 'American University of Science and Continuing Education'
        }
      },
      {
        name: {
          ar: 'دكتوراه في استراتيجيات التدريب وتطوير الممارسة',
          en: 'PhD in Training Strategies and Practice Development'
        },
        institution: {
          ar: 'جامعة ستانفورد',
          en: 'Stanford University'
        }
      }
    ],
    certifications: [
      { name: 'معتمد من التحالف العربي لخبراء العلاج النفسي' }
    ],
    schedule: {
      saturday: { enabled: true, slots: [{ start: '09:00', end: '12:00', available: true }] },
      sunday: { enabled: true, slots: [{ start: '09:00', end: '12:00', available: true }] },
      monday: { enabled: true, slots: [{ start: '09:00', end: '12:00', available: true }] },
      tuesday: { enabled: false, slots: [] },
      wednesday: { enabled: true, slots: [{ start: '14:00', end: '17:00', available: true }] },
      thursday: { enabled: true, slots: [{ start: '09:00', end: '12:00', available: true }] },
      friday: { enabled: false, slots: [] }
    }
  },
  {
    id: '2',
    name: {
      ar: 'د. سارة عبدالله',
      en: 'Dr. Sara Abdullah'
    },
    email: 'sara@clinic.com',
    phone: '+966500000002',
    username: 'sara_abdullah',
    password: 'password456',
    specialty: {
      ar: 'العلاج الأسري',
      en: 'Family Therapy'
    },
    title: {
      ar: 'أخصائية العلاج الأسري والزوجي',
      en: 'Family and Marital Therapy Specialist'
    },
    avatar: 'https://images.unsplash.com/photo-1594824947933-d0501ba2fe65?w=100&h=100&fit=crop&crop=face',
    status: 'busy',
    sessionDuration: 60,
    experience: 8,
    bio: {
      ar: 'متخصصة في العلاج الأسري والزوجي مع خبرة تزيد عن 8 سنوات في تقديم الاستشارات الأسرية وحل النزاعات الزوجية.',
      en: 'Specialized in family and marital therapy with over 8 years of experience in providing family counseling and resolving marital conflicts.'
    },
    methodologies: {
      ar: 'العلاج الأسري النظامي، العلاج الزوجي، العلاج السردي',
      en: 'Systemic Family Therapy, Marital Therapy, Narrative Therapy'
    },
    qualifications: [
      {
        name: {
          ar: 'ماجستير في العلاج الأسري',
          en: 'Master\'s in Family Therapy'
        },
        institution: {
          ar: 'جامعة الملك سعود',
          en: 'King Saud University'
        }
      }
    ],
    certifications: [
      { name: 'معتمدة من الجمعية العالمية للعلاج الأسري' }
    ],
    schedule: {
      saturday: { enabled: true, slots: [{ start: '10:00', end: '13:00', available: true }] },
      sunday: { enabled: true, slots: [{ start: '10:00', end: '13:00', available: true }] },
      monday: { enabled: false, slots: [] },
      tuesday: { enabled: true, slots: [{ start: '15:00', end: '18:00', available: true }] },
      wednesday: { enabled: true, slots: [{ start: '10:00', end: '13:00', available: true }] },
      thursday: { enabled: true, slots: [{ start: '15:00', end: '18:00', available: true }] },
      friday: { enabled: false, slots: [] }
    }
  }
])

// الفلاتر
const filters = reactive({
  search: '',
  status: '',
  specialty: '',
  sort: 'name-asc'
})

// التقسيم
const pagination = reactive({
  currentPage: 1,
  itemsPerPage: 5
})

// Modals
const therapistModalOpen = ref(false)
const scheduleModalOpen = ref(false)
const profileModalOpen = ref(false)
const editingTherapist = ref(null)
const viewingTherapist = ref(null)
const selectedTherapist = ref(null)

// Form
const currentStep = ref(0)
const steps = [
  { label: 'المعلومات الأساسية' },
  { label: 'المعلومات المهنية' },
  { label: 'المؤهلات' }
]

const therapistForm = reactive({
  name: {
    ar: '',
    en: ''
  },
  email: '',
  phone: '',
  username: '',
  password: '',
  specialty: {
    ar: '',
    en: ''
  },
  title: {
    ar: '',
    en: ''
  },
  status: 'active',
  sessionDuration: 45,
  experience: '',
  bio: {
    ar: '',
    en: ''
  },
  methodologies: {
    ar: '',
    en: ''
  },
  qualifications: [],
  certifications: []
})

const localSchedule = ref({})

// Computed Properties
const filteredTherapists = computed(() => {
  let filtered = therapists.value.filter(therapist => {
    const matchesSearch = !filters.search || 
      therapist.name.ar.toLowerCase().includes(filters.search.toLowerCase()) ||
      therapist.name.en.toLowerCase().includes(filters.search.toLowerCase()) ||
      therapist.specialty.ar.toLowerCase().includes(filters.search.toLowerCase()) ||
      therapist.specialty.en.toLowerCase().includes(filters.search.toLowerCase()) ||
      therapist.email.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesStatus = !filters.status || therapist.status === filters.status
    const matchesSpecialty = !filters.specialty || therapist.specialty.ar === filters.specialty
    
    return matchesSearch && matchesStatus && matchesSpecialty
  })

  // الترتيب
  if (filters.sort === 'name-asc') {
    filtered.sort((a, b) => a.name.ar.localeCompare(b.name.ar))
  } else if (filters.sort === 'name-desc') {
    filtered.sort((a, b) => b.name.ar.localeCompare(a.name.ar))
  } else if (filters.sort === 'experience-desc') {
    filtered.sort((a, b) => (b.experience || 0) - (a.experience || 0))
  } else if (filters.sort === 'experience-asc') {
    filtered.sort((a, b) => (a.experience || 0) - (b.experience || 0))
  }

  return filtered
})

const paginatedTherapists = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.itemsPerPage
  const end = start + pagination.itemsPerPage
  return filteredTherapists.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredTherapists.value.length / pagination.itemsPerPage))
const startItem = computed(() => (pagination.currentPage - 1) * pagination.itemsPerPage + 1)
const endItem = computed(() => Math.min(pagination.currentPage * pagination.itemsPerPage, filteredTherapists.value.length))

// Methods
const updateFilters = (newFilters) => {
  Object.assign(filters, newFilters)
  pagination.currentPage = 1
}

const resetFilters = () => {
  Object.assign(filters, {
    search: '',
    status: '',
    specialty: '',
    sort: 'name-asc'
  })
  pagination.currentPage = 1
}

const updatePagination = (newPagination) => {
  Object.assign(pagination, newPagination)
}

const updateStep = (step) => {
  currentStep.value = step
}

const openCreateTherapist = () => {
  editingTherapist.value = null
  currentStep.value = 0
  Object.assign(therapistForm, {
    name: { ar: '', en: '' },
    email: '',
    phone: '',
    username: '',
    password: '',
    specialty: { ar: '', en: '' },
    title: { ar: '', en: '' },
    status: 'active',
    sessionDuration: 45,
    experience: '',
    bio: { ar: '', en: '' },
    methodologies: { ar: '', en: '' },
    qualifications: [],
    certifications: []
  })
  therapistModalOpen.value = true
}

const editTherapist = (therapist) => {
  editingTherapist.value = therapist
  currentStep.value = 0
  Object.assign(therapistForm, {
    name: { ...therapist.name },
    email: therapist.email,
    phone: therapist.phone,
    username: therapist.username || '',
    password: therapist.password || '',
    specialty: { ...therapist.specialty },
    title: { ...therapist.title },
    status: therapist.status,
    sessionDuration: therapist.sessionDuration || 45,
    experience: therapist.experience || '',
    bio: { ...therapist.bio },
    methodologies: { ...therapist.methodologies },
    qualifications: therapist.qualifications ? [...therapist.qualifications] : [],
    certifications: therapist.certifications ? [...therapist.certifications] : []
  })
  therapistModalOpen.value = true
}

const closeTherapistModal = () => {
  therapistModalOpen.value = false
  editingTherapist.value = null
  currentStep.value = 0
}

const saveTherapist = () => {
  if (editingTherapist.value) {
    Object.assign(editingTherapist.value, {
      ...therapistForm,
      qualifications: [...therapistForm.qualifications],
      certifications: [...therapistForm.certifications]
    })
  } else {
    const newTherapist = {
      id: Date.now().toString(),
      ...therapistForm,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
      qualifications: [...therapistForm.qualifications],
      certifications: [...therapistForm.certifications],
      schedule: {
        saturday: { enabled: false, slots: [] },
        sunday: { enabled: false, slots: [] },
        monday: { enabled: false, slots: [] },
        tuesday: { enabled: false, slots: [] },
        wednesday: { enabled: false, slots: [] },
        thursday: { enabled: false, slots: [] },
        friday: { enabled: false, slots: [] }
      }
    }
    therapists.value.push(newTherapist)
  }
  therapistModalOpen.value = false
  currentStep.value = 0
}

const addQualification = () => {
  therapistForm.qualifications.push({
    name: {
      ar: '',
      en: ''
    },
    institution: {
      ar: '',
      en: ''
    }
  })
}

const removeQualification = (index) => {
  therapistForm.qualifications.splice(index, 1)
}

const viewProfile = (therapist) => {
  viewingTherapist.value = therapist
  profileModalOpen.value = true
}

const closeProfileModal = () => {
  profileModalOpen.value = false
}

const openSchedule = (therapist) => {
  selectedTherapist.value = therapist
  localSchedule.value = JSON.parse(JSON.stringify(therapist.schedule))
  scheduleModalOpen.value = true
}

const closeScheduleModal = () => {
  scheduleModalOpen.value = false
}

const addTimeSlot = (dayKey) => {
  if (!localSchedule.value[dayKey].slots) {
    localSchedule.value[dayKey].slots = []
  }
  
  localSchedule.value[dayKey].slots.push({
    start: '09:00',
    end: '10:00',
    available: true
  })
}

const removeTimeSlot = (dayKey, index) => {
  localSchedule.value[dayKey].slots.splice(index, 1)
}

const saveSchedule = () => {
  if (selectedTherapist.value) {
    selectedTherapist.value.schedule = JSON.parse(JSON.stringify(localSchedule.value))
  }
  scheduleModalOpen.value = false
}

const deleteTherapist = (therapist) => {
  if (confirm(`هل أنت متأكد من حذف ${therapist.name.ar}؟`)) {
    therapists.value = therapists.value.filter(t => t.id !== therapist.id)
  }
}

// تحسينات للجوال
const isMobile = ref(false)

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>