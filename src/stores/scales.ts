import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export interface ScaleCategory {
  id: string
  name_ar: string
  name_en: string
  description_ar?: string
  description_en?: string
  is_active: boolean
  scales_count?: number
  created_at?: string
  updated_at?: string
}

export interface Scale {
  id: string
  name_ar: string
  name_en: string
  description_ar?: string
  description_en?: string
  category_id: string
  image_url?: string
  max_score: number
  is_active: boolean
  questions_count?: number
  interpretations_count?: number
  created_at: string
  updated_at: string
  category?: ScaleCategory
  questions?: Question[]
  interpretations?: Interpretation[]
}

export interface Question {
  id: string
  scale_id: string
  question_text_ar: string
  question_text_en: string
  question_order: number
  options?: Option[]
  created_at?: string
  updated_at?: string
}

export interface Option {
  id: string
  question_id: string
  option_text_ar: string
  option_text_en: string
  score_value: number
  option_order: number
  created_at?: string
  updated_at?: string
}

export interface Interpretation {
  id: string
  scale_id: string
  min_score: number
  max_score: number
  interpretation_label_ar: string
  interpretation_label_en: string
  description_ar?: string
  description_en?: string
  color: string
  created_at?: string
  updated_at?: string
}

export interface ScaleStats {
  total_scales: number
  active_scales: number
  total_questions: number
  total_categories: number
}

export interface CreateScaleData {
  category_id: string
  name_ar: string
  name_en: string
  description_ar?: string
  description_en?: string
  image_url?: string
  max_score: number
  is_active?: boolean
  questions?: Array<{
    question_text_ar: string
    question_text_en: string
    question_order: number
    options: Array<{
      option_text_ar: string
      option_text_en: string
      score_value: number
      option_order: number
    }>
  }>
  interpretations?: Array<{
    min_score: number
    max_score: number
    interpretation_label_ar: string
    interpretation_label_en: string
    description_ar?: string
    description_en?: string
    color?: string
  }>
}

export const useScalesStore = defineStore('scales', () => {
  // الحالة
  const scales = ref<Scale[]>([])
  const categories = ref<ScaleCategory[]>([])
  const currentScale = ref<Scale | null>(null)
  const stats = ref<ScaleStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // الإجراءات
  const fetchScales = async (params?: any) => {
    console.log('🔄 جلب المقاييس...')
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/v1/psychological-scales', { params })
      console.log('✅ استجابة المقاييس:', response.data)
      
      scales.value = response.data.data || response.data
      console.log(`📊 تم تحميل ${scales.value.length} مقياس`)
      
    } catch (err: any) {
      console.error('❌ خطأ في جلب المقاييس:', err)
      handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchAllScales = async () => {
    try {
      console.log('🔄 جلب جميع المقاييس (للمسؤولين)...')
      const response = await api.get('/v1/psychological-scales/admin/all')
      scales.value = response.data.data || response.data
    } catch (err: any) {
      console.error('❌ خطأ في جلب جميع المقاييس:', err)
      handleError(err)
      throw err
    }
  }

  const fetchCategories = async () => {
    try {
      console.log('🔄 جلب تصنيفات المقاييس...')
      const response = await api.get('/v1/categories')
      console.log('✅ استجابة التصنيفات:', response.data)
      
      categories.value = response.data.data || response.data
    } catch (err: any) {
      console.error('❌ خطأ في جلب التصنيفات:', err)
      handleError(err)
      throw err
    }
  }

  const fetchScaleById = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      console.log(`🔄 جلب المقياس ${id}...`)
      const response = await api.get(`/v1/psychological-scales/${id}`)
      
      currentScale.value = response.data.data || response.data
      return currentScale.value
    } catch (err: any) {
      console.error(`❌ خطأ في جلب المقياس ${id}:`, err)
      handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchFullScale = async (id: string) => {
    try {
      console.log(`🔄 جلب المقياس الكامل ${id}...`)
      const response = await api.get(`/v1/psychological-scales/${id}/full`)
      
      currentScale.value = response.data.data || response.data
      return currentScale.value
    } catch (err: any) {
      console.error(`❌ خطأ في جلب المقياس الكامل ${id}:`, err)
      handleError(err)
      throw err
    }
  }

  const getInterpretationForScore = async (scaleId: string, score: number) => {
    try {
      console.log(`🔄 جلب التفسير للدرجة ${score} في المقياس ${scaleId}...`)
      const response = await api.get(`/v1/psychological-scales/${scaleId}/interpretation/${score}`)
      
      return response.data.data || response.data
    } catch (err: any) {
      console.error(`❌ خطأ في جلب التفسير:`, err)
      handleError(err)
      throw err
    }
  }

  const fetchScalesByCategory = async (categoryId: string) => {
    try {
      console.log(`🔄 جلب مقاييس التصنيف ${categoryId}...`)
      const response = await api.get(`/v1/psychological-scales/category/${categoryId}`)
      
      return response.data.data || response.data
    } catch (err: any) {
      console.error(`❌ خطأ في جلب مقاييس التصنيف:`, err)
      handleError(err)
      throw err
    }
  }

  const createScale = async (scaleData: CreateScaleData) => {
    loading.value = true
    error.value = null
    try {
      console.log('🔄 إنشاء مقياس جديد...', scaleData)
      const response = await api.post('/v1/psychological-scales', scaleData)
      
      const newScale = response.data.data || response.data
      scales.value.unshift(newScale)
      return newScale
    } catch (err: any) {
      console.error('❌ خطأ في إنشاء المقياس:', err)
      handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateScale = async (id: string, scaleData: Partial<Scale>) => {
    loading.value = true
    error.value = null
    try {
      console.log(`🔄 تحديث المقياس ${id}...`)
      const response = await api.put(`/v1/psychological-scales/${id}`, scaleData)
      
      const updatedScale = response.data.data || response.data
      const index = scales.value.findIndex(scale => scale.id === id)
      if (index !== -1) {
        scales.value[index] = updatedScale
      }
      if (currentScale.value && currentScale.value.id === id) {
        currentScale.value = updatedScale
      }
      return updatedScale
    } catch (err: any) {
      console.error(`❌ خطأ في تحديث المقياس ${id}:`, err)
      handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteScale = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      console.log(`🔄 حذف المقياس ${id}...`)
      await api.delete(`/v1/psychological-scales/${id}`)
      
      scales.value = scales.value.filter(scale => scale.id !== id)
      if (currentScale.value && currentScale.value.id === id) {
        currentScale.value = null
      }
    } catch (err: any) {
      console.error(`❌ خطأ في حذف المقياس ${id}:`, err)
      handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const duplicateScale = async (id: string) => {
    try {
      console.log(`🔄 نسخ المقياس ${id}...`)
      const response = await api.post(`/v1/psychological-scales/${id}/duplicate`)
      
      const duplicatedScale = response.data.data || response.data
      scales.value.unshift(duplicatedScale)
      return duplicatedScale
    } catch (err: any) {
      console.error(`❌ خطأ في نسخ المقياس ${id}:`, err)
      handleError(err)
      throw err
    }
  }

  const toggleScaleStatus = async (id: string) => {
    try {
      console.log(`🔄 تبديل حالة المقياس ${id}...`)
      const response = await api.patch(`/v1/psychological-scales/${id}/toggle-status`)
      
      const updatedScale = response.data.data
      const index = scales.value.findIndex(scale => scale.id === id)
      if (index !== -1) {
        scales.value[index].is_active = updatedScale.is_active
      }
      return updatedScale
    } catch (err: any) {
      console.error(`❌ خطأ في تبديل حالة المقياس ${id}:`, err)
      handleError(err)
      throw err
    }
  }

  // دوال إضافية للتصنيفات
  const createCategory = async (categoryData: Partial<ScaleCategory>) => {
    try {
      console.log('🔄 إنشاء تصنيف جديد...')
      const response = await api.post('/v1/categories', categoryData)
      
      const newCategory = response.data.data || response.data
      categories.value.push(newCategory)
      return newCategory
    } catch (err: any) {
      console.error('❌ خطأ في إنشاء التصنيف:', err)
      handleError(err)
      throw err
    }
  }

  const updateCategory = async (id: string, categoryData: Partial<ScaleCategory>) => {
    try {
      console.log(`🔄 تحديث التصنيف ${id}...`)
      const response = await api.put(`/v1/categories/${id}`, categoryData)
      
      const updatedCategory = response.data.data || response.data
      const index = categories.value.findIndex(cat => cat.id === id)
      if (index !== -1) {
        categories.value[index] = updatedCategory
      }
      return updatedCategory
    } catch (err: any) {
      console.error(`❌ خطأ في تحديث التصنيف ${id}:`, err)
      handleError(err)
      throw err
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      console.log(`🔄 حذف التصنيف ${id}...`)
      await api.delete(`/v1/categories/${id}`)
      
      categories.value = categories.value.filter(cat => cat.id !== id)
    } catch (err: any) {
      console.error(`❌ خطأ في حذف التصنيف ${id}:`, err)
      handleError(err)
      throw err
    }
  }

  // دوال مساعدة
  const handleError = (err: any) => {
    if (err.response) {
      const message = err.response.data?.message || `خطأ ${err.response.status}: فشل في العملية`
      error.value = message
      
      // عرض تفاصيل الخطأ في الكونسول
      console.error('تفاصيل الخطأ:', {
        status: err.response.status,
        data: err.response.data,
        message: message
      })
    } else if (err.request) {
      error.value = 'تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.'
    } else {
      error.value = err.message || 'حدث خطأ غير متوقع'
    }
  }

  const resetError = () => {
    error.value = null
  }

  const resetCurrentScale = () => {
    currentScale.value = null
  }

  const clearScales = () => {
    scales.value = []
  }

  const clearCategories = () => {
    categories.value = []
  }

  // الخصائص المحسوبة
  const activeScales = () => scales.value.filter(scale => scale.is_active)
  const scalesByCategory = (categoryId: string) => scales.value.filter(scale => scale.category_id === categoryId)
  
  const getCategoryName = (categoryId: string) => {
    const category = categories.value.find(cat => cat.id === categoryId)
    return category ? (document.documentElement.lang === 'ar' ? category.name_ar : category.name_en) : 'Unknown'
  }

  const getScaleName = (scale: Scale) => {
    return document.documentElement.lang === 'ar' ? scale.name_ar : scale.name_en
  }

  const getScaleDescription = (scale: Scale) => {
    return document.documentElement.lang === 'ar' ? scale.description_ar : scale.description_en
  }

  return {
    // الحالة
    scales,
    categories,
    currentScale,
    stats,
    loading,
    error,
    
    // الإجراءات الأساسية
    fetchScales,
    fetchAllScales,
    fetchCategories,
    fetchScaleById,
    fetchFullScale,
    fetchScalesByCategory,
    getInterpretationForScore,
    createScale,
    updateScale,
    deleteScale,
    duplicateScale,
    toggleScaleStatus,
    
    // إجراءات التصنيفات
    createCategory,
    updateCategory,
    deleteCategory,
    
    // دوال مساعدة
    resetError,
    resetCurrentScale,
    clearScales,
    clearCategories,
    
    // الخصائص المحسوبة
    activeScales,
    scalesByCategory,
    getCategoryName,
    getScaleName,
    getScaleDescription
  }
})