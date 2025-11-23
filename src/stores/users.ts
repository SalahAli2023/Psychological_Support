import { defineStore } from 'pinia';
import api from '../utils/api';
import type { User, UserStats } from '../types/user';

interface UsersState {
  items: User[];
  loading: boolean;
  error: string | null;
  currentUser: User | null;
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
  } | null;
}

interface FetchUsersParams {
  search?: string;
  role?: string;
  joined_from?: string;
  joined_to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

interface CreateUserData {
  name: string;
  email: string;
  password?: string;
  role: 'Admin' | 'Therapist' | 'Client';
  phone?: string;
  bio?: string;
  joined_at?: string;
  avatar?: File;
}

export const useUserStore = defineStore('users', {
  state: (): UsersState => ({
    items: [],
    loading: false,
    error: null,
    currentUser: null,
    pagination: null
  }),

  getters: {
    totalClients: (state) => state.items.filter(u => u.role === 'Client').length,
    totalTherapists: (state) => state.items.filter(u => u.role === 'Therapist').length,
    totalAdmins: (state) => state.items.filter(u => u.role === 'Admin').length,
    
    getUserById: (state) => (id: number) => {
      return state.items.find(user => user.id === id) || null;
    },

    getUserByEmail: (state) => (email: string) => {
      return state.items.find(user => user.email === email) || null;
    },

    isEmailExists: (state) => (email: string) => {
      return state.items.some(user => user.email === email);
    }
  },

  actions: {
    async fetchUsers(params: FetchUsersParams = {}) {
      this.loading = true;
      this.error = null;
      
      try {
        const requestParams = {
          page: 1,
          per_page: 15,
          sort_by: 'created_at',
          sort_order: 'desc',
          ...params
        };

        const response = await api.get('/users', { 
          params: requestParams,
          timeout: 15000
        });
        
        if (response.data.success) {
          this.items = response.data.data;
          this.pagination = response.data.meta;
          return this.items;
        } else {
          throw new Error(response.data.message || 'Failed to fetch users');
        }
      } catch (error: any) {
        this.handleError(error, 'fetchUsers');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createUser(userData: CreateUserData | FormData) {
      this.loading = true;
      this.error = null;
      
      try {
        let requestData: FormData;
        
        if (userData instanceof FormData) {
          requestData = userData;
        } else {
          requestData = this.createUserFormData(userData);
        }

        const response = await api.post('/users', requestData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000
        });
        
        if (response.data.success) {
          const newUser = response.data.data;
          this.items.unshift(newUser);
          
          if (this.pagination) {
            this.pagination.total += 1;
            if (this.items.length > this.pagination.per_page) {
              this.items.pop();
            }
          }
          
          return newUser;
        } else {
          throw new Error(response.data.message || 'Failed to create user');
        }
      } catch (error: any) {
        this.handleError(error, 'createUser');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateUser(userId: number, userData: Partial<CreateUserData> | FormData) {
      this.loading = true;
      this.error = null;
      
      try {
        let requestData: FormData;
        
        if (userData instanceof FormData) {
          requestData = userData;
          requestData.append('_method', 'PUT');
        } else {
          requestData = this.createUserFormData(userData);
          requestData.append('_method', 'PUT');
        }

        const response = await api.post(`/users/${userId}`, requestData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000
        });
        
        if (response.data.success) {
          const updatedUser = response.data.data;
          this.updateUserInStore(updatedUser);
          return updatedUser;
        } else {
          throw new Error(response.data.message || 'Failed to update user');
        }
      } catch (error: any) {
        this.handleError(error, 'updateUser');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(userId: number) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.delete(`/users/${userId}`, {
          timeout: 10000
        });
        
        if (response.data.success) {
          this.removeUserFromStore(userId);
          return true;
        } else {
          throw new Error(response.data.message || 'Failed to delete user');
        }
      } catch (error: any) {
        this.handleError(error, 'deleteUser');
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchUserStats(): Promise<UserStats> {
      try {
        const response = await api.get('/users/stats', {
          timeout: 10000
        });
        
        if (response.data.success) {
          return response.data.data;
        } else {
          throw new Error(response.data.message || 'Failed to fetch user stats');
        }
      } catch (error: any) {
        console.error('Error fetching user stats:', error);
        throw error;
      }
    },

    async fetchUser(userId: number) {
      try {
        const response = await api.get(`/users/${userId}`, {
          timeout: 10000
        });
        
        if (response.data.success) {
          this.currentUser = response.data.data;
          return this.currentUser;
        } else {
          throw new Error(response.data.message || 'Failed to fetch user');
        }
      } catch (error: any) {
        console.error('Error fetching user:', error);
        throw error;
      }
    },

    async updateUserAvatar(userId: number, avatarFile: File) {
      try {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        const response = await api.post(`/users/${userId}/avatar`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 30000
        });
        
        if (response.data.success) {
          const updatedUser = response.data.data;
          this.updateUserInStore(updatedUser);
          return updatedUser;
        } else {
          throw new Error(response.data.message || 'Failed to update avatar');
        }
      } catch (error: any) {
        console.error('Error updating avatar:', error);
        throw error;
      }
    },

    async removeUserAvatar(userId: number) {
      try {
        const response = await api.delete(`/users/${userId}/avatar`, {
          timeout: 10000
        });
        
        if (response.data.success) {
          const updatedUser = response.data.data;
          this.updateUserInStore(updatedUser);
          return updatedUser;
        } else {
          throw new Error(response.data.message || 'Failed to remove avatar');
        }
      } catch (error: any) {
        console.error('Error removing avatar:', error);
        throw error;
      }
    },

    createUserFormData(userData: any): FormData {
      const formData = new FormData();
      
      Object.keys(userData).forEach(key => {
        const value = userData[key];
        if (value !== null && value !== undefined && value !== '') {
          if (key === 'avatar' && value instanceof File) {
            formData.append('avatar', value);
          } else if (key === 'avatarFile' && value instanceof File) {
            formData.append('avatar', value);
          } else if (key === 'joined_at' && value instanceof Date) {
            formData.append(key, value.toISOString().split('T')[0]);
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      
      return formData;
    },

    updateUserInStore(updatedUser: User) {
      const index = this.items.findIndex(u => u.id === updatedUser.id);
      if (index !== -1) {
        this.items[index] = updatedUser;
      }
      
      if (this.currentUser?.id === updatedUser.id) {
        this.currentUser = updatedUser;
      }
    },

    removeUserFromStore(userId: number) {
      this.items = this.items.filter(u => u.id !== userId);
      
      if (this.pagination) {
        this.pagination.total = Math.max(0, this.pagination.total - 1);
      }
      
      if (this.currentUser?.id === userId) {
        this.currentUser = null;
      }
    },

    handleError(error: any, action: string) {
      console.error(`Error in ${action}:`, error);
      
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        this.error = 'خطأ في الاتصال بالخادم. تأكد من اتصالك بالإنترنت.';
      } else if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        this.error = this.formatValidationErrors(errors);
      } else if (error.response?.status === 404) {
        this.error = 'البيانات المطلوبة غير موجودة.';
      } else if (error.response?.status === 500) {
        this.error = 'خطأ داخلي في الخادم. الرجاء المحاولة لاحقاً.';
      } else if (error.response?.status === 401) {
        this.error = 'غير مصرح لك بتنفيذ هذا الإجراء.';
      } else if (error.response?.status === 403) {
        this.error = 'غير مسموح لك بتنفيذ هذا الإجراء.';
      } else {
        this.error = error.response?.data?.message || error.message || `Failed to ${action}`;
      }
    },

    formatValidationErrors(errors: Record<string, string[]>): string {
      const errorMessages = Object.values(errors).flat();
      return errorMessages.join(', ');
    },

    clearError() {
      this.error = null;
    },

    clearCurrentUser() {
      this.currentUser = null;
    },

    clearPagination() {
      this.pagination = null;
    },

    reset() {
      this.items = [];
      this.loading = false;
      this.error = null;
      this.currentUser = null;
      this.pagination = null;
    },

    searchUsersLocally(query: string): User[] {
      if (!query.trim()) return this.items;
      
      const searchTerm = query.toLowerCase();
      return this.items.filter(user => 
        user.name?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm) ||
        user.phone?.includes(searchTerm) ||
        user.role?.toLowerCase().includes(searchTerm)
      );
    }
  }
});