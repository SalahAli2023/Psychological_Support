<template>
  <div class="space-y-6 p-4">
    <!-- Header -->
    <PatientsHeader @create-patient="openCreatePatient" />
    
    <!-- Filters -->
    <PatientsFilters 
      :filters="filters"
      @apply-filters="applyFilters"
      @reset-filters="resetFilters"
      @update:filters="updateFilters"
    />
    
    <!-- Table -->
    <PatientsTable 
      :patients="paginatedPatients"
      :loading="loading"
      @view-profile="viewProfile"
      @edit-patient="editPatient"
      @delete-patient="deletePatient"
      @open-sessions="openSessionsModal"
    />
    
    <!-- Empty State -->
    <PatientsEmptyState 
      v-if="!loading && paginatedPatients.length === 0"
      @create-patient="openCreatePatient"
    />
    
    <!-- Pagination -->
    <PatientsPagination 
      v-if="filteredPatients.length > 0"
      :current-page="currentPage"
      :total-pages="totalPages"
      :start-item="startItem"
      :end-item="endItem"
      :total-items="filteredPatients.length"
      :items-per-page="itemsPerPage"
      :visible-pages="visiblePages"
      @go-to-page="goToPage"
      @update-items-per-page="updateItemsPerPage"
    />
    
    <!-- Modals -->
    <PatientModal
      :open="patientModalOpen"
      :patient="editingPatient"
      @close="closePatientModal"
      @save="savePatient"
    />
    
    <ProfileModal
      :open="profileModalOpen"
      :patient="viewingPatient"
      @close="closeProfileModal"
    />
    
    <SessionsModal
      :open="sessionsModalOpen"
      :patient="selectedPatientForSessions"
      @close="closeSessionsModal"
      @add-session="openAddSessionModal"
      @edit-session="editSession"
      @delete-session="deleteSession"
    />
    
    <SessionModal
      :open="sessionModalOpen"
      :session="editingSession"
      @close="closeSessionModal"
      @save="saveSession"
    />
    
    <!-- Delete Confirmation Modals -->
    <DeleteConfirmationModal
      :open="deletePatientModalOpen"
      title="حذف المريض"
      :message="`هل أنت متأكد من حذف ${patientToDelete?.name}؟`"
      @confirm="confirmDeletePatient"
      @cancel="cancelDeletePatient"
    />
    
    <DeleteConfirmationModal
      :open="deleteSessionModalOpen"
      title="حذف الجلسة"
      :message="deleteSessionMessage"
      @confirm="confirmDeleteSession"
      @cancel="cancelDeleteSession"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import PatientsHeader from './components/PatientsHeader.vue'
import PatientsFilters from './components/PatientsFilters.vue'
import PatientsTable from './components/PatientsTable.vue'
import PatientsEmptyState from './components/PatientsEmptyState.vue'
import PatientsPagination from './components/PatientsPagination.vue'
import PatientModal from './components/modals/PatientModal.vue'
import ProfileModal from './components/modals/ProfileModal.vue'
import SessionsModal from './components/modals/SessionsModal.vue'
import SessionModal from './components/modals/SessionModal.vue'
import DeleteConfirmationModal from './components/modals/DeleteConfirmationModal.vue'

// البيانات
const patients = ref([])
const loading = ref(false)

// النماذج
const filters = reactive({
  search: '',
  status: '',
  condition: ''
})

const pagination = reactive({
  currentPage: 1,
  itemsPerPage: 9
})

// النوافذ المنبثقة
const patientModalOpen = ref(false)
const profileModalOpen = ref(false)
const sessionsModalOpen = ref(false)
const sessionModalOpen = ref(false)
const deletePatientModalOpen = ref(false)
const deleteSessionModalOpen = ref(false)

const editingPatient = ref(null)
const viewingPatient = ref(null)
const selectedPatientForSessions = ref(null)
const editingSession = ref(null)
const patientToDelete = ref(null)
const sessionToDelete = ref(null)

// رسالة حذف الجلسة
const deleteSessionMessage = computed(() => {
  if (sessionToDelete.value?.title) {
    return `هل أنت متأكد من حذف الجلسة "${sessionToDelete.value.title}"؟`
  }
  return 'هل أنت متأكد من حذف هذه الجلسة؟'
})

// بيانات الجلسات
const patientSessions = ref([])

// الحسابات
const filteredPatients = computed(() => {
  return patients.value.filter(patient => {
    const matchesSearch = !filters.search || 
      patient.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      patient.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      patient.phone.includes(filters.search)
    
    const matchesStatus = !filters.status || patient.status === filters.status
    const matchesCondition = !filters.condition || 
      patient.conditions.some(condition => 
        condition.toLowerCase().includes(filters.condition.toLowerCase())
      )
    
    return matchesSearch && matchesStatus && matchesCondition
  })
})

const paginatedPatients = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.itemsPerPage
  const end = start + pagination.itemsPerPage
  return filteredPatients.value.slice(start, end)
})

// التقسيم الصفحي
const currentPage = computed(() => pagination.currentPage)
const itemsPerPage = computed(() => pagination.itemsPerPage)
const totalPages = computed(() => Math.ceil(filteredPatients.value.length / itemsPerPage.value))

const startItem = computed(() => ((currentPage.value - 1) * itemsPerPage.value) + 1)
const endItem = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredPatients.value.length))

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) pages.push(i)
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// دوال المرضى
const resetFilters = () => {
  Object.assign(filters, {
    search: '',
    status: '',
    condition: ''
  })
  pagination.currentPage = 1
}

const applyFilters = () => {
  pagination.currentPage = 1
}

const updateFilters = (newFilters) => {
  Object.assign(filters, newFilters)
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    pagination.currentPage = page
  }
}

const updateItemsPerPage = (value) => {
  pagination.currentPage = 1
  pagination.itemsPerPage = parseInt(value)
}

const openCreatePatient = () => {
  editingPatient.value = null
  patientModalOpen.value = true
}

const editPatient = (patient) => {
  editingPatient.value = patient
  patientModalOpen.value = true
}

const viewProfile = (patient) => {
  viewingPatient.value = patient
  profileModalOpen.value = true
}

const closePatientModal = () => {
  patientModalOpen.value = false
  editingPatient.value = null
}

const closeProfileModal = () => {
  profileModalOpen.value = false
  viewingPatient.value = null
}

const savePatient = async (patientData) => {
  try {
    if (editingPatient.value) {
      // تحديث المريض الموجود
      const index = patients.value.findIndex(p => p.id === editingPatient.value.id)
      if (index !== -1) {
        patients.value[index] = { 
          ...editingPatient.value, 
          ...patientData,
          age: patientData.dateOfBirth ? calculateAge(patientData.dateOfBirth) : editingPatient.value.age
        }
      }
    } else {
      // إضافة مريض جديد
      const newPatient = {
        id: Date.now(),
        ...patientData,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
        totalSessions: 0,
        lastSession: null,
        nextSession: null,
        age: patientData.dateOfBirth ? calculateAge(patientData.dateOfBirth) : 0,
        createdAt: new Date().toISOString().split('T')[0]
      }
      patients.value.unshift(newPatient)
    }
    
    patientModalOpen.value = false
  } catch (error) {
    console.error('Error saving patient:', error)
  }
}

// دوال حذف المريض
const deletePatient = (patient) => {
  patientToDelete.value = patient
  deletePatientModalOpen.value = true
}

const confirmDeletePatient = () => {
  if (patientToDelete.value) {
    patients.value = patients.value.filter(p => p.id !== patientToDelete.value.id)
    deletePatientModalOpen.value = false
    patientToDelete.value = null
  }
}

const cancelDeletePatient = () => {
  deletePatientModalOpen.value = false
  patientToDelete.value = null
}

// دوال الجلسات
const openSessionsModal = (patient) => {
  selectedPatientForSessions.value = patient
  // تحميل جلسات المريض
  patientSessions.value = sampleSessions.filter(session => session.patientId === patient.id)
  sessionsModalOpen.value = true
}

const closeSessionsModal = () => {
  sessionsModalOpen.value = false
  selectedPatientForSessions.value = null
  patientSessions.value = []
}

const openAddSessionModal = () => {
  editingSession.value = null
  sessionModalOpen.value = true
}

const editSession = (session) => {
  editingSession.value = session
  sessionModalOpen.value = true
}

const closeSessionModal = () => {
  sessionModalOpen.value = false
  editingSession.value = null
}

const saveSession = async (sessionData) => {
  try {
    if (editingSession.value) {
      // تحديث الجلسة
      const index = patientSessions.value.findIndex(s => s.id === editingSession.value.id)
      if (index !== -1) {
        patientSessions.value[index] = { 
          ...editingSession.value, 
          ...sessionData 
        }
      }
    } else {
      // إضافة جلسة جديدة
      const newSession = {
        id: Date.now(),
        patientId: selectedPatientForSessions.value.id,
        ...sessionData
      }
      patientSessions.value.unshift(newSession)
    }
    
    sessionModalOpen.value = false
  } catch (error) {
    console.error('Error saving session:', error)
  }
}

// دوال حذف الجلسة
const deleteSession = (session) => {
  sessionToDelete.value = session
  deleteSessionModalOpen.value = true
}

const confirmDeleteSession = () => {
  if (sessionToDelete.value) {
    patientSessions.value = patientSessions.value.filter(s => s.id !== sessionToDelete.value.id)
    deleteSessionModalOpen.value = false
    sessionToDelete.value = null
  }
}

const cancelDeleteSession = () => {
  deleteSessionModalOpen.value = false
  sessionToDelete.value = null
}

const calculateAge = (dateOfBirth) => {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

// بيانات المثال للجلسات
const sampleSessions = [
  {
    id: 1,
    patientId: 1,
    title: 'جلسة علاج سلوكي',
    date: '2024-01-20',
    time: '14:00',
    therapist: 'د. أحمد محمد',
    status: 'scheduled',
    progress: 0,
    notes: 'التركيز على تقنيات إدارة القلق'
  }
]

// بيانات المثال للمرضى
const samplePatients = [
  {
    id: 1,
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '+966500000001',
    dateOfBirth: '1990-05-15',
    age: 33,
    gender: 'male',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    conditions: ['قلق', 'اكتئاب'],
    totalSessions: 12,
    lastSession: '2024-01-15',
    nextSession: '2024-01-25',
    status: 'active',
    address: 'الرياض، حي الملز',
    therapyGoals: 'التقليل من نوبات القلق وتحسين النوم',
    createdAt: '2024-01-01'
  }
]

// جلب البيانات
const fetchPatients = async () => {
  loading.value = true
  try {
    // محاكاة جلب البيانات من API
    await new Promise(resolve => setTimeout(resolve, 1000))
    patients.value = samplePatients
  } catch (error) {
    console.error('Error fetching patients:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPatients()
})
</script>