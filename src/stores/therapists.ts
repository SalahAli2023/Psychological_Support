// therapists.ts - النسخة الكاملة مع التعديلات
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export const useTherapistStore = defineStore('therapists', () => {
  const therapists = ref([])
  const currentPage = ref(1)
  const totalPages = ref(1)
  const perPage = ref(10)
  const loading = ref(false)

  // جلب قائمة المعالجين - معدل
  const fetchTherapists = async (filters = {}) => {
    try {
      loading.value = true
      
      const params = {
        page: currentPage.value,
        per_page: perPage.value,
        ...filters
      }

      const response = await api.get('/therapists', { params })
      
      therapists.value = response.data.data
      currentPage.value = response.data.meta.current_page
      totalPages.value = response.data.meta.last_page // تم التصحيح هنا
      perPage.value = response.data.meta.per_page
      
      return response.data
    } catch (error) {
      console.error('Error fetching therapists:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // جلب معالج محدد
  const fetchTherapist = async (therapistId) => {
    try {
      const response = await api.get(`/therapists/${therapistId}`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching therapist:', error)
      throw error
    }
  }

  // إنشاء معالج جديد
 const createTherapist = async (therapistData) => {
  try {
    console.log('Sending therapist data:', therapistData)
    
    const response = await api.post('/therapists', therapistData)
    
    // إضافة المعالج الجديد للقائمة
    therapists.value.unshift(response.data.data)
    
    return response.data
  } catch (error) {
    console.error('Error creating therapist:', error)
    console.error('Error response:', error.response)
    console.error('Error data:', error.response?.data)
    throw error
  }
}
  // تحديث معالج - معدل
 const updateTherapist = async (therapistId, therapistData) => {
  try {
    console.log('Updating therapist:', therapistId, therapistData);
    
    // إزالة الحقول غير المطلوبة وتأكد من أن phone هو string
    const { qualifications, certifications, schedules, user, ...dataToSend } = therapistData
    
    // تأكد من أن phone هو string
    if (dataToSend.phone !== undefined) {
      dataToSend.phone = String(dataToSend.phone)
    }
    
    // تأكد من أن جميع القيم النصية هي strings
    const stringFields = ['name_ar', 'name_en', 'title_ar', 'title_en', 'specialty_ar', 'specialty_en', 'bio_ar', 'bio_en', 'gender', 'status']
    stringFields.forEach(field => {
      if (dataToSend[field] !== undefined) {
        dataToSend[field] = String(dataToSend[field])
      }
    })
    
    // تأكد من أن methodologies هي arrays
    if (dataToSend.methodologies_ar && !Array.isArray(dataToSend.methodologies_ar)) {
      dataToSend.methodologies_ar = [dataToSend.methodologies_ar]
    }
    if (dataToSend.methodologies_en && !Array.isArray(dataToSend.methodologies_en)) {
      dataToSend.methodologies_en = [dataToSend.methodologies_en]
    }
    
    console.log('Data to send after processing:', dataToSend)
    
    const response = await api.put(`/therapists/${therapistId}`, dataToSend)
    
    // تحديث البيانات المحلية
    const index = therapists.value.findIndex(t => t.id === therapistId)
    if (index !== -1) {
      therapists.value[index] = { ...therapists.value[index], ...response.data.data }
    }
    
    return response.data
  } catch (error) {
    console.error('Error updating therapist:', error)
    
    if (error.response) {
      console.error('Response error:', error.response.data)
      console.error('Response status:', error.response.status)
    }
    
    throw new Error(error.response?.data?.message || 'فشل في تحديث بيانات المعالج')
  }
}
  // حذف معالج
  const deleteTherapist = async (therapistId) => {
    try {
      await api.delete(`/therapists/${therapistId}`)
      
      // إزالة من القائمة المحلية
      therapists.value = therapists.value.filter(therapist => therapist.id !== therapistId)
      
      return true
    } catch (error) {
      console.error('Error deleting therapist:', error)
      throw error
    }
  }

  // إدارة الشهادات - معدل
  const fetchCertifications = async (therapistId) => {
    try {
      const response = await api.get(`/therapists/${therapistId}/certifications`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching certifications:', error)
      throw error
    }
  }

  const createCertification = async (therapistId, certificationData) => {
    try {
      const response = await api.post(`/therapists/${therapistId}/certifications`, certificationData)
      return response.data
    } catch (error) {
      console.error('Error creating certification:', error)
      throw error
    }
  }

  const updateCertification = async (therapistId, certificationId, certificationData) => {
    try {
      const response = await api.put(`/therapists/${therapistId}/certifications/${certificationId}`, certificationData)
      return response.data
    } catch (error) {
      console.error('Error updating certification:', error)
      throw error
    }
  }

  const deleteCertification = async (therapistId, certificationId) => {
    try {
      await api.delete(`/therapists/${therapistId}/certifications/${certificationId}`)
      return true
    } catch (error) {
      console.error('Error deleting certification:', error)
      throw error
    }
  }

  // إدارة المؤهلات - معدل
  const fetchQualifications = async (therapistId) => {
    try {
      const response = await api.get(`/therapists/${therapistId}/qualifications`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching qualifications:', error)
      throw error
    }
  }

  const createQualification = async (therapistId, qualificationData) => {
    try {
      const response = await api.post(`/therapists/${therapistId}/qualifications`, qualificationData)
      return response.data
    } catch (error) {
      console.error('Error creating qualification:', error)
      throw error
    }
  }

  const updateQualification = async (therapistId, qualificationId, qualificationData) => {
    try {
      const response = await api.put(`/therapists/${therapistId}/qualifications/${qualificationId}`, qualificationData)
      return response.data
    } catch (error) {
      console.error('Error updating qualification:', error)
      throw error
    }
  }

  const deleteQualification = async (therapistId, qualificationId) => {
    try {
      await api.delete(`/therapists/${therapistId}/qualifications/${qualificationId}`)
      return true
    } catch (error) {
      console.error('Error deleting qualification:', error)
      throw error
    }
  }

  // إدارة الجداول - معدل
  const fetchSchedules = async (therapistId) => {
    try {
      const response = await api.get(`/therapists/${therapistId}/schedules`)
      return response.data.data
    } catch (error) {
      console.error('Error fetching schedules:', error)
      throw error
    }
  }

  const createSchedule = async (therapistId, scheduleData) => {
    try {
      const response = await api.post(`/therapists/${therapistId}/schedules`, scheduleData)
      return response.data
    } catch (error) {
      console.error('Error creating schedule:', error)
      throw error
    }
  }

  const updateSchedule = async (therapistId, scheduleId, scheduleData) => {
    try {
      const response = await api.put(`/therapists/${therapistId}/schedules/${scheduleId}`, scheduleData)
      return response.data
    } catch (error) {
      console.error('Error updating schedule:', error)
      throw error
    }
  }

  const deleteSchedule = async (therapistId, scheduleId) => {
    try {
      await api.delete(`/therapists/${therapistId}/schedules/${scheduleId}`)
      return true
    } catch (error) {
      console.error('Error deleting schedule:', error)
      throw error
    }
  }

  // تغيير الصفحة
  const setPage = (page) => {
    currentPage.value = page
  }

  // تغيير عدد العناصر لكل صفحة
  const setPerPage = (count) => {
    perPage.value = count
    currentPage.value = 1
  }

  return {
    therapists,
    currentPage,
    totalPages,
    perPage,
    loading,
    fetchTherapists,
    fetchTherapist,
    createTherapist,
    updateTherapist,
    deleteTherapist,
    fetchCertifications,
    createCertification,
    updateCertification,
    deleteCertification,
    fetchQualifications,
    createQualification,
    updateQualification,
    deleteQualification,
    fetchSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    setPage,
    setPerPage
  }
})