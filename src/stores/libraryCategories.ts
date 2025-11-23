// stores/libraryCategories.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/api'

export interface LibraryCategory {
  id: number
  key: string
  name_ar: string
  name_en: string
  color: string
  items_count?: number
  created_at: string
  updated_at: string
}

export interface PaginationInfo {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

export const useLibraryCategoriesStore = defineStore('libraryCategories', () => {
  const categories = ref<LibraryCategory[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref<PaginationInfo>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0
  })

  const fetchCategories = async (params?: {
    search?: string
    sort?: string
    per_page?: number
    page?: number
  }) => {
    loading.value = true
    error.value = null
    try {
      console.log('📚 Fetching categories from API...')
      
      const response = await api.get('/library/categories/list')
      
      console.log('✅ API Response received:', response.data)

      // البيانات تأتي بهذا الهيكل: {data: Array(8)}
      if (response.data && Array.isArray(response.data.data)) {
        categories.value = response.data.data
        console.log(`✅ Loaded ${categories.value.length} categories`)
      } else {
        categories.value = []
        console.warn('⚠️ Unexpected response format:', response.data)
      }
      
      // تحديث معلومات الترقيم
      pagination.value = {
        current_page: 1,
        last_page: 1,
        per_page: categories.value.length,
        total: categories.value.length,
        from: categories.value.length > 0 ? 1 : 0,
        to: categories.value.length
      }
      
      console.log('📊 Pagination updated:', pagination.value)
      return response.data
      
    } catch (err: any) {
      error.value = 'فشل في تحميل التصنيفات. تأكد من اتصال الشبكة وحاول مرة أخرى.'
      console.error('❌ Error fetching categories:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const createCategory = async (data: any) => {
    loading.value = true
    error.value = null
    try {
      console.log('➕ Creating new category:', data)
      
      const response = await api.post('/library/categories', data)
      
      // أضف التصنيف الجديد للقائمة
      if (response.data.data) {
        categories.value.push(response.data.data)
        pagination.value.total = categories.value.length
        pagination.value.to = categories.value.length
      }
      
      console.log('✅ Category created successfully')
      return response.data
      
    } catch (err: any) {
      error.value = err.response?.data?.message || 'فشل في إنشاء التصنيف'
      console.error('❌ Error creating category:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCategory = async (id: number, data: any) => {
    loading.value = true
    error.value = null
    try {
      console.log('✏️ Updating category:', id, data)
      
      const response = await api.put(`/library/categories/${id}`, data)
      
      // تحديث التصنيف في القائمة
      const index = categories.value.findIndex(cat => cat.id === id)
      if (index !== -1 && response.data.data) {
        categories.value[index] = response.data.data
      }
      
      console.log('✅ Category updated successfully')
      return response.data
      
    } catch (err: any) {
      error.value = err.response?.data?.message || 'فشل في تحديث التصنيف'
      console.error('❌ Error updating category:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      console.log('🗑️ Deleting category:', id)
      
      await api.delete(`/library/categories/${id}`)
      
      // إزالة التصنيف من القائمة
      categories.value = categories.value.filter(category => category.id !== id)
      
      // تحديث الـ pagination
      pagination.value.total = categories.value.length
      pagination.value.to = categories.value.length
      
      console.log('✅ Category deleted successfully')
      
    } catch (err: any) {
      error.value = err.response?.data?.message || 'فشل في حذف التصنيف'
      console.error('❌ Error deleting category:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const changePage = async (page: number) => {
    console.log('🔽 Change page to:', page)
    // بما أن الـ API لا يدعم الترقيم، نعيد تحميل البيانات
    await fetchCategories()
  }

  const changePerPage = async (perPage: number) => {
    console.log('🔽 Change per page to:', perPage)
    // بما أن الـ API لا يدعم الترقيم، نعيد تحميل البيانات
    await fetchCategories()
  }

  return {
    categories,
    loading,
    error,
    pagination,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    changePage,
    changePerPage
  }
})