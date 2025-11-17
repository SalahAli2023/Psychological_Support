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

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="text-secondary">جاري تحميل البيانات...</div>
    </div>
    
    <!-- Therapists List -->
    <TherapistsList 
      v-else
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
import { useTherapistStore } from '@/stores/therapists'
import TherapistsHeader from './components/TherapistsHeader.vue'
import TherapistsFilters from './components/TherapistsFilters.vue'
import TherapistsList from './components/TherapistsList.vue'
import TherapistsPagination from './components/TherapistsPagination.vue'
import TherapistModal from './components/TherapistModal.vue'
import ScheduleModal from './components/ScheduleModal.vue'
import ProfileModal from './components/ProfileModal.vue'

const therapistStore = useTherapistStore()

// بيانات المثال الاحتياطية
const sampleTherapists = ref([])

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
  itemsPerPage: 10
})

// Modals
const therapistModalOpen = ref(false)
const scheduleModalOpen = ref(false)
const profileModalOpen = ref(false)
const editingTherapist = ref(null)
const viewingTherapist = ref(null)
const selectedTherapist = ref(null)
const loading = ref(false)

// Form
const currentStep = ref(0)

const therapistForm = reactive({
  user_id: '',
  name_ar: '',
  name_en: '',
  title_ar: '',
  title_en: '',
  methodologies_ar: '',
  methodologies_en: '',
  specialty_ar: '',
  specialty_en: '',
  session_duration: 45,
  experience: 0,
  hourly_rate: 0,
  phone: '',
  date_of_birth: '',
  gender: 'male',
  bio_ar: '',
  bio_en: '',
  status: 'active',
  qualifications: [],
  certifications: []
})

const localSchedule = ref({})

// Computed Properties
const therapists = computed(() => therapistStore.therapists.length > 0 ? therapistStore.therapists : sampleTherapists.value)

const filteredTherapists = computed(() => {
  let filtered = therapists.value.filter(therapist => {
    const matchesSearch = !filters.search || 
      therapist.name_ar?.toLowerCase().includes(filters.search.toLowerCase()) ||
      therapist.name_en?.toLowerCase().includes(filters.search.toLowerCase()) ||
      therapist.specialty_ar?.toLowerCase().includes(filters.search.toLowerCase()) ||
      therapist.specialty_en?.toLowerCase().includes(filters.search.toLowerCase()) ||
      therapist.email?.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesStatus = !filters.status || therapist.status === filters.status
    const matchesSpecialty = !filters.specialty || therapist.specialty_ar === filters.specialty
    
    return matchesSearch && matchesStatus && matchesSpecialty
  })

  // الترتيب
  if (filters.sort === 'name-asc') {
    filtered.sort((a, b) => (a.name_ar || '').localeCompare(b.name_ar || ''))
  } else if (filters.sort === 'name-desc') {
    filtered.sort((a, b) => (b.name_ar || '').localeCompare(a.name_ar || ''))
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

// Methods
const updateFilters = (newFilters) => {
  Object.assign(filters, newFilters)
  pagination.currentPage = 1
  loadTherapists()
}

const resetFilters = () => {
  Object.assign(filters, {
    search: '',
    status: '',
    specialty: '',
    sort: 'name-asc'
  })
  pagination.currentPage = 1
  loadTherapists()
}

const updatePagination = (newPagination) => {
  Object.assign(pagination, newPagination)
  therapistStore.setPage(newPagination.currentPage)
  therapistStore.setPerPage(newPagination.itemsPerPage)
  loadTherapists()
}

const updateStep = (step) => {
  currentStep.value = step
}



const useSampleData = () => {
  sampleTherapists.value = [
    {
      id: '1',
      name_ar: 'د. عمرو عادل',
      name_en: 'Dr. Amro Adel',
      email: 'amro@clinic.com',
      phone: '+966500000001',
      specialty_ar: 'العلاج النفسي',
      specialty_en: 'Psychotherapy',
      title_ar: 'استشاري الصحة النفسية ونفسي اكلينيكي',
      title_en: 'Mental Health Consultant and Clinical Psychologist',
      avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face',
      status: 'active',
      session_duration: 45,
      experience: 15,
      bio_ar: 'أكثر من 15 عاماً من الخبرة في العلاج النفسي...',
      bio_en: 'Over 15 years of experience in psychotherapy...',
      methodologies_ar: 'العلاج المعرفي السلوكي، العلاج الجدلي السلوكي...',
      methodologies_en: 'Cognitive Behavioral Therapy, Dialectical Behavior Therapy...',
      qualifications: [],
      certifications: [],
      schedules: []
    }
  ]
}

const openCreateTherapist = () => {
  editingTherapist.value = null
  currentStep.value = 0
  
  // إعادة تعيين النموذج بالشكل الصحيح
  Object.assign(therapistForm, {
    user_id: '',
    name_ar: '',
    name_en: '',
    title_ar: '',
    title_en: '',
    methodologies_ar: '',
    methodologies_en: '',
    specialty_ar: '',
    specialty_en: '',
    session_duration: 45,
    experience: 0,
    hourly_rate: 0,
    phone: '',
    date_of_birth: '',
    gender: 'male',
    bio_ar: '',
    bio_en: '',
    status: 'active',
    qualifications: [],
    certifications: []
  })
  
  therapistModalOpen.value = true
}

const editTherapist = (therapist) => {
  editingTherapist.value = therapist
  currentStep.value = 0
  
  Object.assign(therapistForm, {
    user_id: therapist.user_id || '',
    name_ar: therapist.name_ar || '',
    name_en: therapist.name_en || '',
    title_ar: therapist.title_ar || '',
    title_en: therapist.title_en || '',
    methodologies_ar: therapist.methodologies_ar || '',
    methodologies_en: therapist.methodologies_en || '',
    specialty_ar: therapist.specialty_ar || '',
    specialty_en: therapist.specialty_en || '',
    session_duration: therapist.session_duration || 45,
    experience: therapist.experience || 0,
    hourly_rate: therapist.hourly_rate || 0,
    phone: therapist.phone || '',
    date_of_birth: therapist.date_of_birth || '',
    gender: therapist.gender || 'male',
    bio_ar: therapist.bio_ar || '',
    bio_en: therapist.bio_en || '',
    status: therapist.status || 'active',
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

const saveTherapist = async () => {
  try {
    // تحضير البيانات بشكل صحيح
    const therapistData = {
      user_id: therapistForm.user_id || 1, // تأكد من وجود user_id صالح
      name_ar: therapistForm.name_ar,
      name_en: therapistForm.name_en,
      title_ar: therapistForm.title_ar,
      title_en: therapistForm.title_en,
      methodologies_ar: Array.isArray(therapistForm.methodologies_ar) ? 
        therapistForm.methodologies_ar : [therapistForm.methodologies_ar],
      methodologies_en: Array.isArray(therapistForm.methodologies_en) ? 
        therapistForm.methodologies_en : [therapistForm.methodologies_en],
      specialty_ar: therapistForm.specialty_ar,
      specialty_en: therapistForm.specialty_en,
      session_duration: parseInt(therapistForm.session_duration) || 45,
      experience: parseInt(therapistForm.experience) || 0,
      hourly_rate: parseFloat(therapistForm.hourly_rate) || 0,
      phone: therapistForm.phone,
      date_of_birth: therapistForm.date_of_birth,
      gender: therapistForm.gender,
      bio_ar: therapistForm.bio_ar,
      bio_en: therapistForm.bio_en,
      status: therapistForm.status
    }

    if (editingTherapist.value) {
      await therapistStore.updateTherapist(editingTherapist.value.id, therapistData)
    } else {
      await therapistStore.createTherapist(therapistData)
    }
    
    therapistModalOpen.value = false
    currentStep.value = 0
    await loadTherapists()
  } catch (error) {
    console.error('Error saving therapist:', error)
    alert('حدث خطأ أثناء حفظ البيانات: ' + (error.response?.data?.message || error.message))
  }
}

const addQualification = () => {
  therapistForm.qualifications.push({
    name_ar: '',
    name_en: '',
    institution_ar: '',
    institution_en: '',
    year: new Date().getFullYear()
  })
}

const removeQualification = (index) => {
  therapistForm.qualifications.splice(index, 1)
}

const viewProfile = async (therapist) => {
  try {
    console.log('Viewing profile for therapist:', therapist)
    
    // استخدام البيانات المحلية أولاً
    viewingTherapist.value = { ...therapist }
    
    // محاولة جلب البيانات الكاملة من API
    try {
      const fullTherapist = await therapistStore.fetchTherapist(therapist.id)
      if (fullTherapist) {
        viewingTherapist.value = fullTherapist
      }
    } catch (apiError) {
      console.warn('Could not fetch full therapist data, using local data:', apiError)
    }
    
    profileModalOpen.value = true
    console.log('Profile modal opened successfully')
  } catch (error) {
    console.error('Error in viewProfile:', error)
    // استخدام البيانات الأساسية كبديل
    viewingTherapist.value = therapist
    profileModalOpen.value = true
  }
}

const closeProfileModal = () => {
  profileModalOpen.value = false
}

const openSchedule = async (therapist) => {
  try {
    selectedTherapist.value = therapist
    console.log('Opening schedule for therapist:', therapist)
    
    // استخدام البيانات المحلية إذا كانت موجودة
    if (therapist.schedules && therapist.schedules.length > 0) {
      localSchedule.value = convertSchedulesToModalFormat(therapist.schedules)
    } else {
      // جلب الجداول من API
      try {
        const schedules = await therapistStore.fetchSchedules(therapist.id)
        localSchedule.value = convertSchedulesToModalFormat(schedules)
      } catch (apiError) {
        console.error('Error fetching schedules from API:', apiError)
        localSchedule.value = getEmptySchedule()
      }
    }
    
    scheduleModalOpen.value = true
    console.log('Schedule modal opened successfully')
  } catch (error) {
    console.error('Error in openSchedule:', error)
    // استخدام جدول فارغ كبديل
    selectedTherapist.value = therapist
    localSchedule.value = getEmptySchedule()
    scheduleModalOpen.value = true
  }
}

// تحسين دالة تحويل الجداول
const convertSchedulesToModalFormat = (schedules) => {
  const scheduleFormat = getEmptySchedule()
  
  if (schedules && Array.isArray(schedules)) {
    schedules.forEach(schedule => {
      if (scheduleFormat[schedule.day]) {
        scheduleFormat[schedule.day] = {
          enabled: schedule.available !== false,
          slots: [{
            start: schedule.start_time || '09:00',
            end: schedule.end_time || '10:00',
            available: schedule.available !== false
          }]
        }
      }
    })
  }
  
  return scheduleFormat
}



const getEmptySchedule = () => ({
  saturday: { enabled: false, slots: [] },
  sunday: { enabled: false, slots: [] },
  monday: { enabled: false, slots: [] },
  tuesday: { enabled: false, slots: [] },
  wednesday: { enabled: false, slots: [] },
  thursday: { enabled: false, slots: [] },
  friday: { enabled: false, slots: [] }
})

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

const saveSchedule = async () => {
  try {
    if (selectedTherapist.value) {
      // تحويل البيانات لصيغة API وحفظها
      const scheduleData = convertModalToScheduleFormat(localSchedule.value)
      
      for (const day in scheduleData) {
        if (scheduleData[day].enabled && scheduleData[day].slots.length > 0) {
          for (const slot of scheduleData[day].slots) {
            await therapistStore.createSchedule(selectedTherapist.value.id, {
              day: day,
              start_time: slot.start,
              end_time: slot.end,
              available: slot.available,
              slot_duration: selectedTherapist.value.session_duration || 45
            })
          }
        }
      }
    }
    scheduleModalOpen.value = false
    await loadTherapists() // إعادة تحميل البيانات
  } catch (error) {
    console.error('Error saving schedule:', error)
    alert('حدث خطأ أثناء حفظ الجدول')
  }
}

const convertModalToScheduleFormat = (modalSchedule) => {
  return modalSchedule
}



// في المكون الرئيسي TherapistsManagement.vue
const convertSchedulesToCardFormat = (schedules) => {
  const scheduleFormat = getEmptySchedule()
  
  if (schedules && Array.isArray(schedules)) {
    schedules.forEach(schedule => {
      if (scheduleFormat[schedule.day]) {
        scheduleFormat[schedule.day] = {
          enabled: schedule.available,
          slots: [{
            start: schedule.start_time,
            end: schedule.end_time,
            available: schedule.available
          }]
        }
      }
    })
  }
  
  return scheduleFormat
}

// ثم استخدمها عند تحميل البيانات
const loadTherapists = async () => {
  try {
    loading.value = true
    const apiFilters = {
      search: filters.search,
      status: filters.status,
      specialty: filters.specialty
    }
    
    await therapistStore.fetchTherapists(apiFilters)
    
    // تحويل بيانات الجدول للصيغة المتوقعة
    therapistStore.therapists.forEach(therapist => {
      therapist.schedule = convertSchedulesToCardFormat(therapist.schedules)
    })
    
  } catch (error) {
    console.error('Error loading therapists:', error)
    useSampleData()
  } finally {
    loading.value = false
  }
}


const deleteTherapist = async (therapist) => {
  if (confirm(`هل أنت متأكد من حذف ${therapist.name_ar}؟`)) {
    try {
      await therapistStore.deleteTherapist(therapist.id)
      await loadTherapists() // إعادة تحميل البيانات
    } catch (error) {
      console.error('Error deleting therapist:', error)
      alert('حدث خطأ أثناء حذف المعالج')
    }
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
  loadTherapists()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>
