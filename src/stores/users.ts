import { defineStore } from 'pinia';
import api from '../utils/api';
import type { User, UserRole } from '../types/user';

interface UsersState {
      items: User[];
      loading: boolean;
      error: string | null;
}

export const useUserStore = defineStore('users', {
      state: (): UsersState => ({
            items: [],
            loading: false,
            error: null
      }),

      getters: {
            totalClients: (state) => state.items.filter(u => u.role === 'Client').length,
            totalTherapists: (state) => state.items.filter(u => u.role === 'Therapist').length,
            totalAdmins: (state) => state.items.filter(u => u.role === 'Admin').length,
            newUsers: (state) => state.items.filter(u => {
                  const joinedDate = new Date(u.joinedAt);
                  const weekAgo = new Date(Date.now() - 7 * 86400000);
                  return joinedDate >= weekAgo;
            }).length,
      },

      actions: {
            async fetchUsers(searchQuery: string = '', roleFilter: string = '') {
                  this.loading = true;
                  this.error = null;
                  
                  try {
                        const params: any = {};
                        if (searchQuery) params.q = searchQuery;
                        if (roleFilter) params.role = roleFilter;

                        const response = await api.get('/users', { params });
                  
                        if (response.data.success) {
                              this.items = response.data.data;
                        } else {
                              throw new Error(response.data.message || 'Failed to fetch users');
                        }
                  } catch (error: any) {
                        this.error = error.response?.data?.message || error.message || 'Failed to fetch users';
                        console.error('Error fetching users:', error);
                  } finally {
                        this.loading = false;
                  }
            },

            async fetchUserStats() {
                  try {
                        const response = await api.get('/users/stats');
                  
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

            async getUserById(userId: string) {
                  try {
                        const response = await api.get(`/users/${userId}`);
                        
                        if (response.data.success) {
                              return response.data.data;
                        } else {
                              throw new Error(response.data.message || 'Failed to fetch user');
                        }
                  } catch (error: any) {
                        console.error('Error fetching user:', error);
                        throw error;
                  }
            },

            clearError() {
                  this.error = null;
            }
      }
});
