// library.ts - تحديث الـ store
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

export interface LibraryItem {
  id: number
  title_ar: string
  title_en: string
  description_ar?: string
  description_en?: string
  author_ar?: string
  author_en?: string
  type: 'book' | 'research' | 'guide' | 'article'
  category_id: number
  cover_image?: string
  file_path?: string
  file_size?: number
  pages?: number
  publish_date?: string
  downloads: number
  views: number
  rating: number
  rating_count: number
  is_new: boolean
  is_published: boolean
  created_at: string
  updated_at: string
  category?: LibraryCategory
  // حقول إضافية للواجهة
  isFavorite?: boolean
  cover?: string
  author?: string
  title?: string
  description?: string
  year?: string
}

export interface PaginationInfo {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

export const useLibraryStore = defineStore('library', () => {
  const items = ref<LibraryItem[]>([])
  const categories = ref<LibraryCategory[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const favorites = ref<number[]>([])
  const pagination = ref<PaginationInfo>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0
  })

  // تحويل البيانات من API إلى تنسيق الواجهة
  const transformItemForUI = (item: LibraryItem): any => {
    return {
      ...item,
      cover: item.cover_image,
      author: item.author_ar || item.author_en || '',
      title: item.title_ar || item.title_en,
      description: item.description_ar || item.description_en,
      year: item.publish_date ? new Date(item.publish_date).getFullYear().toString() : '',
      isFavorite: favorites.value.includes(item.id),
      rating: parseFloat(item.rating.toString()) || 0
    }
  }

  // جلب جميع العناصر مع الترقيم
  const fetchItems = async (params?: {
    category_id?: string
    type?: string
    search?: string
    sort?: string
    per_page?: number
    page?: number
  }) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/library', { 
        params: {
          per_page: params?.per_page || 15,
          page: params?.page || 1,
          ...params
        }
      })
      
      items.value = response.data.data.map(transformItemForUI)
      
      // تحديث معلومات الترقيم
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
      error.value = err.response?.data?.message || 'Failed to fetch library items'
      console.error('Error fetching library items:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // جلب التصنيفات
  const fetchCategories = async () => {
    try {
      const response = await api.get('/library/categories/list')
      categories.value = response.data.data || response.data
      console.log('Categories loaded:', categories.value.length)
      return categories.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch categories'
      console.error('Error fetching categories:', err)
      throw err
    }
  }

  const fetchItem = async (id: number) => {
    try {
      const response = await api.get(`/library/${id}`)
      return transformItemForUI(response.data.data)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch item'
      throw err
    }
  }

  const createItem = async (formData: FormData) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post('/library', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000,
      })
      const newItem = transformItemForUI(response.data.data)
      items.value.unshift(newItem)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create item'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateItem = async (id: number, formData: FormData) => {
    loading.value = true
    error.value = null
    try {
      const response = await api.post(`/library/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const updatedItem = transformItemForUI(response.data.data)
      const index = items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        items.value[index] = updatedItem
      }
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update item'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteItem = async (id: number) => {
    loading.value = true
    error.value = null
    try {
      await api.delete(`/library/${id}`)
      items.value = items.value.filter(item => item.id !== id)
      favorites.value = favorites.value.filter(favId => favId !== id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete item'
      throw err
    } finally {
      loading.value = false
    }
  }

  const incrementViews = async (id: number) => {
    try {
      await api.get(`/library/${id}`)
      const item = items.value.find(item => item.id === id)
      if (item) {
        item.views++
      }
    } catch (err) {
      console.error('Failed to increment views:', err)
    }
  }

  const toggleFavorite = (id: number) => {
    const index = favorites.value.indexOf(id)
    if (index > -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(id)
    }
    
    const item = items.value.find(item => item.id === id)
    if (item) {
      item.isFavorite = !item.isFavorite
    }
    
    localStorage.setItem('library_favorites', JSON.stringify(favorites.value))
  }

  const downloadItem = async (id: number) => {
    try {
      const item = items.value.find(item => item.id === id)
      if (item && item.file_path) {
        item.downloads++
        window.open(item.file_path, '_blank')
      }
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  const rateItem = async (id: number, rating: number) => {
    try {
      const item = items.value.find(item => item.id === id)
      if (item) {
        const newRatingCount = item.rating_count + 1
        const newRating = ((item.rating * item.rating_count) + rating) / newRatingCount
        item.rating = parseFloat(newRating.toFixed(1))
        item.rating_count = newRatingCount
      }
    } catch (err) {
      console.error('Rating failed:', err)
    }
  }

  const loadFavorites = () => {
    const saved = localStorage.getItem('library_favorites')
    if (saved) {
      favorites.value = JSON.parse(saved)
    }
  }

  // دالة لتغيير الصفحة
  const changePage = async (page: number) => {
    pagination.value.current_page = page
    await fetchItems({ page })
  }

  // دالة لتغيير عدد العناصر في الصفحة
  const changePerPage = async (perPage: number) => {
    pagination.value.per_page = perPage
    pagination.value.current_page = 1
    await fetchItems({ per_page: perPage, page: 1 })
  }

  // تهيئة أولية
  loadFavorites()

  return {
    items,
    categories,
    loading,
    error,
    favorites,
    pagination,
    fetchItems,
    fetchCategories,
    fetchItem,
    createItem,
    updateItem,
    deleteItem,
    incrementViews,
    toggleFavorite,
    downloadItem,
    rateItem,
    loadFavorites,
    changePage,
    changePerPage
  }
})