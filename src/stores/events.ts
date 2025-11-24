import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export const useEventStore = defineStore('events', () => {
  const events = ref([])
  const currentPage = ref(1)
  const totalPages = ref(1)
  const perPage = ref(15)
  const loading = ref(false)
  const currentEvent = ref(null)

  // جلب الفعاليات من API مع إضافة header اللغة
  const fetchEvents = async (filters = {}) => {
    try {
      loading.value = true
      
      // الحصول على اللغة من localStorage أو استخدام الافتراضي
      const currentLanguage = localStorage.getItem('preferredLanguage') || 'ar'
      
      const params = {
        page: currentPage.value,
        per_page: perPage.value,
        ...filters
      }

      const response = await api.get('/events', { 
        params,
        headers: {
          'Accept-Language': currentLanguage
        }
      })
      
      events.value = response.data.data
      currentPage.value = response.data.current_page
      totalPages.value = response.data.last_page
      
      return response.data
    } catch (error) {
      console.error('Error fetching events:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // جلب فعالية محددة مع header اللغة
  const fetchEventById = async (id) => {
    try {
      loading.value = true
      
      const currentLanguage = localStorage.getItem('preferredLanguage') || 'ar'
      
      const response = await api.get(`/events/${id}`, {
        headers: {
          'Accept-Language': currentLanguage
        }
      })
      
      currentEvent.value = response.data.data
      return response.data
    } catch (error) {
      console.error('Error fetching event:', error)
      throw error
    } finally {
      loading.value = false
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

  // تحديث فعالية
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
      
      // تحديث البيانات المحلية إذا كانت موجودة
      const index = events.value.findIndex(event => event.id === eventId)
      if (index !== -1) {
        events.value[index] = response.data.data
      }
      
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
      
      // تحديث البيانات المحلية إذا كانت موجودة
      const index = events.value.findIndex(event => event.id === eventId)
      if (index !== -1) {
        events.value[index].is_published = isPublished
      }
      
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

  // البحث في الفعاليات
  const searchEvents = async (searchTerm) => {
    try {
      loading.value = true
      
      const currentLanguage = localStorage.getItem('preferredLanguage') || 'ar'
      
      const response = await api.get('/events', {
        params: {
          search: searchTerm,
          page: currentPage.value,
          per_page: perPage.value
        },
        headers: {
          'Accept-Language': currentLanguage
        }
      })
      
      events.value = response.data.data
      currentPage.value = response.data.current_page
      totalPages.value = response.data.last_page
      
      return response.data
    } catch (error) {
      console.error('Error searching events:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // تصفية الفعاليات حسب النوع
  const filterEventsByType = async (type) => {
    try {
      loading.value = true
      
      const currentLanguage = localStorage.getItem('preferredLanguage') || 'ar'
      
      const response = await api.get('/events', {
        params: {
          type: type,
          page: currentPage.value,
          per_page: perPage.value
        },
        headers: {
          'Accept-Language': currentLanguage
        }
      })
      
      events.value = response.data.data
      currentPage.value = response.data.current_page
      totalPages.value = response.data.last_page
      
      return response.data
    } catch (error) {
      console.error('Error filtering events:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // جلب الفعاليات المنشورة فقط
  const fetchPublishedEvents = async () => {
    try {
      loading.value = true
      
      const currentLanguage = localStorage.getItem('preferredLanguage') || 'ar'
      
      const response = await api.get('/events', {
        params: {
          is_published: true,
          page: currentPage.value,
          per_page: perPage.value
        },
        headers: {
          'Accept-Language': currentLanguage
        }
      })
      
      events.value = response.data.data
      currentPage.value = response.data.current_page
      totalPages.value = response.data.last_page
      
      return response.data
    } catch (error) {
      console.error('Error fetching published events:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // إعادة تعيين الصفحة
  const resetPage = () => {
    currentPage.value = 1
  }

  // تغيير الصفحة
  const setPage = (page) => {
    currentPage.value = page
  }

  // تغيير عدد العناصر في الصفحة
  const setPerPage = (count) => {
    perPage.value = count
  }

  // مسح الفعالية الحالية
  const clearCurrentEvent = () => {
    currentEvent.value = null
  }

  // تحديث الفعالية محلياً
  const updateEventLocally = (updatedEvent) => {
    const index = events.value.findIndex(event => event.id === updatedEvent.id)
    if (index !== -1) {
      events.value[index] = updatedEvent
    }
    
    if (currentEvent.value && currentEvent.value.id === updatedEvent.id) {
      currentEvent.value = updatedEvent
    }
  }

  return {
    // State
    events,
    currentPage,
    totalPages,
    perPage,
    loading,
    currentEvent,
    
    // Actions
    fetchEvents,
    fetchEventById,
    createEvent,
    updateEvent,
    updateEventPublishStatus,
    deleteEvent,
    searchEvents,
    filterEventsByType,
    fetchPublishedEvents,
    resetPage,
    setPage,
    setPerPage,
    clearCurrentEvent,
    updateEventLocally
  }
})