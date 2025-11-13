import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export const useEventStore = defineStore('events', () => {
  const events = ref([])
  const currentPage = ref(1)
  const totalPages = ref(1)
  const perPage = ref(15)

  // جلب الفعاليات من API
  const fetchEvents = async (filters = {}) => {
    try {
      const params = {
        page: currentPage.value,
        per_page: perPage.value,
        ...filters
      }

      const response = await api.get('/events', { params })
      
      events.value = response.data.data
      currentPage.value = response.data.current_page
      totalPages.value = response.data.last_page
      
      return response.data
    } catch (error) {
      throw error
    }
  }

  // إنشاء فعالية جديدة
  const createEvent = async (eventData) => {
    try {
      const formData = new FormData()
      
      Object.keys(eventData).forEach(key => {
        const value = eventData[key]
        
        if (key === 'media_file' && value) {
          formData.append('media', value)
        } else if (key === 'speakers' && value) {
          formData.append(key, JSON.stringify(value))
        } else if (value !== null && value !== undefined && value !== '') {
          formData.append(key, value)
        }
      })

      const response = await api.post('/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      events.value.unshift(response.data.data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  // تحديث فعالية - إصدار معدل للحفاظ على التحديثات المحلية
  const updateEvent = async (eventId, eventData) => {
    try {
      const formData = new FormData()
      
      Object.keys(eventData).forEach(key => {
        const value = eventData[key]
        
        if (key === 'media_file' && value) {
          formData.append('media', value)
        } else if (key === 'speakers' && value) {
          formData.append(key, JSON.stringify(value))
        } else if (value !== null && value !== undefined && value !== '') {
          formData.append(key, value)
        }
      })

      formData.append('_method', 'PUT')

      const response = await api.post(`/events/${eventId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      // لا نقوم بتحديث البيانات المحلية هنا - نتركها كما هي
      // لأن التحديث المحلي تم مسبقاً في handleTogglePublish
      
      return response.data
    } catch (error) {
      throw error
    }
  }

  // تحديث حالة النشر فقط
  const updateEventPublishStatus = async (eventId, isPublished) => {
    try {
      const formData = new FormData()
      formData.append('is_published', isPublished ? '1' : '0')
      formData.append('_method', 'PUT')

      const response = await api.post(`/events/${eventId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      return response.data
    } catch (error) {
      throw error
    }
  }

  // حذف فعالية
  const deleteEvent = async (eventId) => {
    try {
      await api.delete(`/events/${eventId}`)
      
      events.value = events.value.filter(event => event.id !== eventId)
      
      return true
    } catch (error) {
      throw error
    }
  }

  // تغيير الصفحة
  const setPage = (page) => {
    currentPage.value = page
  }

  return {
    events,
    currentPage,
    totalPages,
    perPage,
    fetchEvents,
    createEvent,
    updateEvent,
    updateEventPublishStatus, // أضف هذه الدالة الجديدة
    deleteEvent,
    setPage
  }
})