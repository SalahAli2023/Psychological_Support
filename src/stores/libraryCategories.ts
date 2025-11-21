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
      const response = await api.get('/library/categories', { 
        params: {
          per_page: params?.per_page || 15,
          page: params?.page || 1,
          ...params
        }
      })
      
      categories.value = response.data.data
      
      if (response.data.meta) {
        pagination.value = {
          current_page: response.data.meta.current_page,
          last_page: response.data.meta.last_page,
          per_page: response.data.meta.per_page,
          total: response.data.meta.total,
          from: response.data.meta.from,
          to: response.data.meta.to
        }
      }
      
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch categories'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createCategory = async (data: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/library/categories', data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create category'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateCategory = async (id: number, data: any) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.put(`/library/categories/${id}`, data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update category'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/library/categories/${id}`)
      categories.value = categories.value.filter(category => category.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete category'
      throw err
    } finally {
      loading.value = false
    }
  }

  const changePage = async (page: number) => {
    await fetchCategories({ page })
  }

  const changePerPage = async (perPage: number) => {
    await fetchCategories({ per_page: perPage, page: 1 })
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