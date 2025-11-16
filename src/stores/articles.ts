import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Article, ArticleCategory } from '@/types/article'

import api from '@/utils/api'

export const useArticleStore = defineStore('articles', () => {
  const articles = ref<Article[]>([])
  const categories = ref<ArticleCategory[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // جلب جميع المقالات
  const fetchArticles = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/articles')
      articles.value = response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'فشل في تحميل المقالات'
      throw err
    } finally {
      loading.value = false
    }
  }

  // جلب التصنيفات
  
const fetchCategories = async () => {
  try {
    console.log('🔄 جلب التصنيفات...')
    
    // جرب المسار الصحيح - قد يكون مختلفاً عما تستخدمه
    // const response = await api.get('/articles/categories')
    // أو جرب:
    const response = await api.get('/articles/categories/list')
    
    console.log('✅ استجابة التصنيفات:', response.data)
    
    if (response.data && response.data.data) {
      categories.value = response.data.data
    } else if (Array.isArray(response.data)) {
      categories.value = response.data
    } else {
      console.warn('⚠️ هيكل استجابة التصنيفات غير متوقع:', response.data)
      categories.value = []
    }
    
    console.log('📊 عدد التصنيفات المحملة:', categories.value.length)
    
  } catch (err: any) {
    console.error('❌ فشل في جلب التصنيفات:', err)
    console.error('📊 تفاصيل الخطأ:', {
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      url: err.config?.url
    })
    
    // جرب مسار بديل إذا كان الأول لا يعمل
    try {
      console.log('🔄 محاولة جلب التصنيفات بمسار بديل...')
      const alternativeResponse = await api.get('/categories')
      if (alternativeResponse.data && alternativeResponse.data.data) {
        categories.value = alternativeResponse.data.data
      }
    } catch (secondErr) {
      console.error('❌ فشل في المسار البديل أيضاً:', secondErr)
    }
  }
}

  // إنشاء مقال جديد
  const createArticle = async (formData: FormData) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/articles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      articles.value.unshift(response.data.data)
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'فشل في إنشاء المقال'
      throw err
    } finally {
      loading.value = false
    }
  }

  // تحديث مقال
  const updateArticle = async (id: string, formData: FormData) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`/articles/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      const index = articles.value.findIndex(article => article.id === id)
      if (index !== -1) {
        articles.value[index] = response.data.data
      }
      
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'فشل في تحديث المقال'
      throw err
    } finally {
      loading.value = false
    }
  }

  // حذف مقال
  const deleteArticle = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/articles/${id}`)
      articles.value = articles.value.filter(article => article.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'فشل في حذف المقال'
      throw err
    } finally {
      loading.value = false
    }
  }


  const deleteCategory = async (categoryId: string) => {
  loading.value = true
  error.value = null
  try {
    await api.delete(`/articles/categories/${categoryId}`)
    categories.value = categories.value.filter(category => category.id !== categoryId)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'فشل في حذف التصنيف'
    throw err
  } finally {
    loading.value = false
  }
}

const createCategory = async (categoryData: any) => {
  loading.value = true
  error.value = null
  try {
    const response = await api.post('/articles/categories', categoryData)
    categories.value.unshift(response.data.data)
    return response.data.data
  } catch (err: any) {
    error.value = err.response?.data?.message || 'فشل في إنشاء التصنيف'
    throw err
  } finally {
    loading.value = false
  }
}

// تحديث تصنيف
const updateCategory = async (id: string, categoryData: any) => {
  loading.value = true
  error.value = null
  try {
    const response = await api.put(`/articles/categories/${id}`, categoryData)
    
    const index = categories.value.findIndex(category => category.id === id)
    if (index !== -1) {
      categories.value[index] = response.data.data
    }
    
    return response.data.data
  } catch (err: any) {
    error.value = err.response?.data?.message || 'فشل في تحديث التصنيف'
    throw err
  } finally {
    loading.value = false
  }
}


  return {
    articles,
    categories,
    loading,
    error,
    fetchArticles,
    fetchCategories,
    createArticle,
    updateArticle,
    deleteArticle,
    createCategory,
   updateCategory,
   deleteCategory

  }
})