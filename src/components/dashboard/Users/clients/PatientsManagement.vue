<template>
  <div class="space-y-6 p-4">
    <!-- Header -->
    <PatientsHeader @create-patient="openCreatePatient" />
    
    <!-- Filters -->
    <PatientsFilters 
      :filters="localFilters"
      @apply-filters="applyFilters"
      @reset-filters="resetFilters"
      @update:filters="updateFilters"
    />
    
    <!-- Table -->
    <PatientsTable 
      :patients="patientsStore.patients"
      :loading="patientsStore.loading"
      @view-profile="viewProfile"
      @edit-patient="editPatient"
      @delete-patient="deletePatient"
      @open-sessions="openSessionsModal"
    />
    
    <!-- Empty State -->
    <PatientsEmptyState 
      v-if="!patientsStore.loading && patientsStore.patients.length === 0"
      @create-patient="openCreatePatient"
    />
    
    <!-- Pagination -->
    <PatientsPagination 
      v-if="patientsStore.patients.length > 0"
      :current-page="patientsStore.currentPage"
      :total-pages="patientsStore.totalPages"
      :start-item="startItem"
      :end-item="endItem"
      :total-items="patientsStore.totalItems"
      :items-per-page="patientsStore.perPage"
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { usePatientsStore } from '@/stores/patients'
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

// استخدام store المرضى
const patientsStore = usePatientsStore()

// الفلاتر المحلية
const localFilters = reactive({
  search: '',
  status: '',
  condition: ''
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
const startItem = computed(() => {
  return ((patientsStore.currentPage - 1) * patientsStore.perPage) + 1
})

const endItem = computed(() => {
  return Math.min(patientsStore.currentPage * patientsStore.perPage, patientsStore.totalItems)
})

const visiblePages = computed(() => {
  const pages = []
  const total = patientsStore.totalPages
  const current = patientsStore.currentPage
  
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

// دوال الفلترة
const resetFilters = () => {
  Object.assign(localFilters, {
    search: '',
    status: '',
    condition: ''
  })
  patientsStore.resetFilters()
  patientsStore.setPage(1)
  patientsStore.fetchPatients()
}

const applyFilters = () => {
  patientsStore.setFilters(localFilters)
  patientsStore.setPage(1)
  patientsStore.fetchPatients()
}

const updateFilters = (newFilters) => {
  Object.assign(localFilters, newFilters)
}

// دوال التقسيم الصفحي
const goToPage = (page) => {
  if (page >= 1 && page <= patientsStore.totalPages && page !== patientsStore.currentPage) {
    patientsStore.setPage(page)
    patientsStore.fetchPatients()
  }
}

const updateItemsPerPage = (value) => {
  patientsStore.setPerPage(parseInt(value))
  patientsStore.fetchPatients()
}

// دوال المرضى
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
      await patientsStore.updatePatient(editingPatient.value.id, patientData)
    } else {
      // إضافة مريض جديد
      await patientsStore.createPatient(patientData)
    }
    
    patientModalOpen.value = false
  } catch (error) {
    console.error('Error saving patient:', error)
    // يمكن إضافة عرض رسالة خطأ للمستخدم
  }
}

// دوال حذف المريض
const deletePatient = (patient) => {
  patientToDelete.value = patient
  deletePatientModalOpen.value = true
}

const confirmDeletePatient = async () => {
  if (patientToDelete.value) {
    try {
      await patientsStore.deletePatient(patientToDelete.value.id)
      deletePatientModalOpen.value = false
      patientToDelete.value = null
    } catch (error) {
      console.error('Error deleting patient:', error)
    }
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

// جلب البيانات عند التحميل
onMounted(() => {
  patientsStore.fetchPatients()
})

// مراقبة تغييرات الفلاتر للتحديث التلقائي
watch(localFilters, () => {
  applyFilters()
}, { deep: true })
</script>