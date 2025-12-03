// stores/frontendScales.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export const useFrontendScalesStore = defineStore('frontendScales', () => {
  // الحالة - خاصة بالفرونت فقط
  const scales = ref([])
  const categories = ref([])
  const popularMeasures = ref([])
  const currentScale = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const dataLoaded = ref(false)

  // 🔥 NEW: Interceptor لمنع التحويل إلى admin
  const setupApiInterceptors = () => {
    // إذا كنت تستخدم axios، أضف interceptor هنا
    if (api.interceptors) {
      api.interceptors.response.use(
        response => response,
        error => {
          if (error.response?.status === 401) {
            console.log('🔒 خطأ 401 - فتح مودال التسجيل بدلاً من التحويل إلى admin')
            // لا تقم بأي تحويل، دع المكون الرئيسي يتعامل معه
            return Promise.reject({ 
              ...error, 
              requiresLogin: true,
              blockedRedirect: true 
            })
          }
          
          // 🔥 NEW: منع التحويل في حالات أخرى
          if (error.response?.status >= 300 && error.response?.status < 400) {
            console.log('🚫 تم منع تحويل غير مصرح به')
            return Promise.reject({ 
              ...error, 
              blockedRedirect: true 
            })
          }
          
          return Promise.reject(error)
        }
      )
    }
  }

  // استدعاء الإعداد عند إنشاء الـ store
  setupApiInterceptors()

  // ==================== دوال جلب البيانات للفرونت ====================

  const fetchFrontendScales = async (params = {}) => {
    // منع إعادة التحميل إذا كانت البيانات محملة
    if (dataLoaded.value && !params.force) {
      console.log('✅ بيانات المقاييس محملة مسبقاً')
      return
    }

    console.log('🔄 جلب المقاييس للصفحة الرئيسية...')
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/frontend/scales', { params })
      
      // معالجة الاستجابة
      if (response.data && Array.isArray(response.data)) {
        scales.value = response.data
      } else if (response.data && response.data.data) {
        scales.value = response.data.data
      } else {
        scales.value = []
      }
      
      dataLoaded.value = true
      console.log(`📊 تم تحميل ${scales.value.length} مقياس للصفحة الرئيسية`)
      
    } catch (err) {
      console.error('❌ خطأ في جلب المقاييس:', err)
      handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchFrontendCategories = async () => {
    try {
      console.log('🔄 جلب تصنيفات المقاييس للصفحة الرئيسية...')
      const response = await api.get('/frontend/scales/categories')
      
      if (response.data && response.data.data) {
        categories.value = response.data.data
      } else {
        categories.value = response.data
      }
      
      console.log(`📂 تم تحميل ${categories.value.length} تصنيف للصفحة الرئيسية`)
    } catch (err) {
      console.error('❌ خطأ في جلب التصنيفات:', err)
      handleError(err)
      throw err
    }
  }

  const fetchFrontendScaleById = async (id) => {
    loading.value = true
    error.value = null
    try {
      console.log(`🔄 جلب المقياس ${id} للصفحة الرئيسية...`)
      
      const response = await api.get(`/frontend/scales/${id}`)
      
      let scaleData
      if (response.data && response.data.data) {
        scaleData = response.data.data
      } else {
        scaleData = response.data
      }
      
      console.log('✅ تم جلب بيانات المقياس للصفحة الرئيسية:', scaleData)
      currentScale.value = scaleData
      return scaleData
    } catch (err) {
      console.error(`❌ خطأ في جلب المقياس ${id}:`, err)
      handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchFrontendFullScale = async (id) => {
    loading.value = true
    error.value = null
    try {
      console.log(`🔄 جلب المقياس الكامل ${id} للصفحة الرئيسية...`)
      
      const response = await api.get(`/frontend/scales/${id}/full`)
      
      let scaleData
      if (response.data && response.data.data) {
        scaleData = response.data.data
      } else {
        scaleData = response.data
      }
      
      console.log('✅ المقياس الكامل للصفحة الرئيسية:', scaleData)
      currentScale.value = scaleData
      return scaleData
    } catch (err) {
      console.error(`❌ خطأ في جلب المقياس الكامل ${id}:`, err)
      handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🔥 NEW: إرسال إجابات الاختبار للمستخدمين المسجلين
  const submitFrontendTest = async (scaleId, answers) => {
    loading.value = true
    error.value = null
    try {
      console.log(`🔄 إرسال إجابات الاختبار للمقياس ${scaleId}...`)
      
      const response = await api.post(`/frontend/scales/${scaleId}/submit`, {
        answers: answers
      })
      
      console.log('✅ تم حساب النتيجة بنجاح:', response.data)
      return response.data
    } catch (err) {
      console.error('❌ خطأ في إرسال الإجابات:', err)
      handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🔥 NEW: إرسال إجابات للمستخدمين غير المسجلين
  const submitPublicTest = async (scaleId, answers) => {
    loading.value = true
    error.value = null
    try {
      console.log(`🔄 إرسال إجابات للمستخدمين غير المسجلين ${scaleId}...`)
      
      const response = await api.post(`/frontend/scales/${scaleId}/submit-public`, {
        answers: answers
      })
      
      console.log('✅ تم حساب النتيجة للمستخدمين غير المسجلين:', response.data)
      return response.data
    } catch (err) {
      console.error('❌ خطأ في إرسال الإجابات العامة:', err)
      handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 🔥 NEW: دالة محسنة لحفظ النتيجة بعد التسجيل
  const saveAssessmentResult = async (scaleId, sessionKey) => {
    loading.value = true
    error.value = null
    try {
      console.log(`💾 حفظ النتيجة بعد التسجيل للمقياس ${scaleId}...`)
      console.log(`🔑 مفتاح الجلسة: ${sessionKey}`)
      
      // 🔥 NEW: التحقق من صحة المدخلات
      if (!scaleId || !sessionKey) {
        console.error('❌ بيانات غير كافية لحفظ النتيجة:', { scaleId, sessionKey })
        return {
          success: false,
          message: 'بيانات غير كافية لحفظ النتيجة',
          error: 'MISSING_REQUIRED_DATA'
        }
      }
      
      // 🔥 NEW: محاولة حفظ النتيجة
      const response = await api.post(`/frontend/scales/${scaleId}/save-result`, {
        session_key: sessionKey
      })
      
      console.log('✅ تم حفظ النتيجة بنجاح:', response.data)
      
      // 🔥 NEW: التحقق من استجابة الخادم
      if (response.data && response.data.success) {
        return response.data
      } else {
        console.warn('⚠️ استجابة الخادم تشير إلى فشل:', response.data)
        return {
          success: false,
          message: response.data?.message || 'فشل في حفظ النتيجة',
          error: 'SERVER_RESPONSE_ERROR',
          serverResponse: response.data
        }
      }
      
    } catch (err) {
      console.error('❌ خطأ في حفظ النتيجة:', err)
      
      // 🔥 NEW: معالجة مفصلة للخطأ
      let errorMessage = 'فشل في حفظ النتيجة'
      let errorType = 'UNKNOWN_ERROR'
      
      if (err.response) {
        // خطأ من الخادم
        errorMessage = err.response.data?.message || `خطأ ${err.response.status} من الخادم`
        errorType = `SERVER_ERROR_${err.response.status}`
        console.error('📡 تفاصيل الخطأ من الخادم:', err.response.data)
      } else if (err.request) {
        // خطأ في الشبكة
        errorMessage = 'تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.'
        errorType = 'NETWORK_ERROR'
      } else {
        // خطأ آخر
        errorMessage = err.message || 'حدث خطأ غير متوقع'
        errorType = 'CLIENT_ERROR'
      }
      
      // 🔥 NEW: إرجاع بيانات افتراضية في حالة الخطأ
      return {
        success: false,
        message: errorMessage,
        error: errorType,
        requiresLogin: err.requiresLogin || false,
        blockedRedirect: err.blockedRedirect || false,
        originalError: err
      }
    } finally {
      loading.value = false
    }
  }

  // 🔥 NEW: دالة محسنة للتحقق من المصادقة تلقائياً
  const submitTestWithAuthCheck = async (scaleId, answers) => {
    loading.value = true
    error.value = null
    
    try {
      console.log(`🔄 إرسال إجابات مع التحقق من المصادقة للمقياس ${scaleId}...`)
      console.log('📤 بيانات الإجابات المرسلة:', answers)
      
      // 🔥 NEW: تحقق إضافي لمنع التحويل إلى admin
      if (window.location.pathname.includes('/admin')) {
        console.error('❌ محاولة الوصول إلى admin من الفرونتند - فتح التسجيل')
        return {
          requires_login: true,
          data: {
            session_key: `temp_admin_block_${Date.now()}_${scaleId}`
          },
          message: 'يجب التسجيل لحفظ النتيجة',
          success: false,
          blocked_admin_redirect: true
        }
      }
      
      // محاولة الإرسال كمسجل أولاً
      try {
        console.log('👤 محاولة الإرسال كمستخدم مسجل...')
        const response = await api.post(`/frontend/scales/${scaleId}/submit`, {
          answers: answers
        })
        
        console.log('✅ تم الإرسال بنجاح (مستخدم مسجل):', response.data)
        return response.data
        
      } catch (authError) {
        console.log('❌ فشل الإرسال كمسجل:', authError.response?.status, authError.response?.data)
        
        // إذا فشل الإرسال كمسجل، حاول كزائر
        if (authError.response && authError.response.status === 401) {
          console.log('🔐 المستخدم غير مسجل، محاولة الإرسال كزائر...')
          try {
            const publicResponse = await api.post(`/frontend/scales/${scaleId}/submit-public`, {
              answers: answers
            })
            
            console.log('✅ تم الإرسال بنجاح (مستخدم غير مسجل):', publicResponse.data)
            
            // إضافة علامة requires_login للاستجابة
            const result = {
              ...publicResponse.data,
              requires_login: true
            }
            
            // التأكد من وجود data object
            if (!result.data) {
              result.data = {}
            }
            
            // إنشاء مفتاح جلسة مؤقت إذا لم يكن موجوداً
            if (!result.data.session_key) {
              result.data.session_key = `temp_${Date.now()}_${scaleId}`
            }
            
            return result
            
          } catch (publicError) {
            console.error('❌ فشل الإرسال كزائر:', publicError.response?.status, publicError.response?.data)
            
            // حتى إذا فشل الإرسال كزائر، نعيد requires_login
            return {
              requires_login: true,
              data: {
                session_key: `temp_error_${Date.now()}_${scaleId}`
              },
              message: 'يجب التسجيل لحفظ النتيجة',
              success: false
            }
          }
        }
        
        // إذا كان الخطأ ليس 401، أعد رميه
        console.error('❌ خطأ غير متوقع في الإرسال:', authError)
        throw authError
      }
      
    } catch (err) {
      console.error('❌ خطأ عام في إرسال الإجابات:', err)
      
      // 🔥 NEW: معالجة خاصة لأخطاء التحويل
      if (err.blockedRedirect) {
        console.log('🚫 تم منع تحويل إلى admin - فتح التسجيل')
        return {
          requires_login: true,
          data: {
            session_key: `temp_redirect_block_${Date.now()}_${scaleId}`
          },
          message: 'يجب التسجيل لحفظ النتيجة',
          success: false,
          blocked_redirect: true
        }
      }
      
      // 🔥 NEW: إرجاع response افتراضي في حالة الخطأ
      return {
        requires_login: true,
        data: {
          session_key: `temp_catch_${Date.now()}_${scaleId}`
        },
        message: 'حدث خطأ في الإرسال، يرجى التسجيل',
        success: false,
        error: err.message
      }
    } finally {
      loading.value = false
    }
  }

  const fetchPopularScales = async () => {
    try {
      console.log('🔄 جلب المقاييس الشعبية...')
      const response = await api.get('/frontend/scales/popular')
      
      let popularData
      if (response.data && response.data.data) {
        popularData = response.data.data
      } else {
        popularData = response.data
      }
      
      popularMeasures.value = popularData
      console.log('⭐ تم تحميل المقاييس الشعبية:', popularData.length)
      return popularData
    } catch (err) {
      console.error('❌ خطأ في جلب المقاييس الشعبية:', err)
      handleError(err)
      throw err
    }
  }

  const fetchScalesByCategory = async (categoryId) => {
    try {
      console.log(`🔄 جلب المقاييس للفئة ${categoryId}...`)
      const response = await api.get(`/frontend/scales/category/${categoryId}`)
      
      let categoryData
      if (response.data && response.data.data) {
        categoryData = response.data.data
      } else {
        categoryData = response.data
      }
      
      return categoryData
    } catch (err) {
      console.error('❌ خطأ في جلب مقاييس الفئة:', err)
      handleError(err)
      throw err
    }
  }

  // ==================== دوال البحث والفلترة ====================

  const searchScales = async (searchQuery) => {
    try {
      console.log(`🔍 البحث عن: "${searchQuery}"`)
      return await fetchFrontendScales({ search: searchQuery, force: true })
    } catch (err) {
      console.error('❌ خطأ في البحث:', err)
      throw err
    }
  }

  const filterByCategory = async (categoryId) => {
    try {
      console.log(`🎯 تصفية حسب الفئة: ${categoryId}`)
      if (categoryId === 'all') {
        return await fetchFrontendScales({ force: true })
      } else {
        return await fetchScalesByCategory(categoryId)
      }
    } catch (err) {
      console.error('❌ خطأ في التصفية:', err)
      throw err
    }
  }

  // ==================== دوال مساعدة ====================

  const handleError = (err) => {
    // 🔥 NEW: معالجة خاصة لأخطاء الشبكة
    if (err.networkError) {
      error.value = 'تعذر الاتصال بالخادم. يرجى التأكد من تشغيل الخادم الخلفي على المنفذ 8000.'
      console.error('🌐 خطأ في الشبكة:', err.message)
      return
    }
    
    // 🔥 NEW: معالجة خاصة لأخطاء التحويل
    if (err.blockedRedirect) {
      error.value = 'تم منع تحويل غير مصرح به. يرجى التسجيل للمتابعة.'
      return
    }
    
    if (err.response) {
      let message = `خطأ ${err.response.status}: `
      
      if (err.response.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat()
        message += errors.join(', ')
      } else if (err.response.data?.message) {
        message += err.response.data.message
      } else {
        message += 'فشل في العملية'
      }
      
      error.value = message
      
      console.error('تفاصيل الخطأ:', {
        status: err.response.status,
        data: err.response.data,
        message: message
      })
    } else if (err.request) {
      error.value = 'تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت وتشغيل الخادم الخلفي.'
    } else {
      error.value = err.message || 'حدث خطأ غير متوقع'
    }
  }

  // 🔥 NEW: دالة للتحقق من حالة الخادم
  const checkServerStatus = async () => {
    try {
      const response = await api.get('/')
      return response.status === 200
    } catch (error) {
      console.error('❌ الخادم غير متاح:', error)
      return false
    }
  }

  const resetError = () => {
    error.value = null
  }

  const resetCurrentScale = () => {
    currentScale.value = null
  }

  const resetAllData = () => {
    scales.value = []
    categories.value = []
    popularMeasures.value = []
    currentScale.value = null
    dataLoaded.value = false
    error.value = null
    console.log('🧹 تم إعادة تعيين جميع بيانات الفرونت')
  }

  const getCategoryName = (categoryId) => {
    const category = categories.value.find(cat => cat.id === categoryId)
    return category ? category.name_ar : 'غير معروف'
  }

  const getScaleById = (id) => {
    return scales.value.find(scale => scale.id === id)
  }

  // ==================== الحسابات المحسوبة ====================

  const activeScales = () => {
    return scales.value.filter(scale => scale.is_active)
  }

  const scalesCount = () => {
    return scales.value.length
  }

  const categoriesCount = () => {
    return categories.value.length
  }

  return {
    // الحالة
    scales,
    categories,
    popularMeasures,
    currentScale,
    loading,
    error,
    dataLoaded,

    // دوال جلب البيانات
    fetchFrontendScales,
    fetchFrontendCategories,
    fetchFrontendScaleById,
    fetchFrontendFullScale,
    submitFrontendTest,
    submitPublicTest,
    saveAssessmentResult,
    submitTestWithAuthCheck,
    fetchPopularScales,
    fetchScalesByCategory,

    // دوال البحث والفلترة
    searchScales,
    filterByCategory,

    // دوال مساعدة
    resetError,
    resetCurrentScale,
    resetAllData,
    getCategoryName,
    getScaleById,
    checkServerStatus,
    handleError,

    // الحسابات المحسوبة
    activeScales,
    scalesCount,
    categoriesCount
  }
})