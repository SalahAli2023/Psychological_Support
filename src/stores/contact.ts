import { defineStore } from 'pinia';
import api from '../utils/api';
import type { Contact, ContactFormData, ContactStats, ContactResponse, ContactsListResponse } from '../types/contact';

interface ContactState {
    items: Contact[];
    currentContact: Contact | null;
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}

export const useContactStore = defineStore('contact', {
    state: (): ContactState => ({
        items: [],
        currentContact: null,
        loading: false,
        error: null,
        successMessage: null
    }),

    getters: {
        newContacts: (state) => state.items.filter(contact => contact.status === 'new'),
        resolvedContacts: (state) => state.items.filter(contact => contact.status === 'resolved'),
        getContactById: (state) => (id: number) => state.items.find(contact => contact.id === id)
    },

    actions: {
        /**
         * إرسال رسالة اتصال جديدة
         */
        async submitContact(formData: ContactFormData): Promise<ContactResponse> {
            this.loading = true;
            this.error = null;
            this.successMessage = null;

            try {
                const response = await api.post<ContactResponse>('/contacts', formData);
                
                if (response.data.success) {
                    this.successMessage = response.data.message;
                    return response.data;
                } else {
                    throw new Error(response.data.message || 'Failed to submit contact form');
                }
            } catch (error: any) {
                this.error = this.handleError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * جلب جميع رسائل الاتصال (للمسؤولين)
         */
        async fetchContacts(params?: {
            status?: string;
            message_type?: string;
            search?: string;
            page?: number;
            }): Promise<ContactsListResponse> {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.get<ContactsListResponse>('/contacts', { params });
                
                if (response.data.success) {
                this.items = response.data.data;
                return response.data;
                } else {
                throw new Error(response.data.message || 'Failed to fetch contacts');
                }
            } catch (error: any) {
                this.error = this.handleError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * جلب رسالة اتصال محددة
         */
        async fetchContactById(id: number): Promise<Contact> {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.get<{ success: boolean; data: Contact }>(`/contacts/${id}`);
                
                if (response.data.success) {
                this.currentContact = response.data.data;
                return response.data.data;
                } else {
                throw new Error(response.data.message || 'Failed to fetch contact');
                }
            } catch (error: any) {
                this.error = this.handleError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * تحديث حالة الرسالة (للمسؤولين)
         */
        async updateContactStatus(id: number, status: string, adminNotes?: string): Promise<Contact> {
            this.loading = true;
            this.error = null;

            try {
                const response = await api.put<{ success: boolean; data: Contact }>(`/contacts/${id}`, {
                status,
                admin_notes: adminNotes
                });
                
                if (response.data.success) {
                // تحديث البيانات المحلية
                const index = this.items.findIndex(contact => contact.id === id);
                if (index !== -1) {
                    this.items[index] = response.data.data;
                }
                if (this.currentContact?.id === id) {
                    this.currentContact = response.data.data;
                }
                return response.data.data;
                } else {
                throw new Error(response.data.message || 'Failed to update contact status');
                }
            } catch (error: any) {
                this.error = this.handleError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        /**
         * جلب إحصائيات الاتصالات (للمسؤولين)
         */
        async fetchContactStats(): Promise<ContactStats> {
            try {
                const response = await api.get<{ success: boolean; data: ContactStats }>('/contacts/statistics');
                
                if (response.data.success) {
                return response.data.data;
                } else {
                throw new Error(response.data.message || 'Failed to fetch contact statistics');
                }
            } catch (error: any) {
                console.error('Error fetching contact stats:', error);
                throw error;
            }
        },

        /**
         * معالجة الأخطاء بشكل مركزي
         */
         handleError(error: any): string {
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                return Object.values(errors).flat().join(', ');
            }
            
            return error.response?.data?.message || error.message || 'An unexpected error occurred';
        },

        /**
         * مسح الرسائل والبيانات
         */
        clearMessages(): void {
            this.error = null;
            this.successMessage = null;
        },

        /**
         * إعادة تعيين الـ store
         */
        reset(): void {
            this.items = [];
            this.currentContact = null;
            this.loading = false;
            this.error = null;
            this.successMessage = null;
        }
    }
});